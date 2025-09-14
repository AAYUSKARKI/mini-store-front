import { create } from "zustand";
import { fetchCategories } from "@/api/categories";

interface CategoryState {
    categories: string[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    loading: false,
    error: null,
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const categories = await fetchCategories();
            set({ categories, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch categories", loading: false });
        }
    },
}))