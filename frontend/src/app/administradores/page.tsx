"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Search,
  Bell,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface Administrador {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  criadoEm: string;
}

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<Administrador[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrador | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    ativo: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admin");
      setAdmins(response.data);
    } catch (error) {
      console.error("Erro ao carregar administradores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({ nome: "", email: "", senha: "", ativo: true });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (admin: Administrador) => {
    setEditingAdmin(admin);
    setFormData({
      nome: admin.nome,
      email: admin.email,
      senha: "",
      ativo: admin.ativo,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      if (editingAdmin) {
        // Editar
        const payload: any = {
          nome: formData.nome,
          email: formData.email,
          ativo: formData.ativo,
        };
        if (formData.senha) {
          payload.senha = formData.senha;
        }
        await api.put(`/admin/${editingAdmin.id}`, payload);
      } else {
        // Criar
        if (!formData.senha) {
          setError("A senha é obrigatória para novos administradores.");
          setSaving(false);
          return;
        }
        await api.post("/admin", {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
        });
      }
      setModalOpen(false);
      fetchAdmins();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Já existe um administrador com este email.");
      } else {
        setError("Erro ao salvar. Verifique os dados e tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin: Administrador) => {
    if (!confirm(`Deseja realmente excluir o administrador "${admin.nome}"?`))
      return;

    try {
      await api.delete(`/admin/${admin.id}`);
      fetchAdmins();
    } catch (error) {
      console.error("Erro ao excluir administrador:", error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Carregando administradores...
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
            placeholder="Buscar administrador..."
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

      {/* CONTENT */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Title + Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Administradores
            </h2>
            <p className="text-slate-500 text-sm">
              Gerencie os usuários com acesso ao sistema
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Novo Administrador
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Criado em</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p className="font-medium">
                        Nenhum administrador encontrado
                      </p>
                      <p className="text-sm">
                        Clique em &quot;Novo Administrador&quot; para criar o
                        primeiro.
                      </p>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                        #{admin.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {admin.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">
                            {admin.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            admin.ativo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {admin.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {formatDate(admin.criadoEm)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(admin)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingAdmin ? "Editar Administrador" : "Novo Administrador"}
                </h3>
                <p className="text-sm text-slate-400">
                  {editingAdmin
                    ? "Altere os dados do administrador"
                    : "Preencha os dados para criar um novo acesso"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Senha{" "}
                  {editingAdmin && (
                    <span className="text-slate-400 font-normal">
                      (deixe vazio para manter a atual)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) =>
                      setFormData({ ...formData, senha: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Ativo (só no modo edição) */}
              {editingAdmin && (
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) =>
                        setFormData({ ...formData, ativo: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-sm font-medium text-slate-700">
                    Ativo
                  </span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.nome || !formData.email}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
