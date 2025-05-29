"use client"

import { useState, useEffect, useRef } from "react"
import { RaceBackground } from "@/components/race-background"
import { RaceContent } from "./race/race-content"
import { PredictionControls } from "./race/prediction-controls"
import { ResultOverlay } from "./race/result-overlay"
import { SlotMachineStyles } from "./race/slot-machine-styles"
import { DigitSlot } from "./race/digit-slot"
import { BadgeNotification } from "@/components/badge-notification"
import { getBadgeFrameProgress } from "@/utils/badge-frame-system"
import { initializePriceService, subscribeToPriceUpdates, cleanupPriceService } from "@/lib/price-service"
import { F1_CARS, getTotalCarBonuses } from "@/utils/f1-car-system"
import { useFarcasterContext } from "@/contexts/farcaster-context-provider"
import { initializeUserData, updateUserData, getUserDataManager } from "@/lib/user-data-manager"
import type { Badge } from "@/types/badge"
import type { BadgeFrame } from "@/types/badge-frame"
import type { F1Car } from "@/types/f1-car"
import { checkLeaderboardBadges } from "@/utils/leaderboard-system"
import { getAllUnlockedBadges } from "@/utils/badge-system"
// Import TestButton component
import { TestButton } from "@/components/test-button"

// Import sound functions at the top
import { playSound, playBackgroundMusic } from "@/lib/sound-manager"

// Import statistics functions
import { 
  getCurrentSuccessRate,
  getPointsMultiplier,
  getWinBonus,
  getComboBonus,
  getRecoverySpeed,
  getMaxEnergy
} from "@/utils/race-statistics"

// Import the Upgrade type from game.ts
import { Upgrade } from "@/types/game"

// Upgrade interface moved to /types/game.ts

interface Item {
  id: number
  name: string
  description: string
  icon: string
  quantity: number
  type: "energy_restore" | "double_points"
}

interface RaceTabProps {
  onDataUpdate?: (data: {
    points: number
    winRate: number
    totalRaces: number
    predictionsRemaining: number
    unlockedBadges: Badge[]
    unlockedFrames: BadgeFrame[]
  }) => void
}

