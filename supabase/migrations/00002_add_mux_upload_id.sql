-- Add mux_upload_id to lectures for webhook upload tracking
ALTER TABLE lectures ADD COLUMN IF NOT EXISTS mux_upload_id TEXT;
