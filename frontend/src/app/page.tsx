"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  Search,
  Bell,
  DollarSign,
  Clock,
  Home,
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

// Interfaces para tipagem dos dados
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar todos os dados em paralelo
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
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">
          Carregando dashboard...
        </div>
      </div>
    );
  }

  // Configuração dos dados do Gráfico de Linha (Vendas por Mês)
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

  // Configuração dos dados do Gráfico de Rosca (Status) - Dinâmico
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

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para formatar status
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      concluida: "Concluído",
      pendente: "Pendente",
      excluida: "Cancelado",
    };
    return statusMap[status] || status;
  };

  // Função para obter classe de cor do status
  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      concluida: "bg-green-100 text-green-700",
      pendente: "bg-amber-100 text-amber-700",
      excluida: "bg-red-100 text-red-700",
    };
    return classMap[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 text-blue-600">
          <LayoutDashboard className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            SalesPro
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          <a
            href="#"
            className="flex items-center gap-3 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-medium"
          >
            <Home className="w-5 h-5" /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition"
          >
            <ShoppingBag className="w-5 h-5" /> Pedidos
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition"
          >
            <Users className="w-5 h-5" /> Clientes
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition"
          >
            <Package className="w-5 h-5" /> Estoque
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <a
            href="#"
            className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition"
          >
            <LogOut className="w-5 h-5" /> Sair
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0">
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
          <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-96">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar relatório..."
              className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  Kaique Silva
                </p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=Kaique+Silva&background=0D8ABC&color=fff"
                className="w-10 h-10 rounded-full shadow-sm"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
            <p className="text-slate-500 text-sm">
              Bem-vindo de volta! Veja os dados reais do seu NestJS.
            </p>
          </div>

          {/* STATS CARDS DINÂMICOS */}
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
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
              onClick={() => router.push("/clientes")} // Redireciona para a página de clientes
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
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
                      grid: {
                        color: "rgba(148, 163, 184, 0.2)",
                      },
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

          {/* TABELA DINÂMICA */}
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
      </main>
    </div>
  );
}
