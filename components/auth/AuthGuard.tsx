"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

// proxy.ts blocks unauthenticated requests server-side before HTML is served.
// If the cookie is present we can render children immediately without waiting
// for Firebase Auth SDK to re-validate from IndexedDB (which can take 2-3s).
function hasAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("axon_auth=1");
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Optimistic: cookie proves server-side auth gate passed → show content immediately.
  // Firebase Auth hydrates user asynchronously in the background.
  if (!hasAuthCookie() && (loading || !user)) return null;

  return <>{children}</>;
}
