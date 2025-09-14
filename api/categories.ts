import { api } from "@/api";

export const fetchCategories = async (): Promise<string[]> => {
  const res = await api.get("/products/categories");
  return res.data;
};
