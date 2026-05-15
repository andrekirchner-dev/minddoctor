import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, FlaskConical, AlertTriangle, CheckCircle,
  BookOpen, Pill, Info, ShieldAlert, Activity, Zap,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  classes,
  getSubclasse,
  getClasseDaSubclasse,
  nivelRiscoLabel,
  nivelRiscoColor,
  ativacaoLabel,
  ativacaoColor,
} from "@/lib/data/classes";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  const params: { classe: string }[] = [];
  for (const c of classes) {
    for (const sub of c.subclasses) {
      params.push({ classe: sub.id });
    }
  }
  return params;
}

export default async function SubclassePage({
  params,
}: {
  params: Promise<{ classe: string }>;
}) {
  const { classe: classeId } = await params;
  const sub = getSubclasse(classeId);
  if (!sub) notFound();

  const classe = getClasseDaSubclasse(classeId);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca/classes"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${classe?.gradiente ?? "from-violet-500 to-purple-600"}`}
            >
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{sub.nome}</h1>
              <p className="text-xs text-muted-foreground">{sub.nome_completo} · {classe?.nome}</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="bg-card border border-border rounded-2xl px-5 py-4 space-y-3">
            <p className="text-sm text-foreground leading-relaxed">{sub.descricao}</p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex gap-3">
              <Zap size={13} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-0.5">Mecanismo de ação</p>
                <p className="text-xs text-foreground leading-relaxed">{sub.mecanismo}</p>
              </div>
            </div>
          </div>

          {/* Perfil clínico */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Activity size={13} className="text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Perfil clínico</p>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ProfileBadge label="Ativação" value={ativacaoLabel[sub.perfil.ativacao]} cls={ativacaoColor[sub.perfil.ativacao]} />
              <ProfileBadge label="Risco sexual" value={nivelRiscoLabel[sub.perfil.risco_sexual]} cls={nivelRiscoColor[sub.perfil.risco_sexual]} />
              <ProfileBadge label="Risco metabólico" value={nivelRiscoLabel[sub.perfil.risco_metabolico]} cls={nivelRiscoColor[sub.perfil.risco_metabolico]} />
              <ProfileBadge label="Risco QTc" value={nivelRiscoLabel[sub.perfil.risco_qtc]} cls={nivelRiscoColor[sub.perfil.risco_qtc]} />
              <ProfileBadge label="Risco EPS" value={nivelRiscoLabel[sub.perfil.risco_eps]} cls={nivelRiscoColor[sub.perfil.risco_eps]} />
              <ProfileBadge
                label="Prolactina"
                value={sub.perfil.prolactina === "eleva" ? "Eleva" : sub.perfil.prolactina === "reduz" ? "Reduz" : "Neutro"}
                cls={
                  sub.perfil.prolactina === "eleva"
                    ? "bg-red-500/10 text-red-700 border-red-500/20"
                    : sub.perfil.prolactina === "reduz"
                    ? "bg-green-500/10 text-green-700 border-green-500/20"
                    : "bg-gray-500/10 text-gray-700 border-gray-500/20"
                }
              />
            </div>
          </div>

          {/* Moléculas */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <Pill size={13} className="text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Moléculas</p>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-2">
              {sub.moleculas.map((m) => (
                <span key={m} className="text-xs font-medium px-3 py-1 rounded-full bg-muted border border-border text-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Indicações */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <CheckCircle size={13} className="text-green-600" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Indicações</p>
            </div>
            <ul className="px-5 py-4 space-y-2">
              {sub.indicacoes.map((ind) => (
                <li key={ind} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                  <span className="text-xs text-foreground leading-relaxed">{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Efeitos adversos */}
          {sub.efeitos_adversos.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <AlertTriangle size={13} className="text-amber-500" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Efeitos adversos</p>
              </div>
              <ul className="px-5 py-4 space-y-2">
                {sub.efeitos_adversos.map((ea) => (
                  <li key={ea} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span className="text-xs text-foreground leading-relaxed">{ea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contraindicações */}
          {sub.contraindicacoes.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <ShieldAlert size={13} className="text-red-600" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contraindicações</p>
              </div>
              <ul className="px-5 py-4 space-y-2">
                {sub.contraindicacoes.map((ci) => (
                  <li key={ci} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span className="text-xs text-foreground leading-relaxed">{ci}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monitoramento */}
          {sub.monitoramento.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Activity size={13} className="text-blue-600" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Monitoramento</p>
              </div>
              <ul className="px-5 py-4 space-y-2">
                {sub.monitoramento.map((m) => (
                  <li key={m} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    <span className="text-xs text-foreground leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Diferenciais */}
          {sub.diferenciais && sub.diferenciais.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Info size={13} className="text-violet-600" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Diferenciais entre moléculas</p>
              </div>
              <ul className="px-5 py-4 space-y-2.5">
                {sub.diferenciais.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                    <span className="text-xs text-foreground leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pearl clínica */}
          {sub.nota_clinica && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-4 flex gap-3">
              <BookOpen size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">Pearl clínica</p>
                <p className="text-xs text-foreground leading-relaxed">{sub.nota_clinica}</p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

function ProfileBadge({
  label,
  value,
  cls,
}: {
  label: string;
  value: string;
  cls: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <span className={cn("inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border", cls)}>
        {value}
      </span>
    </div>
  );
}
