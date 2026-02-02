import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getOverview = async () => {
  const response = await api.get("/dashboard/ovoerview");
  return response.data; // Retorna apenas o que interessa (os dados)
};

export const getProdutos = async () => {
  const response = await api.get("/produtos");
  return response.data;
};

export const getClientes = async () => {
  const response = await api.get("/clientes");
  return response.data;
};
