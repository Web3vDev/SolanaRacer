export interface Task {
  id: number
  title: string
  description: string
  reward: {
    points?: number
    energy?: number
    items?: { id: number; quantity: number }[]
  }
  type: "onetime" | "daily" | "weekly"
  category: "social" | "engagement" | "system" | "special"
  completed: boolean
  canComplete: boolean
  externalUrl?: string
  icon: string
  completedAt?: Date
  lastCompletedAt?: Date // For daily/weekly tasks
  requiresVerification?: boolean
}

export interface TaskProgress {
  totalTasks: number
  completedTasks: number
  todayCompleted: number
  weeklyCompleted: number
  totalPointsEarned: number
}
