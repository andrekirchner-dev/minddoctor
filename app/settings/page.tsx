"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  BookOpen,
  GraduationCap,
  Megaphone,
  Shield,
  LogOut,
  Trash2,
  Info,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateNotificationPrefs, type NotificationPrefs } from "@/lib/firebase/firestore";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const APP_VERSION = "0.5.0";

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  flashcardsVencidos: true,
  lembreteEstudo: false,
  atualizacoesConteudo: true,
};

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-5.5 rounded-full transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        checked ? "bg-primary" : "bg-muted",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <p className="text-xs font-bold text-foreground uppercase tracking-wide">{title}</p>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  description,
  right,
  danger,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  right?: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors",
        onClick && !danger && "hover:bg-muted/30 cursor-pointer",
        onClick && danger && "hover:bg-red-500/5 cursor-pointer"
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
          danger ? "bg-red-500/10" : "bg-muted"
        )}
      >
        <Icon size={14} className={danger ? "text-red-500" : "text-muted-foreground"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", danger ? "text-red-500" : "text-foreground")}>{label}</p>
        {description && <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{description}</p>}
      </div>
      {right ?? (onClick && !danger && <ChevronRight size={15} className="text-muted-foreground/40 shrink-0" />)}
    </Tag>
  );
}

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIF_PREFS);
  const [notifSaved, setNotifSaved] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (profile?.notificacoes) setPrefs(profile.notificacoes);
  }, [profile]);

  const savePrefs = useCallback(
    async (updated: NotificationPrefs) => {
      if (!user) return;
      setPrefs(updated);
      await updateNotificationPrefs(user.uid, updated);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 1800);
    },
    [user]
  );

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5 max-w-xl">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-foreground">Configurações</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Preferências, notificações e conta</p>
          </div>

          {/* Notificações */}
          <Section title="Notificações">
            <div className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Flashcards vencidos</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                  Avise quando houver cards para revisar hoje
                </p>
              </div>
              <Toggle
                checked={prefs.flashcardsVencidos}
                onChange={(v) => savePrefs({ ...prefs, flashcardsVencidos: v })}
              />
            </div>

            <div className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Lembrete diário de estudos</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                  Notificação diária para manter a sequência de estudos
                </p>
              </div>
              <Toggle
                checked={prefs.lembreteEstudo}
                onChange={(v) => savePrefs({ ...prefs, lembreteEstudo: v })}
              />
            </div>

            <div className="px-5 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Novidades e atualizações</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                  Novos conteúdos, diretrizes e atualizações do app
                </p>
              </div>
              <Toggle
                checked={prefs.atualizacoesConteudo}
                onChange={(v) => savePrefs({ ...prefs, atualizacoesConteudo: v })}
              />
            </div>

            <div className="px-5 py-2.5 bg-muted/20 flex items-center gap-2">
              <Info size={11} className="text-muted-foreground/60 shrink-0" />
              <p className="text-[10px] text-muted-foreground/60 leading-snug">
                Notificações push serão ativadas na próxima versão do app. Suas preferências já estão salvas.
              </p>
              {notifSaved && (
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 ml-auto" />
              )}
            </div>
          </Section>

          {/* Privacidade */}
          <Section title="Privacidade e dados">
            <Row
              icon={Shield}
              label="Política de privacidade"
              description="Como seus dados são tratados conforme a LGPD"
              right={<ChevronRight size={15} className="text-muted-foreground/40 shrink-0" />}
            />
            <Row
              icon={BookOpen}
              label="Termos de uso"
              description="Condições de utilização da plataforma Axon"
              right={<ChevronRight size={15} className="text-muted-foreground/40 shrink-0" />}
            />
            <div className="px-5 py-3 bg-muted/10">
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                Dados de uso são coletados de forma anonimizada para melhoria do produto. Nenhum dado clínico inserido
                nas ferramentas de IA é armazenado ou vinculado à sua conta.
              </p>
            </div>
          </Section>

          {/* Conta */}
          <Section title="Conta">
            <div className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Info size={14} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground">
                  Plano{" "}
                  <span className={cn("font-bold", profile?.plano === "pro" ? "text-violet-500" : "")}>
                    {profile?.plano === "pro" ? "PRO" : "Free"}
                  </span>{" "}
                  · login com Google
                </p>
              </div>
            </div>

            {!confirmLogout ? (
              <Row
                icon={LogOut}
                label="Sair da conta"
                onClick={() => setConfirmLogout(true)}
              />
            ) : (
              <div className="px-5 py-3.5 flex items-center gap-3 bg-red-500/5">
                <p className="text-sm text-foreground flex-1">Confirmar saída?</p>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Sair
                </button>
              </div>
            )}

            <Row
              icon={Trash2}
              label="Excluir conta"
              description="Remove permanentemente seus dados da plataforma"
              danger
            />
          </Section>

          {/* Sobre */}
          <div className="text-center py-2 space-y-1">
            <p className="text-[10px] text-muted-foreground/40 font-mono">Axon v{APP_VERSION}</p>
            <p className="text-[10px] text-muted-foreground/30">
              Desenvolvido para residentes de psiquiatria · Brasil
            </p>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
