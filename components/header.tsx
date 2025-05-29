"use client"

import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SolanaWalletConnector } from "@/components/shared/SolanaWalletConnector"
// Import sound functions
import { isSoundEnabled, playSound } from "@/lib/sound-manager"

interface HeaderProps {
  currentTab?: string
  showUpgradesModal?: boolean
}

export function Header({ currentTab = "home", showUpgradesModal = false }: HeaderProps) {
  // Update the useState initialization to use the saved state
  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window !== "undefined") {
      return isSoundEnabled()
    }
    return false
  })
  // Wallet connection is now handled by SolanaWalletConnector

  // Update the toggleSound function
  const toggleSound = () => {
    const newState = !isSoundOn
    setIsSoundOn(newState)

    // Play a sound to test the new state
    if (newState) {
      playSound("nav")
    }
  }

  // Wallet connection is now handled by SolanaWalletConnector component

  // Ẩn header khi upgrades modal đang mở hoặc ở tab leaderboard
  if (showUpgradesModal || currentTab === "leaderboard") {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4">
      {/* Sound toggle button - only show on home tab */}
      {currentTab === "home" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSound}
          className="w-9 h-9 rounded-full bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 border border-zinc-700"
        >
          {isSoundOn ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-white" />}
          <span className="sr-only">{isSoundOn ? "Mute sound" : "Enable sound"}</span>
        </Button>
      )}

      {/* Spacer for other tabs */}
      {currentTab !== "home" && <div />}

      {/* Wallet connect button - only show on home tab */}
      {currentTab === "home" && (
        <div className="absolute right-0 top-4">
          <SolanaWalletConnector />
        </div>
      )}
    </header>
  )
}
