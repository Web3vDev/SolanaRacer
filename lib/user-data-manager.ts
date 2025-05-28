"use client"

import { supabase, type UserProfile } from "./supabase"
import { getCurrentLevel } from "@/utils/level-system"
import { getAllUnlockedBadges } from "@/utils/badge-system"
import { getBadgeFrameProgress } from "@/utils/badge-frame-system"
import { checkLeaderboardBadges } from "@/utils/leaderboard-system"
import { F1_CARS } from "@/utils/f1-car-system"

interface GameData {
  points: number
  winStreak: number
  totalRaces: number
  predictionsRemaining: number
  maxPredictions: number
  baseSuccessRate: number
  lastPredictionTime: number
  doublePointsActive: boolean
  doublePointsEndTime: number
  upgrades: any[]
  cars: any[]
  items: any[]
}

interface UserContext {
  fid: number
  displayName?: string
  username?: string
  pfpUrl?: string
}

class UserDataManager {
  private updateQueue: Partial<GameData> = {}
  private isUpdating = false
  private updateTimeout: NodeJS.Timeout | null = null
  private currentUser: UserContext | null = null

  // Initialize user and load data
  async initializeUser(userContext: UserContext): Promise<GameData | null> {
    this.currentUser = userContext
    console.log("Initializing user with context:", userContext)

    try {
      // Check if user exists
      console.log("Checking if user exists in Supabase...")
      const { data: existingUser, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("fid", userContext.fid)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user:", error)
        return null
      }

      if (existingUser) {
        console.log("User exists, loading data:", existingUser)
        // User exists, return their data
        return this.convertToGameData(existingUser)
      } else {
        console.log("User doesn't exist, creating new user...")
        // Create new user with default data
        const defaultData = this.getDefaultGameData()
        await this.createNewUser(userContext, defaultData)
        console.log("New user created successfully")
        return defaultData
      }
    } catch (error) {
      console.error("Error initializing user:", error)
      return null
    }
  }

  // Create new user profile
  private async createNewUser(userContext: UserContext, gameData: GameData) {
    console.log("Creating new user profile...")
    const level = getCurrentLevel(gameData.points)
    const rank = checkLeaderboardBadges(gameData.points)
    const unlockedBadges = getAllUnlockedBadges(gameData.points, rank)
    const unlockedFrames = getBadgeFrameProgress(gameData.points)

    const userProfile: Omit<UserProfile, "created_at" | "updated_at"> = {
      fid: userContext.fid,
      display_name: userContext.displayName || `User${userContext.fid}`,
      username: userContext.username,
      pfp_url: userContext.pfpUrl,
      points: gameData.points,
      level: level.level,
      win_streak: gameData.winStreak,
      total_races: gameData.totalRaces,
      predictions_remaining: gameData.predictionsRemaining,
      max_predictions: gameData.maxPredictions,
      base_success_rate: gameData.baseSuccessRate,
      last_prediction_time: new Date(gameData.lastPredictionTime).toISOString(),
      double_points_active: gameData.doublePointsActive,
      double_points_end_time: new Date(gameData.doublePointsEndTime).toISOString(),
      upgrades: gameData.upgrades,
      cars: gameData.cars,
      items: gameData.items,
      unlocked_badges: unlockedBadges.map((b) => b.id),
      unlocked_frames: unlockedFrames.map((f) => f.id),
    }

    console.log("Inserting user profile:", userProfile)
    const { error } = await supabase.from("user_profiles").insert([userProfile])

    if (error) {
      console.error("Error creating user:", error)
      throw error
    }
    console.log("User profile created successfully")
  }

  // Convert database record to game data
  private convertToGameData(userProfile: UserProfile): GameData {
    return {
      points: userProfile.points,
      winStreak: userProfile.win_streak,
      totalRaces: userProfile.total_races,
      predictionsRemaining: userProfile.predictions_remaining,
      maxPredictions: userProfile.max_predictions,
      baseSuccessRate: userProfile.base_success_rate,
      lastPredictionTime: new Date(userProfile.last_prediction_time).getTime(),
      doublePointsActive: userProfile.double_points_active,
      doublePointsEndTime: new Date(userProfile.double_points_end_time).getTime(),
      upgrades: userProfile.upgrades || [],
      cars: userProfile.cars || [],
      items: userProfile.items || [],
    }
  }

