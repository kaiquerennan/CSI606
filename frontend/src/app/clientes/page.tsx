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
  MoreVertical,
  Plus,
  Mail,
  Phone,
  Home,
} from "lucide-react";

// Interface para o Cliente
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  status: "ativo" | "inativo";
  totalCompras: number;
  dataCadastro: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Exemplo de chamada à API. Ajuste a rota conforme seu backend NestJS.
        const response = await api.get("/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        // Dados mockados para visualização caso a API falhe ou não exista ainda
        setClientes([
          {
            id: 1,
            nome: "Roberto Almeida",
            email: "roberto@email.com",
            telefone: "(11) 99999-9999",
            status: "ativo",
            totalCompras: 1250.0,
            dataCadastro: "2023-10-15",
          },
          {
            id: 2,
            nome: "Ana Souza",
            email: "ana.souza@email.com",
            telefone: "(21) 98888-8888",
            status: "ativo",
            totalCompras: 3400.5,
            dataCadastro: "2023-09-10",
          },
          {
            id: 3,
            nome: "Carlos Oliveira",
            email: "carlos@email.com",
            telefone: "(31) 97777-7777",
            status: "inativo",
            totalCompras: 0,
            dataCadastro: "2024-01-05",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Filtra clientes localmente baseado na busca
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            href="/"
            className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition"
          >
            <Home className="w-5 h-5" /> Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition"
          >
            <ShoppingBag className="w-5 h-5" /> Pedidos
          </a>
          {/* Item Ativo */}
          <a
            href="/clientes"
            className="flex items-center gap-3 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-medium"
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
              placeholder="Buscar no sistema..."
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
          {/* CABEÇALHO DA PÁGINA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
              <p className="text-slate-500 text-sm">
                Gerencie sua base de clientes e visualize status.
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm shadow-blue-200">
              <Plus className="w-5 h-5" /> Novo Cliente
            </button>
          </div>

          {/* BARRA DE FILTROS */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
            <div className="flex-1 flex items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 focus-within:border-blue-400 transition">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar cliente por nome ou email..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>

          {/* TABELA DE CLIENTES */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-500 animate-pulse">
                Carregando lista de clientes...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Contatos</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Total Gasto</th>
                      <th className="px-6 py-4">Cadastro</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClientes.length > 0 ? (
                      filteredClientes.map((cliente) => (
                        <tr
                          key={cliente.id}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {cliente.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 text-sm">
                                  {cliente.nome}
                                </h4>
                                <span className="text-xs text-slate-500">
                                  ID: #{cliente.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                {cliente.email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {cliente.telefone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1
                              ${
                                cliente.status === "ativo"
                                  ? "bg-green-50 text-green-700 border border-green-100"
                                  : "bg-red-50 text-red-700 border border-red-100"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${cliente.status === "ativo" ? "bg-green-500" : "bg-red-500"}`}
                              ></span>
                              {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">
                            R${" "}
                            {cliente.totalCompras.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {new Date(cliente.dataCadastro).toLocaleDateString(
                              "pt-BR",
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          Nenhum cliente encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* PAGINAÇÃO SIMPLES */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>Mostrando {filteredClientes.length} resultados</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
                  disabled
                >
                  Anterior
                </button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">
                  Próximo
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
