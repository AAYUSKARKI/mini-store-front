"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCartStore } from "@/store"
import type { Product } from "@/types"

interface ProductCardProps {
    product: Product
    onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const { addToCart } = useCartStore()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart?.(product)
        addToCart(product)
    }

    return (
        <Link href={`/product/${product.id}`}>
            <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <Badge className="absolute top-2 right-2 bg-background/80 text-foreground">{product.category}</Badge>
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-muted-foreground ml-1">
                                    {product.rating.rate} ({product.rating.count})
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button onClick={handleAddToCart} className="w-full" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    )
}
