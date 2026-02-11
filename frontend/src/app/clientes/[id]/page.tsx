"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Home, Menu, Settings } from "lucide-react";

export default function ClienteDetalhe() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basicos");

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    documento: "", // CPF/CNPJ
    natureza: "",
    ativo: true,
    dataNascimento: "",
    sexo: "",
    estadoCivil: "",
  });

  useEffect(() => {
    if (!id || id === "novo") {
      setLoading(false);
      return;
    }

    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        if (response.data) {
          setFormData({
            ...formData,
            nome: response.data.nome || "",
            email: response.data.email || "",
            documento: response.data.documento || "",
            natureza: response.data.natureza,
            ativo: response.data.ativo ?? true,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (confirm("Deseja realmente excluir este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        router.push("/clientes");
      } catch (error) {}
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        documento: formData.documento,
        ativo: formData.ativo,
        natureza: formData.natureza,
        dataNascimento: formData.dataNascimento,
        estadoCivil: formData.estadoCivil || undefined,
        sexo: formData.sexo || undefined,
      };

      if (id === "novo") {
        await api.post("/clientes", payload);
        router.push("/clientes");
      } else {
        await api.put(`/clientes/${id}`, payload);
        router.push("/clientes");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Carregando formulário...
      </div>
    );
  }

  return (
    <div className="bg-white text-slate-600 font-sans text-sm min-h-screen flex flex-col">
      {/* HEADER PRINCIPAL */}
      <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center text-slate-500 text-sm gap-2">
          <Home className="w-4 h-4" />
          <span className="text-slate-300">|</span>
          <span>Cadastros</span>
          <span className="text-slate-300">|</span>
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => router.push("/clientes")}
          >
            Clientes
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400 pl-4">
            <Menu className="w-5 h-5 cursor-pointer hover:text-slate-600" />
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </header>

      {/* SUB-HEADER */}
      <div className="bg-white px-6 pt-4 border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("basicos")}
            className={`pb-3 border-b-2 font-medium transition-colors border-blue-600 text-blue-600`}
          >
            Dados
          </button>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO (FORMULÁRIO) */}
      <div className="flex-1 p-6 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* BARRA DE AÇÕES */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-slate-800">Dados</h1>

          <div className="flex items-center gap-3">
            {/* Toggle Switch Style */}
            <div className="flex items-center gap-2 mr-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: !e.target.checked })
                  }
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-500"></div>
                <span className="ml-2 text-sm font-medium text-slate-600">
                  Inativo
                </span>
              </label>
            </div>

            <button
              onClick={handleDelete}
              className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
            >
              Excluir
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#648dae] text-white rounded-lg hover:bg-[#537691] transition text-sm font-medium flex items-center gap-2"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* formulário */}
        <div className="bg-white ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* LINHA 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Natureza
              </label>
              <select
                name="natureza"
                value={formData.natureza}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="Física">Física</option>
                <option value="Jurídica">Jurídica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CPF*
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* LINHA 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome*
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Estado civil
                </label>
                <select
                  name="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="Solteiro">Solteiro(a)</option>
                  <option value="Casado">Casado(a)</option>
                </select>
              </div>
            </div>

            {/* LINHA 3 */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Data de nascimento{" "}
                <span className="text-[10px]">(Visual apenas)</span>
              </label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-600"
              />
            </div>

            {/* LINHA 4 */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
