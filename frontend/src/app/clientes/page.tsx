"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag, // Importado para Vendas
  Search,
  MoreVertical,
  Plus,
  Home,
  Filter,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
} from "lucide-react";

// Interface
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: "ativo" | "inativo";
  dataCadastro: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get("/clientes").catch(() => null);

        if (response && Array.isArray(response.data)) {
          const dadosFormatados = response.data.map((item: any) => ({
            ...item,
            status: item.ativo ? "ativo" : "inativo",
          }));
          setClientes(dadosFormatados);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      (cliente.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || cliente.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white text-slate-600 font-sans text-sm min-h-full flex flex-col h-screen overflow-hidden">
      {/* HEADER LIMPO (Sem botão de IA) */}
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <Home className="w-4 h-4" />
          <span className="text-slate-300">|</span>
          <span>Cadastros</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-medium">Clientes</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Ícones de sistema apenas */}
          <div className="flex items-center gap-3 text-slate-400 pl-4">
            <Menu className="w-5 h-5 cursor-pointer hover:text-slate-600" />
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </header>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {/* BARRA DE AÇÕES (Sem Exportar/Tabelas) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
          {/* Input de Busca + Botão Filtro */}
          <div className="flex w-full md:max-w-md">
            <input
              type="text"
              placeholder="Nome do cliente"
              className="w-full border border-r-0 border-slate-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-[#0f284e] text-white px-4 py-2 rounded-r-md hover:bg-slate-800 transition"
              title="Filtrar"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Apenas Novo Cliente */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0f284e] text-white text-sm font-medium rounded hover:bg-slate-800 transition shadow-sm">
              <Plus className="w-4 h-4" /> Novo cliente
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200 w-20 cursor-pointer hover:bg-slate-200">
                    Código
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-200">
                    Cliente{" "}
                    <span className="text-[10px] text-slate-400 font-normal lowercase ml-1">
                      Razão social
                    </span>
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-200">
                    Natureza
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-200">
                    CPF/CNPJ / Telefone
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-200">
                    Status
                  </th>
                  <th className="px-4 py-3 border-b border-slate-200 w-10"></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Carregando registros...
                    </td>
                  </tr>
                ) : filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente, index) => (
                    <tr
                      key={cliente.id}
                      className={`hover:bg-blue-50/50 transition-colors group ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                    >
                      <td className="px-4 py-3 text-slate-600">{cliente.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-medium">
                            {cliente.nome}
                          </span>
                          <span className="text-xs text-slate-500">
                            {cliente.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Física</td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                        {cliente.telefone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`${cliente.status === "ativo" ? "text-slate-700" : "text-red-600"} text-xs font-medium`}
                        >
                          {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* RODAPÉ DA TABELA */}
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between bg-white text-xs text-slate-500">
            <div>
              Itens por página:{" "}
              <span className="font-semibold text-slate-700">20</span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                1 - {filteredClientes.length} de {filteredClientes.length}{" "}
                clientes
              </span>
              <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                <button
                  className="p-1.5 hover:bg-slate-50 border-r border-slate-200 disabled:opacity-50"
                  disabled
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="px-3 py-1.5 bg-slate-50 font-medium text-slate-700">
                  1 de 1
                </div>
                <button
                  className="p-1.5 hover:bg-slate-50 disabled:opacity-50"
                  disabled
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