  // Get default game data for new users
  private getDefaultGameData(): GameData {
    return {
      points: 0,
      winStreak: 0,
      totalRaces: 0,
      predictionsRemaining: 10,
      maxPredictions: 20,
      baseSuccessRate: Math.floor(Math.random() * 11) + 60, // 60-70%
      lastPredictionTime: Date.now(),
      doublePointsActive: false,
      doublePointsEndTime: 0,
      upgrades: [
        {
          id: 1,
          name: "Win Bonus",
          description: "Extra points when winning",
          baseCost: 1000,
          icon: "/placeholder.svg?height=80&width=80&query=trophy%20with%20green%20glow",
          level: 0,
          maxLevel: 10,
          effect: { type: "pointsBonus", value: 25 },
        },
        {
          id: 2,
          name: "Point Multiplier",
          description: "Increase points percentage",
          baseCost: 2000,
          icon: "/placeholder-a14b3.png",
          level: 0,
          maxLevel: 5,
          effect: { type: "pointsMultiplier", value: 0.1 },
        },
        {
          id: 3,
          name: "Recovery Speed",
          description: "Faster energy recovery",
          baseCost: 1500,
          icon: "/placeholder.svg?height=80&width=80&query=lightning%20bolt%20with%20blue%20glow",
          level: 0,
          maxLevel: 5,
          effect: { type: "recoverySpeed", value: 20 },
        },
        {
          id: 4,
          name: "Energy Tank",
          description: "Increase maximum energy",
          baseCost: 2500,
          icon: "/placeholder.svg?height=80&width=80&query=battery%20with%20yellow%20glow",
          level: 0,
          maxLevel: 10,
          effect: { type: "maxEnergy", value: 1 },
        },
        {
          id: 5,
          name: "Combo Master",
          description: "Bonus points for win streaks",
          baseCost: 1800,
          icon: "/placeholder.svg?height=80&width=80&query=combo%20chain%20with%20purple%20glow",
          level: 0,
          maxLevel: 5,
          effect: { type: "comboBonus", value: 15 },
        },
      ],
      cars: F1_CARS.map((car) => ({ ...car })), // Use the full F1_CARS array
      items: [
        {
          id: 1,
          name: "Energy Restore",
          description: "Restore all energy instantly",
          icon: "⚡",
          quantity: 1,
          type: "energy_restore",
        },
        {
          id: 2,
          name: "Double Points",
          description: "Double all points earned for 1 hour",
          icon: "💎",
          quantity: 1,
          type: "double_points",
        },
      ],
    }
  }

  // Queue update for batch processing
  queueUpdate(data: Partial<GameData>) {
    // Merge with existing queue
    this.updateQueue = { ...this.updateQueue, ...data }

    // Clear existing timeout
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }

    // Set new timeout for batch update
    this.updateTimeout = setTimeout(() => {
      this.processQueuedUpdates()
    }, 2000) // Wait 2 seconds before updating
  }

  // Process all queued updates
  private async processQueuedUpdates() {
    if (this.isUpdating || !this.currentUser || Object.keys(this.updateQueue).length === 0) {
      return
    }

    this.isUpdating = true

    try {
      const updateData = { ...this.updateQueue }
      this.updateQueue = {} // Clear queue

      // Calculate derived data
      const level = getCurrentLevel(updateData.points || 0)
      const rank = checkLeaderboardBadges(updateData.points || 0)
      const unlockedBadges = getAllUnlockedBadges(updateData.points || 0, rank)
      const unlockedFrames = getBadgeFrameProgress(updateData.points || 0)

      // Prepare update object
      const dbUpdate: Partial<UserProfile> = {
        updated_at: new Date().toISOString(),
      }

      // Map game data to database fields
      if (updateData.points !== undefined) {
        dbUpdate.points = updateData.points
        dbUpdate.level = level.level
        dbUpdate.unlocked_badges = unlockedBadges.map((b) => b.id)
        dbUpdate.unlocked_frames = unlockedFrames.map((f) => f.id)
      }
      if (updateData.winStreak !== undefined) dbUpdate.win_streak = updateData.winStreak
      if (updateData.totalRaces !== undefined) dbUpdate.total_races = updateData.totalRaces
      if (updateData.predictionsRemaining !== undefined)
        dbUpdate.predictions_remaining = updateData.predictionsRemaining
      if (updateData.maxPredictions !== undefined) dbUpdate.max_predictions = updateData.maxPredictions
      if (updateData.lastPredictionTime !== undefined) {
        dbUpdate.last_prediction_time = new Date(updateData.lastPredictionTime).toISOString()
      }
      if (updateData.doublePointsActive !== undefined) dbUpdate.double_points_active = updateData.doublePointsActive
      if (updateData.doublePointsEndTime !== undefined) {
        dbUpdate.double_points_end_time = new Date(updateData.doublePointsEndTime).toISOString()
      }
      if (updateData.upgrades !== undefined) dbUpdate.upgrades = updateData.upgrades
      if (updateData.cars !== undefined) dbUpdate.cars = updateData.cars
      if (updateData.items !== undefined) dbUpdate.items = updateData.items

      // Update user profile
      const { error } = await supabase.from("user_profiles").update(dbUpdate).eq("fid", this.currentUser.fid)

      if (error) {
        console.error("Error updating user data:", error)
        // Re-queue the failed update
        this.updateQueue = { ...this.updateQueue, ...updateData }
      }
    } catch (error) {
      console.error("Error processing queued updates:", error)
    } finally {
      this.isUpdating = false
    }
  }

  // Force immediate update (use sparingly)
  async forceUpdate(data: Partial<GameData>) {
    if (!this.currentUser) return

    try {
      const level = getCurrentLevel(data.points || 0)
      const rank = checkLeaderboardBadges(data.points || 0)
      const unlockedBadges = getAllUnlockedBadges(data.points || 0, rank)
      const unlockedFrames = getBadgeFrameProgress(data.points || 0)

      const dbUpdate: Partial<UserProfile> = {
        points: data.points,
        level: level.level,
        win_streak: data.winStreak,
        total_races: data.totalRaces,
        predictions_remaining: data.predictionsRemaining,
        max_predictions: data.maxPredictions,
        last_prediction_time: data.lastPredictionTime ? new Date(data.lastPredictionTime).toISOString() : undefined,
        double_points_active: data.doublePointsActive,
        double_points_end_time: data.doublePointsEndTime ? new Date(data.doublePointsEndTime).toISOString() : undefined,
        upgrades: data.upgrades,
        cars: data.cars,
        items: data.items,
        unlocked_badges: unlockedBadges.map((b) => b.id),
        unlocked_frames: unlockedFrames.map((f) => f.id),
        updated_at: new Date().toISOString(),
      }

      // Remove undefined values
      Object.keys(dbUpdate).forEach((key) => {
        if (dbUpdate[key as keyof UserProfile] === undefined) {
          delete dbUpdate[key as keyof UserProfile]
        }
      })

      const { error } = await supabase.from("user_profiles").update(dbUpdate).eq("fid", this.currentUser.fid)

      if (error) {
        console.error("Error force updating user data:", error)
        throw error
      }
    } catch (error) {
      console.error("Error in force update:", error)
      throw error
    }
  }

  // Get leaderboard data
  async getLeaderboard(limit = 100) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("fid, display_name, pfp_url, points, level")
        .order("points", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error fetching leaderboard:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getLeaderboard:", error)
      return []
    }
  }

  // Get user rank
  async getUserRank(fid: number): Promise<number> {
    try {
      const { data: userPoints } = await supabase.from("user_profiles").select("points").eq("fid", fid).single()

      if (!userPoints) return 0

      const { count } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gt("points", userPoints.points)

      return (count || 0) + 1
    } catch (error) {
      console.error("Error getting user rank:", error)
      return 0
    }
  }

  // Cleanup
  destroy() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
    }
    this.updateQueue = {}
    this.currentUser = null
  }
}

// Singleton instance
let userDataManagerInstance: UserDataManager | null = null

export function getUserDataManager(): UserDataManager {
  if (!userDataManagerInstance) {
    userDataManagerInstance = new UserDataManager()
  }
  return userDataManagerInstance
}

// Convenience functions
export async function initializeUserData(userContext: UserContext) {
  const manager = getUserDataManager()
  return await manager.initializeUser(userContext)
}

export function updateUserData(data: Partial<GameData>) {
  const manager = getUserDataManager()
  manager.queueUpdate(data)
}

export async function forceUpdateUserData(data: Partial<GameData>) {
  const manager = getUserDataManager()
  return await manager.forceUpdate(data)
}

export async function getLeaderboardData(limit?: number) {
  const manager = getUserDataManager()
  return await manager.getLeaderboard(limit)
}

export async function getUserRank(fid: number) {
  const manager = getUserDataManager()
  return await manager.getUserRank(fid)
}
