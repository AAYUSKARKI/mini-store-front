"use client"
import { useEffect, useMemo } from "react"
import { useProductStore, useCartStore, useCategoryStore, useFilterStore } from "@/store"
import { Header } from "@/components/header"
import { useSearchParams } from "next/navigation"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/productFilter"
import { ProductGrid } from "@/components/productGrid"
import type { Product } from "@/types"
import toast from "react-hot-toast"
export default function Home() {
  const { products, loading, error, fetchProducts } = useProductStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { category, priceRange, sortBy, searchQuery } = useFilterStore()
  const { addToCart, quantity } = useCartStore()
  const searchParams = useSearchParams()
  useEffect(() => {
    fetchProducts()
    fetchCategories()

    const query = searchParams.get("query")
    if (query) {
      useFilterStore.setState({ searchQuery: query })
    }
  }, [fetchProducts, fetchCategories, searchParams])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (searchQuery) {
      filtered = filtered.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (category.length > 0) {
      filtered = filtered.filter((product) => category.includes(product.category))
    }
    if (priceRange.min > 0) {
      filtered = filtered.filter((product) => product.price >= priceRange.min)
    }
    if (priceRange.max > 0) {
      filtered = filtered.filter((product) => product.price <= priceRange.max)
    }
    if (sortBy === "price-asc") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "title") {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating.rate - a.rating.rate)
    }
    return filtered
  }, [products, category, priceRange, sortBy, searchQuery])

  const handleSearch = (query: string) => {
    useFilterStore.setState({ searchQuery: query })
  }

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast.success(`${product.title} added to cart`)
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleSearch} searchQuery={searchQuery} cartItemCount={quantity} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} searchQuery={searchQuery} cartItemCount={quantity} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <ProductFilters
            categories={categories}
            filters={{ category, priceRange, sortBy, searchQuery }}
            onFilterChange={(filters) => useFilterStore.setState(filters)}
            productCount={filteredProducts.length}
          />

          <div className="flex-1 min-w-0">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onAddToCart={handleAddToCart} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
