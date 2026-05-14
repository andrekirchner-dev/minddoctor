"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  AlertTriangle,
  ClipboardList,
  BookOpen,
  Layers,
  GraduationCap,
  Brain,
  Stethoscope,
  FolderOpen,
  User,
  Settings,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard",        icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ia",               icon: Brain,            label: "IA Clínica" },
  { href: "/consulta",         icon: Stethoscope,      label: "Consulta" },
  { href: "/psicofarmacologia",icon: Pill,             label: "Psicofarmacologia" },
  { href: "/emergencia",       icon: AlertTriangle,    label: "Emergência" },
  { href: "/escalas",          icon: ClipboardList,    label: "Escalas" },
  { href: "/biblioteca",       icon: BookOpen,         label: "Biblioteca" },
  { href: "/modulos",          icon: Layers,           label: "Módulos" },
  { href: "/estudos",          icon: GraduationCap,    label: "Estudos" },
];

const bottomItems = [
  { href: "/casos",    icon: FolderOpen, label: "Casos Clínicos" },
  { href: "/perfil",   icon: User,       label: "Perfil" },
  { href: "/settings", icon: Settings,   label: "Configurações" },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname  = usePathname();
  const { isAdmin } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <aside
      style={{ width: expanded ? 220 : 64 }}
      className={cn(
        "relative flex flex-col shrink-0 h-screen transition-[width] duration-300 ease-in-out overflow-hidden",
        "bg-[#4A6CF7] dark:bg-[#13162A]"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-center w-10 h-10 mx-auto mt-4 mb-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label={expanded ? "Recolher menu" : "Expandir menu"}
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 mb-4 transition-opacity duration-200",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <Image src="/MindDoctor.png" width={22} height={22} alt="" className="rounded-md shrink-0" />
        <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
          MindDoctor
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <NavItem
              key={href}
              href={href}
              icon={Icon}
              label={label}
              active={active}
              expanded={expanded}
            />
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="flex flex-col gap-1 px-2 pb-4">
        <div className="h-px bg-white/10 my-2 mx-1" />
        {isAdmin && (
          <NavItem
            href="/admin"
            icon={ShieldCheck}
            label="Admin"
            active={pathname === "/admin" || pathname.startsWith("/admin/")}
            expanded={expanded}
            admin
          />
        )}
        {bottomItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <NavItem
              key={href}
              href={href}
              icon={Icon}
              label={label}
              active={active}
              expanded={expanded}
            />
          );
        })}
        <div className="relative group/nav">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-red-300 hover:bg-white/10 hover:text-red-200"
          >
            <LogOut size={20} className="shrink-0 transition-transform duration-150 group-hover/nav:scale-110" />
            <span className={cn(
              "whitespace-nowrap text-sm font-medium transition-opacity duration-200",
              expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}>
              Sair
            </span>
          </button>
          {!expanded && (
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150 z-50">
              Sair
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  expanded: boolean;
  danger?: boolean;
  admin?: boolean;
}

function NavItem({ href, icon: Icon, label, active, expanded, danger, admin }: NavItemProps) {
  return (
    <div className="relative group/nav">
      <Link
        href={href}
        title={!expanded ? label : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
          active
            ? "bg-white text-[#4A6CF7] dark:bg-[#4A6CF7] dark:text-white font-semibold"
            : danger
            ? "text-red-300 hover:bg-white/10 hover:text-red-200"
            : admin
            ? "text-amber-300 hover:bg-white/10 hover:text-amber-200"
            : "text-white/75 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon
          size={20}
          className={cn(
            "shrink-0 transition-transform duration-150 group-hover/nav:scale-110",
            active && "text-[#4A6CF7] dark:text-white"
          )}
        />
        <span
          className={cn(
            "whitespace-nowrap text-sm font-medium transition-opacity duration-200",
            expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}
        >
          {label}
        </span>
      </Link>

      {/* Custom CSS tooltip when collapsed */}
      {!expanded && (
        <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150 z-50">
          {label}
        </span>
      )}
    </div>
  );
}
