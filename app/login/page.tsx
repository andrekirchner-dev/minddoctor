"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { upsertUserProfile } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  async function handleGoogleSignIn() {
    try {
      const user = await signInWithGoogle();
      await upsertUserProfile(user);
      router.replace("/dashboard");
    } catch {
      // silent — user closed popup or cancelled
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image src="/MindDoctor.png" width={96} height={96} alt="MindDoctor" className="rounded-2xl" />
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-[0_4px_20px_rgba(74,108,247,0.08)]">
          <h2 className="text-lg font-semibold text-foreground mb-1">Entrar</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Acesse com sua conta Google para continuar.
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground"
          >
            <GoogleIcon />
            Entrar com Google
          </button>

          <p className="text-[11px] text-muted-foreground text-center mt-6 leading-relaxed">
            Ao entrar, você concorda com os{" "}
            <a href="#" className="text-primary hover:underline">Termos de Uso</a>
            {" "}e{" "}
            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ferramenta de suporte clínico — não substitui avaliação médica.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
    </svg>
  );
}
