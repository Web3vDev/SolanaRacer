import type { F1Car } from "@/types/f1-car"

export const F1_CARS: F1Car[] = [
  {
    id: 0,
    name: "Basic Racer",
    team: "Starter",
    image: "/images/f1-car.png", // Default starter car
    price: 0,
    rarity: "common",
    stats: { speed: 20, acceleration: 20, handling: 20, reliability: 20 },
    bonuses: { winRateBonus: 0, pointsMultiplier: 0, resistanceBonus: 0 },
    owned: true,
    isEquipped: true,
  },
  {
    id: 1,
    name: "Williams FW46",
    team: "Williams Racing",
    image: "/f1-cars/williams-f1.png",
    price: 2500,
    rarity: "common",
    stats: { speed: 45, acceleration: 50, handling: 40, reliability: 55 },
    bonuses: { winRateBonus: 2, pointsMultiplier: 0.05, resistanceBonus: 5 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 2,
    name: "Haas VF-24",
    team: "MoneyGram Haas F1",
    image: "/f1-cars/haas.png",
    price: 3000,
    rarity: "common",
    stats: { speed: 50, acceleration: 45, handling: 45, reliability: 50 },
    bonuses: { winRateBonus: 3, pointsMultiplier: 0.08, resistanceBonus: 8 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 3,
    name: "Kick Sauber C44",
    team: "Stake F1 Team",
    image: "/f1-cars/kick-sauber-c44.png",
    price: 4000,
    rarity: "rare",
    stats: { speed: 55, acceleration: 55, handling: 50, reliability: 60 },
    bonuses: { winRateBonus: 4, pointsMultiplier: 0.12, resistanceBonus: 10 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 4,
    name: "Alpine A524",
    team: "BWT Alpine F1",
    image: "/f1-cars/alpine-a524.png",
    price: 5500,
    rarity: "rare",
    stats: { speed: 60, acceleration: 58, handling: 55, reliability: 65 },
    bonuses: { winRateBonus: 5, pointsMultiplier: 0.15, resistanceBonus: 12 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 5,
    name: "VCARB 01",
    team: "Visa Cash App RB",
    image: "/f1-cars/vcarb.png",
    price: 7000,
    rarity: "rare",
    stats: { speed: 65, acceleration: 62, handling: 60, reliability: 68 },
    bonuses: { winRateBonus: 6, pointsMultiplier: 0.18, resistanceBonus: 15 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 6,
    name: "Aston Martin AMR24",
    team: "Aston Martin Aramco",
    image: "/f1-cars/aston-martin-amr24.png",
    price: 9000,
    rarity: "epic",
    stats: { speed: 70, acceleration: 68, handling: 65, reliability: 72 },
    bonuses: { winRateBonus: 8, pointsMultiplier: 0.22, resistanceBonus: 18 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 7,
    name: "Mercedes W15",
    team: "Mercedes-AMG Petronas",
    image: "/f1-cars/mercedes-amg-w15.png",
    price: 12000,
    rarity: "epic",
    stats: { speed: 75, acceleration: 72, handling: 70, reliability: 78 },
    bonuses: { winRateBonus: 10, pointsMultiplier: 0.25, resistanceBonus: 20 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 8,
    name: "Ferrari SF-24",
    team: "Scuderia Ferrari",
    image: "/f1-cars/ferrari-sf24.png",
    price: 15000,
    rarity: "legendary",
    stats: { speed: 80, acceleration: 78, handling: 75, reliability: 82 },
    bonuses: { winRateBonus: 12, pointsMultiplier: 0.3, resistanceBonus: 25 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 9,
    name: "McLaren MCL38",
    team: "McLaren F1 Team",
    image: "/f1-cars/mclaren-mcl38.png",
    price: 18000,
    rarity: "legendary",
    stats: { speed: 85, acceleration: 82, handling: 80, reliability: 85 },
    bonuses: { winRateBonus: 15, pointsMultiplier: 0.35, resistanceBonus: 28 },
    owned: false,
    isEquipped: false,
  },
  {
    id: 10,
    name: "Red Bull RB20",
    team: "Oracle Red Bull Racing",
    image: "/f1-cars/redbull-rb20.png",
    price: 25000,
    rarity: "mythic",
    stats: { speed: 95, acceleration: 90, handling: 88, reliability: 92 },
    bonuses: { winRateBonus: 20, pointsMultiplier: 0.5, resistanceBonus: 35 },
    owned: false,
    isEquipped: false,
  },
]

export function getCarRarityColor(rarity: F1Car["rarity"]): string {
  switch (rarity) {
    case "common":
      return "text-gray-400 border-gray-400"
    case "rare":
      return "text-blue-400 border-blue-400"
    case "epic":
      return "text-purple-400 border-purple-400"
    case "legendary":
      return "text-yellow-400 border-yellow-400"
    case "mythic":
      return "text-pink-400 border-pink-400"
    default:
      return "text-gray-400 border-gray-400"
  }
}

export function getCarRarityGlow(rarity: F1Car["rarity"]): string {
  switch (rarity) {
    case "common":
      return "shadow-gray-400/20"
    case "rare":
      return "shadow-blue-400/30"
    case "epic":
      return "shadow-purple-400/40"
    case "legendary":
      return "shadow-yellow-400/50"
    case "mythic":
      return "shadow-pink-400/60"
    default:
      return "shadow-gray-400/20"
  }
}

export function getEquippedCar(cars: F1Car[]): F1Car {
  return cars.find((car) => car.isEquipped) || cars[0]
}

export function getTotalCarBonuses(cars: F1Car[]): {
  winRateBonus: number
  pointsMultiplier: number
  resistanceBonus: number
} {
  const equippedCar = getEquippedCar(cars)
  return equippedCar.bonuses
}
