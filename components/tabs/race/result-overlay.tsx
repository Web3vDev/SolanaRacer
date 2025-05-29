import { TrendingUp, TrendingDown } from "lucide-react"
import type { MutableRefObject } from "react"

interface ResultOverlayProps {
  resultOverlayRef: MutableRefObject<HTMLDivElement>
  predictionResult: "correct" | "wrong" | null
  priceBeforePrediction: string
  priceAfterPrediction: string
  predictionAction: "pump" | "dump" | null
  pointsEarned?: number // New prop for points earned
}

export function ResultOverlay({
  resultOverlayRef,
  predictionResult,
  priceBeforePrediction,
  priceAfterPrediction,
  predictionAction,
  pointsEarned = 0, // Default to 0 if not provided
}: ResultOverlayProps) {
  return (
    <div
      ref={resultOverlayRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-9999 result-overlay"
    >
      <div className="text-center p-8 max-w-md">
        {/* Title - Win or Lose */}
        <h2 className={`text-4xl font-bold mb-4 ${predictionResult === "correct" ? "text-green-400" : "text-red-500"}`}>
          {predictionResult === "correct" ? "WIN!" : "LOSE!"}
        </h2>

        {/* Price Change */}
        <div className="mb-6">
          <p className="text-white/70 mb-2">SOL Price Change</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white">{priceBeforePrediction}</span>
            <span className="mx-2">
              {predictionAction === "pump" ? (
                <TrendingUp className="text-green-400" />
              ) : (
                <TrendingDown className="text-red-400" />
              )}
            </span>
            <span className="text-white">{priceAfterPrediction}</span>
          </div>
        </div>

        {/* Points */}
        {predictionResult === "correct" && (
          <div className="bg-green-400/20 rounded-lg p-4 animate-pulse">
            <p className="text-white text-lg">+{pointsEarned} POINTS</p>
          </div>
        )}
      </div>
    </div>
  )
}
