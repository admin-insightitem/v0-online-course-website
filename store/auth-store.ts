import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

interface AuthState {
  user: Profile | null
  isLoading: boolean
  setUser: (user: Profile | null) => void
  fetchUser: () => Promise<void>
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

  fetchUser: async () => {
    set({ isLoading: true })
    const supabase = createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      set({ user: null, isLoading: false })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    set({ user: profile as Profile | null, isLoading: false })
  },

  clear: () => set({ user: null, isLoading: false }),
}))
