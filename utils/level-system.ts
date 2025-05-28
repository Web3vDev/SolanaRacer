export interface Level {
  level: number
  name: string
  pointsRequired: number
  color: string
  icon: string
}

export const LEVELS: Level[] = [
  { level: 1, name: "Rookie", pointsRequired: 0, color: "text-gray-400", icon: "🏁" },
  { level: 2, name: "Amateur", pointsRequired: 100, color: "text-green-400", icon: "🚗" },
  { level: 3, name: "Semi-Pro", pointsRequired: 500, color: "text-blue-400", icon: "🏎️" },
  { level: 4, name: "Professional", pointsRequired: 1000, color: "text-purple-400", icon: "🏆" },
  { level: 5, name: "Expert", pointsRequired: 2500, color: "text-yellow-400", icon: "⭐" },
  { level: 6, name: "Master", pointsRequired: 5000, color: "text-orange-400", icon: "🔥" },
  { level: 7, name: "Champion", pointsRequired: 10000, color: "text-red-400", icon: "👑" },
  { level: 8, name: "Legend", pointsRequired: 25000, color: "text-pink-400", icon: "💎" },
  { level: 9, name: "Mythic", pointsRequired: 50000, color: "text-cyan-400", icon: "🌟" },
  { level: 10, name: "Godlike", pointsRequired: 100000, color: "text-gradient", icon: "⚡" },
]

export function getCurrentLevel(points: number): Level {
  let currentLevel = LEVELS[0]

  for (const level of LEVELS) {
    if (points >= level.pointsRequired) {
      currentLevel = level
    } else {
      break
    }
  }

  return currentLevel
}

export function getNextLevel(points: number): Level | null {
  const currentLevel = getCurrentLevel(points)
  const currentIndex = LEVELS.findIndex((level) => level.level === currentLevel.level)

  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1]
  }

  return null
}

export function getLevelProgress(points: number): number {
  const currentLevel = getCurrentLevel(points)
  const nextLevel = getNextLevel(points)

  if (!nextLevel) return 100

  const progressPoints = points - currentLevel.pointsRequired
  const totalPointsNeeded = nextLevel.pointsRequired - currentLevel.pointsRequired

  return Math.min((progressPoints / totalPointsNeeded) * 100, 100)
}
