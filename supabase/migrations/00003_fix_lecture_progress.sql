-- Fix lecture_progress schema to match implementation code
-- Code uses: progress_percent, last_watched_at, completed_at
-- Migration had: last_position, watched_duration

ALTER TABLE lecture_progress ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0;
ALTER TABLE lecture_progress ADD COLUMN IF NOT EXISTS last_watched_at TIMESTAMPTZ;
ALTER TABLE lecture_progress ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Drop old columns that are no longer used
ALTER TABLE lecture_progress DROP COLUMN IF EXISTS last_position;
ALTER TABLE lecture_progress DROP COLUMN IF EXISTS watched_duration;
ALTER TABLE lecture_progress DROP COLUMN IF EXISTS course_id;
