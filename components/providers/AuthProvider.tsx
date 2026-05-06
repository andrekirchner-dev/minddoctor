"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthChange, getGoogleRedirectResult } from "@/lib/firebase/auth";
import { getUserProfile, upsertUserProfile, type UserProfile } from "@/lib/firebase/firestore";

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
    let unsubscribeFn: (() => void) | undefined;

    async function init() {
      // Processa redirect pendente do Google ANTES de assinar onAuthStateChanged.
      // Sem isso, onAuthStateChanged dispara com null enquanto o redirect ainda
      // está sendo resolvido, causando loop login → dashboard → login.
      try {
        const redirectUser = await getGoogleRedirectResult();
        if (redirectUser) await upsertUserProfile(redirectUser);
      } catch {
        // sem redirect pendente ou erro ignorável
      }

      unsubscribeFn = onAuthChange(async (u) => {
        setUser(u);
        if (u) {
          const p = await getUserProfile(u.uid);
          setProfile(p);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    }

    init();
    return () => unsubscribeFn?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: profile?.role === "admin", loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
