"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MoreVertical, Zap, TrendingUp, Trophy, Star, Coins, Clock, Battery } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import type { F1Car } from "@/types/f1-car"
import { getCarRarityColor, getCarRarityGlow } from "@/utils/f1-car-system"

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

interface UpgradesModalProps {
  onClose: () => void
  points?: number
  upgrades?: Upgrade[]
  onUpgrade: (upgradeId: number) => void
  cars?: F1Car[]
  onBuyCar: (carId: number) => void
  onEquipCar: (carId: number) => void
  items?: Item[]
  onUseItem?: (itemId: number) => void
  doublePointsActive?: boolean
  doublePointsEndTime?: number
}

export function UpgradesModal({
  onClose,
  points = 5815,
  upgrades = [],
  onUpgrade,
  cars = [],
  onBuyCar,
  onEquipCar,
  items = [],
  onUseItem = () => {},
  doublePointsActive = false,
  doublePointsEndTime = 0,
}: UpgradesModalProps) {
  const [activeTab, setActiveTab] = useState("car")
  // State for Points Card dropdown
  const [pointsCardOpen, setPointsCardOpen] = useState(false)

  // Disable scrolling when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  const calculateUpgradeCost = (upgrade: Upgrade) => {
    // Cost increases exponentially with each level
    return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.level))
  }

  const getEffectDescription = (upgrade: Upgrade) => {
    const nextLevelValue = upgrade.effect.value * (upgrade.level + 1)

    switch (upgrade.effect.type) {
      case "pointsBonus":
        return `+${nextLevelValue} points when winning`
      case "pointsMultiplier":
        return `+${nextLevelValue * 10}% more points per win`
      case "recoverySpeed":
        return `${nextLevelValue}% faster energy recovery`
      case "maxEnergy":
        return `+${nextLevelValue} max energy (${20 + nextLevelValue} total)`
      case "comboBonus":
        return `+${nextLevelValue}% combo bonus points`
      default:
        return upgrade.description
    }
  }

  const getUpgradeIcon = (upgrade: Upgrade) => {
    switch (upgrade.effect.type) {
      case "pointsBonus":
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case "pointsMultiplier":
        return <TrendingUp className="w-6 h-6 text-blue-400" />
      case "recoverySpeed":
        return <Clock className="w-6 h-6 text-green-400" />
      case "maxEnergy":
        return <Battery className="w-6 h-6 text-orange-400" />
      case "comboBonus":
        return <Zap className="w-6 h-6 text-purple-400" />
      default:
        return <Star className="w-6 h-6 text-gray-400" />
    }
  }

  const canAfford = (upgrade: Upgrade) => {
    return points >= calculateUpgradeCost(upgrade) && upgrade.level < upgrade.maxLevel
  }

  const canAffordCar = (car: F1Car) => {
    return points >= car.price && !car.owned
  }

  const handleUpgrade = (upgrade: Upgrade) => {
    if (canAfford(upgrade)) {
      onUpgrade(upgrade.id)
    }
  }

  const handleBuyCar = (car: F1Car) => {
    if (canAffordCar(car)) {
      onBuyCar(car.id)
    }
  }

  const handleEquipCar = (car: F1Car) => {
    if (car.owned) {
      onEquipCar(car.id)
    }
  }

  // Calculate total stats from upgrades and equipped car
  const equippedCar = cars.find((car) => car.isEquipped) || cars[0]
  const totalStats = upgrades.reduce(
    (stats, upgrade) => {
      const effectValue = upgrade.effect.value * upgrade.level

      switch (upgrade.effect.type) {
        case "pointsBonus":
          stats.pointsBonus += effectValue
          break
        case "pointsMultiplier":
          stats.pointsMultiplier += effectValue
          break
        case "recoverySpeed":
          stats.recoverySpeed += effectValue
          break
        case "maxEnergy":
          stats.maxEnergy += effectValue
          break
        case "comboBonus":
          stats.comboBonus += effectValue
          break
      }

      return stats
    },
    {
      pointsBonus: 0,
      pointsMultiplier: equippedCar?.bonuses?.pointsMultiplier || 0,
      recoverySpeed: 0,
      maxEnergy: 20,
      comboBonus: 0,
    },
  )

  // Function to calculate stats for a specific car (if it were equipped)
  const calculateCarStats = (car: F1Car) => {
    const carStats = upgrades.reduce(
      (stats, upgrade) => {
        const effectValue = upgrade.effect.value * upgrade.level

        switch (upgrade.effect.type) {
          case "pointsBonus":
            stats.pointsBonus += effectValue
            break
          case "pointsMultiplier":
            stats.pointsMultiplier += effectValue
            break
          case "recoverySpeed":
            stats.recoverySpeed += effectValue
            break
          case "maxEnergy":
            stats.maxEnergy += effectValue
            break
          case "comboBonus":
            stats.comboBonus += effectValue
            break
        }

        return stats
      },
      {
        pointsBonus: 0,
        pointsMultiplier: car.bonuses?.pointsMultiplier || 0,
        recoverySpeed: 0,
        maxEnergy: 20,
        comboBonus: 0,
      },
    )

    return carStats
  }

  const formatTimeRemaining = (endTime: number) => {
    const remaining = Math.max(0, endTime - Date.now())
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/95"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100000,
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex flex-col p-0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100001,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <button onClick={onClose} className="text-white flex items-center hover:text-gray-300 transition-colors">
            <ChevronLeft className="w-6 h-6" />
            <span className="text-base">Back</span>
          </button>

          <div className="flex-1"></div>

          <button className="text-white">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Points Card Dropdown */}
        <div className="p-4">
          <Card className="bg-zinc-900 border border-zinc-700/50 rounded-xl p-4">
            <button
              className="w-full flex justify-between items-center mb-2 focus:outline-none"
              onClick={() => setPointsCardOpen((prev) => !prev)}
              aria-expanded={pointsCardOpen}
            >
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">Available points: </span>
                <span className="text-white text-sm font-bold">{points.toLocaleString()}</span>
              </div>
              <ChevronLeft
                className={`w-6 h-6 text-zinc-400 transition-transform ${pointsCardOpen ? 'rotate-[-90deg]' : 'rotate-180'}`}
              />
            </button>

            {pointsCardOpen && (
              <>
                {doublePointsActive && (
                  <div className="mb-4 p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 text-xs font-medium">💎 Double Points Active</span>
                      <span className="text-purple-200 text-xs">{formatTimeRemaining(doublePointsEndTime)}</span>
                    </div>
                  </div>
                )}

                <div className="h-px bg-zinc-800 my-4"></div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-zinc-400 text-xs">Win Bonus</span>
                    <div className="flex items-center mt-1">
                      <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-white font-bold">+{totalStats.pointsBonus}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-zinc-400 text-xs">Points Multiplier</span>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-white font-bold">+{Math.floor(totalStats.pointsMultiplier * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-zinc-400 text-xs">Recovery Speed</span>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-white font-bold">+{totalStats.recoverySpeed}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-zinc-400 text-xs">Max Energy</span>
                    <div className="flex items-center mt-1">
                      <Battery className="w-4 h-4 text-orange-400 mr-1" />
                      <span className="text-white font-bold">{totalStats.maxEnergy}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800">
          <div className="flex">
            <button
              className={`flex-1 py-2 text-xs font-bold ${activeTab === "racer" ? "text-white border-b-2 border-white" : "text-zinc-500"}`}
              onClick={() => setActiveTab("racer")}
            >
              Racer
            </button>
            <button
              className={`flex-1 py-2 text-xs font-bold ${activeTab === "car" ? "text-white border-b-2 border-white" : "text-zinc-500"}`}
              onClick={() => setActiveTab("car")}
            >
              Car
            </button>
            <button
              className={`flex-1 py-2 text-xs font-bold ${activeTab === "items" ? "text-white border-b-2 border-white" : "text-zinc-500"}`}
              onClick={() => setActiveTab("items")}
            >
              Items
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-20">
          {/* Racer Tab */}
          {activeTab === "racer" && (
            <>
              {upgrades.length > 0 ? (
                upgrades.map((upgrade) => {
                  const cost = calculateUpgradeCost(upgrade)
                  const affordable = canAfford(upgrade)
                  const maxed = upgrade.level >= upgrade.maxLevel

                  return (
                    <Card key={upgrade.id} className="bg-zinc-900 border-zinc-800 rounded-xl overflow-hidden">
                      <div className="flex p-4">
                        <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center">
                          {getUpgradeIcon(upgrade)}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-base font-bold text-white">{upgrade.name}</h3>
                          <p className="text-xs text-zinc-400 mb-2">{getEffectDescription(upgrade)}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Coins className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-zinc-400 text-xs mr-2">
                                {maxed ? "MAX" : `-${cost.toLocaleString()} pts`}
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="text-zinc-400 ml-2 text-xs">
                                Lvl {upgrade.level}/{upgrade.maxLevel}
                              </span>
                            </div>

                            <Button
                              onClick={() => handleUpgrade(upgrade)}
                              disabled={!affordable || maxed}
                              size="sm"
                              className={`h-8 px-3 text-xs ${
                                maxed
                                  ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                  : affordable
                                    ? "bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500"
                                    : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                              }`}
                            >
                              {maxed ? "MAX" : affordable ? "Upgrade" : "Can't afford"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">🏁</div>
                  <h3 className="text-base font-bold text-white mb-2">No Upgrades Available</h3>
                  <p className="text-zinc-400">Upgrades will be available soon!</p>
                </div>
              )}
            </>
          )}

          {/* Car Tab */}
          {activeTab === "car" && (
            <>
              {cars.length > 0 ? (
                cars.map((car) => {
                  const affordable = canAffordCar(car)
                  const carStats = calculateCarStats(car)

                  return (
                    <Card
                      key={car.id}
                      className={`bg-zinc-900 border rounded-xl overflow-hidden ${
                        car.isEquipped
                          ? `${getCarRarityColor(car.rarity)} ${getCarRarityGlow(car.rarity)} bg-white/5`
                          : car.owned
                            ? "border-zinc-700"
                            : "border-zinc-800"
                      }`}
                    >
                      <div className="p-4">
                        {/* Car Image */}
                        <div className="relative w-full h-24 mb-4 bg-zinc-800 rounded-lg overflow-hidden">
                          <Image
                            src={car.image || "/placeholder.svg"}
                            alt={car.name}
                            fill
                            className="object-contain"
                            style={{ imageRendering: "crisp-edges" }}
                          />
                          {car.isEquipped && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              EQUIPPED
                            </div>
                          )}
                        </div>

                        {/* Car Info */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-white">{car.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getCarRarityColor(car.rarity)}`}>
                              {car.rarity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">{car.team}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Speed:</span>
                            <span className="text-white">{car.stats.speed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Acceleration:</span>
                            <span className="text-white">{car.stats.acceleration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Handling:</span>
                            <span className="text-white">{car.stats.handling}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Reliability:</span>
                            <span className="text-white">{car.stats.reliability}</span>
                          </div>
                        </div>

                        {/* System Bonuses - Hiển thị chỉ số tổng hệ thống nếu xe này được trang bị */}
                        <div className="mb-4 p-2 bg-zinc-800 rounded-lg">
                          <p className="text-xs text-zinc-400 mb-1">
                            {car.isEquipped ? "Current System Stats:" : "Stats if equipped:"}
                          </p>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Win Bonus:</span>
                              <span className="text-yellow-400">+{carStats.pointsBonus}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Points Multiplier:</span>
                              <span className="text-blue-400">+{Math.floor(carStats.pointsMultiplier * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Recovery Speed:</span>
                              <span className="text-green-400">+{carStats.recoverySpeed}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-300">Max Energy:</span>
                              <span className="text-orange-400">{carStats.maxEnergy}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-between">
                          <div className="text-xs">
                            {car.price === 0 ? (
                              <span className="text-green-400 font-bold">FREE</span>
                            ) : (
                              <span className="text-white font-bold">{car.price.toLocaleString()} pts</span>
                            )}
                          </div>

                          {car.isEquipped ? (
                            <Button disabled size="sm" className="bg-green-600 text-white cursor-not-allowed">
                              Equipped
                            </Button>
                          ) : car.owned ? (
                            <Button
                              onClick={() => handleEquipCar(car)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Equip
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleBuyCar(car)}
                              disabled={!affordable}
                              size="sm"
                              className={
                                affordable
                                  ? "bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500"
                                  : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                              }
                            >
                              {affordable ? "Buy" : "Can't afford"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">🏎️</div>
                  <h3 className="text-base font-bold text-white mb-2">No Cars Available</h3>
                  <p className="text-zinc-400">Cars will be available soon!</p>
                </div>
              )}
            </>
          )}

          {/* Items Tab */}
          {activeTab === "items" && (
            <>
              {items.length > 0 ? (
                items.map((item) => (
                  <Card key={item.id} className="bg-zinc-900 border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex p-4">
                      <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-zinc-800 flex items-center justify-center text-2xl">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white">{item.name}</h3>
                        <p className="text-xs text-zinc-400 mb-2">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-zinc-400 mr-2">Quantity: {item.quantity}</span>
                          </div>

                          <Button
                            onClick={() => onUseItem(item.id)}
                            disabled={item.quantity <= 0}
                            size="sm"
                            className={`h-8 px-3 text-xs ${
                              item.quantity > 0
                                ? "bg-gradient-to-r from-purple-500 to-green-400 hover:from-purple-600 hover:to-green-500"
                                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                            }`}
                          >
                            {item.quantity > 0 ? "Use" : "Out of stock"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-3xl mb-4">📦</div>
                  <h3 className="text-base font-bold text-white mb-2">No Items</h3>
                  <p className="text-zinc-400">Complete tasks to earn items!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
