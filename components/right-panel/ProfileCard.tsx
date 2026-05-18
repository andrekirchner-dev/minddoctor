"use client";

import { MapPin, Pencil, Crown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { SITUACAO_LABEL } from "@/lib/firebase/firestore";

export function ProfileCard() {
  const { user, profile, isAdmin } = useAuth();

  const name     = user?.displayName ?? "Usuário";
  const email    = user?.email ?? "";
  const photo    = user?.photoURL ?? "";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const isPro    = profile?.plano === "pro";
  const situacaoLabel = profile?.situacaoAcademica
    ? SITUACAO_LABEL[profile.situacaoAcademica]
    : "Residente";

  return (
    <div className="bg-card rounded-2xl p-5 shadow-[0_4px_20px_rgba(74,108,247,0.08)] border border-border">
      <div className="flex justify-end mb-2">
        <Link
          href="/perfil"
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Pencil size={14} />
        </Link>
      </div>

      <div className="flex flex-col items-center text-center mb-4">
        <Avatar className="h-16 w-16 mb-3 ring-2 ring-primary/20">
          <AvatarImage src={photo} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-bold text-foreground text-sm">{name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">{email}</p>

        <div className="flex items-center gap-1.5 mt-2">
          <Badge
            variant="secondary"
            className="text-[10px] tracking-widest font-semibold uppercase"
          >
            {situacaoLabel}
          </Badge>
          {isPro && (
            <Badge className="text-[10px] font-semibold gap-1 bg-[#7B5EA7]/15 text-[#7B5EA7] border-0">
              <Crown size={9} />
              Pro
            </Badge>
          )}
        </div>
      </div>

      <div className="h-px bg-border mb-4" />

      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <MapPin size={11} />
        <span>Brasil</span>
      </div>

      {isAdmin && (
        <>
          <div className="h-px bg-border my-4" />
          <Link
            href="/admin"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#7B5EA7] hover:text-[#6a4f94] transition-colors"
          >
            <ShieldCheck size={13} />
            Painel Admin
          </Link>
        </>
      )}
    </div>
  );
}
