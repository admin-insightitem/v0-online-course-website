"use client"

import { useEffect, useRef, useCallback } from "react"
import MuxPlayer from "@mux/mux-player-react"
import { updateLectureProgress } from "@/lib/actions/courses"

interface MuxPlayerWrapperProps {
  playbackId: string
  lectureId: string
  title?: string
  accentColor?: string
  onProgress?: (percent: number) => void
  onEnded?: () => void
}

export function MuxPlayerWrapper({
  playbackId,
  lectureId,
  title,
  accentColor = "#7c3aed",
  onProgress,
  onEnded,
}: MuxPlayerWrapperProps) {
  const lastReportedRef = useRef(0)

  const handleTimeUpdate = useCallback(
    (event: Event) => {
      const player = event.target as HTMLMediaElement
      if (!player.duration) return

      const percent = Math.round((player.currentTime / player.duration) * 100)

      // 5% 단위로 서버에 보고
      if (percent - lastReportedRef.current >= 5) {
        lastReportedRef.current = percent
        updateLectureProgress(lectureId, percent)
        onProgress?.(percent)
      }
    },
    [lectureId, onProgress]
  )

  const handleEnded = useCallback(() => {
    updateLectureProgress(lectureId, 100)
    onEnded?.()
  }, [lectureId, onEnded])

  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{
        video_title: title,
      }}
      accentColor={accentColor}
      streamType="on-demand"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      style={{ width: "100%", aspectRatio: "16/9" }}
    />
  )
}
