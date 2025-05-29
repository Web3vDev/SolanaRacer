"use client"
import { useState, useEffect } from "react"
import { PredictionProgress } from "./prediction-progress"
import { PredictionButtons } from "./prediction-buttons"

interface PredictionControlsProps {
  predictionsRemaining: number
  totalPredictions: number
  onPrediction: (action: "pump" | "dump") => void
  lastPredictionTime?: number
  isPredictionActive?: boolean
}

export function PredictionControls({
  predictionsRemaining,
  totalPredictions,
  onPrediction,
  lastPredictionTime,
  isPredictionActive = false,
}: PredictionControlsProps) {
  const [timeUntilNextRecovery, setTimeUntilNextRecovery] = useState<string>("")

  // Calculate time until next energy recovery
  useEffect(() => {
    const updateCountdown = () => {
      if (!lastPredictionTime || predictionsRemaining >= totalPredictions) {
        setTimeUntilNextRecovery("")
        return
      }

      const recoveryInterval = 10 * 60 * 1000 // 10 minutes in milliseconds
      const timeSinceLastPrediction = Date.now() - lastPredictionTime
      const timeUntilNext = recoveryInterval - (timeSinceLastPrediction % recoveryInterval)

      if (timeUntilNext <= 0) {
        setTimeUntilNextRecovery("")
        return
      }

      const minutes = Math.floor(timeUntilNext / 60000)
      const seconds = Math.floor((timeUntilNext % 60000) / 1000)
      setTimeUntilNextRecovery(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [lastPredictionTime, predictionsRemaining, totalPredictions])

  return (
    <div
      className="w-full max-w-[90%] backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg mt-auto"
      style={{ position: "relative" }}
    >
      {/* Instruction text */}
      <p className="text-white/80 text-sm mb-3 font-medium text-center">Guess the SOL price in the next 4 secs</p>

      {/* Prediction Progress Bar */}
      <PredictionProgress predictionsRemaining={predictionsRemaining} totalPredictions={totalPredictions} />

      {/* Prediction buttons */}
      <PredictionButtons
        onPrediction={onPrediction}
        predictionsRemaining={predictionsRemaining}
        isPredictionActive={isPredictionActive}
      />

      {/* Recovery info */}
      <div className="text-center mt-2">
        {/* <div className="text-white/60 text-xs">+1 every 10 minutes (max 20)</div> */}
        {timeUntilNextRecovery && predictionsRemaining < totalPredictions && (
          <div className="text-white/80 text-xs mt-4 font-medium">Next energy: {timeUntilNextRecovery}</div>
        )}
      </div>
    </div>
  )
}
