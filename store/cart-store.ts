import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { CartItemWithCourse } from '@/types'
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction } from '@/lib/actions/cart'

interface CartState {
  items: CartItemWithCourse[]
  isLoading: boolean
  addItem: (courseId: string) => Promise<{ success: boolean; error?: string }>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  syncWithServer: () => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: true,

  addItem: async (courseId: string) => {
    const result = await addToCartAction(courseId)
    if (result.success) {
      // 서버와 동기화
      await get().syncWithServer()
      return { success: true }
    }
    return { success: false, error: result.error.message }
  },

  removeItem: async (itemId: string) => {
    // Optimistic: 즉시 UI에서 제거
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
    }))

    const result = await removeFromCartAction(itemId)
    if (!result.success) {
      // 실패 시 서버에서 다시 가져오기
      await get().syncWithServer()
    }
  },

  clearCart: () => set({ items: [] }),

  syncWithServer: async () => {
    set({ isLoading: true })
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      set({ items: [], isLoading: false })
      return
    }

    const { data } = await supabase
      .from('cart_items')
      .select(`
        id, added_at,
        course:courses!inner(
          id, title, image_url, price, original_price,
          instructor:profiles!courses_instructor_id_fkey(id, name, nickname, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false })

    set({ items: (data || []) as unknown as CartItemWithCourse[], isLoading: false })
  },
}))
