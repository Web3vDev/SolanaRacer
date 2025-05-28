"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getLeaderboardData, getUserRank } from "@/lib/user-data-manager"
import { getLeaderboardBadges } from "@/utils/badge-system"
import { getCurrentLevel } from "@/utils/level-system"
import { useState, useEffect } from "react"
import { UserDetailModal } from "@/components/user-detail-modal"
import { useFarcasterContext } from "@/hooks/use-farcaster-context"

interface LeaderboardTabProps {
  userPoints?: number
}

interface LeaderboardPlayer {
  fid: number
  display_name: string
  pfp_url?: string
  points: number
  level: number
  rank?: number
}

export default function LeaderboardTab({ userPoints = 0 }: LeaderboardTabProps) {
  const { context } = useFarcasterContext()
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([])
  const [userRank, setUserRank] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)

        // Get leaderboard data from Supabase
        const data = await getLeaderboardData(100)

        // Add rank to each player
        const rankedData = data.map((player, index) => ({
          ...player,
          rank: index + 1,
        }))

        setLeaderboardData(rankedData)

        // Get current user's rank if they have a fid
        if (context?.user?.fid) {
          const rank = await getUserRank(context.user.fid)
          setUserRank(rank)
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [context?.user?.fid])

  const leaderboardBadges = getLeaderboardBadges(userRank)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-r-green-400 border-b-green-400 border-l-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white/70">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-4 pt-8 pb-20 overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Leaderboard</h2>

      {/* User's rank display */}
      {userRank > 0 && userRank <= 100 && (
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-green-400 rounded-lg p-3 mb-2">
            <p className="text-white font-bold">Your Rank: #{userRank}</p>
            <p className="text-white/80 text-sm">{userPoints.toLocaleString()} points</p>
          </div>

          {/* Show earned leaderboard badges */}
          {leaderboardBadges.length > 0 && (
            <div className="flex justify-center gap-2 mb-2">
              {leaderboardBadges.map((badge) => (
                <div key={badge.id} className="w-8 h-8">
                  <img
                    src={badge.icon || "/placeholder.svg"}
                    alt={badge.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 flex-1">
        {leaderboardData.map((player) => {
          const playerLevel = getCurrentLevel(player.points)
          const isCurrentUser = context?.user?.fid === player.fid

          return (
            <Card
              key={player.fid}
              onClick={() => setSelectedUser(player)}
              className={`p-4 border-0 cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                isCurrentUser
                  ? "bg-gradient-to-r from-purple-900/50 to-green-900/50 border-2 border-purple-500"
                  : "bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`text-xl font-bold w-8 text-center ${
                    player.rank === 1
                      ? "text-yellow-400"
                      : player.rank === 2
                        ? "text-gray-300"
                        : player.rank === 3
                          ? "text-amber-600"
                          : "text-white"
                  }`}
                >
                  {player.rank}
                </div>

                <Avatar>
                  <AvatarImage src={player.pfp_url || "/placeholder.svg"} alt={player.display_name} />
                  <AvatarFallback>{player.display_name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${isCurrentUser ? "text-white font-bold" : ""}`}>
                      {player.display_name}
                      {isCurrentUser && " (You)"}
                    </h3>
                    {/* Level display */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{playerLevel.icon}</span>
                      <span className={`text-xs font-medium ${playerLevel.color}`}>Lv.{playerLevel.level}</span>
                    </div>
                  </div>

                  {/* Show leaderboard badges for top players */}
                  {player.rank && player.rank <= 10 && (
                    <div className="flex gap-1 mt-1">
                      {getLeaderboardBadges(player.rank)
                        .slice(0, 2)
                        .map((badge) => (
                          <div key={badge.id} className="w-4 h-4">
                            <img
                              src={badge.icon || "/placeholder.svg"}
                              alt={badge.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-bold">{player.points.toLocaleString()}</p>
                  <p className="text-xs text-zinc-400">points</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {userRank > 100 && (
        <div className="mt-4 text-center">
          <p className="text-zinc-400 text-sm">Your rank: #{userRank} • Keep racing to reach the top 100!</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}
