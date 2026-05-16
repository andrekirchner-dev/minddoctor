"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Users,
  ShieldCheck,
  Crown,
  TrendingUp,
  MoreHorizontal,
  Settings,
  Bell,
  Search,
  X,
  Plus,
  Check,
  AlertTriangle,
  Info,
  Zap,
  Lock,
  Unlock,
  RefreshCw,
  Megaphone,
  Activity,
  BarChart3,
  ClipboardList,
  UserCheck,
  Globe,
} from "lucide-react";
import { getAllUsers, updateUserRole, updateUserPlan, type UserProfile } from "@/lib/firebase/firestore";
import { getAllConsultasCount } from "@/lib/firebase/consultas";
import {
  getAppConfig,
  updateAppConfig,
  getAnuncios,
  createAnuncio,
  toggleAnuncio,
  deleteAnuncio,
  DEFAULT_CONFIG,
  type AppConfig,
  type Anuncio,
} from "@/lib/firebase/appConfig";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "usuarios" | "configuracoes" | "comunicados";

type PlanFilter = "todos" | "free" | "pro" | "admin";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: unknown): string {
  if (!ts) return "—";
  if (typeof ts === "object" && ts !== null && "seconds" in ts) {
    const d = new Date((ts as { seconds: number }).seconds * 1000);
    return d.toLocaleDateString("pt-BR");
  }
  return "—";
}

function userInitial(u: UserProfile): string {
  return (u.displayName ?? u.email ?? "?")[0].toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-10 rounded bg-muted animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

function PlanBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>
          {count} ({pct}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

function UserRow({
  u,
  openMenu,
  setOpenMenu,
  onPlanChange,
  onRoleChange,
}: {
  u: UserProfile;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onPlanChange: (uid: string, plano: "free" | "pro") => void;
  onRoleChange: (uid: string, role: "admin" | "user") => void;
}) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {u.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={u.photoURL}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {userInitial(u)}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{u.displayName ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
            u.plano === "pro"
              ? "bg-[#7B5EA7]/15 text-[#7B5EA7]"
              : "bg-muted text-muted-foreground"
          )}
        >
          {u.plano === "pro" ? "Pro" : "Free"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
            u.role === "admin"
              ? "bg-[#D62828]/10 text-[#D62828]"
              : "bg-muted text-muted-foreground"
          )}
        >
          {u.role === "admin" && <ShieldCheck size={10} />}
          {u.role === "admin" ? "Admin" : "Usuário"}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {formatDate(u.createdAt)}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative inline-block">
          <button
            onClick={() => setOpenMenu(openMenu === u.uid ? null : u.uid)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal size={16} />
          </button>
          {openMenu === u.uid && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide border-b border-border">
                Plano
              </div>
              <button
                onClick={() => onPlanChange(u.uid, "free")}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                  u.plano === "free" && "text-primary font-semibold"
                )}
              >
                {u.plano === "free" && <Check size={12} />}
                Free
              </button>
              <button
                onClick={() => onPlanChange(u.uid, "pro")}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                  u.plano === "pro" && "text-primary font-semibold"
                )}
              >
                {u.plano === "pro" && <Check size={12} />}
                Pro
              </button>
              <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide border-t border-b border-border">
                Role
              </div>
              <button
                onClick={() => onRoleChange(u.uid, "admin")}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-[#D62828] flex items-center gap-2",
                  u.role === "admin" && "font-semibold"
                )}
              >
                {u.role === "admin" && <Check size={12} />}
                Tornar Admin
              </button>
              <button
                onClick={() => onRoleChange(u.uid, "user")}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2",
                  u.role === "user" && "text-primary font-semibold"
                )}
              >
                {u.role === "user" && <Check size={12} />}
                Remover Admin
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  icon: Icon,
  iconColor,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={15} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          value ? "bg-primary" : "bg-muted"
        )}
        aria-checked={value}
        role="switch"
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
            value && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

function SaveFeedback({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <Check size={13} />
      Configurações salvas
    </span>
  );
}

