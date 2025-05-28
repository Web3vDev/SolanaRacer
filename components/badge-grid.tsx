"use client"

import Image from "next/image"
import type { Badge } from "@/types/badge"
import { getBadgeRarityColor, getBadgeRarityGlow } from "@/utils/badge-system"

interface BadgeGridProps {
  unlockedBadges: Badge[]
  allBadges: Badge[]
  currentPoints: number
}

export function BadgeGrid({ unlockedBadges, allBadges, currentPoints }: BadgeGridProps) {
  const isUnlocked = (badge: Badge) => unlockedBadges.some((ub) => ub.id === badge.id)

  const getProgressPercentage = (badge: Badge) => {
    if (isUnlocked(badge)) return 100
    return Math.min((currentPoints / badge.pointsRequired) * 100, 100)
  }

  // Add special styling for leaderboard badges
  const getBadgeSpecialStyling = (badge: Badge) => {
    if (badge.category === "leaderboard") {
      return "ring-2 ring-yellow-400/50 shadow-yellow-400/30"
    }
    return ""
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {allBadges.map((badge) => {
        const unlocked = isUnlocked(badge)
        const progress = getProgressPercentage(badge)
        const specialStyling = getBadgeSpecialStyling(badge)

        return (
          <div
            key={badge.id}
            className={`relative aspect-square rounded-xl border-2 p-2 transition-all duration-300 ${
              unlocked
                ? `${getBadgeRarityColor(badge.rarity)} ${getBadgeRarityGlow(badge.rarity)} bg-black/20 ${specialStyling}`
                : "border-zinc-700 bg-zinc-800/50"
            }`}
          >
            {/* Badge Image */}
            <div className="relative w-full h-full">
              <Image
                src={badge.icon || "/placeholder.svg"}
                alt={badge.name}
                fill
                className={`object-contain transition-all duration-300 ${
                  unlocked ? "opacity-100" : "opacity-30 grayscale"
                }`}
              />

              {/* Progress overlay for locked badges */}
              {!unlocked && progress > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-600 flex items-center justify-center bg-black/80">
                    <span className="text-xs text-white font-bold">{Math.floor(progress)}%</span>
                  </div>
                </div>
              )}

              {/* Lock icon for completely locked badges */}
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

              {/* Glow effect for unlocked badges */}
              {unlocked && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"></div>
              )}
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              <div className="bg-black/90 text-white text-xs rounded-lg p-2 whitespace-nowrap max-w-48">
                <div className="font-bold">{badge.name}</div>
                <div className="text-zinc-300">{badge.description}</div>
                <div className={`text-xs mt-1 ${getBadgeRarityColor(badge.rarity).split(" ")[0]}`}>
                  {unlocked ? "UNLOCKED" : `${badge.pointsRequired.toLocaleString()} points required`}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
