import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar"; // Verifique o caminho do import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalesPro ERP",
  description: "Sistema de Gestão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          {/* A Sidebar é fixa (fixed) dentro do componente dela */}
          <Sidebar />

          {/* O conteúdo principal é empurrado 280px para a direita */}
          <main className="flex-1 ml-[280px]">{children}</main>
        </div>
      </body>
    </html>
  );
}
