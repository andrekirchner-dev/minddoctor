import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PsicopatologiaPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Link
              href="/biblioteca"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Wiki de Psicopatologia</h1>
              <p className="text-xs text-muted-foreground">12 domínios semiológicos</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-2xl py-20 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Clock size={22} className="text-violet-600" />
            </div>
            <p className="font-semibold text-foreground">Em construção</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              A wiki de psicopatologia com fenômenos, pearls clínicas e referências está sendo curada e será publicada em breve.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
