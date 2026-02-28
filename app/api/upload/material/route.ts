import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 강사 또는 관리자 권한 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const lectureId = formData.get('lecture_id') as string

  if (!file || !lectureId) {
    return NextResponse.json({ error: 'File and lecture_id required' }, { status: 400 })
  }

  // 파일 크기 제한 (50MB)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() || 'file'
  const filePath = `materials/${lectureId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('courses')
    .upload(filePath, file)

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('courses')
    .getPublicUrl(filePath)

  // 강의에 materials_url 업데이트
  await supabase
    .from('lectures')
    .update({ materials_url: publicUrl })
    .eq('id', lectureId)

  return NextResponse.json({ url: publicUrl, fileName: file.name, fileSize: file.size })
}
