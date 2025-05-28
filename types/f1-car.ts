export interface F1Car {
  id: number
  name: string
  team: string
  image: string
  price: number
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
  stats: {
    speed: number
    acceleration: number
    handling: number
    reliability: number
  }
  bonuses: {
    winRateBonus: number
    pointsMultiplier: number
    resistanceBonus: number
  }
  owned: boolean
  isEquipped: boolean
}
