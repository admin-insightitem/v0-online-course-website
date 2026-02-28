"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, setUser, clear } = useAuthStore()

  useEffect(() => {
    // 초기 유저 상태 로드
    fetchUser()

    // Auth 상태 변경 리스너
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN') {
          fetchUser()
        } else if (event === 'SIGNED_OUT') {
          clear()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser, setUser, clear])

  return <>{children}</>
}
