"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";
import { getUserProfile, upsertUserProfile, type UserProfile } from "@/lib/firebase/firestore";

const ADMIN_EMAILS = ["kirchner.andre@gmail.com"];

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false); // unblock immediately — profile loads in background

      if (u) {
        getUserProfile(u.uid)
          .then(setProfile)
          .catch(() => setProfile(null));
      } else {
        setProfile(null);
      }
    });
    return unsubscribe;
  }, []);

  const isAdmin =
    profile?.role === "admin" ||
    ADMIN_EMAILS.includes(user?.email?.toLowerCase() ?? "");

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
