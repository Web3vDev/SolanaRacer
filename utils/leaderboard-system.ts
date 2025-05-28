// Simulated leaderboard data - in a real app this would come from a backend
export interface LeaderboardPlayer {
  id: string
  name: string
  points: number
  avatar: string
  rank: number
}

export const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
  { id: "1", name: "MaxSpeed", points: 12500, avatar: "/diverse-avatars.png", rank: 1 },
  { id: "2", name: "SolRacer", points: 10200, avatar: "/diverse-avatars.png", rank: 2 },
  { id: "3", name: "CryptoDriver", points: 9800, avatar: "/diverse-avatars.png", rank: 3 },
  { id: "4", name: "BlockchainRacer", points: 8500, avatar: "/diverse-avatars.png", rank: 4 },
  { id: "5", name: "TokenRider", points: 7200, avatar: "/diverse-avatars.png", rank: 5 },
  { id: "6", name: "DeFiSpeedster", points: 6800, avatar: "/diverse-avatars.png", rank: 6 },
  { id: "7", name: "NFTRacer", points: 6200, avatar: "/diverse-avatars.png", rank: 7 },
  { id: "8", name: "MetaDriver", points: 5900, avatar: "/diverse-avatars.png", rank: 8 },
  { id: "9", name: "Web3Racer", points: 5500, avatar: "/diverse-avatars.png", rank: 9 },
  { id: "10", name: "CoinRacer", points: 5200, avatar: "/diverse-avatars.png", rank: 10 },
]

// Function to get user's rank based on their points
export function getUserRank(userPoints: number): number {
  // Count how many players have more points than the user
  const playersAbove = MOCK_LEADERBOARD.filter((player) => player.points > userPoints).length
  return playersAbove + 1
}

// Function to check if user qualifies for leaderboard badges
export function checkLeaderboardBadges(userPoints: number): number {
  const rank = getUserRank(userPoints)

  // Only return rank if user is in top 100
  if (rank <= 100) {
    return rank
  }

  return 0 // Not in top 100
}

// Function to get leaderboard with user included
export function getLeaderboardWithUser(userPoints: number, userName = "You"): LeaderboardPlayer[] {
  const userRank = getUserRank(userPoints)
  const userEntry: LeaderboardPlayer = {
    id: "user",
    name: userName,
    points: userPoints,
    avatar: "/diverse-avatars.png",
    rank: userRank,
  }

  // Create a new leaderboard with user inserted at correct position
  const leaderboardWithUser = [...MOCK_LEADERBOARD]

  // Find where to insert the user
  let insertIndex = leaderboardWithUser.findIndex((player) => player.points < userPoints)
  if (insertIndex === -1) {
    insertIndex = leaderboardWithUser.length
  }

  // Insert user and update ranks
  leaderboardWithUser.splice(insertIndex, 0, userEntry)

  // Update ranks for all players
  leaderboardWithUser.forEach((player, index) => {
    player.rank = index + 1
  })

  return leaderboardWithUser.slice(0, 10) // Return top 10
}
