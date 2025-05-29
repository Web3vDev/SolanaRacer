import { F1Car } from "@/types/f1-car"
import { Upgrade } from "@/types/game"
import { getTotalCarBonuses } from "@/utils/f1-car-system"

// Calculate current success rate with car bonuses
export const getCurrentSuccessRate = (baseSuccessRate: number, cars: F1Car[]) => {
  const carBonuses = getTotalCarBonuses(cars)
  return Math.min(baseSuccessRate + carBonuses.winRateBonus, 95) // Cap at 95%
}

// Calculate points multiplier from upgrades and car bonuses
export const getPointsMultiplier = (upgrades: Upgrade[], cars: F1Car[]) => {
  const upgradeMultiplier = upgrades.reduce((total, upgrade) => {
    if (upgrade.effect.type === "pointsMultiplier") {
      return total + upgrade.effect.value * upgrade.level
    }
    return total
  }, 1) // Base multiplier is 1

  const carBonuses = getTotalCarBonuses(cars)
  return upgradeMultiplier + carBonuses.pointsMultiplier
}

// Calculate win bonus points
export const getWinBonus = (upgrades: Upgrade[]) => {
  const winBonusUpgrade = upgrades.find((u) => u.effect.type === "pointsBonus")
  return winBonusUpgrade ? winBonusUpgrade.effect.value * winBonusUpgrade.level : 0
}

// Calculate combo bonus
export const getComboBonus = (upgrades: Upgrade[], winStreak: number) => {
  const comboUpgrade = upgrades.find((u) => u.effect.type === "comboBonus")
  if (comboUpgrade && comboUpgrade.level > 0 && winStreak >= 2) {
    return Math.floor((comboUpgrade.effect.value * comboUpgrade.level * winStreak) / 100)
  }
  return 0
}

// Calculate recovery speed
export const getRecoverySpeed = (upgrades: Upgrade[]) => {
  const recoveryUpgrade = upgrades.find((u) => u.effect.type === "recoverySpeed")
  return recoveryUpgrade ? recoveryUpgrade.effect.value * recoveryUpgrade.level : 0
}

// Calculate max energy
export const getMaxEnergy = (upgrades: Upgrade[]) => {
  const maxEnergyUpgrade = upgrades.find((u) => u.effect.type === "maxEnergy")
  return 20 + (maxEnergyUpgrade ? maxEnergyUpgrade.effect.value * maxEnergyUpgrade.level : 0)
}
