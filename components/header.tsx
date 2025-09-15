"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "./themeToggle"
import { useProductStore } from "@/store"
import { SearchInput } from "@/components/searchInput"
interface HeaderProps {
    cartItemCount?: number
    onSearch?: (query: string) => void
    searchQuery?: string
}

export function Header({ cartItemCount = 0, onSearch, searchQuery = "" }: HeaderProps) {
    const { products } = useProductStore()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchInput searchQuery={searchQuery} onSearch={onSearch} products={products} />
          </div>

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
                        <SearchInput searchQuery={searchQuery} onSearch={onSearch} products={products} />
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