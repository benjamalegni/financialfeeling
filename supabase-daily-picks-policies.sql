-- Enable RLS on daily_picks table
ALTER TABLE daily_picks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "daily_picks_select_policy" ON daily_picks;
DROP POLICY IF EXISTS "daily_picks_insert_policy" ON daily_picks;
DROP POLICY IF EXISTS "daily_picks_update_policy" ON daily_picks;
DROP POLICY IF EXISTS "daily_picks_delete_policy" ON daily_picks;

-- Create policies for daily_picks table
-- Allow anyone to read daily picks (public data)
CREATE POLICY "daily_picks_select_policy" ON daily_picks
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert daily picks
CREATE POLICY "daily_picks_insert_policy" ON daily_picks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update daily picks
CREATE POLICY "daily_picks_update_policy" ON daily_picks
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete daily picks
CREATE POLICY "daily_picks_delete_policy" ON daily_picks
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Also ensure the table exists with proper structure
CREATE TABLE IF NOT EXISTS daily_picks (
  id SERIAL PRIMARY KEY,
  pick_date DATE UNIQUE NOT NULL,
  symbols TEXT[] NOT NULL,
  charts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_picks_pick_date ON daily_picks(pick_date);
CREATE INDEX IF NOT EXISTS idx_daily_picks_created_at ON daily_picks(created_at);
