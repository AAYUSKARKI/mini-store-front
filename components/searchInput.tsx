"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { debounce } from "lodash"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface SearchInputProps {
  searchQuery: string
  onSearch?: (query: string) => void
  products: { title: string }[] 
}

export function SearchInput({ searchQuery, onSearch, products }: SearchInputProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  const debouncedSearch = useMemo(
    () => debounce((query: string) => onSearch?.(query), 300),
    [onSearch]
  )

  const debouncedSuggestions = useMemo(
    () =>
      debounce((query: string) => {
        if (!query.trim()) {
          setSuggestions([])
          return
        }
        const filtered = products
          .filter((product) => product.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map((product) => product.title)
        setSuggestions(filtered)
      }, 200),
    [products]
  )

  useEffect(() => {
    debouncedSuggestions(localSearchQuery)
  }, [localSearchQuery, debouncedSuggestions])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalSearchQuery(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      debouncedSuggestions.cancel()
      debouncedSearch.cancel()
      setSuggestions([])
      setLocalSearchQuery(suggestion)
      router.push(`/?query=${encodeURIComponent(suggestion)}`)
      onSearch?.(suggestion)
    },
    [onSearch, router]
  )

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      debouncedSuggestions.cancel()
      debouncedSearch.cancel()
      setSuggestions([])
      router.push(`/?query=${encodeURIComponent(localSearchQuery)}`)
      onSearch?.(localSearchQuery)
    },
    [localSearchQuery, onSearch, router]
  )

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Search products..."
        value={localSearchQuery}
        onChange={handleInputChange}
        className="pl-10 pr-4"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-background border border-border rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm border-b border-border last:border-b-0"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}