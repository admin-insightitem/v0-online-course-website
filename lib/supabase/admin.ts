import { createClient } from '@supabase/supabase-js'

// Service Role 클라이언트: RLS 우회, 서버 전용
// 웹훅 처리, 관리자 작업 등에서만 사용
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
