import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { populacoes } from "@/lib/data/populacoes";

export default function PopulacoesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Link
              href="/psicofarmacologia/biblioteca"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #F43F5E, #EC4899)" }}
            >
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Populações Especiais</h1>
              <p className="text-xs text-muted-foreground">
                {populacoes.length} populações · ajustes de conduta e precauções específicas
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-3">
            {populacoes.map((p) => (
              <Link
                key={p.id}
                href={`/psicofarmacologia/biblioteca/populacoes/${p.id}`}
                className="group bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.06)] transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${p.gradiente}`}>
                  <Users size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-foreground text-sm">{p.nome}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                      Disponível
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{p.descricao}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {p.regras.length} regras
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                      {p.pearls.length} pearls
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
