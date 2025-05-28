-- Create user_profiles table
CREATE TABLE user_profiles (
  fid BIGINT PRIMARY KEY,
  display_name TEXT NOT NULL,
  username TEXT,
  pfp_url TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  win_streak INTEGER DEFAULT 0,
  total_races INTEGER DEFAULT 0,
  predictions_remaining INTEGER DEFAULT 10,
  max_predictions INTEGER DEFAULT 20,
  base_success_rate INTEGER DEFAULT 65,
  last_prediction_time TIMESTAMPTZ DEFAULT NOW(),
  double_points_active BOOLEAN DEFAULT FALSE,
  double_points_end_time TIMESTAMPTZ DEFAULT NOW(),
  upgrades JSONB DEFAULT '[]'::jsonb,
  cars JSONB DEFAULT '[]'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  unlocked_badges INTEGER[] DEFAULT '{}',
  unlocked_frames INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create game_sessions table for temporary data
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fid BIGINT REFERENCES user_profiles(fid) ON DELETE CASCADE,
  session_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_points ON user_profiles(points DESC);
CREATE INDEX idx_user_profiles_level ON user_profiles(level DESC);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at DESC);
CREATE INDEX idx_game_sessions_fid ON game_sessions(fid);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at 
    BEFORE UPDATE ON game_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now, you can restrict later)
CREATE POLICY "Allow all operations on user_profiles" ON user_profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on game_sessions" ON game_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- Create view for leaderboard
CREATE VIEW leaderboard_view AS
SELECT 
  fid,
  display_name,
  pfp_url,
  points,
  level,
  ROW_NUMBER() OVER (ORDER BY points DESC) as rank
FROM user_profiles
ORDER BY points DESC;
