"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";
import { getUserProfile, upsertUserProfile, type UserProfile } from "@/lib/firebase/firestore";

const ADMIN_EMAILS = ["kirchner.andre@gmail.com"];

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef               = useRef<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      userRef.current = u;
      setLoading(false);

      // Cookie gates the proxy.ts server-side redirect (UI-only, not security)
      if (u) {
        document.cookie = "axon_auth=1; path=/; max-age=86400; SameSite=Lax";
        getUserProfile(u.uid)
          .then(setProfile)
          .catch(() => setProfile(null));
      } else {
        document.cookie = "axon_auth=; path=/; max-age=0";
        setProfile(null);
      }
    });
    return unsubscribe;
  }, []);

  async function refreshProfile() {
    const u = userRef.current;
    if (!u) return;
    const updated = await getUserProfile(u.uid).catch(() => null);
    setProfile(updated);
  }

  const isAdmin =
    profile?.role === "admin" ||
    ADMIN_EMAILS.includes(user?.email?.toLowerCase() ?? "");

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
