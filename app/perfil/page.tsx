"use client";

import { useEffect, useState } from "react";
import { User, Mail, CreditCard, Stethoscope, CheckCircle2, Loader2, ShieldCheck, GraduationCap } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateUserProfileData, SITUACAO_LABEL, type SituacaoAcademica } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";
import Image from "next/image";

const MODULOS = [
  { value: "adulto",          label: "Psiquiatria do Adulto" },
  { value: "infancia",        label: "Psiquiatria da Infância e Adolescência" },
  { value: "forense",         label: "Psiquiatria Forense" },
  { value: "psicogeriatria",  label: "Psicogeriatria" },
  { value: "interconsulta",   label: "Psiquiatria de Interconsulta" },
] as const;

type SaveState = "idle" | "saving" | "saved" | "error";

export default function PerfilPage() {
  const { user, profile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [crm, setCrm] = useState("");
  const [moduloAtivo, setModuloAtivo] = useState<string>("adulto");
  const [situacaoAcademica, setSituacaoAcademica] = useState<SituacaoAcademica>("r1");
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setCrm(profile.crm ?? "");
      setModuloAtivo(profile.moduloAtivo ?? "adulto");
      setSituacaoAcademica(profile.situacaoAcademica ?? "r1");
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaveState("saving");
    try {
      await updateUserProfileData(user.uid, {
        displayName: displayName.trim() || null,
        crm: crm.trim() || undefined,
        moduloAtivo: moduloAtivo as "adulto" | "infancia" | "forense" | "psicogeriatria" | "interconsulta",
        situacaoAcademica,
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  }

  const initials = (displayName || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = profile?.createdAt?.toDate
    ? new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
        profile.createdAt.toDate()
      )
    : null;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-xl">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Gerencie suas informações pessoais e preferências</p>
          </div>

          {/* Avatar + identidade */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="relative shrink-0">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{initials}</span>
                </div>
              )}
              {profile?.role === "admin" && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <ShieldCheck size={11} className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground text-base truncate">
                {profile?.displayName || user?.displayName || "Sem nome"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    profile?.plano === "pro"
                      ? "bg-violet-500/10 text-violet-600 border-violet-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {profile?.plano === "pro" ? "PRO" : "Free"}
                </span>
                {memberSince && (
                  <span className="text-[10px] text-muted-foreground/60">Membro desde {memberSince}</span>
                )}
              </div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Informações pessoais</p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User size={11} className="text-muted-foreground" /> Nome de exibição
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail size={11} className="text-muted-foreground" /> E-mail
              </label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full bg-muted/10 border border-border rounded-xl px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[10px] text-muted-foreground/60">Vinculado ao Google — não editável</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CreditCard size={11} className="text-muted-foreground" /> CRM
              </label>
              <input
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                placeholder="ex: CRM/SP 123456"
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Stethoscope size={11} className="text-muted-foreground" /> Área de atuação
              </label>
              <select
                value={moduloAtivo}
                onChange={(e) => setModuloAtivo(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
              >
                {MODULOS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground/60">Personaliza o conteúdo exibido no Dashboard</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <GraduationCap size={11} className="text-muted-foreground" /> Situação acadêmica
              </label>
              <select
                value={situacaoAcademica}
                onChange={(e) => setSituacaoAcademica(e.target.value as SituacaoAcademica)}
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
              >
                {(Object.entries(SITUACAO_LABEL) as [SituacaoAcademica, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <p className="text-[10px] text-muted-foreground/60">Exibida no card de perfil da dashboard</p>
            </div>

            <button
              type="submit"
              disabled={saveState === "saving"}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                saveState === "saved"
                  ? "bg-emerald-600 text-white"
                  : saveState === "error"
                  ? "bg-red-600 text-white"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {saveState === "saving" && <Loader2 size={14} className="animate-spin" />}
              {saveState === "saved" && <CheckCircle2 size={14} />}
              {saveState === "saving"
                ? "Salvando..."
                : saveState === "saved"
                ? "Salvo!"
                : saveState === "error"
                ? "Erro ao salvar"
                : "Salvar alterações"}
            </button>
          </form>

          {/* Plano */}
          {profile?.plano === "free" && (
            <div className="bg-gradient-to-br from-violet-500/10 to-primary/5 border border-violet-500/20 rounded-2xl p-5 space-y-2">
              <p className="text-sm font-bold text-foreground">Upgrade para PRO</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Acesse todos os módulos, IA clínica ilimitada, banco de questões completo e atualizações prioritárias.
              </p>
              <button className="mt-1 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-primary text-white text-xs font-bold hover:opacity-90 transition-opacity">
                Conhecer plano PRO
              </button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
