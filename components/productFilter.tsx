"use client"
import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { FilterState } from "@/types"
import { useFilterStore } from "@/store"

interface ProductFilterProps {
    categories: string[]
    productCount: number
}

export function ProductFilters({ categories, productCount }: ProductFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { category, priceRange, sortBy, setCategory, setPriceRange, setSortBy, resetFilters, searchQuery } = useFilterStore()

  const handleCategoryChange = (categoryItem: string, checked: boolean) => {
    const newCategories = checked
      ? [...category, categoryItem]
      : category.filter((c) => c !== categoryItem)
    setCategory(newCategories)
  }

    const handlePriceRangeChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value)
    if (isNaN(numValue)) return 
    setPriceRange(
      field === "min" ? numValue : priceRange.min,
      field === "max" ? numValue : priceRange.max
    )
    }
    
    const handleSortChange = (value: string) => {
    setSortBy(value as FilterState["sortBy"])
  }

const clearFilters = () => {
    resetFilters()
  }

  const hasActiveFilters =
    category.length > 0 ||
    priceRange.min > 0 ||
    priceRange.max > 0 ||
    searchQuery.length > 0 

   const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-sm font-medium">Sort By</Label>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Name</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium">Categories</Label>
        <div className="mt-3 space-y-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={cat}
                checked={category.includes(cat)}
                onCheckedChange={(checked) => handleCategoryChange(cat, checked as boolean)}
              />
              <Label htmlFor={cat} className="text-sm capitalize cursor-pointer">
                {cat.replace(/'/g, "")}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="mt-3 space-y-3">
          <div>
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              Min Price
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={priceRange.min || ""}
              onChange={(e) => handlePriceRangeChange("min", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              Max Price
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="1000"
              value={priceRange.max || ""}
              onChange={(e) => handlePriceRangeChange("max", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <span className="text-sm text-muted-foreground">{productCount} products</span>
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{productCount} products</span>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">!</span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}