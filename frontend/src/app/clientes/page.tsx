"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  MoreVertical,
  Plus,
  Home,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

// Interface
interface Cliente {
  id: number;
  nome: string;
  email: string;
  natureza: string;
  dataNascimento: Date;
  sexo: string;
  esatdoCivil: string;
  documento: string;
  telefone: string;
  status: "ativo" | "inativo";
  dataCadastro: string;
}

export default function Clientes() {
  const router = useRouter();
  const { admin } = useAuth();
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
      {/* HEADER*/}
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <Home className="w-4 h-4" />
          <span className="text-slate-300">|</span>
          <span>Cadastros</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-medium">Clientes</span>
        </div>

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
              className="w-9 h-9 rounded-full shadow-sm"
              alt="Avatar"
            />
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
              className="w-full border border-slate-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => router.push("/clientes/novo")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0f284e] text-white text-sm font-medium rounded hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Novo cliente
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-slate-600 text-xs font-bold uppercase z-10 shadow-sm">
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
                    // Adicionado onClick e cursor-pointer
                    onClick={() => router.push(`/clientes/${cliente.id}`)}
                    className={`hover:bg-blue-50/50 transition-colors group cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
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
                    <td className="px-4 py-3 text-slate-600">
                      {cliente.natureza}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                      {cliente.documento}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`${cliente.status === "ativo" ? "text-slate-700" : "text-red-600"} text-xs font-medium`}
                      >
                        {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right"></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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
