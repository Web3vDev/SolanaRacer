"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface RaceNotificationProps {
  show: boolean
  roundNumber: number
  userPrediction: "pump" | "dump"
  opponentPrediction: "pump" | "dump"
  actualDirection: "up" | "down"
  userCorrect: boolean
  opponentCorrect: boolean
  onClose: () => void
}

export function RaceNotification({
  show,
  roundNumber,
  userPrediction,
  opponentPrediction,
  actualDirection,
  userCorrect,
  opponentCorrect,
  onClose,
}: RaceNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto close after 1 second
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-lg w-80 mx-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Round {roundNumber} Result</h3>
          <div className="flex items-center gap-1">
            {actualDirection === "up" ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-xs font-bold ${actualDirection === "up" ? "text-green-400" : "text-red-400"}`}>
              {actualDirection === "up" ? "PUMP" : "DUMP"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <p className="text-zinc-400 mb-2">You</p>
            <div
              className={`p-3 rounded-lg ${userCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              <p className="font-bold text-sm">{userPrediction.toUpperCase()}</p>
              <p className="text-xs mt-1">{userCorrect ? "✓ Correct" : "✗ Wrong"}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-zinc-400 mb-2">Opponent</p>
            <div
              className={`p-3 rounded-lg ${opponentCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              <p className="font-bold text-sm">{opponentPrediction.toUpperCase()}</p>
              <p className="text-xs mt-1">{opponentCorrect ? "✓ Correct" : "✗ Wrong"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