export default function RaceTab({ onDataUpdate }: RaceTabProps) {
  const { context, isLoading: farcasterLoading } = useFarcasterContext()

  // State variables - will be initialized from Supabase
  const [isInitialized, setIsInitialized] = useState(false)
  const [points, setPoints] = useState(0)
  const [predictionsRemaining, setPredictionsRemaining] = useState(10)
  const [maxPredictions, setMaxPredictions] = useState(20)
  const [baseSuccessRate, setBaseSuccessRate] = useState(65)
  const [winStreak, setWinStreak] = useState(0)
  const [totalRaces, setTotalRaces] = useState(0)
  const [lastPredictionTime, setLastPredictionTime] = useState<number>(Date.now())
  const [doublePointsActive, setDoublePointsActive] = useState(false)
  const [doublePointsEndTime, setDoublePointsEndTime] = useState<number>(0)
  const [showResultOverlay, setShowResultOverlay] = useState(false)

  // F1 Cars state
  const [cars, setCars] = useState<F1Car[]>(F1_CARS)

  // Items state
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      name: "Energy Restore",
      description: "Restore all energy instantly",
      icon: "⚡",
      quantity: 1,
      type: "energy_restore",
    },
    {
      id: 2,
      name: "Double Points",
      description: "Double all points earned for 1 hour",
      icon: "💎",
      quantity: 1,
      type: "double_points",
    },
  ])

  // Updated upgrade system state
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Win Bonus",
      description: "Extra points when winning",
      baseCost: 1000,
      icon: "/placeholder.svg?height=80&width=80&query=trophy%20with%20green%20glow",
      level: 0,
      maxLevel: 10,
      effect: { type: "pointsBonus", value: 25 },
    },
    {
      id: 2,
      name: "Point Multiplier",
      description: "Increase points percentage",
      baseCost: 2000,
      icon: "/placeholder-a14b3.png",
      level: 0,
      maxLevel: 5,
      effect: { type: "pointsMultiplier", value: 0.1 },
    },
    {
      id: 3,
      name: "Recovery Speed",
      description: "Faster energy recovery",
      baseCost: 1500,
      icon: "/placeholder.svg?height=80&width=80&query=lightning%20bolt%20with%20blue%20glow",
      level: 0,
      maxLevel: 5,
      effect: { type: "recoverySpeed", value: 20 },
    },
    {
      id: 4,
      name: "Energy Tank",
      description: "Increase maximum energy",
      baseCost: 2500,
      icon: "/placeholder.svg?height=80&width=80&query=battery%20with%20yellow%20glow",
      level: 0,
      maxLevel: 10,
      effect: { type: "maxEnergy", value: 1 },
    },
    {
      id: 5,
      name: "Combo Master",
      description: "Bonus points for win streaks",
      baseCost: 1800,
      icon: "/placeholder.svg?height=80&width=80&query=combo%20chain%20with%20purple%20glow",
      level: 0,
      maxLevel: 5,
      effect: { type: "comboBonus", value: 15 },
    },
  ])

  // Refs
  const prevDisplayPriceRef = useRef("205.000")
  const spinTimeouts = useRef([])
  const speedTimeoutRef = useRef(null)
  const resultOverlayRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const priceUnsubscribeRef = useRef<(() => void) | null>(null)

  // State variables for price updates
  const [isLoading, setIsLoading] = useState(true)
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "neutral">("neutral")
  const [spinningDigits, setSpinningDigits] = useState({})
  const [displayPrice, setDisplayPrice] = useState("200.000")

  // State variables for prediction
  const [isPredictionActive, setIsPredictionActive] = useState(false)
  const [predictionResult, setPredictionResult] = useState<"correct" | "wrong" | null>(null)
  const [priceBeforePrediction, setPriceBeforePrediction] = useState("")
  const [priceAfterPrediction, setPriceAfterPrediction] = useState("")
  const [predictionAction, setPredictionAction] = useState<"pump" | "dump" | null>(null)
  const [lineSpeed, setLineSpeed] = useState(5)
  const [carMovement, setCarMovement] = useState<"pump" | "dump" | "none">("none")
  const [countdownActive, setCountdownActive] = useState(false)
  const [countdownTime, setCountdownTime] = useState(4)

  // State for badge notifications
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([])
  const [unlockedFrames, setUnlockedFrames] = useState<BadgeFrame[]>([])
  const [newBadge, setNewBadge] = useState<Badge | null>(null)

  // Initialize user data from Supabase
  useEffect(() => {
    const initializeUser = async () => {
      try {
        let userContext

        // Nếu có Farcaster context và fid, sử dụng thông tin thật
        if (context?.user?.fid) {
          userContext = {
            fid: context.user.fid,
            displayName: context.user.displayName,
            username: context.user.username,
            pfpUrl: context.user.pfpUrl,
          }
          console.log("Using Farcaster user:", userContext)
        } else {
          // Nếu không có fid, sử dụng user mặc định để test Supabase
          userContext = {
            fid: 1,
            displayName: "hello",
            username: "hello",
            pfpUrl: undefined,
          }
          console.log("Using test user:", userContext)
        }

        const gameData = await initializeUserData(userContext)

        if (gameData) {
          console.log("Loaded game data:", gameData)
          // Update all state with loaded data
          setPoints(gameData.points)
          setWinStreak(gameData.winStreak)
          setTotalRaces(gameData.totalRaces)
          setPredictionsRemaining(gameData.predictionsRemaining)
          setMaxPredictions(gameData.maxPredictions)
          setBaseSuccessRate(gameData.baseSuccessRate)
          setLastPredictionTime(gameData.lastPredictionTime)
          setDoublePointsActive(gameData.doublePointsActive)
          setDoublePointsEndTime(gameData.doublePointsEndTime)
          setUpgrades(gameData.upgrades)
          setCars(gameData.cars)
          setItems(gameData.items)
        } else {
          console.log("No game data loaded, using defaults")
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Error initializing user data:", error)
        setIsInitialized(true) // Still allow the game to work with default data
      }
    }

    // Chỉ chạy khi farcasterLoading đã xong hoặc sau timeout
    if (!farcasterLoading) {
      initializeUser()
    } else {
      // Timeout sau 2 giây nếu farcaster vẫn loading
      const timeoutId = setTimeout(() => {
        console.log("Farcaster loading timeout, initializing with test user")
        initializeUser()
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [context, farcasterLoading])

  // Update Supabase when game data changes
  useEffect(() => {
    if (!isInitialized) return

    const gameData = {
      points,
      winStreak,
      totalRaces,
      predictionsRemaining,
      maxPredictions,
      baseSuccessRate,
      lastPredictionTime,
      doublePointsActive,
      doublePointsEndTime,
      upgrades,
      cars,
      items,
    }

    updateUserData(gameData)
  }, [
    isInitialized,
    points,
    winStreak,
    totalRaces,
    predictionsRemaining,
    maxPredictions,
    lastPredictionTime,
    doublePointsActive,
    doublePointsEndTime,
    upgrades,
    cars,
    items,
  ])

  // Statistics functions have been moved to /utils/race-statistics.ts

  // Handle upgrade
  const handleUpgrade = (upgradeId: number) => {
    setUpgrades((prev) =>
      prev.map((upgrade) => (upgrade.id === upgradeId ? { ...upgrade, level: upgrade.level + 1 } : upgrade)),
    )
  }

  // Handle item usage
  const handleUseItem = (itemId: number) => {
    const item = items.find((i) => i.id === itemId)
    if (!item || item.quantity <= 0) return

    if (item.type === "energy_restore") {
      setPredictionsRemaining(getMaxEnergy(upgrades))
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)))
    } else if (item.type === "double_points") {
      setDoublePointsActive(true)
      setDoublePointsEndTime(Date.now() + 60 * 60 * 1000) // 1 hour
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i)))
    }
  }

  // Handle car purchase
  const handleBuyCar = (carId: number) => {
    setCars((prev) => prev.map((car) => (car.id === carId ? { ...car, owned: true } : car)))
  }

  // Handle car equip
  const handleEquipCar = (carId: number) => {
    setCars((prev) =>
      prev.map((car) => ({
        ...car,
        isEquipped: car.id === carId,
      })),
    )
  }

  // Update max predictions when energy tank is upgraded
  useEffect(() => {
    const newMaxEnergy = getMaxEnergy(upgrades)
    setMaxPredictions(newMaxEnergy)
  }, [upgrades])

  // Check double points expiry
  useEffect(() => {
    if (doublePointsActive && Date.now() > doublePointsEndTime) {
      setDoublePointsActive(false)
    }
  }, [doublePointsActive, doublePointsEndTime])

  // Initialize price service
  useEffect(() => {
    const initPrice = async () => {
      setIsLoading(true)
      await initializePriceService()

      // Subscribe to price updates
      const unsubscribe = subscribeToPriceUpdates((newPrice) => {
        const prevPrice = prevDisplayPriceRef.current

        // Determine price direction for color change
        const prevDecimal = Number.parseInt(prevPrice.split(".")[1] || "0", 10)
        const newDecimal = Number.parseInt(newPrice.split(".")[1] || "0", 10)

        if (newDecimal > prevDecimal) {
          setPriceDirection("up")
        } else if (newDecimal < prevDecimal) {
          setPriceDirection("down")
        } else {
          setPriceDirection("neutral")
        }

        // Update the ref with new price
        prevDisplayPriceRef.current = newPrice

        // Clear any existing timeouts
        spinTimeouts.current.forEach((timeout) => clearTimeout(timeout))
        spinTimeouts.current = []

        // Track which digits are spinning by comparing with previous price
        const newSpinningDigits = {}

        // Compare each digit and only animate those that change
        newPrice.split("").forEach((digit, index) => {
          if (
            digit !== "." && // Don't animate decimal point
            (index >= prevPrice.length || digit !== prevPrice[index])
          ) {
            newSpinningDigits[index] = true
          }
        })

        // Update spinning digits state
        setSpinningDigits(newSpinningDigits)

        // Update display price
        setDisplayPrice(newPrice)

        // Get positions of digits that are spinning
        const spinningPositions = Object.keys(newSpinningDigits).map(Number)

        // Set timeouts to stop spinning for each digit
        spinningPositions.forEach((position, index) => {
          // Base delay plus additional delay based on position
          const isDecimalPart = position > newPrice.indexOf(".")
          const positionFactor = isDecimalPart ? position - newPrice.indexOf(".") : 0
          const delay = 300 + positionFactor * 100

          const timeout = setTimeout(() => {
            setSpinningDigits((prev) => {
              const updated = { ...prev }
              delete updated[position]
              return updated
            })
          }, delay)

          spinTimeouts.current.push(timeout)
        })
      })

      priceUnsubscribeRef.current = unsubscribe
      setIsLoading(false)
    }

    initPrice()

    return () => {
      if (priceUnsubscribeRef.current) {
        priceUnsubscribeRef.current()
      }
      spinTimeouts.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  // Function to render a single digit slot
  const renderDigitSlot = (digit, index) => {
    return (
      <DigitSlot
        key={index}
        digit={digit}
        index={index}
        isSpinning={spinningDigits[index]}
        displayPrice={displayPrice}
        priceDirection={priceDirection}
      />
    )
  }

  // Check for newly unlocked badges and frames
  const checkForNewBadges = (newPoints: number) => {
    const currentRank = checkLeaderboardBadges(points)
    const newRank = checkLeaderboardBadges(newPoints)

    const currentUnlocked = getAllUnlockedBadges(points, currentRank)
    const newUnlocked = getAllUnlockedBadges(newPoints, newRank)

    const newlyUnlocked = newUnlocked.filter((badge) => !currentUnlocked.some((current) => current.id === badge.id))

    if (newlyUnlocked.length > 0) {
      // Show notification for the first new badge
      setNewBadge(newlyUnlocked[0])
      setUnlockedBadges(newUnlocked)
    }
  }

  // Handle prediction
  const handlePrediction = (action: "pump" | "dump") => {
    // Play button sound when prediction is made
    playSound("button")

    // Clear any existing timeout
    if (speedTimeoutRef.current) {
      clearTimeout(speedTimeoutRef.current)
    }

    // Clear any existing countdown interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Only process prediction if there are predictions remaining
    if (predictionsRemaining > 0) {
      setIsPredictionActive(true)
      // Activate countdown and set initial time
      setCountdownActive(true)
      setCountdownTime(4)

      // Start countdown interval
      countdownIntervalRef.current = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Store the current price before prediction
      setPriceBeforePrediction(displayPrice)
      setPredictionAction(action)

      // Decrease predictions remaining
      setPredictionsRemaining((prev) => prev - 1)
      setLastPredictionTime(Date.now())
      setTotalRaces((prev) => prev + 1)

      // Determine if prediction is correct based on success rate
      const currentSuccessRate = getCurrentSuccessRate(baseSuccessRate, cars)
      const isCorrect = Math.random() * 100 < currentSuccessRate

      // Set prediction result
      setPredictionResult(isCorrect ? "correct" : "wrong")

      // Set high speed based on action
      const newSpeed = action === "pump" ? 20 : 25
      setLineSpeed(newSpeed)

      // Set car movement
      setCarMovement(action)

      // Get the car container element and adjust its position for acceleration effect
      const carContainer = document.querySelector(".car-container")
      if (carContainer) {
        // Move car up slightly during acceleration
        carContainer.style.bottom = "-680px"

        // Return to normal position after animation completes
        setTimeout(() => {
          carContainer.style.bottom = "-700px"
        }, 3000)
      }

      // After 4 seconds, show the result and return to normal animation
      setTimeout(() => {
        // Deactivate countdown
        setCountdownActive(false)

        // Generate the final price that determines win/loss
        let finalDecimal
        if (isCorrect) {
          // If correct prediction, make the price match the prediction
          finalDecimal = action === "pump" ? "999" : "001"
        } else {
          // If wrong prediction, make the price opposite of the prediction
          finalDecimal = action === "pump" ? "001" : "999"
        }

        // Set the final price
        const finalPrice = `${Math.floor(Number.parseFloat(displayPrice))}.${finalDecimal}`
        setDisplayPrice(finalPrice)
        prevDisplayPriceRef.current = finalPrice
        setPriceAfterPrediction(finalPrice)

        // Stop all spinning
        setSpinningDigits({})

        // Show the result overlay
        setShowResultOverlay(true)

        // Hide the overlay after 1.5 seconds and start fade animation
        setTimeout(() => {
          // Update points if prediction is correct
          if (isCorrect) {
            // Calculate points with all bonuses
            const basePoints = 100
            const multiplier = getPointsMultiplier(upgrades, cars)
            const winBonus = getWinBonus(upgrades)
            const comboBonus = getComboBonus(upgrades, winStreak)

            let totalPoints = Math.floor((basePoints + winBonus) * multiplier) + comboBonus

            // Apply double points if active
            if (doublePointsActive) {
              totalPoints *= 2
            }

            const newPoints = points + totalPoints

            setPoints(newPoints)
            checkForNewBadges(newPoints)
            setWinStreak((prev) => prev + 1)
          } else {
            setWinStreak(0) // Reset win streak on loss
          }

          if (resultOverlayRef.current) {
            resultOverlayRef.current.classList.add("result-fade-out")

            // Remove the overlay after animation completes
            setTimeout(() => {
              setShowResultOverlay(false)
              setPredictionResult(null)
              if (resultOverlayRef.current) {
                resultOverlayRef.current.classList.remove("result-fade-out")
              }
            }, 1000)
          }
        }, 1500)

        // Play result sound
        if (isCorrect) {
          playSound("correct")
        } else {
          playSound("wrong")
        }

        // Reset to normal speed
        setLineSpeed(5)
        setCarMovement("none")
        setIsPredictionActive(false)
      }, 4000)
    }
  }

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // Update parent component with current data
  useEffect(() => {
    if (onDataUpdate && isInitialized) {
      const rank = checkLeaderboardBadges(points)
      onDataUpdate({
        points,
        winRate: getCurrentSuccessRate(baseSuccessRate, cars),
        totalRaces,
        predictionsRemaining,
        unlockedBadges: getAllUnlockedBadges(points, rank),
        unlockedFrames,
      })
    }
  }, [points, upgrades, totalRaces, predictionsRemaining, unlockedBadges, unlockedFrames, onDataUpdate, isInitialized])

  // Initialize unlocked badges and frames based on current points
  useEffect(() => {
    if (isInitialized) {
      const rank = checkLeaderboardBadges(points)
      setUnlockedBadges(getAllUnlockedBadges(points, rank))
      setUnlockedFrames(getBadgeFrameProgress(points))
    }
  }, [points, isInitialized])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPriceService()
      getUserDataManager().destroy()
    }
  }, [])

  // Energy recovery system with improved speed and proper timing
  useEffect(() => {
    const baseRecoveryTime = 10 * 60 * 1000 // 10 minutes base
    const speedBonus = getRecoverySpeed(upgrades)
    const actualRecoveryTime = baseRecoveryTime * (1 - speedBonus / 100)

    // Calculate time until next recovery based on last prediction
    const calculateNextRecoveryTime = () => {
      if (!lastPredictionTime) return actualRecoveryTime

      const timeSinceLastPrediction = Date.now() - lastPredictionTime
      const timeUntilNext = actualRecoveryTime - (timeSinceLastPrediction % actualRecoveryTime)

      return timeUntilNext > 0 ? timeUntilNext : actualRecoveryTime
    }

    // Set initial timeout for the next recovery
    const initialTimeout = setTimeout(() => {
      setPredictionsRemaining((prev) => {
        const maxEnergy = getMaxEnergy(upgrades)
        if (prev < maxEnergy) {
          return prev + 1
        }
        return prev
      })

      // Set up regular interval after the first recovery
      const recoveryInterval = setInterval(() => {
        setPredictionsRemaining((prev) => {
          const maxEnergy = getMaxEnergy(upgrades)
          if (prev < maxEnergy) {
            return prev + 1
          }
          return prev
        })
      }, actualRecoveryTime)

      return () => clearInterval(recoveryInterval)
    }, calculateNextRecoveryTime())

    return () => clearTimeout(initialTimeout)
  }, [upgrades, lastPredictionTime])

  // Handle test points
  const handleAddTestPoints = (addedPoints: number) => {
    const newPoints = points + addedPoints
    setPoints(newPoints)
    checkForNewBadges(newPoints)
  }

  // Add useEffect to start background music when component mounts
  useEffect(() => {
    // Start background music after a short delay
    const timer = setTimeout(() => {
      playBackgroundMusic()
    }, 2000)

    return () => {
      clearTimeout(timer)
      // Don't stop background music on unmount as it should continue playing
    }
  }, [])

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-r-green-400 border-b-green-400 border-l-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white/70">Loading game...</p>
        <p className="text-white/50 text-sm mt-2">
          {context?.user?.fid ? `Loading user ${context.user.fid}` : "Using test user (fid: 1)"}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full h-full pt-6 pb-24 relative overflow-hidden">
      {/* Test Button for development */}
      <TestButton onAddPoints={handleAddTestPoints} />

      {/* CSS for slot machine animation and result overlay animation */}
      <SlotMachineStyles />

      {/* Racing background with animated road lines */}
      <RaceBackground lineSpeed={lineSpeed} carMovement={carMovement} />

      {/* Race Content */}
      <RaceContent
        isLoading={isLoading}
        displayPrice={displayPrice}
        renderDigitSlot={renderDigitSlot}
        points={points}
        countdownActive={countdownActive}
        countdownTime={countdownTime}
        upgrades={upgrades}
        onUpgrade={handleUpgrade}
        onPointsChange={setPoints}
        cars={cars}
        onBuyCar={handleBuyCar}
        onEquipCar={handleEquipCar}
        items={items}
        onUseItem={handleUseItem}
        doublePointsActive={doublePointsActive}
        doublePointsEndTime={doublePointsEndTime}
      />

      {/* Prediction Controls */}
      <PredictionControls
        predictionsRemaining={predictionsRemaining}
        totalPredictions={maxPredictions}
        onPrediction={handlePrediction}
        lastPredictionTime={lastPredictionTime}
        isPredictionActive={isPredictionActive}
      />

      {/* Result Overlay */}
      {showResultOverlay && (
        <ResultOverlay
          resultOverlayRef={resultOverlayRef}
          predictionResult={predictionResult}
          priceBeforePrediction={priceBeforePrediction}
          priceAfterPrediction={priceAfterPrediction}
          predictionAction={predictionAction}
        />
      )}

      {/* Badge Notification */}
      <BadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />
    </div>
  )
}
