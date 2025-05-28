"use client"

import { Rocket, Flame } from "lucide-react"
import { playSound } from "@/lib/sound-manager"

interface PredictionButtonsProps {
  onPrediction: (action: "pump" | "dump") => void
  predictionsRemaining: number
  isPredictionActive?: boolean
}

export function PredictionButtons({
  onPrediction,
  predictionsRemaining,
  isPredictionActive = false,
}: PredictionButtonsProps) {
  return (
    <div className="flex justify-center gap-16 w-full">
      <button
        className={`flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-3 px-6 uppercase shadow-[0_4px_0_0_#b91c1c,0_6px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_0_0_#b91c1c,0_4px_6px_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all ${predictionsRemaining === 0 || isPredictionActive ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={async () => {
          await playSound("button")
          onPrediction("dump")
        }}
        disabled={predictionsRemaining === 0 || isPredictionActive}
        style={{
          borderRadius: "100px",
          paddingLeft: "calc(1.5rem + 10px)",
          paddingRight: "calc(1.5rem + 10px)",
          position: "relative",
        }}
      >
        <Flame className="w-5 h-5" strokeWidth={2.5} />
        DUMP
      </button>

      <button
        className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 uppercase shadow-[0_4px_0_0_#16a34a,0_6px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_0_0_#16a34a,0_4px_6px_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all ${predictionsRemaining === 0 || isPredictionActive ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={async () => {
          await playSound("button")
          onPrediction("pump")
        }}
        disabled={predictionsRemaining === 0 || isPredictionActive}
        style={{
          borderRadius: "100px",
          paddingLeft: "calc(1.5rem + 10px)",
          paddingRight: "calc(1.5rem + 10px)",
          position: "relative",
        }}
      >
        PUMP
        <Rocket className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </div>
  )
}
