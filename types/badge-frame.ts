export interface BadgeFrame {
  id: number
  name: string
  description: string
  icon: string
  pointsRequired: number
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
  category: "points" | "wins" | "streak" | "special"
  unlockedAt?: Date
}
