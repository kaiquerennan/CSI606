"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Home, Menu, Settings } from "lucide-react";

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    descricao: "",
    preco: "", // string para facilitar input
    grupo: "",
    categoria: "",
    estoque: "0",
    ativo: true,
  });

  useEffect(() => {
    if (!id || id === "novo") {
      setLoading(false);
      return;
    }

    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${id}`);
        if (response.data) {
          setFormData({
            descricao: response.data.descricao || "",
            preco: response.data.preco ? String(response.data.preco) : "",
            grupo: response.data.grupo || "",
            categoria: response.data.categoria || "",
            estoque: response.data.estoque
              ? String(response.data.estoque)
              : "0",
            ativo: response.data.ativo ?? true,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        router.push("/produtos");
      } catch (error) {
        alert("Erro ao excluir.");
      }
    }
  };

  const handleSave = async () => {
    try {
      // Converte preço e estoque para número
      const payload = {
        descricao: formData.descricao,
        preco: parseFloat(formData.preco.replace(",", ".")) || 0,
        grupo: formData.grupo,
        categoria: formData.categoria,
        estoque: parseFloat(formData.estoque.replace(",", ".")) || 0,
        ativo: formData.ativo,
      };

      if (id === "novo") {
        await api.post("/produtos", payload);
        router.push("/produtos");
      } else {
        await api.put(`/produtos/${id}`, payload);
        router.push("/produtos");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto.");
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
          <span>Itens para Venda</span>
          <span className="text-slate-300">|</span>
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => router.push("/produtos")}
          >
            Produtos
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400 pl-4">
            <Menu className="w-5 h-5 cursor-pointer hover:text-slate-600" />
            <Settings className="w-5 h-5 cursor-pointer hover:text-slate-600" />
          </div>
        </div>
      </header>

      {/* SUB-HEADER  */}
      <div className="bg-white px-6 pt-4 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
          <button className="pb-3 border-b-2 font-medium transition-colors whitespace-nowrap border-blue-600 text-blue-600">
            Dados
          </button>
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 p-6 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* BARRA DE AÇÕES */}
        <div className="flex justify-end items-center mb-6 gap-3">
          <div className="flex items-center gap-2 mr-2">
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
            className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg bg-white hover:bg-red-50 hover:text-red-600 transition text-sm font-medium"
          >
            Excluir
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg bg-white hover:bg-slate-50 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#648dae] text-white rounded-lg hover:bg-[#537691] transition text-sm font-medium"
          >
            Salvar
          </button>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white space-y-6">
          {/* Seção Identificação */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Identificação
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Linha 1 */}
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descrição*
                </label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Linha 2 */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grupo
                </label>
                <input
                  type="text"
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Seção Dados de Valor/Estoque  */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 mt-6">
              Informações de Venda e Estoque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preço (R$)
                </label>
                {/* Input mask simples manual ou use uma lib */}
                <input
                  type="number"
                  step="0.01"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estoque Atual
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="estoque"
                  value={formData.estoque}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
