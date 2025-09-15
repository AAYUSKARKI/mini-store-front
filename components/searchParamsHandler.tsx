"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFilterStore } from "@/store";

export function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      useFilterStore.setState({ searchQuery: query });
    }
  }, [searchParams]);

  return null; 
}