import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/types'

interface WishlistStore {
    items: Product[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    clearWishlist: () => void
    isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const currentItems = get().items
                if (!currentItems.find((item) => item.id === product.id)) {
                    set({ items: [...currentItems, product] })
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) })
            },
            clearWishlist: () => set({ items: [] }),
            isInWishlist: (productId) => !!get().items.find((item) => item.id === productId),
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
