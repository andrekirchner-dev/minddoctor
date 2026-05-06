"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ShieldCheck,
  Crown,
  TrendingUp,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { getAllUsers, updateUserRole, updateUserPlan, type UserProfile } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";

type Tab = "overview" | "usuarios";

export default function AdminPage() {
  const [tab, setTab]       = useState<Tab>("overview");
  const [users, setUsers]   = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const totalUsers  = users.length;
  const proUsers    = users.filter((u) => u.plano === "pro").length;
  const adminUsers  = users.filter((u) => u.role === "admin").length;
  const freeUsers   = totalUsers - proUsers;

  async function handleRoleChange(uid: string, role: "admin" | "user") {
    await updateUserRole(uid, role);
    setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role } : u));
    setOpenMenu(null);
  }

  async function handlePlanChange(uid: string, plano: "free" | "pro") {
    await updateUserPlan(uid, plano);
    setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, plano } : u));
    setOpenMenu(null);
  }

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
      <div className="flex gap-1 border-b border-border">
        {(["overview", "usuarios"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "overview" ? "Visão Geral" : "Usuários"}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users}      label="Total de usuários" value={totalUsers}  color="#4A6CF7" />
            <StatCard icon={Crown}      label="Plano Pro"          value={proUsers}    color="#7B5EA7" />
            <StatCard icon={TrendingUp} label="Plano Free"         value={freeUsers}   color="#10B981" />
            <StatCard icon={ShieldCheck}label="Admins"             value={adminUsers}  color="#D62828" />
          </div>

          {/* Plan distribution */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição de planos</h2>
            <div className="space-y-3">
              <PlanBar label="Free" count={freeUsers} total={totalUsers} color="#4A6CF7" />
              <PlanBar label="Pro"  count={proUsers}  total={totalUsers} color="#7B5EA7" />
            </div>
          </div>
        </div>
      )}

      {tab === "usuarios" && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhum usuário encontrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Usuário</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plano</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {(u.displayName ?? u.email ?? "?")[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{u.displayName ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                        u.plano === "pro"
                          ? "bg-[#7B5EA7]/15 text-[#7B5EA7]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {u.plano === "pro" ? "Pro" : "Free"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                        u.role === "admin"
                          ? "bg-[#D62828]/10 text-[#D62828]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {u.role === "admin" && <ShieldCheck size={10} />}
                        {u.role === "admin" ? "Admin" : "Usuário"}
                      </span>
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
                              onClick={() => handlePlanChange(u.uid, "free")}
                              className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", u.plano === "free" && "text-primary font-semibold")}
                            >
                              Free
                            </button>
                            <button
                              onClick={() => handlePlanChange(u.uid, "pro")}
                              className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", u.plano === "pro" && "text-primary font-semibold")}
                            >
                              Pro
                            </button>
                            <div className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide border-t border-b border-border">
                              Role
                            </div>
                            <button
                              onClick={() => handleRoleChange(u.uid, "admin")}
                              className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-[#D62828]", u.role === "admin" && "font-semibold")}
                            >
                              Tornar Admin
                            </button>
                            <button
                              onClick={() => handleRoleChange(u.uid, "user")}
                              className={cn("w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors", u.role === "user" && "text-primary font-semibold")}
                            >
                              Remover Admin
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
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
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

function PlanBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{count} ({pct}%)</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
