import { create } from "zustand";
import type { Product } from "@/types";
import { fetchProducts,fetchProduct } from "@/api/products";

interface ProductState {
    product: Product | null;
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    fetchProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
    product: null,
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
    fetchProduct: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const product = await fetchProduct(id);
            set({ product, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch product", loading: false });
        }
    }
}));
