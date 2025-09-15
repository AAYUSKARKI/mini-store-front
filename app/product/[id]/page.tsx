"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/productGrid"
import { useCartStore, useProductStore } from "@/store"
import type { Product } from "@/types"
import toast from "react-hot-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, quantity: cartQuantity } = useCartStore()
  const { products, product, fetchProduct, fetchProducts, loading, error } = useProductStore()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)

  const productId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    }
    if (products.length === 0) {
    fetchProducts()
  }
  }, [productId, fetchProduct])

  useEffect(() => {
    if (product && products.length > 0) {
      const related = products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [product, products, fetchProducts, products.length])


  const handleAddToCart = () => {
    if (!product) return

    addToCart(product, quantity)
    toast.success(`${quantity} × ${product.title} added to your cart.`)
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleRelatedProductAddToCart = (product: Product) => {
    addToCart(product)
    toast.success(`${product.title} added to your cart.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={cartQuantity} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={cartQuantity} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-4">{error || "The product you're looking for doesn't exist."}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartQuantity} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating.rate}</span>
                  <span className="text-muted-foreground">({product.rating.count} reviews)</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary mb-4">${product.price.toFixed(2)}</div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => handleQuantityChange(1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} className="flex-1 cursor-pointer" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button className="cursor-pointer" variant="outline" size="lg" onClick={() => router.push("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} onAddToCart={handleRelatedProductAddToCart} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
