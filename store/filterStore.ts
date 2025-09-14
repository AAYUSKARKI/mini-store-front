import { create } from "zustand";
import type { FilterState } from "@/types";

interface FilterStore extends FilterState {
    setCategory: (category: string[]) => void;
    setPriceRange: (min: number, max: number) => void;
    setSortBy: (sortBy: "price-asc" | "price-desc" | "title" | "rating") => void;
    setSearchQuery: (query: string) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>()((set) => ({
    category: [],
    priceRange: { min: 0, max: 0 },
    sortBy: "price-asc",
    searchQuery: "",

    setCategory: (category) => set({ category }),
    setPriceRange: (min, max) => set({ priceRange: { min, max } }),
    setSortBy: (sortBy) => set({ sortBy }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    resetFilters: () => set({ category: [], priceRange: { min: 0, max: 0 }, sortBy: "title", searchQuery: "" }),
}));