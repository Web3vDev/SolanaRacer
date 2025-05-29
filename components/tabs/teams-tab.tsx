"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Clock, ArrowLeft, Flame, Rocket } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { RaceBackground } from "@/components/race-background"
import { PriceDisplayWidget } from "@/components/shared/price-display-widget"
import { RaceNotification } from "@/components/race-notification"
import { DigitSlot } from "./race/digit-slot"
import { initializePriceService, subscribeToPriceUpdates, getCurrentPrice } from "@/lib/price-service"

// Import sound functions at the top
import { playSound } from "@/lib/sound-manager"

interface RaceTrack {
  id: number
  name: string
  country: string
  svg: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  entryFee: number
  maxReward: number
  playersOnline: number
}

interface Opponent {
  id: string
  name: string
  avatar: string
  level: number
  winRate: number
}

interface RaceState {
  currentRound: number
  userScore: number
  opponentScore: number
  userPredictions: ("pump" | "dump")[]
  opponentPredictions: ("pump" | "dump")[]
  roundResults: ("win" | "lose" | "tie")[]
  isRacing: boolean
  countdown: number
  currentPrice: string
  priceDirection: "up" | "down" | "neutral"
  showResult: boolean
  raceFinished: boolean
  spinningDigits: { [key: number]: boolean }
}

interface TeamsTabProps {
  onRaceStateChange?: (isRacing: boolean) => void
}

