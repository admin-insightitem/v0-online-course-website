import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// 외부 워크플로우 웹훅 (n8n 등)
export async function POST(request: NextRequest) {
  // Webhook Secret 검증
  const authHeader = request.headers.get('authorization')
  const expectedSecret = process.env.WEBHOOK_SECRET

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, data } = body

  // 웹훅 로그 저장
  await supabaseAdmin
    .from('webhook_logs')
    .insert({
      source: 'external',
      event_type: action,
      payload: body,
    })

  switch (action) {
    case 'update_lecture_video': {
      // n8n에서 영상 정보 업데이트 (Mux asset 연결)
      const { lectureId, muxAssetId, muxPlaybackId, duration } = data

      await supabaseAdmin
        .from('lectures')
        .update({
          mux_asset_id: muxAssetId,
          mux_playback_id: muxPlaybackId,
          mux_upload_status: 'ready',
          duration: duration || null,
        })
        .eq('id', lectureId)

      return NextResponse.json({ success: true, message: 'Lecture video updated' })
    }

    case 'send_notification': {
      // n8n에서 알림 발송
      const { userId, type, title, content, link } = data

      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: userId,
          type: type || 'notice',
          title,
          content: content || null,
          link: link || null,
        })

      return NextResponse.json({ success: true, message: 'Notification sent' })
    }

    case 'bulk_notify': {
      // 전체/특정 유저 대량 알림
      const { userIds, type, title, content, link } = data

      let targetUsers: string[]
      if (userIds && userIds.length > 0) {
        targetUsers = userIds
      } else {
        // 전체 유저
        const { data: profiles } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .is('deleted_at', null)
        targetUsers = (profiles || []).map(p => p.id)
      }

      const notifications = targetUsers.map((userId: string) => ({
        user_id: userId,
        type: type || 'notice',
        title,
        content: content || null,
        link: link || null,
      }))

      if (notifications.length > 0) {
        await supabaseAdmin.from('notifications').insert(notifications)
      }

      return NextResponse.json({ success: true, message: `Notified ${notifications.length} users` })
    }

    case 'update_course_badge': {
      // 외부에서 뱃지 일괄 업데이트
      const { courseId, badge, badgeColor } = data

      await supabaseAdmin
        .from('courses')
        .update({ badge, badge_color: badgeColor })
        .eq('id', courseId)

      return NextResponse.json({ success: true, message: 'Course badge updated' })
    }

    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      )
  }
}
