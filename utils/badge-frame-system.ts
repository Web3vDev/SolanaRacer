import type { BadgeFrame } from "@/types/badge-frame"

export const BADGE_FRAMES: BadgeFrame[] = [
  {
    id: 0,
    name: "Starter Frame",
    description: "Your first avatar frame! Welcome to SOL Race",
    icon: "/badge-frames/badge-frame.png",
    pointsRequired: 0,
    rarity: "common",
    category: "points",
  },
  {
    id: 1,
    name: "Silver Ring",
    description: "A sleek silver frame for dedicated racers",
    icon: "/badge-frames/badge-frame-1.png",
    pointsRequired: 250,
    rarity: "common",
    category: "points",
  },
  {
    id: 2,
    name: "Bronze Star",
    description: "Show your rising star status with this bronze frame",
    icon: "/badge-frames/badge-frame-2.png",
    pointsRequired: 750,
    rarity: "rare",
    category: "points",
  },
  {
    id: 3,
    name: "Aqua Elite",
    description: "A refined aqua frame for skilled traders",
    icon: "/badge-frames/badge-frame-3.png",
    pointsRequired: 1500,
    rarity: "rare",
    category: "points",
  },
  {
    id: 4,
    name: "Golden Circle",
    description: "Pure gold frame for exceptional performance",
    icon: "/badge-frames/badge-frame-4.png",
    pointsRequired: 3000,
    rarity: "epic",
    category: "points",
  },
  {
    id: 5,
    name: "Royal Crown",
    description: "Majestic frame with royal spikes for true champions",
    icon: "/badge-frames/badge-frame-5.png",
    pointsRequired: 7500,
    rarity: "epic",
    category: "points",
  },
  {
    id: 6,
    name: "Diamond Sovereign",
    description: "Crystalline perfection for market masters",
    icon: "/badge-frames/badge-frame-6.png",
    pointsRequired: 15000,
    rarity: "legendary",
    category: "points",
  },
  {
    id: 7,
    name: "Ruby Emperor",
    description: "Imperial frame with precious ruby for legends",
    icon: "/badge-frames/badge-frame-7.png",
    pointsRequired: 35000,
    rarity: "legendary",
    category: "points",
  },
  {
    id: 8,
    name: "Obsidian God",
    description: "The ultimate frame for crypto gods - dark and powerful",
    icon: "/badge-frames/badge-frame-8.png",
    pointsRequired: 75000,
    rarity: "mythic",
    category: "points",
  },
]

export function getBadgeFrameProgress(points: number): BadgeFrame[] {
  return BADGE_FRAMES.filter((frame) => points >= frame.pointsRequired)
}

export function getNextBadgeFrame(points: number): BadgeFrame | null {
  return BADGE_FRAMES.find((frame) => points < frame.pointsRequired) || null
}

export function getCurrentBadgeFrame(points: number): BadgeFrame {
  const unlockedFrames = getBadgeFrameProgress(points)
  return unlockedFrames[unlockedFrames.length - 1] || BADGE_FRAMES[0]
}

export function getBadgeFrameRarityColor(rarity: BadgeFrame["rarity"]): string {
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

export function getBadgeFrameRarityGlow(rarity: BadgeFrame["rarity"]): string {
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
