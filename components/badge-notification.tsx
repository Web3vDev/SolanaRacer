"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Badge } from "@/types/badge"
import { getBadgeRarityColor, getBadgeRarityGlow } from "@/utils/badge-system"
// Import sound function at the top
import { playSound } from "@/lib/sound-manager"

interface BadgeNotificationProps {
  badge: Badge | null
  onClose: () => void
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (badge) {
      setIsVisible(true)

      // Play notification sound
      playSound("notification")

      // Auto close after 1 second
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [badge, onClose])

  if (!badge) return null

  return (
    <div
      className={`fixed top-20 left-2 right-2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`bg-zinc-900 border-2 ${getBadgeRarityColor(badge.rarity)} rounded-xl p-4 shadow-lg ${getBadgeRarityGlow(badge.rarity)} mx-auto max-w-full`}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image src={badge.icon || "/placeholder.svg"} alt={badge.name} fill className="object-contain" />
            <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg">Badge Unlocked!</h3>
            <p className={`font-medium ${getBadgeRarityColor(badge.rarity).split(" ")[0]} truncate`}>{badge.name}</p>
            <p className="text-zinc-400 text-sm line-clamp-2">{badge.description}</p>
          </div>
        </div>

        <div className="mt-3 text-center">
          <span className={`text-xs px-2 py-1 rounded-full border ${getBadgeRarityColor(badge.rarity)} bg-black/20`}>
            {badge.rarity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}