function AnuncioTipoBadge({ tipo }: { tipo: Anuncio["tipo"] }) {
  const styles = {
    info:    "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  };
  const labels = { info: "Info", warning: "Aviso", success: "Sucesso" };
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-semibold", styles[tipo])}>
      {labels[tipo]}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user } = useAuth();

  // Tab
  const [tab, setTab] = useState<Tab>("overview");

  // Users
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("todos");

  // Consultas
  const [consultasCount, setConsultasCount] = useState({ total: 0, mes: 0 });
  const [consultasLoading, setConsultasLoading] = useState(true);

  // AppConfig
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configDraft, setConfigDraft] = useState<AppConfig | null>(null);
  const [configSaved, setConfigSaved] = useState(false);

  // Comunicados
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [anunciosLoading, setAnunciosLoading] = useState(true);
  const [novoAnuncio, setNovoAnuncio] = useState<Omit<Anuncio, "id" | "createdAt">>({
    titulo: "",
    mensagem: "",
    tipo: "info",
    ativo: true,
  });
  const [creatingAnuncio, setCreatingAnuncio] = useState(false);

  // ── Load data ────────────────────────────────────────────────────────────

  // Config and anuncios are cheap (single doc / small collection) — load eagerly.
  // Users is a full collection scan — load lazily on first visit to that tab.

  useEffect(() => {
    getAppConfig()
      .then((c) => { setConfig(c); setConfigDraft(c); })
      .catch(() => { setConfig(DEFAULT_CONFIG); setConfigDraft(DEFAULT_CONFIG); })
      .finally(() => setConfigLoading(false));
  }, []);

  useEffect(() => {
    getAnuncios()
      .then(setAnuncios)
      .catch(() => setAnuncios([]))
      .finally(() => setAnunciosLoading(false));
  }, []);

  const usersFetched = useRef(false);

  useEffect(() => {
    if (tab !== "overview" && tab !== "usuarios") return;
    if (usersFetched.current) return;
    usersFetched.current = true;
    getAllUsers().then(setUsers).catch(() => setUsers([])).finally(() => setUsersLoading(false));
    getAllConsultasCount().then(setConsultasCount).catch(() => {}).finally(() => setConsultasLoading(false));
  }, [tab]);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const totalUsers = users.length;
  const proUsers   = users.filter((u) => u.plano === "pro").length;
  const freeUsers  = totalUsers - proUsers;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  const recentUsers = [...users]
    .sort((a, b) => {
      const as = (a.createdAt as { seconds?: number })?.seconds ?? 0;
      const bs = (b.createdAt as { seconds?: number })?.seconds ?? 0;
      return bs - as;
    })
    .slice(0, 5);

  // ── Filtered users for Usuários tab ──────────────────────────────────────

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !search ||
      (u.displayName?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchFilter =
      planFilter === "todos" ||
      (planFilter === "free" && u.plano === "free") ||
      (planFilter === "pro" && u.plano === "pro") ||
      (planFilter === "admin" && u.role === "admin");
    return matchSearch && matchFilter;
  });

  // ── User action handlers ──────────────────────────────────────────────────

  const handleRoleChange = useCallback(async (uid: string, role: "admin" | "user") => {
    await updateUserRole(uid, role);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
    setOpenMenu(null);
  }, []);

  const handlePlanChange = useCallback(async (uid: string, plano: "free" | "pro") => {
    await updateUserPlan(uid, plano);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, plano } : u)));
    setOpenMenu(null);
  }, []);

  // ── Config handlers ───────────────────────────────────────────────────────

  const handleSaveBanner = useCallback(async () => {
    if (!configDraft) return;
    await updateAppConfig({ banner: configDraft.banner }, user?.email ?? "");
    setConfig((prev) => prev ? { ...prev, banner: configDraft.banner } : prev);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  }, [configDraft, user?.email]);

  const handleSaveControles = useCallback(async () => {
    if (!configDraft) return;
    const { manutencao, registroAberto, iaHabilitada, maxConsultasFree } = configDraft;
    await updateAppConfig({ manutencao, registroAberto, iaHabilitada, maxConsultasFree }, user?.email ?? "");
    setConfig((prev) => prev ? { ...prev, manutencao, registroAberto, iaHabilitada, maxConsultasFree } : prev);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  }, [configDraft, user?.email]);

  const patchDraft = useCallback((patch: Partial<AppConfig>) => {
    setConfigDraft((prev) => prev ? { ...prev, ...patch } : prev);
  }, []);

  const patchBanner = useCallback(
    (patch: Partial<AppConfig["banner"]>) => {
      setConfigDraft((prev) =>
        prev ? { ...prev, banner: { ...prev.banner, ...patch } } : prev
      );
    },
    []
  );

  // ── Anuncio handlers ──────────────────────────────────────────────────────

  const handleCreateAnuncio = useCallback(async () => {
    if (!novoAnuncio.titulo.trim() || !novoAnuncio.mensagem.trim()) return;
    setCreatingAnuncio(true);
    try {
      const id = await createAnuncio(novoAnuncio);
      const newItem: Anuncio = { id, ...novoAnuncio, createdAt: { seconds: Date.now() / 1000 } };
      setAnuncios((prev) => [newItem, ...prev]);
      setNovoAnuncio({ titulo: "", mensagem: "", tipo: "info", ativo: true });
    } finally {
      setCreatingAnuncio(false);
    }
  }, [novoAnuncio]);

  const handleToggleAnuncio = useCallback(async (id: string, ativo: boolean) => {
    await toggleAnuncio(id, ativo);
    setAnuncios((prev) => prev.map((a) => (a.id === id ? { ...a, ativo } : a)));
  }, []);

  const handleDeleteAnuncio = useCallback(async (id: string) => {
    await deleteAnuncio(id);
    setAnuncios((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ── Tab labels ────────────────────────────────────────────────────────────

  const TAB_CONFIG: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview",       label: "Visão Geral",   icon: BarChart3 },
    { key: "usuarios",       label: "Usuários",      icon: Users },
    { key: "configuracoes",  label: "Configurações", icon: Settings },
    { key: "comunicados",    label: "Comunicados",   icon: Megaphone },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4A6CF7, #7B5EA7)" }}
        >
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Painel Admin</h1>
          <p className="text-xs text-muted-foreground">MindDoctor — controle total do app</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Users}       label="Total usuários"   value={totalUsers}              color="#4A6CF7" loading={usersLoading} />
            <StatCard icon={Crown}       label="Plano Pro"         value={proUsers}                color="#7B5EA7" loading={usersLoading} />
            <StatCard icon={TrendingUp}  label="Plano Free"        value={freeUsers}               color="#10B981" loading={usersLoading} />
            <StatCard icon={ShieldCheck} label="Admins"            value={adminUsers}              color="#D62828" loading={usersLoading} />
            <StatCard icon={Activity}    label="Consultas (total)" value={consultasCount.total}    color="#F59E0B" loading={consultasLoading} />
            <StatCard icon={ClipboardList} label="Consultas este mês" value={consultasCount.mes}  color="#06B6D4" loading={consultasLoading} />
          </div>

          {/* Plan distribution */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição de planos</h2>
            <div className="space-y-3">
              <PlanBar label="Free" count={freeUsers} total={totalUsers} color="#4A6CF7" />
              <PlanBar label="Pro"  count={proUsers}  total={totalUsers} color="#7B5EA7" />
            </div>
          </div>

          {/* Recent signups */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Últimos cadastros</h2>
            </div>
            {usersLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-2.5 w-48 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Nenhum usuário ainda.</p>
            ) : (
              <div className="divide-y divide-border">
                {recentUsers.map((u) => (
                  <div key={u.uid} className="px-5 py-3 flex items-center gap-3">
                    {u.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {userInitial(u)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.displayName ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                          u.plano === "pro" ? "bg-[#7B5EA7]/15 text-[#7B5EA7]" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {u.plano === "pro" ? "Pro" : "Free"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(u.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── USUÁRIOS ── */}
      {tab === "usuarios" && (
        <div className="space-y-4">
          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["todos", "free", "pro", "admin"] as PlanFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setPlanFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                    planFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {filteredUsers.length} usuário{filteredUsers.length !== 1 ? "s" : ""} encontrado{filteredUsers.length !== 1 ? "s" : ""}
          </p>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {usersLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Carregando usuários...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Nenhum usuário encontrado.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuário</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plano</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cadastro</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <UserRow
                        key={u.uid}
                        u={u}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onPlanChange={handlePlanChange}
                        onRoleChange={handleRoleChange}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONFIGURAÇÕES ── */}
      {tab === "configuracoes" && (
        <div className="space-y-6">
          {configLoading || !configDraft ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
              Carregando configurações...
            </div>
          ) : (
            <>
              {/* Banner Global */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Bell size={15} className="text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Banner Global</h2>
                  <span className="text-xs text-muted-foreground ml-1">Exibido para todos os usuários logados</span>
                </div>
                <div className="p-5 space-y-4">
                  <ToggleRow
                    label="Banner ativo"
                    description="Mostra o banner no topo do app"
                    value={configDraft.banner.ativo}
                    onChange={(v) => patchBanner({ ativo: v })}
                    icon={Bell}
                    iconColor="#4A6CF7"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                      <select
                        value={configDraft.banner.tipo}
                        onChange={(e) => patchBanner({ tipo: e.target.value as AppConfig["banner"]["tipo"] })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="info">Info (azul)</option>
                        <option value="warning">Aviso (âmbar)</option>
                        <option value="error">Erro (rosa)</option>
                        <option value="success">Sucesso (verde)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Link (opcional)</label>
                      <input
                        type="url"
                        value={configDraft.banner.link}
                        onChange={(e) => patchBanner({ link: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Mensagem</label>
                    <textarea
                      value={configDraft.banner.mensagem}
                      onChange={(e) => patchBanner({ mensagem: e.target.value })}
                      rows={2}
                      placeholder="Mensagem exibida no banner..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  {configDraft.banner.link && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Texto do link</label>
                      <input
                        type="text"
                        value={configDraft.banner.linkLabel}
                        onChange={(e) => patchBanner({ linkLabel: e.target.value })}
                        placeholder="Saiba mais"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleSaveBanner}
                      className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Salvar banner
                    </button>
                    <SaveFeedback show={configSaved} />
                  </div>
                </div>
              </div>

              {/* Controles do App */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Settings size={15} className="text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Controles do App</h2>
                </div>
                <div className="p-5 space-y-0">
                  <ToggleRow
                    label="Modo Manutenção"
                    description="Exibe overlay de manutenção para não-admins"
                    value={configDraft.manutencao}
                    onChange={(v) => patchDraft({ manutencao: v })}
                    icon={configDraft.manutencao ? Lock : Unlock}
                    iconColor="#F59E0B"
                  />
                  <ToggleRow
                    label="Registro de novos usuários"
                    description="Permite novos cadastros no app"
                    value={configDraft.registroAberto}
                    onChange={(v) => patchDraft({ registroAberto: v })}
                    icon={UserCheck}
                    iconColor="#10B981"
                  />
                  <ToggleRow
                    label="Funcionalidades de IA"
                    description="Habilita assistentes e análises com IA"
                    value={configDraft.iaHabilitada}
                    onChange={(v) => patchDraft({ iaHabilitada: v })}
                    icon={Zap}
                    iconColor="#7B5EA7"
                  />
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#4A6CF718" }}>
                        <RefreshCw size={15} style={{ color: "#4A6CF7" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Limite de consultas (plano Free)</p>
                        <p className="text-xs text-muted-foreground">999 = sem limite</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={configDraft.maxConsultasFree}
                      onChange={(e) => patchDraft({ maxConsultasFree: Number(e.target.value) })}
                      className="w-20 px-3 py-1.5 text-sm rounded-xl border border-border bg-card text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveControles}
                      className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Salvar controles
                    </button>
                    <SaveFeedback show={configSaved} />
                  </div>
                </div>
              </div>

              {/* Admin emails (read-only) */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#D62828]" />
                  <h2 className="text-sm font-semibold text-foreground">Emails com acesso admin</h2>
                  <span className="text-xs text-muted-foreground ml-1">(somente leitura)</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50 border border-border">
                    <ShieldCheck size={14} className="text-[#D62828] shrink-0" />
                    <span className="text-sm font-mono text-foreground">kirchner.andre@gmail.com</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Info size={12} />
                    Para alterar, edite <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">lib/firebase/firestore.ts</code>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── COMUNICADOS ── */}
      {tab === "comunicados" && (
        <div className="space-y-6">
          {/* Create form */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Plus size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Novo Comunicado</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Título</label>
                <input
                  type="text"
                  value={novoAnuncio.titulo}
                  onChange={(e) => setNovoAnuncio((p) => ({ ...p, titulo: e.target.value }))}
                  placeholder="Título do comunicado..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Mensagem</label>
                <textarea
                  value={novoAnuncio.mensagem}
                  onChange={(e) => setNovoAnuncio((p) => ({ ...p, mensagem: e.target.value }))}
                  rows={3}
                  placeholder="Conteúdo do comunicado..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                  <select
                    value={novoAnuncio.tipo}
                    onChange={(e) => setNovoAnuncio((p) => ({ ...p, tipo: e.target.value as Anuncio["tipo"] }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Aviso</option>
                    <option value="success">Sucesso</option>
                  </select>
                </div>
                <div className="pt-5">
                  <button
                    onClick={handleCreateAnuncio}
                    disabled={creatingAnuncio || !novoAnuncio.titulo.trim() || !novoAnuncio.mensagem.trim()}
                    className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={14} />
                    {creatingAnuncio ? "Criando..." : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Existing comunicados */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Globe size={15} className="text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Comunicados publicados</h2>
            </div>
            {anunciosLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Carregando comunicados...</div>
            ) : anuncios.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Megaphone size={28} className="text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Nenhum comunicado publicado ainda.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {anuncios.map((a) => (
                  <div key={a.id} className="px-5 py-4 flex items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{a.titulo}</p>
                        <AnuncioTipoBadge tipo={a.tipo} />
                        <span
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-xs font-semibold",
                            a.ativo
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {a.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{a.mensagem}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleAnuncio(a.id, !a.ativo)}
                        className={cn(
                          "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                          a.ativo
                            ? "bg-muted text-muted-foreground hover:text-foreground"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                        title={a.ativo ? "Desativar" : "Ativar"}
                      >
                        {a.ativo ? <AlertTriangle size={13} /> : <Check size={13} />}
                      </button>
                      <button
                        onClick={() => handleDeleteAnuncio(a.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
