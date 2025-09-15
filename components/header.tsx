"use client"
import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "./themeToggle"
import { useProductStore } from "@/store"

interface HeaderProps {
    cartItemCount?: number
    onSearch?: (query: string) => void
    searchQuery?: string
}

export function Header({ cartItemCount = 0, onSearch, searchQuery = "" }: HeaderProps) {
    const { products } = useProductStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        setLocalSearchQuery(searchQuery)
    }, [searchQuery])

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                onSearch?.(query)
            }, 300),
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
                    .filter((product) =>
                        product.title.toLowerCase().includes(query.toLowerCase())
                    )
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
        [onSearch]
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
        [localSearchQuery, onSearch]
    )


    const SearchInput = () => (
        <div className="relative w-full">
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
        </div>
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">S</span>
                        </div>
                        <span className="font-bold text-xl">Mini Storefront</span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <SearchInput />
                    </form>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link href="/cart">
                            <Button variant="ghost" size="sm" className="relative cursor-pointer">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t py-4">
                        <form onSubmit={handleSearch} className="mb-4">
                            <SearchInput />
                        </form>
                        <div className="flex items-center justify-between">
                            <ThemeToggle />
                            <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm" className="relative cursor-pointer">
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    Cart
                                    {cartItemCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                        >
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}