const raceTracks: RaceTrack[] = [
  {
    id: 1,
    name: "Yas Marina Circuit",
    country: "Abu Dhabi",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="26" fill="none" viewBox="0 0 40 26">
      <path stroke="#fff" d="m16.711 1 21.643.1a.46.46 0 0 1 .287.097c1.256 1.013-1.057 1.271-2.693 1.277a.51.51 0 0 0-.488.358l-.233.759a.478.478 0 0 1-.178.25c-.88.627-3.002 1.859-5.46 2.455-3.235.784-3.137.294-4.51 1.274-1.023.731-1.388 3.334-1.46 4.796a.512.512 0 0 1-.283.437l-4.293 2.104a.5.5 0 0 1-.662-.215L12.653 3.874a.5.5 0 0 0-.655-.219l-1.14.536a.5.5 0 0 0-.164.125L8.439 6.918a.5.5 0 0 0-.062.564l2.65 4.936c.02.037.035.075.045.116l.276 1.102a.5.5 0 0 1-.28.577l-2.087.936a.5.5 0 0 1-.613-.168l-1.181-1.668a.492.492 0 0 0-.63-.154c-.84.439-2.064 1.135-2.266 1.471-.294.49-.882 2.942-.784 3.53.072.431 1.683 3.525 2.683 5.4a.5.5 0 0 1-.249.697l-2.116.887c-.236.099-.507.001-.662-.203-.247-.327-.599-.659-.93-.603-.589.098-.883.588-1.178-.687-.294-1.274.589-7.452 2.55-12.943C5.044 6.68 7.528 4.322 8.862 3.454A.536.536 0 0 0 9.1 2.88l-.229-.913a.5.5 0 0 1 .522-.62l4.523.335a.5.5 0 0 0 .163-.015l2.504-.65A.5.5 0 0 1 16.711 1Z"/>
    </svg>`,
    difficulty: "Hard",
    entryFee: 500,
    maxReward: 2000,
    playersOnline: 24,
  },
  {
    id: 2,
    name: "Albert Park Circuit",
    country: "Australia",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="21" fill="none" viewBox="0 0 40 21">
      <path stroke="#fff" d="M15.915 19.7h13.162c3.2 0 3.1-.7 2.8-1.9-.3-1.2 0-1.6 1.4-1.1s3.3.6 3.6 0l1.872-3.746a.5.5 0 0 0-.231-.674L32 9.16a.5.5 0 0 0-.26-.048l-5.193.464a.529.529 0 0 0-.404.26c-.358.6-1.04 1.52-1.729 1.752a.418.418 0 0 1-.078.017c-4.467.59-5.764-.309-7.46-1.605-1.7-1.3-2.9-5-3.6-6-.7-1-3.7-3-5.1-3-1.4 0-2.5 1.2-3.2 1.8-.43.369-1.162.525-1.69.578a.546.546 0 0 0-.49.424l-.208 1.044a.5.5 0 0 1-.034.105L1.408 7.528a.5.5 0 0 0-.04.15l-.365 3.379a.5.5 0 0 0 .15.413l2.644 2.56c.165.159.2.408.089.608-.338.605-.786 1.438-.948 1.848-.052.133-.002.27.114.354 2.013 1.436 8.179 1.057 9.925.96 1.242-.069 2.078.9 2.455 1.595a.56.56 0 0 0 .483.305Z"/>
    </svg>`,
    difficulty: "Medium",
    entryFee: 300,
    maxReward: 1200,
    playersOnline: 18,
  },
  {
    id: 3,
    name: "Red Bull Ring",
    country: "Austria",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="21" fill="none" viewBox="0 0 40 21">
      <path stroke="#fff" d="M15.915 19.7h13.162c3.2 0 3.1-.7 2.8-1.9-.3-1.2 0-1.6 1.4-1.1s3.3.6 3.6 0l1.872-3.746a.5.5 0 0 0-.231-.674L32 9.16a.5.5 0 0 0-.26-.048l-5.193.464a.529.529 0 0 0-.404.26c-.358.6-1.04 1.52-1.729 1.752a.418.418 0 0 1-.078.017c-4.467.59-5.764-.309-7.46-1.605-1.7-1.3-2.9-5-3.6-6-.7-1-3.7-3-5.1-3-1.4 0-2.5 1.2-3.2 1.8-.43.369-1.162.525-1.69.578a.546.546 0 0 0-.49.424l-.208 1.044a.5.5 0 0 1-.034.105L1.408 7.528a.5.5 0 0 0-.04.15l-.365 3.379a.5.5 0 0 0 .15.413l2.644 2.56c.165.159.2.408.089.608-.338.605-.786 1.438-.948 1.848-.052.133-.002.27.114.354 2.013 1.436 8.179 1.057 9.925.96 1.242-.069 2.078.9 2.455 1.595a.56.56 0 0 0 .483.305Z"/>
    </svg>`,
    difficulty: "Easy",
    entryFee: 200,
    maxReward: 800,
    playersOnline: 32,
  },
  {
    id: 4,
    name: "Circuit Gilles Villeneuve",
    country: "Canada",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="23" fill="none" viewBox="0 0 40 23">
      <path stroke="#fff" d="m35.92 20.765 2.683.938a.298.298 0 0 0 .219-.555c-.891-.396-2.597-1.194-3.517-1.769-.919-.574-3.517-3.961-4.945-5.913a.992.992 0 0 1-.148-.872l.166-.552a.989.989 0 0 0-.192-.925c-.924-1.087-2.657-3.055-4.272-4.67-1.64-1.64-4.046-2.753-5.393-3.235a.944.944 0 0 0-.855.123l-1.015.703a1 1 0 0 1-1.164-.019l-3.202-2.371a1 1 0 0 0-.838-.167l-1.885.471a1 1 0 0 1-.243.03H9.131a1 1 0 0 1-.76-.349l-.243-.284a1 1 0 0 0-.955-.33l-1.735.347c-1.283.36-3.941 1.201-4.31 1.694-.213.282-.131.645.035.961.2.382.686.449 1.07.256l.28-.14a1 1 0 0 1 1.123.158l3.068 2.812a1 1 0 0 0 .268.176l8.091 3.612a1 1 0 0 1 .529.562l.183.49a1 1 0 0 0 .46.528l3.367 1.824 6.62 3.233 4.24 1.817c.047.02.095.037.145.05l5.314 1.366Z"/>
    </svg>`,
    difficulty: "Medium",
    entryFee: 350,
    maxReward: 1400,
    playersOnline: 21,
  },
  {
    id: 5,
    name: "Shanghai International Circuit",
    country: "China",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="28" fill="none" viewBox="0 0 42 28">
      <path stroke="#fff" d="M20.611 1.866c-.34.975-5.776 15.07-8.597 22.38a.875.875 0 0 1-.815.56c-2.08.011-5.319.077-7.087.122-2.438.063-3.875 1.75-2.688 1.75 1.188 0 24.188-.062 31.063 0 6.874.063 7.312.313 8.562-2.187 1.25-2.5-1.829-3.875-3.375-3.188-1.125.5.75 2.688-.688 2.688-.812 0-12.812-.188-13.562-.5-.75-.313-1.657-2.84-1-3.438.688-.625 3.133 1.255 4.938-.375 1.937-1.75.25-2.875-1-5.75s.75-5.25 2.687-5.25c1.319 0 7.875.563 9.188 0 1.24-.531 1.208-1.17.75-1.437-.75-.438-6.25-1.813-7.063-1.813-1.313 0-8.025 1.163-8.875 1.063-1.063-.125-2.875-2.313-1.625-3.063s1.563 1.709 2.75 1.313c1.125-.375 1.313-1.75.688-2.875-.587-1.055-3.813-1.25-4.25 0Z"/>
    </svg>`,
    difficulty: "Hard",
    entryFee: 450,
    maxReward: 1800,
    playersOnline: 16,
  },
  {
    id: 6,
    name: "Suzuka International Racing Course",
    country: "Japan",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="22" fill="none" viewBox="0 0 40 22">
      <path stroke="#fff" d="M16.234 20.841c3.09 0 3.89-1.82 3.928-3.061.009-.292.203-.563.492-.606a.533.533 0 0 0 .448-.58 47.972 47.972 0 0 1-.203-4.416c0-2.871.564-2.666 4.921-5.793 4.357-3.127 10.663-5.331 11.79-5.383 1.128-.05 1.436.718 1.385 1.64-.052.924-.718 2.308-2.512 1.898-1.794-.41-3.742-1.077-6.152 0-2.409 1.076-2.768 2.46-3.178 3.69-.41 1.23 1.435 4.153.872 4.255-.395.072-1.107-1.055-1.53-1.842a1.048 1.048 0 0 0-.48-.458l-4.332-2.002a1 1 0 0 0-1.256.36l-.942 1.442a1.036 1.036 0 0 0-.147.753c.275 1.511.556 4.177-.08 5.336-.87 1.589-2.716 2.306-3.331 2.306-.616 0-1.64-2.665-2.717-2.665-1.077 0-1.897 1.128-2.717 1.64-.82.513-2.05-.461-3.025-.512-.974-.052-.769.512-1.538.974-.615.369-1.794.153-2.306 0-.735-.154-2.276-.257-2.563.563-.36 1.026.973 2.461 1.486 2.461h13.687Z"/>
    </svg>`,
    difficulty: "Expert",
    entryFee: 600,
    maxReward: 2500,
    playersOnline: 12,
  },
  {
    id: 7,
    name: "Las Vegas Street Circuit",
    country: "Las Vegas",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="39" height="24" fill="none" viewBox="0 0 39 24">
      <path stroke="#fff" d="M33.125 3.313c-.4-.7 0-1.834.25-2.313 1.52 1.833 4.563 5.313 4.563 6.875v13.938l-.75.437v.813h-24c-1 0-12.188-6.375-12.188-6.375l.813-3.125s1.46-1.05 2.437-1.376c2.625-.874 3.25-2.312 3.25-3.25V1.75l2.25.375c.083-.208.375-.625.875-.625 3.125.25 3.563 2.438 3.563 3.25v3.313c6 0 18.325-.213 19.624-1.063 1.626-1.063-.187-2.813-.687-3.688Z"/>
    </svg>`,
    difficulty: "Hard",
    entryFee: 550,
    maxReward: 2200,
    playersOnline: 19,
  },
  {
    id: 8,
    name: "Jeddah Corniche Circuit",
    country: "Saudi Arabia",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="none" viewBox="0 0 40 24">
      <path stroke="#fff" d="m32.056 5.031 5.938-3.864c.644-.502 1.217.144.93 1.718-.286 1.574-2.075 4.365-4.006 6.082-1.932 1.717-4.293 1.43-5.08 1.288-.787-.143-2.647.286-2.862.93-.215.644-1.073 1.788-2.29 1.86-1.216.072-3.648 1.431-4.006 2.29-.358.858-1.717 2.074-2.433 2.074-.715 0-2.146.43-2.504 1.074-.358.643-2.504 1.86-3.22 2.146-.715.286-1.574.286-1.788 0-.215-.286-.644-.715-1.217-.5-.572.214-2.003.07-2.36 0-.358-.072-1.074.285-2.004.572-.93.286-1.717 1.788-2.29 2.146-.572.358-1.287.286-1.788-.43-.4-.572.882-1.24 1.574-1.502 1.36-.572 4.164-1.76 4.508-1.932.429-.214 1.788 0 2.432-.357.644-.358 1.789-.072 2.003.214.215.287.501.716 2.147.358 1.645-.358 1.001-1.789 1.645-2.218.644-.43 1.646-.286 2.576-.43.667-.102.962-.979 1.05-1.537a.53.53 0 0 1 .153-.305c.307-.292.835-.75 1.23-.947.445-.223 2.053-1.095 2.865-1.537a.5.5 0 0 1 .144-.052l1.509-.292a.43.43 0 0 0 .275-.66.43.43 0 0 1 .083-.568l6.786-5.62Z"/>
    </svg>`,
    difficulty: "Expert",
    entryFee: 650,
    maxReward: 2600,
    playersOnline: 8,
  },
  {
    id: 9,
    name: "Losail International Circuit",
    country: "Qatar",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="27" fill="none" viewBox="0 0 37 27">
      <path stroke="#fff" d="M33.87 26.117H6.307c-1.904 0-2.73-2.41-1.228-3.579l3.28-2.55a1 1 0 0 0-.078-1.633l-3.997-2.543a1 1 0 0 1-.416-.54L1.095 6.554a2 2 0 0 1 1.33-2.522l1.262-.379A2.007 2.007 0 0 1 6.14 4.866a326.23 326.23 0 0 0 1.84 4.751c1 2.5 1.5 1 2-3.5s1.5-5.5 3-5 1 1.5 1.5 3 2.5 3 3 4-1.5 4-.5 5.5 4-.5 6.5-3 3-8.5 4.5-8.5h2.8a3 3 0 0 1 2.573 1.457l1.063 1.771a3 3 0 0 1-.214 3.397l-3.789 4.823a1 1 0 0 0-.062 1.148l5.216 8.344c.832 1.332-.126 3.06-1.696 3.06Z"/>
    </svg>`,
    difficulty: "Medium",
    entryFee: 400,
    maxReward: 1600,
    playersOnline: 14,
  },
  {
    id: 10,
    name: "Ethereum World Circuit",
    country: "Ethereum World",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="45" fill="none" viewBox="0 0 36 45">
      <path fill="#fff" d="M29.872 32.432h-4.267V7.255c0-4-3.258-7.255-7.262-7.255h-.84c-4.004 0-7.26 3.255-7.26 7.255v25.177h-4.27A5.982 5.982 0 0 0 0 38.407a5.982 5.982 0 0 0 5.974 5.974h23.897a5.982 5.982 0 0 0 5.975-5.974 5.981 5.981 0 0 0-5.974-5.975Zm-19.63 10.242H5.974a4.272 4.272 0 0 1-4.267-4.267 4.272 4.272 0 0 1 4.267-4.268h4.268v8.535Zm1.707-35.42c0-2.912 2.26-5.303 5.12-5.525v.831a.853.853 0 1 0 1.708 0v-.83c2.86.222 5.12 2.613 5.12 5.526v5.548H11.95V7.255Zm11.949 26.032v9.388H11.949V14.51h11.949v18.777Zm5.974 9.388h-4.267V34.14h4.267a4.272 4.272 0 0 1 4.268 4.268 4.273 4.273 0 0 1-4.268 4.267Z"/>
    </svg>`,
    difficulty: "Expert",
    entryFee: 750,
    maxReward: 3000,
    playersOnline: 6,
  },
]

