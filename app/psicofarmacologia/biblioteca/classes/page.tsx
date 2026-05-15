import Link from "next/link";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { classes } from "@/lib/data/classes";

export default function ClassesPage() {
  const totalSubclasses = classes.reduce((acc, c) => acc + c.subclasses.length, 0);

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
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Classes Farmacológicas</h1>
              <p className="text-xs text-muted-foreground">
                {classes.length} classes · {totalSubclasses} subclasses
              </p>
            </div>
          </div>

          {/* Classes */}
          <div className="space-y-6">
            {classes.map((classe) => (
              <div key={classe.id} className="space-y-2.5">
                {/* Class header */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${classe.gradiente}`}>
                    <FlaskConical size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{classe.nome}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight">{classe.descricao}</p>
                  </div>
                </div>

                {/* Subclasses grid */}
                <div className="grid grid-cols-1 gap-2 pl-0">
                  {classe.subclasses.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/psicofarmacologia/biblioteca/classes/${sub.id}`}
                      className="group bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(74,108,247,0.06)] transition-all duration-200"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${classe.gradiente} opacity-80`}>
                        <FlaskConical size={15} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-bold text-foreground text-sm">{sub.nome}</p>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {sub.nome_completo !== sub.nome ? sub.nome_completo : ""}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{sub.descricao}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sub.moleculas.slice(0, 4).map((m) => (
                            <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              {m}
                            </span>
                          ))}
                          {sub.moleculas.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                              +{sub.moleculas.length - 4} mais
                            </span>
                          )}
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
            ))}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
