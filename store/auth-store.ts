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
    try {
      const supabase = createClient()

      // getSession(): 쿠키에서 직접 읽기 (네트워크 요청 없음)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        set({ user: null, isLoading: false })
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError || !profile) {
        console.error('[auth-store] profiles 조회 실패:', profileError?.message)
        set({ user: null, isLoading: false })
        return
      }

      set({ user: profile as Profile, isLoading: false })
    } catch (err) {
      console.error('[auth-store] fetchUser 에러:', err)
      set({ user: null, isLoading: false })
    }
  },

  clear: () => set({ user: null, isLoading: false }),
}))
