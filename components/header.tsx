"use client"

import { useState } from "react"
import { Volume2, VolumeX, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showWalletAddress, setShowWalletAddress] = useState(false)

  // Update the toggleSound function
  const toggleSound = async () => {
    const newState = toggleSound()
    setIsSoundOn(newState)

    // Play a sound to test the new state
    if (newState) {
      await playSound("nav")
    }
  }

  const connectWallet = () => {
    if (!isWalletConnected) {
      // Wallet connection logic would go here
      console.log("Connecting wallet...")
      setIsWalletConnected(true)
    } else {
      // Toggle wallet address display
      setShowWalletAddress(!showWalletAddress)
    }
  }

  const mockWalletAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

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
        <Button
          onClick={connectWallet}
          className={`absolute right-0 top-4 h-10 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-medium rounded-l-full rounded-r-none border border-zinc-700 flex items-center gap-1.5 transition-all duration-300 ${
            isWalletConnected && !showWalletAddress ? "pr-3 pl-3" : "pr-4 pl-3"
          }`}
        >
          <Wallet className="h-3.5 w-3.5" />
          {!isWalletConnected
            ? "Connect Wallet"
            : showWalletAddress
              ? `${mockWalletAddress.slice(0, 4)}...${mockWalletAddress.slice(-4)}`
              : null}
        </Button>
      )}
    </header>
  )
}
