import { create } from 'zustand'
import type { Dish } from '../data/menu'

export interface CartItem {
  dish: Dish
  quantity: number
  specs?: Record<string, string>
}

interface CartState {
  items: CartItem[]
  addToCart: (dish: Dish, specs?: Record<string, string>) => void
  removeFromCart: (dishId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalCount: () => number
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (dish, specs) => {
    set(state => {
      const existing = state.items.find(
        item => item.dish.id === dish.id && JSON.stringify(item.specs) === JSON.stringify(specs)
      )
      if (existing) {
        return {
          items: state.items.map(item =>
            item.dish.id === dish.id && JSON.stringify(item.specs) === JSON.stringify(specs)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return { items: [...state.items, { dish, quantity: 1, specs }] }
    })
  },
  removeFromCart: (dishId) => {
    set(state => ({
      items: state.items.map(item => item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0)
    }))
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((sum, item) => {
      let price = item.dish.price
      if (item.specs) {
        Object.values(item.specs).forEach(specVal => {
          const spec = item.dish.specs?.find(s => s.name)
          if (spec) {
            const option = spec.options.find(o => o.label === specVal)
            if (option) price += option.price
          }
        })
      }
      return sum + price * item.quantity
    }, 0)
  },
  getTotalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}))

export default useCartStore