import type { Task } from "@/types/task"

export interface TaskProgress {
  totalTasks: number
  completedTasks: number
  todayCompleted: number
  weeklyCompleted: number
  totalPointsEarned: number
}

export const TASKS: Task[] = [
  // One-time Social Tasks
  {
    id: 1,
    title: "Follow GMonchain.eth",
    description: "Follow @gmonchain.eth on Farcaster to stay updated",
    reward: { points: 500, energy: 2 },
    type: "onetime",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl: "https://farcaster.xyz/gmonchain.eth",
    icon: "👤",
    requiresVerification: true,
  },
  {
    id: 2,
    title: "Join GMonchain Channel",
    description: "Follow the official GMonchain channel",
    reward: { points: 300, energy: 1 },
    type: "onetime",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl: "https://farcaster.xyz/~/channel/gmonchain",
    icon: "📺",
    requiresVerification: true,
  },
  {
    id: 3,
    title: "Join FarRank Channel",
    description: "Follow the FarRank channel for rankings",
    reward: { points: 300, energy: 1 },
    type: "onetime",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl: "https://farcaster.xyz/~/channel/farrank",
    icon: "📊",
    requiresVerification: true,
  },
  {
    id: 4,
    title: "Join Monader Channel",
    description: "Follow the Monader channel for updates",
    reward: { points: 300, energy: 1 },
    type: "onetime",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl: "https://farcaster.xyz/~/channel/monader",
    icon: "🚀",
    requiresVerification: true,
  },
  {
    id: 5,
    title: "Connect Wallet",
    description: "Connect your Solana wallet to the game",
    reward: { points: 1000, energy: 5 },
    type: "onetime",
    category: "system",
    completed: false,
    canComplete: true,
    icon: "💳",
  },
  {
    id: 6,
    title: "Make First Prediction",
    description: "Make your first SOL price prediction",
    reward: { points: 200 },
    type: "onetime",
    category: "engagement",
    completed: true,
    canComplete: true,
    icon: "🎯",
  },
  {
    id: 7,
    title: "Win 5 Predictions",
    description: "Successfully predict SOL price 5 times",
    reward: { points: 1500, items: [{ id: 1, quantity: 1 }] },
    type: "onetime",
    category: "engagement",
    completed: false,
    canComplete: false,
    icon: "🏆",
  },
  {
    id: 8,
    title: "Reach 1000 Points",
    description: "Accumulate 1000 total points",
    reward: { points: 500, energy: 3 },
    type: "onetime",
    category: "engagement",
    completed: false,
    canComplete: false,
    icon: "⭐",
  },

  // Daily Tasks
  {
    id: 101,
    title: "Daily Check-in",
    description: "Check in daily to receive bonus energy",
    reward: { energy: 3, points: 50 },
    type: "daily",
    category: "system",
    completed: false,
    canComplete: true,
    icon: "📅",
  },
  {
    id: 102,
    title: "Share on Twitter",
    description: "Share SOL Race on Twitter/X",
    reward: { points: 100, energy: 1 },
    type: "daily",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl:
      "https://twitter.com/intent/tweet?text=Just%20played%20SOL%20Race%20-%20the%20ultimate%20Solana%20price%20prediction%20game!%20🏎️%20%23SOLRace%20%23Solana%20%23Crypto&url=https://solrace.app",
    icon: "🐦",
  },
  {
    id: 103,
    title: "Share on Warpcast",
    description: "Cast about SOL Race on Farcaster",
    reward: { points: 150, energy: 1 },
    type: "daily",
    category: "social",
    completed: false,
    canComplete: true,
    externalUrl:
      "https://warpcast.com/~/compose?text=Just%20played%20SOL%20Race%20-%20the%20ultimate%20Solana%20price%20prediction%20game!%20🏎️%20Try%20it%20now!&embeds[]=https://solrace.app",
    icon: "📡",
  },
  {
    id: 104,
    title: "Make 3 Predictions",
    description: "Make at least 3 price predictions today",
    reward: { points: 200 },
    type: "daily",
    category: "engagement",
    completed: false,
    canComplete: false,
    icon: "🎲",
  },
  {
    id: 105,
    title: "Win 2 Predictions",
    description: "Successfully predict SOL price 2 times today",
    reward: { points: 300, energy: 2 },
    type: "daily",
    category: "engagement",
    completed: false,
    canComplete: false,
    icon: "🎯",
  },

  // Weekly Tasks
  {
    id: 201,
    title: "Weekly Champion",
    description: "Complete all daily tasks for 7 days",
    reward: { points: 2000, energy: 10, items: [{ id: 2, quantity: 1 }] },
    type: "weekly",
    category: "special",
    completed: false,
    canComplete: false,
    icon: "👑",
  },
  {
    id: 202,
    title: "Social Media Master",
    description: "Share on all platforms 5 times this week",
    reward: { points: 1000, energy: 5 },
    type: "weekly",
    category: "social",
    completed: false,
    canComplete: false,
    icon: "📱",
  },
]

export function getTasksByType(type: Task["type"]): Task[] {
  return TASKS.filter((task) => task.type === type)
}

export function getTasksByCategory(category: Task["category"]): Task[] {
  return TASKS.filter((task) => task.category === category)
}

export function getAvailableTasks(): Task[] {
  return TASKS.filter((task) => task.canComplete && !task.completed)
}

export function getCompletedTasks(): Task[] {
  return TASKS.filter((task) => task.completed)
}

export function canCompleteTask(task: Task): boolean {
  if (task.completed) return false

  // Check if it's a daily task and already completed today
  if (task.type === "daily" && task.lastCompletedAt) {
    const today = new Date().toDateString()
    const lastCompleted = new Date(task.lastCompletedAt).toDateString()
    if (today === lastCompleted) return false
  }

  // Check if it's a weekly task and already completed this week
  if (task.type === "weekly" && task.lastCompletedAt) {
    const now = new Date()
    const lastCompleted = new Date(task.lastCompletedAt)
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    if (lastCompleted >= weekStart) return false
  }

  return task.canComplete
}

export function getTaskProgress(): TaskProgress {
  const totalTasks = TASKS.length
  const completedTasks = getCompletedTasks().length

  const today = new Date().toDateString()
  const todayCompleted = TASKS.filter(
    (task) => task.completedAt && new Date(task.completedAt).toDateString() === today,
  ).length

  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const weeklyCompleted = TASKS.filter((task) => task.completedAt && new Date(task.completedAt) >= weekStart).length

  const totalPointsEarned = getCompletedTasks().reduce((total, task) => total + (task.reward.points || 0), 0)

  return {
    totalTasks,
    completedTasks,
    todayCompleted,
    weeklyCompleted,
    totalPointsEarned,
  }
}

export function getTaskTypeColor(type: Task["type"]): string {
  switch (type) {
    case "onetime":
      return "text-blue-400 bg-blue-400/20"
    case "daily":
      return "text-green-400 bg-green-400/20"
    case "weekly":
      return "text-purple-400 bg-purple-400/20"
    default:
      return "text-gray-400 bg-gray-400/20"
  }
}

export function getTaskCategoryColor(category: Task["category"]): string {
  switch (category) {
    case "social":
      return "text-pink-400"
    case "engagement":
      return "text-yellow-400"
    case "system":
      return "text-cyan-400"
    case "special":
      return "text-purple-400"
    default:
      return "text-gray-400"
  }
}
