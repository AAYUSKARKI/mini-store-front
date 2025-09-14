"use client"
import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProductStore, useFilterStore } from "@/store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { FilterState } from "@/types"

interface ProductFilterProps {
    categories: string[]
    filters: FilterState
    onFilterChange: (filters: FilterState) => void
    productCount: number
}

export function ProductFilters({ categories, filters, onFilterChange, productCount }: ProductFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [localFilters, setLocalFilters] = useState(filters)
    const {setCategory, setPriceRange, setSortBy, setSearchQuery, resetFilters} = useFilterStore()

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...localFilters.category, category]
      : localFilters.category.filter((c) => c !== category)

    const newFilters = { ...localFilters, category: newCategories }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

    const handlePriceRangeChange = (field: "min" | "max", value: string) => {
        const numValue = value === "" ? 0 : Number.parseFloat(value)
    const newFilters = {
      ...localFilters,
      priceRange: { ...localFilters.priceRange, [field]: numValue },
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters) 
    }

    const handleSortChange = (value: string) => {
    const newFilters = { ...localFilters, sortBy: value as FilterState["sortBy"] }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: [],
      priceRange: { min: 0, max: 0 },
      sortBy: "title",
      searchQuery: "",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters =
    localFilters.category.length > 0 ||
    localFilters.priceRange.min > 0 ||
    localFilters.priceRange.max > 0 ||
    localFilters.searchQuery.length > 0

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-sm font-medium">Sort By</Label>
        <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
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
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={localFilters.category.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm capitalize cursor-pointer">
                {category.replace(/'/g, "")}
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
              value={localFilters.priceRange.min || ""}
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
              value={localFilters.priceRange.max || ""}
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


