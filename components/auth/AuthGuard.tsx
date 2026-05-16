"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Render immediately — Firebase resolves auth from IndexedDB within ~200ms.
  // Unauthenticated users are redirected via useEffect before Firestore data loads.
  if (!loading && !user) return null;

  return <>{children}</>;
}
