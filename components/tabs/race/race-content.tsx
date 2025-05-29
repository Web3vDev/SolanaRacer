"use client"

import { useState } from "react"
import { PriceDisplayWidget } from "@/components/shared/price-display-widget"
import { PointsBalance } from "./points-balance"
import { UpgradesModal } from "./upgrades-modal"
// Header is now managed in the main page.tsx
import type { JSX } from "react"
import type { F1Car } from "@/types/f1-car"

interface Upgrade {
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

interface Item {
  id: number
  name: string
  description: string
  icon: string
  quantity: number
  type: "energy_restore" | "double_points"
}

interface RaceContentProps {
  isLoading: boolean
  displayPrice: string
  renderDigitSlot: (digit: string, index: number) => JSX.Element
  points: number
  countdownActive?: boolean
  countdownTime?: number
  upgrades: Upgrade[]
  onUpgrade: (upgradeId: number) => void
  onPointsChange: (newPoints: number) => void
  cars: F1Car[]
  onBuyCar: (carId: number) => void
  onEquipCar: (carId: number) => void
  items?: Item[]
  onUseItem?: (itemId: number) => void
  doublePointsActive?: boolean
  doublePointsEndTime?: number
  showUpgradesModal?: boolean
  setShowUpgradesModal?: (show: boolean) => void
}

export function RaceContent({
  isLoading,
  displayPrice,
  renderDigitSlot,
  points,
  countdownActive = false,
  countdownTime = 0,
  upgrades,
  onUpgrade,
  onPointsChange,
  cars,
  onBuyCar,
  onEquipCar,
  items = [],
  onUseItem = () => {},
  doublePointsActive = false,
  doublePointsEndTime = 0,
  showUpgradesModal = false,
  setShowUpgradesModal = () => {},
}: RaceContentProps) {

  const handleUpgrade = (upgradeId: number) => {
    const upgrade = upgrades.find((u) => u.id === upgradeId)
    if (upgrade) {
      const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level))
      if (points >= cost && upgrade.level < upgrade.maxLevel) {
        onPointsChange(points - cost)
        onUpgrade(upgradeId)
      }
    }
  }

  const handleBuyCar = (carId: number) => {
    const car = cars.find((c) => c.id === carId)
    if (car && points >= car.price && !car.owned) {
      onPointsChange(points - car.price)
      onBuyCar(carId)
    }
  }

  return (
    <div className="relative w-full z-10 mt-8">
      {/* Header removed - now managed in page.tsx */}

      <PointsBalance points={points} countdownActive={countdownActive} countdownTime={countdownTime} />

      <PriceDisplayWidget
        isLoading={isLoading}
        displayPrice={displayPrice}
        renderDigitSlot={renderDigitSlot}
        showWheel={true}
        showUpgradesLink={true}
        onUpgradesClick={() => setShowUpgradesModal(true)}
      />

      {/* Upgrades Modal */}
      {showUpgradesModal && (
        <UpgradesModal
          onClose={() => setShowUpgradesModal(false)}
          points={points}
          upgrades={upgrades}
          onUpgrade={handleUpgrade}
          cars={cars}
          onBuyCar={handleBuyCar}
          onEquipCar={onEquipCar}
          items={items}
          onUseItem={onUseItem}
          doublePointsActive={doublePointsActive}
          doublePointsEndTime={doublePointsEndTime}
        />
      )}
    </div>
  )
}
