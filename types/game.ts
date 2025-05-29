// Game related types

export interface Upgrade {
  id: number
  name: string
  description: string
  baseCost: number
  icon: string
  level: number
  maxLevel: number
  effect: {
    type: "pointsBonus" | "pointsMultiplier" | "recoverySpeed" | "maxEnergy" | "comboBonus"
    value: number
  }
}
