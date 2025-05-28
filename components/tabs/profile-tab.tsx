"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Settings, Palette } from "lucide-react"
import { BadgeGrid } from "@/components/badge-grid"
import { BadgeFrameGrid } from "@/components/badge-frame-grid"
import { AvatarWithFrame } from "@/components/avatar-with-frame"
import { BADGES, getNextBadge } from "@/utils/badge-system"
import {
  BADGE_FRAMES,
  getBadgeFrameProgress,
  getCurrentBadgeFrame,
  getNextBadgeFrame,
} from "@/utils/badge-frame-system"
import { getCurrentLevel, getNextLevel, getLevelProgress } from "@/utils/level-system"
import type { Badge } from "@/types/badge"
import type { BadgeFrame } from "@/types/badge-frame"
import { FarcasterInfoCard } from "@/components/farcaster-info-card"
import { useFarcasterContext } from "@/hooks/use-farcaster-context"

interface ProfileTabProps {
  points?: number
  winRate?: number
  totalRaces?: number
  predictionsRemaining?: number
  unlockedBadges?: Badge[]
}

export default function ProfileTab({
  points = 0,
  winRate = 0,
  totalRaces = 0,
  predictionsRemaining = 0,
  unlockedBadges = [],
}: ProfileTabProps) {
  const [selectedFrame, setSelectedFrame] = useState<BadgeFrame | null>(getCurrentBadgeFrame(points))
  const { context } = useFarcasterContext()

  const currentLevel = getCurrentLevel(points)
  const nextLevel = getNextLevel(points)
  const levelProgress = getLevelProgress(points)

  const nextBadge = getNextBadge(points)
  const progressToNext = nextBadge ? Math.min((points / nextBadge.pointsRequired) * 100, 100) : 100

  const unlockedFrames = getBadgeFrameProgress(points)
  const nextFrame = getNextBadgeFrame(points)
  const progressToNextFrame = nextFrame ? Math.min((points / nextFrame.pointsRequired) * 100, 100) : 100

  return (
    <div className="w-full h-full overflow-y-auto p-4 pt-8 pb-24" style={{ overflowX: "hidden" }}>
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <AvatarWithFrame
          src={context?.user?.pfpUrl || "/placeholder.svg"}
          alt="User avatar"
          fallback="SR"
          size="xl"
          badgeFrame={selectedFrame}
          className="border-4 border-purple-500 rounded-full"
        />
        <h2 className="text-2xl font-bold mt-4">
          {context?.user?.displayName || "N/A"}
          {context?.user?.fid && <span className="text-lg text-zinc-400 ml-2">#{context.user.fid}</span>}
        </h2>
        {context?.user?.username && <p className="text-zinc-400 text-lg">@{context.user.username}</p>}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl">{currentLevel.icon}</span>
          <span className={`text-lg font-bold ${currentLevel.color}`}>
            Level {currentLevel.level} - {currentLevel.name}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span>Top 5%</span>
          </div>
          <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-purple-400" />
            <span>Pro Racer</span>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      {nextLevel && (
        <Card className="bg-zinc-900 border-0 p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Level Progress</h3>
            <div className="text-right">
              <div className="text-xs text-zinc-400">
                Next: {nextLevel.icon} {nextLevel.name}
              </div>
              <div className="text-xs text-green-400">{Math.floor(levelProgress)}%</div>
            </div>
          </div>
          <div className="w-full bg-zinc-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-zinc-400">
              {points.toLocaleString()} / {nextLevel.pointsRequired.toLocaleString()} points
            </span>
          </div>
        </Card>
      )}

      {/* Stats Card */}
      <Card className="bg-zinc-900 border-0 p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Stats</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">{points.toLocaleString()}</div>
            <div className="text-xs text-zinc-400">Points</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">{winRate}%</div>
            <div className="text-xs text-zinc-400">Win Rate</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">{totalRaces}</div>
            <div className="text-xs text-zinc-400">Races</div>
          </div>
        </div>
      </Card>

      {/* Badge Frames Section */}
      <Card className="bg-zinc-900 border-0 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="font-medium">
              Avatar Frames ({unlockedFrames.length}/{BADGE_FRAMES.length})
            </h3>
          </div>
          {nextFrame && (
            <div className="text-right">
              <div className="text-xs text-zinc-400">Next: {nextFrame.name}</div>
              <div className="text-xs text-green-400">{Math.floor(progressToNextFrame)}%</div>
            </div>
          )}
        </div>

        <BadgeFrameGrid
          unlockedFrames={unlockedFrames}
          allFrames={BADGE_FRAMES}
          currentPoints={points}
          selectedFrame={selectedFrame}
          onSelectFrame={setSelectedFrame}
        />

        {nextFrame && (
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress to {nextFrame.name}</span>
              <span className="text-sm text-zinc-400">
                {points.toLocaleString()} / {nextFrame.pointsRequired.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-green-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToNextFrame}%` }}
              ></div>
            </div>
          </div>
        )}
      </Card>

      {/* Badges Section */}
      <Card className="bg-zinc-900 border-0 p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">
            Badges ({unlockedBadges.length}/{BADGES.length})
          </h3>
          {nextBadge && (
            <div className="text-right">
              <div className="text-xs text-zinc-400">Next: {nextBadge.name}</div>
              <div className="text-xs text-green-400">{Math.floor(progressToNext)}%</div>
            </div>
          )}
        </div>

        <BadgeGrid unlockedBadges={unlockedBadges} allBadges={BADGES} currentPoints={points} />

        {nextBadge && (
          <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress to {nextBadge.name}</span>
              <span className="text-sm text-zinc-400">
                {points.toLocaleString()} / {nextBadge.pointsRequired.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-green-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
        )}
      </Card>

      {/* Team Section */}
      <Card className="bg-zinc-900 border-0 p-4">
        <h3 className="font-medium mb-4">Team</h3>

        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <img src="/williams-racing-logo.png" alt="Team logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1">
            <h4 className="font-medium">Williams Racing</h4>
            <p className="text-xs text-zinc-400">Joined 2 weeks ago</p>
          </div>

          <Button variant="outline" size="sm" className="h-8">
            View
          </Button>
        </div>
      </Card>

      {/* Farcaster Context */}
      <FarcasterInfoCard />
    </div>
  )
}
