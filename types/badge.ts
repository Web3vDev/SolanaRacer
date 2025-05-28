export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  pointsRequired: number
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
  category: "points" | "wins" | "streak" | "special" | "leaderboard"
  unlockedAt?: Date
}

export interface BadgeProgress {
  badge: Badge
  isUnlocked: boolean
  progress: number
  progressText: string
}
