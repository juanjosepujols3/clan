"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import ClanSwitcher from "@/components/ClanSwitcher";

const navItems = [
  { label: "Panel", href: "/dashboard" },
  { label: "Clan", href: "/clan" },
  { label: "Miembros", href: "/clan/members" },
  { label: "Periodos", href: "/periods" },
  { label: "Exploracion", href: "/exploration" },
  { label: "Advertencias", href: "/warnings" },
  { label: "Comparar", href: "/compare" },
  { label: "Importar/Exportar", href: "/import-export" },
];

type AppShellProps = {
  children: React.ReactNode;
  userName?: string | null;
};

export default function AppShell({ children, userName }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <header className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 px-6">
          <div className="flex-none lg:hidden">
            <label htmlFor="app-drawer" className="btn btn-square btn-ghost">
              <span className="text-sm font-semibold">Menu</span>
            </label>
          </div>
          <div className="flex-1 gap-4">
            <Link href="/dashboard" className="text-xl font-semibold">
              ClanOps
            </Link>
            <div className="hidden md:block">
              <ClanSwitcher />
            </div>
          </div>
          <div className="flex-none gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-base-content/70">
              {userName ? `Conectado como ${userName}` : ""}
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Salir
            </button>
          </div>
        </header>
        <div className="px-6 py-6">
          <div className="md:hidden mb-4">
            <ClanSwitcher />
          </div>
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <aside className="menu w-72 bg-base-100 text-base-content border-r border-base-300 p-4">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-base-content/50">
              Navegacion
            </div>
          </div>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "active font-semibold"
                    : "font-medium"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </aside>
      </div>
    </div>
  );
}
