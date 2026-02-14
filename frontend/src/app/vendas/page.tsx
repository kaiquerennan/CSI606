"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Search, Bell, Plus, Eye, XCircle, ShoppingBag } from "lucide-react";

interface ItemVenda {
  id: number;
  quantidade: string;
  valorUnitario: string;
  valorTotal: string;
  produto: { id: number; descricao: string; categoria: string };
}

interface Venda {
  id: number;
  valor: number;
  data: string;
  status: string;
  usuario: { id: number; nome: string; email: string };
  itens: ItemVenda[];
}

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState<Venda | null>(null);
  const router = useRouter();

  const fetchVendas = async () => {
    try {
      const res = await api.get("/vendas?perPage=50");
      setVendas(res.data.vendas);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const handleCancelar = async (id: number) => {
    if (!confirm("Deseja cancelar esta venda? O estoque será devolvido."))
      return;
    try {
      await api.put(`/vendas/${id}/cancelar`);
      fetchVendas();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao cancelar venda");
    }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusMap: Record<string, { label: string; cls: string }> = {
    concluida: { label: "Concluída", cls: "bg-green-100 text-green-700" },
    pendente: { label: "Pendente", cls: "bg-amber-100 text-amber-700" },
    excluida: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">
            Carregando vendas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 w-full min-h-full">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
        <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg w-96">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar venda..."
            className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Vendas</h2>
            <p className="text-slate-500 text-sm">
              {total} venda{total !== 1 && "s"} registrada{total !== 1 && "s"}
            </p>
          </div>
          <button
            onClick={() => router.push("/vendas/nova")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nova Venda
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nº</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Itens</th>
                  <th className="px-6 py-4">Valor Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">Nenhuma venda encontrada</p>
                    </td>
                  </tr>
                ) : (
                  vendas.map((venda) => {
                    const st = statusMap[venda.status] || {
                      label: venda.status,
                      cls: "bg-slate-100 text-slate-600",
                    };
                    return (
                      <tr
                        key={venda.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-sm text-slate-500">
                          #{venda.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700">
                            {venda.usuario.nome}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {venda.itens.length} ite
                          {venda.itens.length !== 1 ? "ns" : "m"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {formatCurrency(venda.valor)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {formatDate(venda.data)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailModal(venda)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {venda.status !== "excluida" && (
                              <button
                                onClick={() => handleCancelar(venda.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DETALHES */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Venda #{detailModal.id}
                </h3>
                <p className="text-sm text-slate-400">
                  {formatDate(detailModal.data)} · {detailModal.usuario.nome}
                </p>
              </div>
              <button
                onClick={() => setDetailModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3 text-right">Qtd.</th>
                    <th className="px-4 py-3 text-right">Vlr. Unit.</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailModal.itens.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {item.produto.descricao}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        {item.produto.categoria}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {parseFloat(item.quantidade).toFixed(0)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatCurrency(parseFloat(item.valorUnitario))}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">
                        {formatCurrency(parseFloat(item.valorTotal))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total da Venda</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(detailModal.valor)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
