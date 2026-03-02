"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthStore } from "@/store/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, clear } = useAuthStore()

  useEffect(() => {
    // 마운트 시 직접 세션 확인 (쿠키 기반, 네트워크 요청 없음)
    fetchUser()

    // 이후 Auth 상태 변경 리스너
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchUser()
        } else if (event === 'SIGNED_OUT') {
          clear()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser, clear])

  return <>{children}</>
}
