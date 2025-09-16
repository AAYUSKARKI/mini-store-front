"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { debounce } from "lodash"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const DEBOUNCE_DELAYS = {
  SEARCH: 500,
  SUGGESTIONS: 500,
} as const
const MAX_SUGGESTIONS = 5

interface Product {
  title: string
}

interface SearchInputProps {
  searchQuery: string
  onSearch?: (query: string) => void
  products: Product[]
}

const filterSuggestions = (query: string, products: Product[], max: number): string[] => {
  if (!query.trim()) return []
  return products
    .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, max)
    .map((product) => product.title)
}

export function SearchInput({ searchQuery, onSearch, products }: SearchInputProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  const debouncedSearch = useMemo(
    () => debounce((query: string) => onSearch?.(query), DEBOUNCE_DELAYS.SEARCH),
    [onSearch]
  )

  const debouncedSuggestions = useMemo(
    () => debounce((query: string) => {
      setSuggestions(filterSuggestions(query, products, MAX_SUGGESTIONS))
    }, DEBOUNCE_DELAYS.SUGGESTIONS),
    [products]
  )

  useEffect(() => {
    debouncedSuggestions(localSearchQuery)
    return () => debouncedSuggestions.cancel()
  }, [localSearchQuery, debouncedSuggestions])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalSearchQuery(value)
      debouncedSearch(value)
      setIsFocused(true)
    },
    [debouncedSearch]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      debouncedSuggestions.cancel()
      debouncedSearch.cancel()
      setLocalSearchQuery(suggestion)
      setSuggestions([])
      setIsFocused(false)
      router.push(`/?query=${encodeURIComponent(suggestion)}`)
      onSearch?.(suggestion)
    },
    [debouncedSearch, debouncedSuggestions, onSearch, router]
  )

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      debouncedSuggestions.cancel()
      debouncedSearch.cancel()
      setSuggestions([])
      setIsFocused(false)
      router.push(`/?query=${encodeURIComponent(localSearchQuery)}`)
      onSearch?.(localSearchQuery)
    },
    [localSearchQuery, debouncedSearch, debouncedSuggestions, onSearch, router]
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSuggestions([])
      setIsFocused(false)
    }
  }, [])

  const renderSuggestions = () =>
    suggestions.length > 0 && isFocused && (
      <ul className="absolute z-50 w-full bg-background border border-border rounded-md mt-1 max-h-60 overflow-auto shadow-lg transition-all duration-200 ease-in-out transform origin-top opacity-100 scale-y-100">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-2 hover:bg-accent cursor-pointer text-sm border-b border-border last:border-b-0 transition-colors duration-150"
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow suggestion click
            onKeyDown={handleKeyDown}
            className={`pl-10 pr-4 transition-all duration-200 ${
              isFocused ? "ring-2 ring-primary" : ""
            }`}
          />
        </div>
      </form>
      {renderSuggestions()}
    </div>
  )
}