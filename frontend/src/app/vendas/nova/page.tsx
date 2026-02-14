"use client";

import React, { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  ShoppingBag,
  User,
  Package,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// ===================== INTERFACES =====================

interface Cliente {
  id: number;
  nome: string;
  documento: string;
  email: string;
}

interface Produto {
  id: number;
  descricao: string;
  preco: number;
  estoque: string;
  categoria: string;
  ativo: boolean;
}

interface ItemVenda {
  produtoId: number;
  descricao: string;
  categoria: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  estoqueDisponivel: number;
}

// ===================== COMPONENT =====================

export default function NovaVendaPage() {
  const router = useRouter();

  // Estado cliente
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );
  const [clienteSearch, setClienteSearch] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);

  // Estado produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSearch, setProdutoSearch] = useState("");
  const [showProdutoDropdown, setShowProdutoDropdown] = useState(false);
  const [quantidadeInput, setQuantidadeInput] = useState(1);

  // Itens da venda
  const [itens, setItens] = useState<ItemVenda[]>([]);

  // Status
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Refs para fechar dropdowns ao clicar fora
  const clienteRef = useRef<HTMLDivElement>(null);
  const produtoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, produtosRes] = await Promise.all([
          api.get("/clientes"),
          api.get("/produtos"),
        ]);
        setClientes(clientesRes.data);
        setProdutos(produtosRes.data.filter((p: Produto) => p.ativo));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchData();
  }, []);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        clienteRef.current &&
        !clienteRef.current.contains(e.target as Node)
      ) {
        setShowClienteDropdown(false);
      }
      if (
        produtoRef.current &&
        !produtoRef.current.contains(e.target as Node)
      ) {
        setShowProdutoDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtros
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(clienteSearch.toLowerCase()) ||
      c.documento.includes(clienteSearch) ||
      c.id.toString() === clienteSearch,
  );

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.descricao.toLowerCase().includes(produtoSearch.toLowerCase()) ||
      p.categoria.toLowerCase().includes(produtoSearch.toLowerCase()) ||
      p.id.toString() === produtoSearch,
  );

  // Selecionar cliente
  const selecionarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setClienteSearch("");
    setShowClienteDropdown(false);
  };

  // Adicionar item
  const adicionarItem = (produto: Produto) => {
    setError("");

    // Verificar se já existe
    const existente = itens.find((i) => i.produtoId === produto.id);
    if (existente) {
      // Incrementar quantidade
      const novaQtd = existente.quantidade + quantidadeInput;
      if (novaQtd > Number(produto.estoque)) {
        setError(
          `Estoque insuficiente para "${produto.descricao}". Disponível: ${produto.estoque}`,
        );
        return;
      }
      setItens(
        itens.map((i) =>
          i.produtoId === produto.id
            ? {
                ...i,
                quantidade: novaQtd,
                valorTotal: novaQtd * i.valorUnitario,
              }
            : i,
        ),
      );
    } else {
      if (quantidadeInput > Number(produto.estoque)) {
        setError(
          `Estoque insuficiente para "${produto.descricao}". Disponível: ${produto.estoque}`,
        );
        return;
      }
      setItens([
        ...itens,
        {
          produtoId: produto.id,
          descricao: produto.descricao,
          categoria: produto.categoria,
          quantidade: quantidadeInput,
          valorUnitario: produto.preco,
          valorTotal: produto.preco * quantidadeInput,
          estoqueDisponivel: Number(produto.estoque),
        },
      ]);
    }

    setProdutoSearch("");
    setQuantidadeInput(1);
    setShowProdutoDropdown(false);
  };

  // Atualizar quantidade de um item
  const atualizarQuantidade = (produtoId: number, novaQtd: number) => {
    if (novaQtd <= 0) return;
    setItens(
      itens.map((i) => {
        if (i.produtoId === produtoId) {
          if (novaQtd > i.estoqueDisponivel) return i;
          return {
            ...i,
            quantidade: novaQtd,
            valorTotal: novaQtd * i.valorUnitario,
          };
        }
        return i;
      }),
    );
  };

  // Remover item
  const removerItem = (produtoId: number) => {
    setItens(itens.filter((i) => i.produtoId !== produtoId));
  };

  // Totais
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);
  const totalVenda = itens.reduce((acc, i) => acc + i.valorTotal, 0);

  // Finalizar venda
  const finalizarVenda = async () => {
    setError("");

    if (!clienteSelecionado) {
      setError("Selecione um cliente para a venda.");
      return;
    }
    if (itens.length === 0) {
      setError("Adicione pelo menos um produto à venda.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/vendas", {
        clienteId: clienteSelecionado.id,
        itens: itens.map((i) => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
        })),
      });
      setSuccess(true);
      setTimeout(() => router.push("/vendas"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao registrar a venda. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ===================== SUCESSO =====================
  if (success) {
    return (
      <div className="bg-slate-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Venda Registrada!
          </h2>
          <p className="text-slate-500">
            Redirecionando para a lista de vendas...
          </p>
        </div>
      </div>
    );
  }

  // ===================== RENDER =====================
  return (
    <div className="bg-slate-50 text-slate-900 w-full min-h-full">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/vendas")}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Nova Venda</h1>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/vendas")}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={finalizarVenda}
            disabled={saving || itens.length === 0 || !clienteSelecionado}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Finalizar Venda
              </>
            )}
          </button>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        {/* SEÇÃO: Cliente */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">Cliente</h3>
          </div>

          {clienteSelecionado ? (
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div>
                <p className="font-semibold text-slate-800">
                  {clienteSelecionado.nome}
                </p>
                <p className="text-sm text-slate-500">
                  {clienteSelecionado.documento} · {clienteSelecionado.email}
                </p>
              </div>
              <button
                onClick={() => setClienteSelecionado(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Alterar
              </button>
            </div>
          ) : (
            <div ref={clienteRef} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value);
                    setShowClienteDropdown(true);
                  }}
                  onFocus={() => setShowClienteDropdown(true)}
                  placeholder="Buscar por nome, documento ou código..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              {showClienteDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {clientesFiltrados.length === 0 ? (
                    <p className="p-4 text-sm text-slate-400 text-center">
                      Nenhum cliente encontrado
                    </p>
                  ) : (
                    clientesFiltrados.slice(0, 10).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => selecionarCliente(c)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {c.nome}
                            </p>
                            <p className="text-xs text-slate-400">
                              {c.documento}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            #{c.id}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEÇÃO: Adicionar Produto */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">Adicionar Produto</h3>
          </div>

          <div className="flex gap-3">
            {/* Busca de Produto */}
            <div ref={produtoRef} className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={produtoSearch}
                  onChange={(e) => {
                    setProdutoSearch(e.target.value);
                    setShowProdutoDropdown(true);
                  }}
                  onFocus={() => setShowProdutoDropdown(true)}
                  placeholder="Buscar produto por nome, categoria ou código..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
              {showProdutoDropdown && produtoSearch.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {produtosFiltrados.length === 0 ? (
                    <p className="p-4 text-sm text-slate-400 text-center">
                      Nenhum produto encontrado
                    </p>
                  ) : (
                    produtosFiltrados.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => adicionarItem(p)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {p.descricao}
                            </p>
                            <p className="text-xs text-slate-400">
                              {p.categoria} · Estoque:{" "}
                              {Number(p.estoque).toFixed(0)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {formatCurrency(p.preco)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quantidade */}
            <div className="w-28">
              <input
                type="number"
                min={1}
                value={quantidadeInput}
                onChange={(e) =>
                  setQuantidadeInput(Math.max(1, Number(e.target.value)))
                }
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                placeholder="Qtd."
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO: Itens da Venda */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800">Itens da Venda</h3>
            <span className="ml-auto text-sm text-slate-400">
              {itens.length} ite{itens.length !== 1 ? "ns" : "m"}
            </span>
          </div>

          {itens.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">Nenhum produto adicionado</p>
              <p className="text-sm">
                Use a busca acima para adicionar produtos à venda
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Código</th>
                      <th className="px-6 py-3">Descrição</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3 text-center">Qtde.</th>
                      <th className="px-6 py-3 text-right">Vlr. Unitário</th>
                      <th className="px-6 py-3 text-right">Vlr. Total</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {itens.map((item) => (
                      <tr
                        key={item.produtoId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-sm text-slate-500">
                          #{item.produtoId}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {item.descricao}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">
                          {item.categoria}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                atualizarQuantidade(
                                  item.produtoId,
                                  item.quantidade - 1,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm font-bold"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={item.estoqueDisponivel}
                              value={item.quantidade}
                              onChange={(e) =>
                                atualizarQuantidade(
                                  item.produtoId,
                                  Number(e.target.value),
                                )
                              }
                              className="w-14 text-center py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                              onClick={() =>
                                atualizarQuantidade(
                                  item.produtoId,
                                  item.quantidade + 1,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(item.valorUnitario)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-800">
                          {formatCurrency(item.valorTotal)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removerItem(item.produtoId)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé com totais */}
              <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                <div className="text-sm text-slate-500">
                  <span className="font-medium">{totalItens}</span> ite
                  {totalItens !== 1 ? "ns" : "m"}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total da Venda</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(totalVenda)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
