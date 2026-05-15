import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Atom, Zap, MapPin, FlaskConical,
  AlertTriangle, CheckCircle, BookOpen, Info,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { sistemas, acaoLabel, acaoColor, type AlvoFarmacologico } from "@/lib/data/receptores";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return sistemas.map((s) => ({ sistema: s.id }));
}

export default async function SistemaPage({
  params,
}: {
  params: Promise<{ sistema: string }>;
}) {
  const { sistema: sistemaId } = await params;
  const sistema = sistemas.find((s) => s.id === sistemaId);
  if (!sistema) notFound();

  const essenciais = sistema.alvos.filter((a) => a.nivel === "essencial");
  const avancados  = sistema.alvos.filter((a) => a.nivel === "avancado");

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca/receptores"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${sistema.gradiente}`}
            >
              <Atom size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{sistema.nome}</h1>
              <p className="text-xs text-muted-foreground">
                {sistema.alvos.length} {sistema.alvos.length === 1 ? "alvo" : "alvos"} ·{" "}
                {essenciais.length} essenciais · {avancados.length} avançados
              </p>
            </div>
          </div>

          {/* Descrição e relevância */}
          <div className="space-y-3">
            <div className="bg-card border border-border rounded-2xl px-5 py-4">
              <p className="text-sm text-foreground leading-relaxed">{sistema.descricao}</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-4 flex gap-3">
              <BookOpen size={14} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">
                <span className="font-semibold text-primary">Relevância clínica: </span>
                {sistema.relevancia_clinica}
              </p>
            </div>
          </div>

          {/* Alvos essenciais */}
          {essenciais.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={13} className="text-green-600" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Essenciais — conhecimento mandatório
                </p>
              </div>
              <div className="space-y-3">
                {essenciais.map((alvo) => (
                  <AlvoCard key={alvo.id} alvo={alvo} gradiente={sistema.gradiente} />
                ))}
              </div>
            </div>
          )}

          {/* Alvos avançados */}
          {avancados.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-amber-500" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Avançados — aprofundamento
                </p>
              </div>
              <div className="space-y-3">
                {avancados.map((alvo) => (
                  <AlvoCard key={alvo.id} alvo={alvo} gradiente={sistema.gradiente} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

function AlvoCard({ alvo, gradiente }: { alvo: AlvoFarmacologico; gradiente: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Título */}
      <div className="px-5 py-4 border-b border-border flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${gradiente}`}>
          <Atom size={15} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-foreground text-sm">{alvo.nome}</p>
            {alvo.nome_completo && (
              <p className="text-[11px] text-muted-foreground italic truncate">{alvo.nome_completo}</p>
            )}
          </div>
          <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            {alvo.tipo}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Localização */}
        {alvo.localizacao.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <MapPin size={10} /> Localização
            </p>
            <div className="flex flex-wrap gap-1.5">
              {alvo.localizacao.map((loc) => (
                <span
                  key={loc}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Função */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Zap size={10} /> Função
          </p>
          <p className="text-xs text-foreground leading-relaxed">{alvo.funcao}</p>
        </div>

        {/* Agonismo / Antagonismo */}
        {(alvo.agonismo || alvo.antagonismo) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alvo.agonismo && (
              <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-3 py-2.5 space-y-1">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">
                  Agonismo / Ativação
                </p>
                <p className="text-xs text-foreground leading-relaxed">{alvo.agonismo}</p>
              </div>
            )}
            {alvo.antagonismo && (
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-3 py-2.5 space-y-1">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                  Antagonismo / Bloqueio
                </p>
                <p className="text-xs text-foreground leading-relaxed">{alvo.antagonismo}</p>
              </div>
            )}
          </div>
        )}

        {/* Fármacos */}
        {alvo.farmacos.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <FlaskConical size={10} /> Fármacos relacionados
            </p>
            <div className="space-y-1.5">
              {alvo.farmacos.map((f) => (
                <div key={f.nome} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5",
                      acaoColor[f.acao]
                    )}
                  >
                    {acaoLabel[f.acao]}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-foreground">{f.nome}</span>
                    {f.nota && (
                      <span className="text-[11px] text-muted-foreground ml-1.5">— {f.nota}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pearl clínico */}
        {alvo.nota && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 flex gap-3">
            <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-0.5">Pearl clínico</p>
              <p className="text-xs text-foreground leading-relaxed">{alvo.nota}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
