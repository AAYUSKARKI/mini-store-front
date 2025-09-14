export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
        rate: number
        count: number
    }
}

export interface CartItem {
    product: Product
    quantity: number
}

export interface CartState {
    items: CartItem[]
    total: number
    quantity: number
}

export interface FilterState {
   category: string[]
   priceRange: {
    min: number
    max: number
   }
   sortBy: "price-asc" | "price-desc" | "title" | "rating"
   searchQuery: string
}