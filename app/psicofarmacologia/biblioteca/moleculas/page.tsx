import Link from "next/link";
import { ChevronLeft, Pill } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BibliotecaFarmacos } from "@/components/psicofarmacologia/BibliotecaFarmacos";

export default function MoleculasPage() {
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
              style={{ background: "linear-gradient(135deg, #3B82F6, #4338CA)" }}
            >
              <Pill size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Moléculas</h1>
              <p className="text-xs text-muted-foreground">Busca por nome, indicação ou classe farmacológica</p>
            </div>
          </div>

          <BibliotecaFarmacos />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
