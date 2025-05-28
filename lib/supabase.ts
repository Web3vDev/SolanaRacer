import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ulvmzripygqjfgfdhazh.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsdm16cmlweWdxamZnZmRoYXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzgyODEsImV4cCI6MjA2MzkxNDI4MX0._ohWTiiL9Pbj9IyWn53-ZbtePSGnv0LPk6o3bhoMoXM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  fid: number
  display_name: string
  username?: string
  pfp_url?: string
  points: number
  level: number
  win_streak: number
  total_races: number
  predictions_remaining: number
  max_predictions: number
  base_success_rate: number
  last_prediction_time: string
  double_points_active: boolean
  double_points_end_time: string
  upgrades: any[]
  cars: any[]
  items: any[]
  unlocked_badges: number[]
  unlocked_frames: number[]
  created_at: string
  updated_at: string
}

export interface GameSession {
  id: string
  fid: number
  session_data: any
  created_at: string
  updated_at: string
}
