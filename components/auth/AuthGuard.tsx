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

  // proxy.ts redirects unauthenticated users server-side before HTML is sent.
  // Show nothing while Firebase resolves from IndexedDB to prevent dashboard flash.
  if (loading || !user) return null;

  return <>{children}</>;
}