// Mock opponents
const mockOpponents: Opponent[] = [
  { id: "1", name: "SpeedRacer", avatar: "/diverse-avatars.png", level: 12, winRate: 68 },
  { id: "2", name: "CryptoKing", avatar: "/diverse-avatars.png", level: 15, winRate: 72 },
  { id: "3", name: "SolMaster", avatar: "/diverse-avatars.png", level: 8, winRate: 61 },
  { id: "4", name: "RocketFuel", avatar: "/diverse-avatars.png", level: 20, winRate: 79 },
  { id: "5", name: "DiamondHands", avatar: "/diverse-avatars.png", level: 11, winRate: 65 },
  { id: "6", name: "MoonRider", avatar: "/diverse-avatars.png", level: 17, winRate: 74 },
]

export default function TeamsTab({ onRaceStateChange }: TeamsTabProps) {
  const [selectedTrack, setSelectedTrack] = useState<RaceTrack | null>(null)
  const [currentOpponent, setCurrentOpponent] = useState<Opponent | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState<any>(null)
  const [raceState, setRaceState] = useState<RaceState>({
    currentRound: 1,
    userScore: 0,
    opponentScore: 0,
    userPredictions: [],
    opponentPredictions: [],
    roundResults: [],
    isRacing: false,
    countdown: 0,
    currentPrice: "205.000",
    priceDirection: "neutral",
    showResult: false,
    raceFinished: false,
    spinningDigits: {},
  })

  const countdownRef = useRef<number | null>(null)
  const spinTimeouts = useRef<number[]>([])
  const priceUnsubscribeRef = useRef<(() => void) | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/20"
      case "Medium":
        return "text-yellow-400 bg-yellow-400/20"
      case "Hard":
        return "text-red-400 bg-red-400/20"
      case "Expert":
        return "text-purple-400 bg-purple-400/20"
      default:
        return "text-gray-400 bg-gray-400/20"
    }
  }

  // Generate random opponent
  const getRandomOpponent = () => {
    return mockOpponents[Math.floor(Math.random() * mockOpponents.length)]
  }

  // Function to render a single digit slot (same as home page)
  const renderDigitSlot = (digit: string, index: number) => {
    return (
      <DigitSlot
        key={index}
        digit={digit}
        index={index}
        isSpinning={raceState.spinningDigits[index]}
        displayPrice={raceState.currentPrice}
        priceDirection={raceState.priceDirection}
      />
    )
  }

  // Start race
  const handleJoinRace = async (track: RaceTrack) => {
    setSelectedTrack(track)
    setCurrentOpponent(getRandomOpponent())

    // Initialize price service
    await initializePriceService()

    // Subscribe to price updates
    const unsubscribe = subscribeToPriceUpdates((newPrice) => {
      setRaceState((prev) => {
        const prevPrice = prev.currentPrice

        // Determine price direction for color change
        const prevDecimal = Number.parseInt(prevPrice.split(".")[1] || "0", 10)
        const newDecimal = Number.parseInt(newPrice.split(".")[1] || "0", 10)

        let newDirection: "up" | "down" | "neutral" = "neutral"
        if (newDecimal > prevDecimal) {
          newDirection = "up"
        } else if (newDecimal < prevDecimal) {
          newDirection = "down"
        }

        // Clear any existing timeouts
        spinTimeouts.current.forEach((timeout) => clearTimeout(timeout))
        spinTimeouts.current = []

        // Track which digits are spinning by comparing with previous price
        const newSpinningDigits: { [key: number]: boolean } = {}

        // Compare each digit and only animate those that change
        newPrice.split("").forEach((digit, index) => {
          if (
            digit !== "." && // Don't animate decimal point
            (index >= prevPrice.length || digit !== prevPrice[index])
          ) {
            newSpinningDigits[index] = true
          }
        })

        // Get positions of digits that are spinning
        const spinningPositions = Object.keys(newSpinningDigits).map(Number)

        // Set timeouts to stop spinning for each digit
        spinningPositions.forEach((position) => {
          const isDecimalPart = position > newPrice.indexOf(".")
          const positionFactor = isDecimalPart ? position - newPrice.indexOf(".") : 0
          const delay = 300 + positionFactor * 100

          const timeout = window.setTimeout(() => {
            setRaceState((prev) => {
              const updated = { ...prev.spinningDigits }
              delete updated[position]
              return { ...prev, spinningDigits: updated }
            })
          }, delay)

          spinTimeouts.current.push(timeout)
        })

        return {
          ...prev,
          currentPrice: newPrice,
          priceDirection: newDirection,
          spinningDigits: newSpinningDigits,
        }
      })
    })

    priceUnsubscribeRef.current = unsubscribe

    const newRaceState = {
      currentRound: 1,
      userScore: 0,
      opponentScore: 0,
      userPredictions: [],
      opponentPredictions: [],
      roundResults: [],
      isRacing: true,
      countdown: 0,
      currentPrice: getCurrentPrice(),
      priceDirection: "neutral" as const,
      showResult: false,
      raceFinished: false,
      spinningDigits: {},
    }
    setRaceState(newRaceState)
    onRaceStateChange?.(true)
  }

  // Handle prediction
  const handlePrediction = (prediction: "pump" | "dump") => {
    if (raceState.countdown > 0 || raceState.currentRound > 6) return

    // Play button sound
    playSound("button")

    // Generate opponent prediction (with some AI logic)
    const opponentPrediction: "pump" | "dump" = Math.random() > 0.5 ? "pump" : "dump"

    // Start countdown
    setRaceState((prev) => ({
      ...prev,
      countdown: 4,
      userPredictions: [...prev.userPredictions, prediction],
      opponentPredictions: [...prev.opponentPredictions, opponentPrediction],
    }))

    // Start countdown timer
    let timeLeft = 4
    countdownRef.current = window.setInterval(() => {
      timeLeft--
      if (timeLeft <= 0) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current)
        }
        resolveRound(prediction, opponentPrediction)
      } else {
        setRaceState((prev) => ({ ...prev, countdown: timeLeft }))
      }
    }, 1000)
  }

  // Resolve round result
  const resolveRound = (userPrediction: "pump" | "dump", opponentPrediction: "pump" | "dump") => {
    // Determine actual price movement (random for now)
    const actualDirection: "pump" | "dump" = Math.random() > 0.5 ? "pump" : "dump"

    // Check who was correct
    const userCorrect = userPrediction === actualDirection
    const opponentCorrect = opponentPrediction === actualDirection

    let roundResult: "win" | "lose" | "tie"
    let userPoints = 0
    let opponentPoints = 0

    if (userCorrect && !opponentCorrect) {
      roundResult = "win"
      userPoints = 100
    } else if (!userCorrect && opponentCorrect) {
      roundResult = "lose"
      opponentPoints = 100
    } else {
      roundResult = "tie"
      if (userCorrect && opponentCorrect) {
        userPoints = 50
        opponentPoints = 50
      }
    }

    setRaceState((prev) => ({
      ...prev,
      countdown: 0,
      userScore: prev.userScore + userPoints,
      opponentScore: prev.opponentScore + opponentPoints,
      roundResults: [...prev.roundResults, roundResult],
      priceDirection: actualDirection === "pump" ? "up" : "down",
    }))

    // Show notification
    setNotificationData({
      roundNumber: raceState.currentRound,
      userPrediction,
      opponentPrediction,
      actualDirection: actualDirection === "pump" ? "up" : "down",
      userCorrect,
      opponentCorrect,
    })
    setShowNotification(true)

    // Play result sound based on round result
    if (roundResult === "win") {
      playSound("correct")
    } else if (roundResult === "lose") {
      playSound("wrong")
    } else {
      // For tie, play a neutral notification sound
      playSound("notification")
    }

    // Move to next round after notification
    setTimeout(() => {
      setRaceState((prev) => {
        const nextRound = prev.currentRound + 1
        if (nextRound > 6) {
          // Race finished
          return {
            ...prev,
            raceFinished: true,
            currentRound: nextRound,
          }
        } else {
          return {
            ...prev,
            currentRound: nextRound,
          }
        }
      })
    }, 1300) // Wait for notification to close
  }

  // Handle back button click
  const handleBackClick = () => {
    if (raceState.isRacing && !raceState.raceFinished) {
      setShowExitConfirm(true)
    } else {
      handleBackToTracks()
    }
  }

  // Confirm exit race
  const handleConfirmExit = () => {
    setShowExitConfirm(false)
    handleBackToTracks()
  }

  // Back to track selection
  const handleBackToTracks = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
    if (priceUnsubscribeRef.current) {
      priceUnsubscribeRef.current()
    }
    spinTimeouts.current.forEach((timeout) => clearTimeout(timeout))
    spinTimeouts.current = []

    setSelectedTrack(null)
    setCurrentOpponent(null)
    setRaceState({
      currentRound: 1,
      userScore: 0,
      opponentScore: 0,
      userPredictions: [],
      opponentPredictions: [],
      roundResults: [],
      isRacing: false,
      countdown: 0,
      currentPrice: "205.000",
      priceDirection: "neutral",
      showResult: false,
      raceFinished: false,
      spinningDigits: {},
    })
    onRaceStateChange?.(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
      if (priceUnsubscribeRef.current) {
        priceUnsubscribeRef.current()
      }
      spinTimeouts.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  // Racing interface
  if (selectedTrack && currentOpponent) {
    return (
      <div className="flex flex-col items-center w-full h-full pt-6 pb-24 relative overflow-hidden">
        {/* Racing background with animated road lines - same as home page */}
        <RaceBackground
          lineSpeed={raceState.countdown > 0 ? 15 : 5}
          carMovement={raceState.countdown > 0 ? "pump" : "none"}
        />

        {/* Header */}
        <div className="relative w-full z-10 flex items-center justify-between mb-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold text-white">{selectedTrack.name}</h2>
            <p className="text-sm text-white/70">{selectedTrack.country}</p>
          </div>

          <div className="text-right">
            <div className="text-sm text-white/80">Round {raceState.currentRound}/6</div>
            <div className="text-xs text-white/60">Entry: {selectedTrack.entryFee} pts</div>
          </div>
        </div>

        {/* Race Status - Compact version with predicting info */}
        <div className="relative w-full max-w-[90%] z-10 backdrop-blur-md bg-white/10 rounded-xl p-4 mb-2 border border-white/20">
          {/* Competitors */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">YOU</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">You</p>
                <p className="text-lg font-bold text-green-400">{raceState.userScore}</p>
              </div>
            </div>

            <div className="text-center">
              {raceState.countdown > 0 ? (
                <div className="text-center">
                  <span className="text-sm text-yellow-400 font-bold">Predicting...</span>
                  <div className="text-lg font-bold text-white">{raceState.countdown}s</div>
                </div>
              ) : (
                <p className="text-xs text-white/70">VS</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div>
                <p className="text-sm font-bold text-right text-white">{currentOpponent.name}</p>
                <p className="text-lg font-bold text-red-400 text-right">{raceState.opponentScore}</p>
              </div>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </div>
            </div>
          </div>

          {/* Round History - moved here */}
          {raceState.roundResults.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-xs text-white/70 mb-2">Round History</p>
              <div className="flex gap-2 justify-center">
                {raceState.roundResults.map((result, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      result === "win" ? "bg-green-500" : result === "lose" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Display - using shared component */}
        <div className="relative w-full max-w-[90%] z-10 backdrop-blur-md bg-white/10 rounded-xl p-6 mb-4 border border-white/20">
          <PriceDisplayWidget
            isLoading={false}
            displayPrice={raceState.currentPrice}
            renderDigitSlot={renderDigitSlot}
            showWheel={false}
            showUpgradesLink={false}
            compact={true}
          />
        </div>

        {/* Race Finished */}
        {raceState.raceFinished && (
          <div className="relative w-full max-w-[90%] z-10 backdrop-blur-md bg-white/10 rounded-xl p-6 mb-4 border border-white/20 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">
              {raceState.userScore > raceState.opponentScore
                ? "🏆 YOU WIN!"
                : raceState.userScore < raceState.opponentScore
                  ? "💔 YOU LOSE!"
                  : "🤝 TIE!"}
            </h3>
            <div className="flex justify-center gap-8 mb-4">
              <div>
                <p className="text-sm text-white/70">Your Score</p>
                <p className="text-2xl font-bold text-green-400">{raceState.userScore}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Opponent Score</p>
                <p className="text-2xl font-bold text-red-400">{raceState.opponentScore}</p>
              </div>
            </div>
            {raceState.userScore > raceState.opponentScore && (
              <p className="text-sm text-green-400">+{selectedTrack.maxReward} points earned!</p>
            )}
            <Button
              onClick={handleBackToTracks}
              className="mt-4 bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500"
            >
              Race Again
            </Button>
          </div>
        )}

        {/* Prediction Buttons - always visible, not hidden during countdown */}
        {!raceState.raceFinished && (
          <div className="relative w-full max-w-[90%] z-10 backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20 shadow-lg mt-auto mb-4">
            <p className="text-white/80 text-sm mb-3 font-medium text-center">Guess the SOL price in the next 4 secs</p>

            <div className="flex justify-center gap-16 w-full">
              <button
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-3 px-6 uppercase shadow-[0_4px_0_0_#b91c1c,0_6px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_0_0_#b91c1c,0_4px_6px_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all ${
                  raceState.countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePrediction("dump")}
                disabled={raceState.countdown > 0}
                style={{
                  borderRadius: "100px",
                  paddingLeft: "calc(1.5rem + 10px)",
                  paddingRight: "calc(1.5rem + 10px)",
                  position: "relative",
                }}
              >
                <Flame className="w-5 h-5" strokeWidth={2.5} />
                DUMP
              </button>

              <button
                className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-3 px-6 uppercase shadow-[0_4px_0_0_#16a34a,0_6px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_2px_0_0_#16a34a,0_4px_6px_rgba(0,0,0,0.4)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all ${
                  raceState.countdown > 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePrediction("pump")}
                disabled={raceState.countdown > 0}
                style={{
                  borderRadius: "100px",
                  paddingLeft: "calc(1.5rem + 10px)",
                  paddingRight: "calc(1.5rem + 10px)",
                  position: "relative",
                }}
              >
                PUMP
                <Rocket className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* Race Notification */}
        {notificationData && (
          <RaceNotification
            show={showNotification}
            roundNumber={notificationData.roundNumber}
            userPrediction={notificationData.userPrediction}
            opponentPrediction={notificationData.opponentPrediction}
            actualDirection={notificationData.actualDirection}
            userCorrect={notificationData.userCorrect}
            opponentCorrect={notificationData.opponentCorrect}
            onClose={() => setShowNotification(false)}
          />
        )}

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full border border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-4">Exit Race?</h3>
              <p className="text-zinc-400 mb-6">
                Leaving now will count as a loss. Are you sure you want to exit the race?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowExitConfirm(false)} className="flex-1">
                  Continue Racing
                </Button>
                <Button onClick={handleConfirmExit} className="flex-1 bg-red-600 hover:bg-red-700">
                  Exit Race
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Track selection interface
  return (
    <div className="flex flex-col w-full h-full p-4 pt-4 pb-15">
      <h2 className="text-2xl font-bold text-center mb-2">Race Tracks</h2>
      <p className="text-center text-zinc-400 text-sm mb-2">Choose your track and race against opponents!</p>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {raceTracks.map((track) => (
          <Card key={track.id} className="p-4 bg-zinc-900 border-0 hover:bg-zinc-800 transition-colors">
            <div className="flex items-center gap-4">
              {/* Track SVG */}
              <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center p-2">
                <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: track.svg }} />
              </div>

              {/* Track Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{track.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(track.difficulty)}`}>
                    {track.difficulty}
                  </span>
                </div>

                <p className="text-sm text-zinc-400 mb-2">{track.country}</p>

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>Max: {track.maxReward} pts</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{track.playersOnline} online</span>
                  </div>
                </div>
              </div>

              {/* Entry Fee & Join Button */}
              <div className="text-right">
                <p className="text-sm font-bold text-white mb-1">{track.entryFee} pts</p>
                <p className="text-xs text-zinc-400 mb-2">Entry Fee</p>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500 text-white font-bold text-xs px-3 py-1"
                  onClick={() => handleJoinRace(track)}
                >
                  Join Race
                </Button>
              </div>
            </div>

            {/* Race Format Info */}
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>6 predictions • Best score wins</span>
                </div>
                <span>1v1 Race</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-zinc-400">Races Won</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-xs text-zinc-400">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-zinc-400">Win Streak</p>
        </div>
      </div>
    </div>
  )
}
