"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LogOut,
  Home,
  FileBarChart,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  // Lista de rotas
  const menuItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/clientes", icon: Users, label: "Clientes" },
    { href: "/produtos", icon: Package, label: "Produtos" },
    { href: "/vendas", icon: ShoppingBag, label: "Vendas" },
    { href: "/relatorios", icon: FileBarChart, label: "Relatórios" },
    { href: "/administradores", icon: ShieldCheck, label: "Administradores" },
  ];

  return (
    // CORREÇÃO 1: Largura w-[280px] para fechar o buraco branco
    <aside className="w-[280px] bg-white border-r border-slate-200 h-screen fixed top-0 left-0 flex flex-col p-6 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 text-blue-600">
        <LayoutDashboard className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-slate-800">
          SalesPro
        </span>
      </div>

      {/* Navegação Dinâmica */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          // Verifica se o link é o atual (inclui sub-rotas)
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600" // Estilo Ativo
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900" // Estilo Inativo
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        {admin && (
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-slate-700 truncate">
              {admin.nome}
            </p>
            <p className="text-xs text-slate-400 truncate">{admin.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition w-full px-2"
        >
          <LogOut className="w-5 h-5" /> Sair
        </button>
      </div>
    </aside>
  );
}
