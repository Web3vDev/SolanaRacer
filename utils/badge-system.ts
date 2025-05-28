import type { Badge } from "@/types/badge"

export const BADGES: Badge[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Welcome to SOL Race! Earn your first 100 points",
    icon: "/badges/badge-01.png",
    pointsRequired: 100,
    rarity: "common",
    category: "points",
  },
  {
    id: 2,
    name: "Getting Started",
    description: "You're getting the hang of it! Reach 500 points",
    icon: "/badges/badge-02.png",
    pointsRequired: 500,
    rarity: "common",
    category: "points",
  },
  {
    id: 3,
    name: "Rising Star",
    description: "You're on fire! Accumulate 1,000 points",
    icon: "/badges/badge-03.png",
    pointsRequired: 1000,
    rarity: "rare",
    category: "points",
  },
  {
    id: 4,
    name: "Skilled Racer",
    description: "Impressive performance! Reach 2,500 points",
    icon: "/badges/badge-04.png",
    pointsRequired: 2500,
    rarity: "rare",
    category: "points",
  },
  {
    id: 5,
    name: "Expert Trader",
    description: "You know the market! Earn 5,000 points",
    icon: "/badges/badge-05.png",
    pointsRequired: 5000,
    rarity: "epic",
    category: "points",
  },
  {
    id: 6,
    name: "Market Master",
    description: "Exceptional skills! Accumulate 10,000 points",
    icon: "/badges/badge-06.png",
    pointsRequired: 10000,
    rarity: "epic",
    category: "points",
  },
  {
    id: 7,
    name: "SOL Legend",
    description: "Legendary status! Reach 25,000 points",
    icon: "/badges/badge-07.png",
    pointsRequired: 25000,
    rarity: "legendary",
    category: "points",
  },
  {
    id: 8,
    name: "Diamond Hands",
    description: "Ultimate dedication! Earn 50,000 points",
    icon: "/badges/badge-08.png",
    pointsRequired: 50000,
    rarity: "legendary",
    category: "points",
  },
  {
    id: 9,
    name: "Crypto God",
    description: "Mythical achievement! Accumulate 100,000 points",
    icon: "/badges/badge-09.png",
    pointsRequired: 100000,
    rarity: "mythic",
    category: "points",
  },
  // Leaderboard Badges
  {
    id: 10,
    name: "Champion",
    description: "Reached #1 on the leaderboard! You are the ultimate SOL racer!",
    icon: "/badges/top-1.png",
    pointsRequired: 0,
    rarity: "mythic",
    category: "leaderboard",
  },
  {
    id: 11,
    name: "Runner-up",
    description: "Achieved #2 on the leaderboard! So close to the top!",
    icon: "/badges/top-2.png",
    pointsRequired: 0,
    rarity: "legendary",
    category: "leaderboard",
  },
  {
    id: 12,
    name: "Podium Finisher",
    description: "Made it to #3 on the leaderboard! Bronze medal earned!",
    icon: "/badges/top-3.png",
    pointsRequired: 0,
    rarity: "legendary",
    category: "leaderboard",
  },
  {
    id: 13,
    name: "Top 10",
    description: "Ranked in the top 10 players! Elite performance!",
    icon: "/badges/top-10.png",
    pointsRequired: 0,
    rarity: "epic",
    category: "leaderboard",
  },
  {
    id: 14,
    name: "Top 50",
    description: "Ranked in the top 50 players! Great racing skills!",
    icon: "/badges/top-50.png",
    pointsRequired: 0,
    rarity: "rare",
    category: "leaderboard",
  },
  {
    id: 15,
    name: "Top 100",
    description: "Ranked in the top 100 players! You're among the best!",
    icon: "/badges/top-100.png",
    pointsRequired: 0,
    rarity: "rare",
    category: "leaderboard",
  },
]

// Add new function to get leaderboard badges based on rank
export function getLeaderboardBadges(rank: number): Badge[] {
  const leaderboardBadges: Badge[] = []

  if (rank <= 100) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 15)!) // Top 100
  }
  if (rank <= 50) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 14)!) // Top 50
  }
  if (rank <= 10) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 13)!) // Top 10
  }
  if (rank === 3) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 12)!) // Top 3
  }
  if (rank === 2) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 11)!) // Top 2
  }
  if (rank === 1) {
    leaderboardBadges.push(BADGES.find((b) => b.id === 10)!) // Top 1
  }

  return leaderboardBadges
}

// Update the getBadgeProgress function to include leaderboard badges
export function getBadgeProgress(points: number, leaderboardRank?: number): Badge[] {
  const pointsBadges = BADGES.filter((badge) => badge.category === "points" && points >= badge.pointsRequired)
  const leaderboardBadges = leaderboardRank ? getLeaderboardBadges(leaderboardRank) : []

  return [...pointsBadges, ...leaderboardBadges]
}

// Add function to get all badges including leaderboard
export function getAllUnlockedBadges(points: number, leaderboardRank?: number): Badge[] {
  return getBadgeProgress(points, leaderboardRank)
}

// Add alias for compatibility
export function getUnlockedBadges(points: number, leaderboardRank?: number): Badge[] {
  return getAllUnlockedBadges(points, leaderboardRank)
}

export function getNextBadge(points: number): Badge | null {
  return BADGES.find((badge) => badge.category === "points" && points < badge.pointsRequired) || null
}

export function getBadgeRarityColor(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common":
      return "text-gray-400 border-gray-400"
    case "rare":
      return "text-blue-400 border-blue-400"
    case "epic":
      return "text-purple-400 border-purple-400"
    case "legendary":
      return "text-yellow-400 border-yellow-400"
    case "mythic":
      return "text-pink-400 border-pink-400"
    default:
      return "text-gray-400 border-gray-400"
  }
}

export function getBadgeRarityGlow(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common":
      return "shadow-gray-400/20"
    case "rare":
      return "shadow-blue-400/30"
    case "epic":
      return "shadow-purple-400/40"
    case "legendary":
      return "shadow-yellow-400/50"
    case "mythic":
      return "shadow-pink-400/60"
    default:
      return "shadow-gray-400/20"
  }
}
