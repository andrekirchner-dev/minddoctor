import { ClipboardList } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { escalas } from "@/lib/data/escalas";
import { EscalasGrid } from "@/components/escalas/EscalasGrid";

export default function EscalasPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #4A6CF7, #7B5EA7)" }}
            >
              <ClipboardList size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Escalas Clínicas</h1>
              <p className="text-xs text-muted-foreground">Instrumentos validados para avaliação psiquiátrica</p>
            </div>
          </div>

          <EscalasGrid escalas={escalas} />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
