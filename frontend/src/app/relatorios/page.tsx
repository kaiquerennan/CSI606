"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Registro dos componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
);

// ==================== INTERFACES ====================

interface Resumo {
  totalVendas: number;
  valorTotal: number;
  ticketMedio: number;
  totalClientes: number;
  totalProdutos: number;
  receita30dias: number;
  transacoes30dias: number;
  crescimento: number;
}

interface TopProduto {
  id: number;
  descricao: string;
  categoria: string;
  preco: number;
  total_vendido: string;
  receita_total: string;
}

interface TopCliente {
  id: number;
  nome: string;
  email: string;
  documento: string;
  natureza: string;
  total_pedidos: string;
  valor_total: string;
}

interface ReceitaCategoria {
  categoria: string;
  total_vendas: string;
  total_itens: string;
  receita_total: string;
}

interface ProdutoEstoqueBaixo {
  id: number;
  descricao: string;
  categoria: string;
  preco: number;
  estoque: string;
}

interface VendaDia {
  dia: string;
  receita: number;
  transacoes: number;
}

interface VendasPorMes {
  mes: string;
  receita: number;
  transacoes: number;
  ticketMedio: number;
  crescimento: number;
}

interface VendaDiaSemana {
  dia: string;
  totalVendas: number;
  receita: number;
}

interface StatusPedido {
  status: string;
  _count: { id: number };
}

interface RelatorioData {
  resumo: Resumo | null;
  topProdutos: TopProduto[];
  topClientes: TopCliente[];
  receitaCategoria: ReceitaCategoria[];
  estoqueBaixo: ProdutoEstoqueBaixo[];
  vendasDia: VendaDia[];
  vendasMes: VendasPorMes[];
  vendasDiaSemana: VendaDiaSemana[];
  statusPedidos: StatusPedido[];
}

// ==================== TABS ====================
type TabKey = "visao-geral" | "vendas" | "produtos" | "clientes";

const tabs: { key: TabKey; label: string }[] = [
  { key: "visao-geral", label: "Visão Geral" },
  { key: "vendas", label: "Vendas" },
  { key: "produtos", label: "Produtos" },
  { key: "clientes", label: "Clientes" },
];

