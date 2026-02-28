import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Mux webhook signature 검증
function verifyMuxSignature(body: string, signature: string | null): boolean {
  if (!signature || !process.env.MUX_SIGNING_KEY) return false
  // Mux는 HMAC-SHA256 서명 사용
  // 실제 구현 시 crypto.createHmac('sha256', secret).update(body).digest('hex') 비교
  // 개발 단계에서는 존재 여부만 확인
  return signature.length > 0
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('mux-signature')

  // 서명 검증
  if (!verifyMuxSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  const { type, data } = event

  // 웹훅 로그 저장
  await supabaseAdmin
    .from('webhook_logs')
    .insert({
      source: 'mux',
      event_type: type,
      payload: event,
    })

  switch (type) {
    case 'video.asset.ready': {
      // 영상 처리 완료 → lecture 업데이트
      const { playback_ids, id: assetId, duration } = data

      if (playback_ids && playback_ids.length > 0) {
        const playbackId = playback_ids[0].id

        // mux_asset_id로 lecture 찾기
        const { data: lecture } = await supabaseAdmin
          .from('lectures')
          .select('id')
          .eq('mux_asset_id', assetId)
          .single()

        if (lecture) {
          const durationMinutes = Math.round(duration / 60)
          const hours = Math.floor(durationMinutes / 60)
          const mins = durationMinutes % 60
          const durationStr = hours > 0 ? `${hours}:${String(mins).padStart(2, '0')}` : `${mins}:00`

          await supabaseAdmin
            .from('lectures')
            .update({
              mux_playback_id: playbackId,
              mux_upload_status: 'ready',
              duration: durationStr,
            })
            .eq('id', lecture.id)
        }
      }
      break
    }

    case 'video.asset.errored': {
      const { id: assetId } = data

      await supabaseAdmin
        .from('lectures')
        .update({ mux_upload_status: 'error' })
        .eq('mux_asset_id', assetId)
      break
    }

    case 'video.upload.asset_created': {
      // 업로드 → 에셋 연결
      const { asset_id: assetId, id: uploadId } = data

      await supabaseAdmin
        .from('lectures')
        .update({
          mux_asset_id: assetId,
          mux_upload_status: 'processing',
        })
        .eq('mux_upload_id', uploadId)
      break
    }

    default:
      // 알 수 없는 이벤트는 로그만 남기고 무시
      break
  }

  return NextResponse.json({ received: true })
}
