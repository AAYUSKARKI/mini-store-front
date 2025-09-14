"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem, CartState } from "@/types"

interface CartStore extends CartState {
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      quantity: 0,

      addToCart: (product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find((item) => item.product.id === product.id)

        let newItems: CartItem[]
        if (existingItem) {
          newItems = items.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        } else {
          newItems = [...items, { product, quantity }]
        }

        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, quantity: itemCount })
      },

      removeFromCart: (productId) => {
        const newItems = get().items.filter((item) => item.product.id !== productId)
        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, quantity: itemCount })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }

        const newItems = get().items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        )
        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

        set({ items: newItems, total, quantity: itemCount })
      },

      clearCart: () => set({ items: [], total: 0, quantity: 0 }),
    }),
    {
      name: "cart-storage", // key in localStorage
      partialize: (state) => ({ items: state.items }), // only persist items
      onRehydrateStorage: () => (state) => {
        if (state) {
          const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
          state.total = total
          state.quantity = itemCount
        }
      },
    },
  ),
)