// ==================== HELPERS ====================
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const mesesNomes = [
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

const formatMesLabel = (mes: string) => {
  const [ano, m] = mes.split("-");
  return mesesNomes[parseInt(m) - 1] + "/" + ano.slice(2);
};

// ==================== COMPONENT ====================
export default function RelatoriosPage() {
  const [data, setData] = useState<RelatorioData>({
    resumo: null,
    topProdutos: [],
    topClientes: [],
    receitaCategoria: [],
    estoqueBaixo: [],
    vendasDia: [],
    vendasMes: [],
    vendasDiaSemana: [],
    statusPedidos: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("visao-geral");
  const { admin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          resumoRes,
          topProdutosRes,
          topClientesRes,
          receitaCategoriaRes,
          estoqueBaixoRes,
          vendasDiaRes,
          vendasMesRes,
          vendasDiaSemanaRes,
          statusPedidosRes,
        ] = await Promise.all([
          api.get("/relatorios/resumo"),
          api.get("/relatorios/top-produtos?limite=10"),
          api.get("/relatorios/top-clientes?limite=10"),
          api.get("/relatorios/receita-por-categoria"),
          api.get("/relatorios/estoque-baixo?limite=20"),
          api.get("/relatorios/vendas-por-dia?dias=30"),
          api.get("/relatorios/vendas-por-meses?meses=12"),
          api.get("/relatorios/vendas-por-dia-semana"),
          api.get("/relatorios/status-pedidos"),
        ]);

        setData({
          resumo: resumoRes.data,
          topProdutos: topProdutosRes.data,
          topClientes: topClientesRes.data,
          receitaCategoria: receitaCategoriaRes.data,
          estoqueBaixo: estoqueBaixoRes.data,
          vendasDia: vendasDiaRes.data,
          vendasMes: vendasMesRes.data,
          vendasDiaSemana: vendasDiaSemanaRes.data,
          statusPedidos: statusPedidosRes.data,
        });
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  // Vendas por dia
  const vendasDiaChart = {
    labels: data.vendasDia.map((v) => {
      const d = new Date(v.dia + "T00:00:00");
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Receita Diária",
        data: data.vendasDia.map((v) => v.receita),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  // Receita mensal (bar chart)
  const vendasMesChart = {
    labels: data.vendasMes.map((v) => formatMesLabel(v.mes)),
    datasets: [
      {
        label: "Receita",
        data: data.vendasMes.map((v) => v.receita),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Ticket Médio",
        data: data.vendasMes.map((v) => v.ticketMedio),
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Vendas por dia da semana (bar chart)
  const diaSemanaChart = {
    labels: data.vendasDiaSemana.map((v) => v.dia),
    datasets: [
      {
        label: "Receita",
        data: data.vendasDiaSemana.map((v) => v.receita),
        backgroundColor: [
          "rgba(239, 68, 68, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(107, 114, 128, 0.7)",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Receita por categoria (doughnut)
  const categoriaColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  const categoriaChart = {
    labels: data.receitaCategoria.map((c) => c.categoria),
    datasets: [
      {
        data: data.receitaCategoria.map((c) => parseFloat(c.receita_total)),
        backgroundColor: categoriaColors.slice(0, data.receitaCategoria.length),
        hoverOffset: 6,
        borderWidth: 0,
      },
    ],
  };

  // Status pedidos (doughnut)
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

  const statusChart = {
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

  // ==================== RENDER SECTIONS ====================

  const renderVisaoGeral = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          label="Receita Total"
          value={formatCurrency(data.resumo?.valorTotal || 0)}
          badge={
            data.resumo && data.resumo.crescimento !== 0 ? (
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                  data.resumo.crescimento >= 0
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {data.resumo.crescimento >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(data.resumo.crescimento)}%
              </span>
            ) : null
          }
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Total de Vendas"
          value={formatNumber(data.resumo?.totalVendas || 0)}
          subtitle={`${data.resumo?.transacoes30dias || 0} nos últimos 30 dias`}
        />
        <KPICard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          label="Clientes Ativos"
          value={formatNumber(data.resumo?.totalClientes || 0)}
        />
        <KPICard
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          label="Ticket Médio"
          value={formatCurrency(data.resumo?.ticketMedio || 0)}
        />
      </div>

      {/* Receita mensal + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Receita Mensal</h3>
          <p className="text-sm text-slate-400 mb-6">Últimos 12 meses</p>
          <Bar
            data={vendasMesChart}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: { usePointStyle: true, padding: 20 },
                },
              },
              scales: {
                y: {
                  grid: { color: "rgba(148, 163, 184, 0.15)" },
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
          <h3 className="font-bold text-slate-800 mb-1 text-center">
            Status dos Pedidos
          </h3>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Distribuição geral
          </p>
          <Doughnut
            data={statusChart}
            options={{
              cutout: "75%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { usePointStyle: true, padding: 16 },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Vendas por dia da semana + Receita por categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">
            Vendas por Dia da Semana
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Distribuição de receita semanal
          </p>
          <Bar
            data={diaSemanaChart}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  grid: { color: "rgba(148, 163, 184, 0.15)" },
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
          <h3 className="font-bold text-slate-800 mb-1 text-center">
            Receita por Categoria
          </h3>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Participação no faturamento
          </p>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Doughnut
                data={categoriaChart}
                options={{
                  cutout: "65%",
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        usePointStyle: true,
                        padding: 12,
                        font: { size: 11 },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderVendas = () => (
    <>
      {/* KPI de vendas 30 dias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          label="Receita (30 dias)"
          value={formatCurrency(data.resumo?.receita30dias || 0)}
          badge={
            data.resumo && data.resumo.crescimento !== 0 ? (
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                  data.resumo.crescimento >= 0
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {data.resumo.crescimento >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(data.resumo.crescimento)}% vs período anterior
              </span>
            ) : null
          }
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Transações (30 dias)"
          value={formatNumber(data.resumo?.transacoes30dias || 0)}
        />
        <KPICard
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          label="Ticket Médio"
          value={formatCurrency(data.resumo?.ticketMedio || 0)}
        />
      </div>

      {/* Gráfico diário */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-slate-800 mb-1">Vendas Diárias</h3>
        <p className="text-sm text-slate-400 mb-6">
          Receita por dia nos últimos 30 dias
        </p>
        <Line
          data={vendasDiaChart}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                grid: { color: "rgba(148, 163, 184, 0.15)" },
                ticks: {
                  color: "#94a3b8",
                  callback: (value) =>
                    `R$ ${Number(value).toLocaleString("pt-BR")}`,
                },
              },
              x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", maxRotation: 45 },
              },
            },
          }}
        />
      </div>

      {/* Tabela evolução mensal */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            Evolução Mensal de Vendas
          </h3>
          <p className="text-sm text-slate-400">
            Comparativo de receita, transações e ticket médio
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Mês</th>
                <th className="px-6 py-4">Receita</th>
                <th className="px-6 py-4">Transações</th>
                <th className="px-6 py-4">Ticket Médio</th>
                <th className="px-6 py-4">Crescimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.vendasMes.map((mes) => (
                <tr
                  key={mes.mes}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {formatMesLabel(mes.mes)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {formatCurrency(mes.receita)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{mes.transacoes}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatCurrency(mes.ticketMedio)}
                  </td>
                  <td className="px-6 py-4">
                    {mes.crescimento !== 0 ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          mes.crescimento >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mes.crescimento >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(mes.crescimento)}%
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receita por categoria tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Receita por Categoria</h3>
          <p className="text-sm text-slate-400">
            Detalhamento de vendas por categoria de produto
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Vendas</th>
                <th className="px-6 py-4">Itens Vendidos</th>
                <th className="px-6 py-4">Receita Total</th>
                <th className="px-6 py-4">% do Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(() => {
                const totalReceita = data.receitaCategoria.reduce(
                  (acc, c) => acc + parseFloat(c.receita_total),
                  0,
                );
                return data.receitaCategoria.map((cat, i) => {
                  const receita = parseFloat(cat.receita_total);
                  const pct =
                    totalReceita > 0 ? (receita / totalReceita) * 100 : 0;
                  return (
                    <tr
                      key={cat.categoria}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                categoriaColors[i % categoriaColors.length],
                            }}
                          />
                          <span className="font-medium text-slate-700">
                            {cat.categoria}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {cat.total_vendas}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {parseFloat(cat.total_itens).toFixed(0)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {formatCurrency(receita)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor:
                                  categoriaColors[i % categoriaColors.length],
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderProdutos = () => (
    <>
      {/* KPIs de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          icon={<Package className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          label="Produtos Ativos"
          value={formatNumber(data.resumo?.totalProdutos || 0)}
        />
        <KPICard
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-red-50 text-red-600"
          label="Estoque Baixo"
          value={formatNumber(data.estoqueBaixo.length)}
          subtitle="Produtos com estoque ≤ 10 unidades"
        />
        <KPICard
          icon={<BarChart3 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Categorias"
          value={formatNumber(data.receitaCategoria.length)}
        />
      </div>

      {/* Top 10 Produtos + Categoria chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              Top 10 Produtos Mais Vendidos
            </h3>
            <p className="text-sm text-slate-400">
              Ranking por quantidade vendida
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Qtd. Vendida</th>
                  <th className="px-6 py-4">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topProdutos.map((prod, i) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i < 3
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {prod.descricao}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {prod.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(prod.preco)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {parseFloat(prod.total_vendido).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {formatCurrency(parseFloat(prod.receita_total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1 text-center">
            Vendas por Categoria
          </h3>
          <p className="text-sm text-slate-400 mb-6 text-center">
            % de receita
          </p>
          <Doughnut
            data={categoriaChart}
            options={{
              cutout: "70%",
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    padding: 12,
                    font: { size: 11 },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Produtos com estoque baixo */}
      {data.estoqueBaixo.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-100 flex items-center gap-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">
                Alerta de Estoque Baixo
              </h3>
              <p className="text-sm text-slate-400">
                Produtos com estoque igual ou inferior a 10 unidades
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-red-50/50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.estoqueBaixo.map((prod) => {
                  const estoque = parseFloat(String(prod.estoque));
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-500">#{prod.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {prod.descricao}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {prod.categoria}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatCurrency(prod.preco)}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        {estoque}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            estoque <= 0
                              ? "bg-red-100 text-red-700"
                              : estoque <= 5
                                ? "bg-orange-100 text-orange-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {estoque <= 0
                            ? "Esgotado"
                            : estoque <= 5
                              ? "Crítico"
                              : "Baixo"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );

  const renderClientes = () => (
    <>
      {/* KPIs clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-600"
          label="Clientes Ativos"
          value={formatNumber(data.resumo?.totalClientes || 0)}
        />
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          label="Receita Total"
          value={formatCurrency(data.resumo?.valorTotal || 0)}
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
          label="Total de Vendas"
          value={formatNumber(data.resumo?.totalVendas || 0)}
        />
      </div>

      {/* Top 10 clientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Top 10 Clientes</h3>
          <p className="text-sm text-slate-400">
            Ranking por valor total de compras
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Natureza</th>
                <th className="px-6 py-4">Pedidos</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topClientes.map((cliente, i) => {
                const valorTotal = parseFloat(cliente.valor_total);
                const pedidos = parseInt(cliente.total_pedidos);
                const ticketMedio = pedidos > 0 ? valorTotal / pedidos : 0;
                return (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i < 3
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-700">
                          {cliente.nome}
                        </p>
                        <p className="text-xs text-slate-400">
                          {cliente.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm font-mono">
                      {cliente.documento}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          cliente.natureza === "Jurídica"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {cliente.natureza}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {pedidos}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {formatCurrency(valorTotal)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatCurrency(ticketMedio)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking visual de clientes */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-1">
          Participação dos Top Clientes
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Representação visual do volume de compras
        </p>
        <div className="space-y-4">
          {(() => {
            const maxValor =
              data.topClientes.length > 0
                ? parseFloat(data.topClientes[0].valor_total)
                : 1;
            return data.topClientes.slice(0, 5).map((cliente, i) => {
              const valor = parseFloat(cliente.valor_total);
              const pct = maxValor > 0 ? (valor / maxValor) * 100 : 0;
              return (
                <div key={cliente.id} className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    <span className="text-sm font-bold text-slate-500">
                      {i + 1}º
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">
                        {cliente.nome}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {formatCurrency(valor)}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: [
                            "#8b5cf6",
                            "#a78bfa",
                            "#c4b5fd",
                            "#ddd6fe",
                            "#ede9fe",
                          ][i],
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="bg-slate-50 text-slate-900 w-full min-h-full">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
        <h1 className="text-lg font-semibold text-slate-800">Relatórios</h1>
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

      {/* CONTENT */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Relatórios</h2>
          <p className="text-slate-500 text-sm">
            Análises detalhadas de vendas, produtos e clientes
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-200 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "visao-geral" && renderVisaoGeral()}
        {activeTab === "vendas" && renderVendas()}
        {activeTab === "produtos" && renderProdutos()}
        {activeTab === "clientes" && renderClientes()}
      </div>
    </div>
  );
}

// ==================== KPI Card Component ====================
function KPICard({
  icon,
  iconBg,
  label,
  value,
  badge,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  badge?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
        {badge}
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
