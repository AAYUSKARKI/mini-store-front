import { api } from "@/api";
import type { Product } from "@/types";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await api.get(`/products/category/${category}`);
  return res.data;
};
