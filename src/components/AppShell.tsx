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
        <header className="navbar bg-base-100/80 backdrop-blur border-b border-base-300 px-4 lg:px-6 min-h-16">
          <div className="navbar-start">
            <label htmlFor="app-drawer" className="btn btn-square btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
            <Link href="/dashboard" className="btn btn-ghost text-xl font-bold normal-case">
              ClanOps
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ClanSwitcher />
          </div>

          <div className="navbar-end gap-2">
            {userName && (
              <div className="hidden xl:flex items-center gap-2">
                <div className="badge badge-ghost badge-sm">
                  {userName}
                </div>
              </div>
            )}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Salir
            </button>
          </div>
        </header>
        <div className="p-4 lg:p-6">
          <div className="lg:hidden mb-6">
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
