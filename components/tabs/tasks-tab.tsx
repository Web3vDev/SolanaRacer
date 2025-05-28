"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, ExternalLink, Clock, Trophy, Gift } from "lucide-react"
import { TASKS, getTasksByType, canCompleteTask, getTaskProgress, getTaskTypeColor } from "@/utils/task-system"
import type { Task } from "@/types/task"

interface TasksTabProps {
  onTaskComplete?: (task: Task) => void
  onEnergyUpdate?: (energy: number) => void
  onPointsUpdate?: (points: number) => void
}

export default function TasksTab({ onTaskComplete, onEnergyUpdate, onPointsUpdate }: TasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [activeFilter, setActiveFilter] = useState<"all" | "onetime" | "daily" | "weekly">("all")
  const [completingTasks, setCompletingTasks] = useState<Set<number>>(new Set())

  const progress = getTaskProgress()

  const filteredTasks = activeFilter === "all" ? tasks : getTasksByType(activeFilter)

  const handleTaskComplete = async (task: Task) => {
    if (!canCompleteTask(task) || completingTasks.has(task.id)) return

    setCompletingTasks((prev) => new Set(prev).add(task.id))

    try {
      // If task requires external verification, open the link
      if (task.externalUrl) {
        window.open(task.externalUrl, "_blank")

        // For social tasks, we'll simulate completion after a delay
        // In a real app, you'd verify the action was completed
        setTimeout(() => {
          completeTask(task)
        }, 2000)
      } else {
        // Complete immediately for system tasks
        completeTask(task)
      }
    } catch (error) {
      console.error("Error completing task:", error)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(task.id)
        return newSet
      })
    }
  }

  const completeTask = (task: Task) => {
    const now = new Date()

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          const updatedTask = {
            ...t,
            completed: task.type === "onetime" ? true : t.completed,
            completedAt: now,
            lastCompletedAt: now,
          }
          return updatedTask
        }
        return t
      }),
    )

    // Apply rewards
    if (task.reward.points) {
      onPointsUpdate?.(task.reward.points)
    }
    if (task.reward.energy) {
      onEnergyUpdate?.(task.reward.energy)
    }

    onTaskComplete?.(task)

    setCompletingTasks((prev) => {
      const newSet = new Set(prev)
      newSet.delete(task.id)
      return newSet
    })
  }

  const getTaskStatus = (task: Task) => {
    if (task.type === "onetime" && task.completed) {
      return { text: "Completed", color: "text-green-400", icon: <CheckCircle className="w-4 h-4" /> }
    }

    if (task.type === "daily" && task.lastCompletedAt) {
      const today = new Date().toDateString()
      const lastCompleted = new Date(task.lastCompletedAt).toDateString()
      if (today === lastCompleted) {
        return { text: "Done Today", color: "text-green-400", icon: <CheckCircle className="w-4 h-4" /> }
      }
    }

    if (task.type === "weekly" && task.lastCompletedAt) {
      const now = new Date()
      const lastCompleted = new Date(task.lastCompletedAt)
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      if (lastCompleted >= weekStart) {
        return { text: "Done This Week", color: "text-green-400", icon: <CheckCircle className="w-4 h-4" /> }
      }
    }

    if (!task.canComplete) {
      return { text: "Locked", color: "text-gray-400", icon: <Circle className="w-4 h-4" /> }
    }

    return { text: "Available", color: "text-blue-400", icon: <Circle className="w-4 h-4" /> }
  }

  const getTimeUntilReset = (type: Task["type"]) => {
    const now = new Date()

    if (type === "daily") {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    }

    if (type === "weekly") {
      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + (7 - nextWeek.getDay()))
      nextWeek.setHours(0, 0, 0, 0)
      const diff = nextWeek.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      return `${days}d ${hours}h`
    }

    return ""
  }

  return (
    <div className="flex flex-col w-full h-full p-4 pt-8 pb-20">
      <h2 className="text-2xl font-bold text-center mb-2">Tasks</h2>
      <p className="text-center text-zinc-400 text-sm mb-6">Complete tasks to earn points and energy!</p>

      {/* Progress Overview */}
      <Card className="bg-zinc-900 border-0 p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {progress.completedTasks}/{progress.totalTasks}
            </p>
            <p className="text-xs text-zinc-400">Total Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{progress.totalPointsEarned.toLocaleString()}</p>
            <p className="text-xs text-zinc-400">Points Earned</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-blue-400">{progress.todayCompleted}</p>
            <p className="text-xs text-zinc-400">Today</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">{progress.weeklyCompleted}</p>
            <p className="text-xs text-zinc-400">This Week</p>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { key: "all", label: "All", icon: "📋" },
          { key: "onetime", label: "One-time", icon: "⭐" },
          { key: "daily", label: "Daily", icon: "📅" },
          { key: "weekly", label: "Weekly", icon: "🗓️" },
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.key as any)}
            className={`flex items-center gap-1 whitespace-nowrap ${
              activeFilter === filter.key ? "bg-gradient-to-r from-purple-500 to-green-400" : "border-zinc-700"
            }`}
          >
            <span>{filter.icon}</span>
            <span className="text-xs">{filter.label}</span>
          </Button>
        ))}
      </div>

      {/* Reset Timers */}
      {(activeFilter === "daily" || activeFilter === "weekly") && (
        <div className="mb-4 p-3 bg-zinc-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span className="text-sm text-zinc-400">
                {activeFilter === "daily" ? "Daily reset in:" : "Weekly reset in:"}
              </span>
            </div>
            <span className="text-sm font-bold text-white">{getTimeUntilReset(activeFilter)}</span>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {filteredTasks.map((task) => {
          const status = getTaskStatus(task)
          const isCompleting = completingTasks.has(task.id)
          const canComplete = canCompleteTask(task)

          return (
            <Card key={task.id} className="p-4 bg-zinc-900 border-0 hover:bg-zinc-800 transition-colors">
              <div className="flex items-start gap-3">
                {/* Task Icon & Status */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl">{task.icon}</div>
                  <div className={`${status.color}`}>{status.icon}</div>
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm">{task.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{task.description}</p>
                    </div>

                    {/* Task Type Badge */}
                    <span className={`text-xs px-2 py-1 rounded-full ml-2 ${getTaskTypeColor(task.type)}`}>
                      {task.type}
                    </span>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-3 mb-3">
                    {task.reward.points && (
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">+{task.reward.points}</span>
                      </div>
                    )}
                    {task.reward.energy && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⚡</span>
                        <span className="text-xs text-blue-400">+{task.reward.energy}</span>
                      </div>
                    )}
                    {task.reward.items && task.reward.items.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-purple-400">+Items</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${status.color}`}>{status.text}</span>

                    {canComplete && (
                      <Button
                        size="sm"
                        onClick={() => handleTaskComplete(task)}
                        disabled={isCompleting}
                        className="h-7 px-3 text-xs bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500 flex items-center gap-1"
                      >
                        {isCompleting ? (
                          "Completing..."
                        ) : (
                          <>
                            {task.externalUrl ? "Open" : "Complete"}
                            {task.externalUrl && <ExternalLink className="w-3 h-3" />}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">No Tasks Available</h3>
          <p className="text-zinc-400">Check back later for new tasks!</p>
        </div>
      )}
    </div>
  )
}
