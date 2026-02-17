"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  ShoppingBag,
  Users,
  Package,
  Bell,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
);

// Interfaces
interface OverviewData {
  totalVendas: number;
  valorTotal: string;
  ticketMedio: string;
  clientesAtivos: number;
  vendasHoje: string;
  totalProdutos: number;
  vendasPendentes: number;
}

interface VendasPorMes {
  mes: string;
  receita: number;
  transacoes: number;
  ticketMedio: number;
  crescimento: number;
}

interface StatusPedido {
  status: string;
  _count: { id: number };
}

interface Pedido {
  id: number;
  valor: number;
  data: string;
  status: string;
  usuarioId: number;
}

interface DashboardData {
  overview: OverviewData | null;
  vendasPorMes: VendasPorMes[];
  statusPedidos: StatusPedido[];
  ultimosPedidos: Pedido[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    overview: null,
    vendasPorMes: [],
    statusPedidos: [],
    ultimosPedidos: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { admin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, vendasMesRes, statusRes, pedidosRes] =
          await Promise.all([
            api.get("/dashboard/overview"),
            api.get("/relatorios/vendas-por-meses?meses=6"),
            api.get("/relatorios/status-pedidos"),
            api.get("/relatorios/pedidos?quantidade=10"),
          ]);

        setData({
          overview: overviewRes.data,
          vendasPorMes: vendasMesRes.data,
          statusPedidos: statusRes.data,
          ultimosPedidos: pedidosRes.data,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do NestJS:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    // Ajustado para ocupar altura total sem flex global
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">
          Carregando dashboard...
        </div>
      </div>
    );
  }

  // --- CONFIGURAÇÃO GRÁFICOS ---
  const salesChartData = {
    labels: data.vendasPorMes.map((item) => {
      const [ano, mes] = item.mes.split("-");
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      return meses[parseInt(mes) - 1] + "/" + ano.slice(2);
    }),
    datasets: [
      {
        label: "Receita",
        data: data.vendasPorMes.map((item) => item.receita),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const statusLabels: Record<string, string> = {
    concluida: "Concluído",
    pendente: "Pendente",
    excluida: "Cancelado",
  };

  const statusColors: Record<string, string> = {
    concluida: "#10b981",
    pendente: "#f59e0b",
    excluida: "#ef4444",
  };

  const statusData = {
    labels: data.statusPedidos.map((s) => statusLabels[s.status] || s.status),
    datasets: [
      {
        data: data.statusPedidos.map((s) => s._count.id),
        backgroundColor: data.statusPedidos.map(
          (s) => statusColors[s.status] || "#94a3b8",
        ),
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR");

  const formatStatus = (status: string) => {
    const map: Record<string, string> = {
      concluida: "Concluído",
      pendente: "Pendente",
      excluida: "Cancelado",
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      concluida: "bg-green-100 text-green-700",
      pendente: "bg-amber-100 text-amber-700",
      excluida: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-slate-100 text-slate-700";
  };

  return (
    // REMOVIDO: "flex min-h-screen" e a tag <main> interna.
    // O Layout Global já define a estrutura. Aqui retornamos apenas o bloco de conteúdo.
    <div className="bg-slate-50 text-slate-900 w-full min-h-full">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
        <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {admin?.nome || "Admin"}
              </p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.nome || "Admin")}&background=0D8ABC&color=fff`}
              className="w-10 h-10 rounded-full shadow-sm"
              alt="Avatar"
            />
          </div>
        </div>
      </header>

      {/* CONTEÚDO SCROLLÁVEL */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500 text-sm">
            Bem-vindo de volta! Veja os dados reais do seu NestJS.
          </p>
        </div>

        {/* CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <DollarSign />
              </div>
              <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">
                {data.overview?.totalVendas || 0} vendas
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Vendas Hoje</p>
            <h3 className="text-2xl font-bold text-slate-800">
              R${" "}
              {parseFloat(data.overview?.vendasHoje || "0").toLocaleString(
                "pt-BR",
                { minimumFractionDigits: 2 },
              )}
            </h3>
          </div>

          <div
            onClick={() => router.push("/vendas")}
            className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer border-slate-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Pedidos Pendentes
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.overview?.vendasPendentes || 0}
            </h3>
          </div>

          <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition"
            onClick={() => router.push("/clientes")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Users />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Clientes Ativos
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.overview?.clientesAtivos || 0}
            </h3>
          </div>

          <div
            onClick={() => router.push("/clientes")}
            className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer border border-slate-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Package />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Produtos em Estoque
            </p>
            <h3 className="text-2xl font-bold text-slate-800">
              {data.overview?.totalProdutos || 0}
            </h3>
          </div>
        </section>

        {/* GRÁFICOS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6">
              Desempenho de Vendas (Últimos 6 meses)
            </h3>
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    grid: { color: "rgba(148, 163, 184, 0.2)" },
                    ticks: {
                      color: "#94a3b8",
                      callback: (value) =>
                        `R$ ${Number(value).toLocaleString("pt-BR")}`,
                    },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "#94a3b8" },
                  },
                },
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 text-center">
              Status de Pedidos
            </h3>
            <Doughnut
              data={statusData}
              options={{
                cutout: "80%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { usePointStyle: true, padding: 20 },
                  },
                },
              }}
            />
          </div>
        </section>

        {/* TABELA */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Últimas Transações</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">
              Ver tudo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">ID Pedido</th>
                  <th className="px-6 py-4">Usuário ID</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.ultimosPedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">#{pedido.id}</td>
                    <td className="px-6 py-4 text-slate-600">
                      Usuário #{pedido.usuarioId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      R${" "}
                      {pedido.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(pedido.status)}`}
                      >
                        {formatStatus(pedido.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {formatDate(pedido.data)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
