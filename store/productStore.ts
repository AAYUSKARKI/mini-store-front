import { create } from "zustand";
import type { Product } from "@/types";
import { fetchProducts } from "@/api/products";

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    products: [],
    loading: false,
    error: null,
    
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const products = await fetchProducts();
            set({ products, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false });
        }
    },
}));
