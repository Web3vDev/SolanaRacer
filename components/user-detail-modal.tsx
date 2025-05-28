"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trophy, Star, Palette } from "lucide-react"
import { BadgeGrid } from "@/components/badge-grid"
import { BadgeFrameGrid } from "@/components/badge-frame-grid"
import { AvatarWithFrame } from "@/components/avatar-with-frame"
import { BADGES, getUnlockedBadges } from "@/utils/badge-system"
import { BADGE_FRAMES, getBadgeFrameProgress, getCurrentBadgeFrame } from "@/utils/badge-frame-system"
import { getCurrentLevel } from "@/utils/level-system"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

interface UserDetailModalProps {
  user: {
    id: string
    name: string
    points: number
    rank: number
    avatar?: string
    winRate?: number
    totalRaces?: number
  }
  onClose: () => void
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  if (!mounted) return null

  // Get user data with fallbacks
  const currentLevel = getCurrentLevel(user.points)
  const unlockedBadges = getUnlockedBadges(user.points) || []
  const unlockedFrames = getBadgeFrameProgress(user.points) || []
  const currentFrame = getCurrentBadgeFrame(user.points)

  const modalContent = (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-lg font-bold">Player Profile</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <AvatarWithFrame
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              fallback={user.name.slice(0, 2)}
              size="xl"
              badgeFrame={currentFrame}
              className="border-4 border-purple-500 rounded-full"
            />
            <h3 className="text-xl font-bold mt-4">{user.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl">{currentLevel.icon}</span>
              <span className={`text-base font-bold ${currentLevel.color}`}>
                Level {currentLevel.level} - {currentLevel.name}
              </span>
            </div>

            {/* Rank Badge */}
            <div className="flex items-center gap-2 mt-2">
              <div className="bg-gradient-to-r from-purple-500 to-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>Rank #{user.rank}</span>
              </div>
              {user.rank <= 10 && (
                <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>Top Player</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <Card className="bg-zinc-800 border-0 p-4 mb-4">
            <h4 className="font-medium mb-3">Stats</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold">{user.points.toLocaleString()}</div>
                <div className="text-xs text-zinc-400">Points</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold">{user.winRate || 0}%</div>
                <div className="text-xs text-zinc-400">Win Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold">{user.totalRaces || 0}</div>
                <div className="text-xs text-zinc-400">Races</div>
              </div>
            </div>
          </Card>

          {/* Avatar Frames Section */}
          <Card className="bg-zinc-800 border-0 p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-purple-400" />
              <h4 className="font-medium">
                Avatar Frames ({unlockedFrames.length}/{BADGE_FRAMES?.length || 0})
              </h4>
            </div>
            <BadgeFrameGrid
              unlockedFrames={unlockedFrames}
              allFrames={BADGE_FRAMES || []}
              currentPoints={user.points}
              selectedFrame={currentFrame}
              onSelectFrame={() => {}} // Read-only mode
              readOnly={true}
            />
          </Card>

          {/* Badges Section */}
          <Card className="bg-zinc-800 border-0 p-4">
            <h4 className="font-medium mb-4">
              Badges ({unlockedBadges.length}/{BADGES?.length || 0})
            </h4>
            <BadgeGrid unlockedBadges={unlockedBadges} allBadges={BADGES || []} currentPoints={user.points} />
          </Card>
        </div>
      </div>
    </div>
  )

  const portalElement = document.getElementById("modal-portal")
  if (!portalElement) return null

  return createPortal(modalContent, portalElement)
}
