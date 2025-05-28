"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Zap, Trophy, Rocket } from "lucide-react"

export default function SurprisesTab() {
  const surprises = [
    {
      id: 1,
      title: "Daily Bonus",
      description: "Claim your daily race points",
      reward: "+100 points",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      available: true,
    },
    {
      id: 2,
      title: "Mystery Box",
      description: "Open for a random reward",
      reward: "Random",
      icon: <Gift className="w-5 h-5 text-purple-400" />,
      available: true,
    },
    {
      id: 3,
      title: "Weekly Tournament",
      description: "Compete for the top prize",
      reward: "Up to 5000 points",
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      available: false,
      timeRemaining: "2d 14h",
    },
    {
      id: 4,
      title: "Nitro Boost",
      description: "2x points for 24 hours",
      reward: "2x Multiplier",
      icon: <Rocket className="w-5 h-5 text-blue-400" />,
      available: false,
      timeRemaining: "12h",
    },
  ]

  return (
    <div className="flex flex-col w-full h-full p-4 pt-8 pb-20">
      <h2 className="text-2xl font-bold text-center mb-6">Surprises</h2>

      <div className="space-y-4">
        {surprises.map((surprise) => (
          <Card key={surprise.id} className="p-4 bg-zinc-900 border-0">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-zinc-800 p-2 rounded-full">{surprise.icon}</div>

              <div className="flex-1">
                <h3 className="font-medium">{surprise.title}</h3>
                <p className="text-xs text-zinc-400">{surprise.description}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-green-400">{surprise.reward}</p>
                {!surprise.available && surprise.timeRemaining && (
                  <p className="text-xs text-zinc-400">Available in {surprise.timeRemaining}</p>
                )}
              </div>
            </div>

            <div className="mt-3 ml-10">
              <Button
                variant={surprise.available ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                disabled={!surprise.available}
              >
                {surprise.available ? "Claim Now" : "Coming Soon"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-zinc-500">New surprises available every day!</p>
      </div>
    </div>
  )
}
