"use client"

import Image from "next/image"
import type { BadgeFrame } from "@/types/badge-frame"
import { getBadgeFrameRarityColor, getBadgeFrameRarityGlow } from "@/utils/badge-frame-system"

interface BadgeFrameGridProps {
  unlockedFrames: BadgeFrame[]
  allFrames: BadgeFrame[]
  currentPoints: number
  selectedFrame: BadgeFrame | null
  onSelectFrame: (frame: BadgeFrame) => void
  readOnly?: boolean
}

export function BadgeFrameGrid({
  unlockedFrames,
  allFrames,
  currentPoints,
  selectedFrame,
  onSelectFrame,
  readOnly = false,
}: BadgeFrameGridProps) {
  const isUnlocked = (frame: BadgeFrame) => unlockedFrames.some((uf) => uf.id === frame.id)

  const getProgressPercentage = (frame: BadgeFrame) => {
    if (isUnlocked(frame)) return 100
    return Math.min((currentPoints / frame.pointsRequired) * 100, 100)
  }

  // Ensure allFrames is an array
  if (!allFrames || !Array.isArray(allFrames)) {
    return <div className="text-zinc-400 text-sm">No frames available</div>
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {allFrames.map((frame) => {
        const unlocked = isUnlocked(frame)
        const progress = getProgressPercentage(frame)
        const isSelected = selectedFrame?.id === frame.id

        return (
          <div
            key={frame.id}
            className={`relative aspect-square rounded-xl border-2 p-2 transition-all duration-300 ${
              readOnly ? "cursor-default" : "cursor-pointer"
            } ${
              unlocked
                ? `${getBadgeFrameRarityColor(frame.rarity)} ${getBadgeFrameRarityGlow(frame.rarity)} ${
                    isSelected ? "bg-white/20 scale-105" : "bg-black/20 hover:bg-white/10"
                  }`
                : "border-zinc-700 bg-zinc-800/50 cursor-not-allowed"
            }`}
            onClick={() => !readOnly && unlocked && onSelectFrame(frame)}
          >
            {/* Frame Preview with Avatar */}
            <div className="relative w-full h-full">

              {/* Frame Overlay */}
              <Image
                src={frame.icon || ""}
                alt={frame.name}
                fill
                className={`object-contain transition-all duration-300 ${
                  unlocked ? "opacity-100" : "opacity-30 grayscale"
                }`}
              />

              {/* Selected Indicator */}
              {isSelected && unlocked && !readOnly && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-2 h-2 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}

              {/* Progress overlay for locked frames */}
              {!unlocked && progress > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-600 flex items-center justify-center bg-black/80">
                    <span className="text-xs text-white font-bold">{Math.floor(progress)}%</span>
                  </div>
                </div>
              )}

              {/* Lock icon for completely locked frames */}
              {!unlocked && progress === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 text-zinc-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Tooltip on hover */}
            {!readOnly && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                <div className="bg-black/90 text-white text-xs rounded-lg p-2 whitespace-nowrap max-w-48">
                  <div className="font-bold">{frame.name}</div>
                  <div className="text-zinc-300">{frame.description}</div>
                  <div className={`text-xs mt-1 ${getBadgeFrameRarityColor(frame.rarity).split(" ")[0]}`}>
                    {unlocked ? "UNLOCKED" : `${frame.pointsRequired.toLocaleString()} points required`}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
