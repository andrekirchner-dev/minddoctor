"use client";

import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, CheckCircle, AlertCircle, Wrench } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getAppConfig, type AppConfig } from "@/lib/firebase/appConfig";
import { cn } from "@/lib/utils";

type BannerTipo = AppConfig["banner"]["tipo"];

const TIPO_STYLES: Record<BannerTipo, string> = {
  info:    "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-100",
  warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-100",
  error:   "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-100",
  success: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100",
};

const TIPO_ICONS: Record<BannerTipo, React.ElementType> = {
  info:    Info,
  warning: AlertTriangle,
  error:   AlertCircle,
  success: CheckCircle,
};

const MANUTENCAO_STYLE = "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-100";

// Module-level cache — survives client-side navigations within the session.
let configCache: AppConfig | null = null;

export function GlobalBanner() {
  const { isAdmin } = useAuth();
  const [config, setConfig] = useState<AppConfig | null>(configCache);
  const [dismissed, setDismissed] = useState(false);
  const [manutencaoDismissed, setManutencaoDismissed] = useState(false);

  useEffect(() => {
    if (configCache) return; // already fetched this session
    getAppConfig()
      .then(c => { configCache = c; setConfig(c); })
      .catch(() => {});
  }, []);

  if (!config) return null;

  const showMaintenanceBanner = config.manutencao && !isAdmin && !manutencaoDismissed;
  const showCustomBanner = config.banner.ativo && !dismissed;

  if (!showMaintenanceBanner && !showCustomBanner) return null;

  return (
    <div className="flex flex-col gap-1 px-6 pt-2">
      {showMaintenanceBanner && (
        <div className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium", MANUTENCAO_STYLE)}>
          <Wrench size={16} className="shrink-0" />
          <span className="flex-1">
            O sistema está em manutenção. Algumas funcionalidades podem estar indisponíveis.
          </span>
          <button onClick={() => setManutencaoDismissed(true)} className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity" aria-label="Fechar">
            <X size={14} />
          </button>
        </div>
      )}

      {showCustomBanner && (() => {
        const Icon = TIPO_ICONS[config.banner.tipo];
        return (
          <div className={cn("flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium", TIPO_STYLES[config.banner.tipo])}>
            <Icon size={16} className="shrink-0" />
            <span className="flex-1">{config.banner.mensagem}</span>
            {config.banner.link && (
              <a href={config.banner.link} target="_blank" rel="noopener noreferrer" className="shrink-0 underline underline-offset-2 hover:opacity-80 transition-opacity text-xs font-semibold">
                {config.banner.linkLabel || "Saiba mais"}
              </a>
            )}
            <button onClick={() => setDismissed(true)} className="shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity" aria-label="Fechar banner">
              <X size={14} />
            </button>
          </div>
        );
      })()}
    </div>
  );
}
