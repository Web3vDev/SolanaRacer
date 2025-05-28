"use client"

import { SVGWheelSpin } from "@/components/svg-wheel-spin"
import { SlotMachineStyles } from "@/components/tabs/race/slot-machine-styles"
import type { JSX } from "react"

interface PriceDisplayWidgetProps {
  isLoading: boolean
  displayPrice: string
  renderDigitSlot: (digit: string, index: number) => JSX.Element
  showWheel?: boolean
  showUpgradesLink?: boolean
  onUpgradesClick?: () => void
  className?: string
  compact?: boolean
}

export function PriceDisplayWidget({
  isLoading,
  displayPrice,
  renderDigitSlot,
  showWheel = true,
  showUpgradesLink = false,
  onUpgradesClick,
  className = "",
  compact = false,
}: PriceDisplayWidgetProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <SlotMachineStyles />

      {showWheel && (
        <div className="relative w-full max-w-[90%] mx-auto mt-4">
          <div className="w-full flex flex-col items-center">
            <SVGWheelSpin />
            <div className="w-[80%] mt-[-45%] mb-[10%] text-center">
              <div className="text-[10px] text-center mb-[0%] text-white/70 mt-[-4%]">SOLANA PRICE</div>
              <PriceDisplay isLoading={isLoading} displayPrice={displayPrice} renderDigitSlot={renderDigitSlot} />
              {showUpgradesLink && (
                <p
                  className="text-sm text-white/80 mt-12 font-bold cursor-pointer hover:text-white transition-colors active:scale-95"
                  onClick={onUpgradesClick}
                >
                  🏎️ Upgrades &gt;
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!showWheel && (
        <div className="text-center w-full">
          <div className={`text-white/70 mb-2 ${compact ? "text-xs" : "text-sm"}`}>SOLANA PRICE</div>
          <PriceDisplay isLoading={isLoading} displayPrice={displayPrice} renderDigitSlot={renderDigitSlot} />
        </div>
      )}
    </div>
  )
}

function PriceDisplay({
  isLoading,
  displayPrice,
  renderDigitSlot,
}: {
  isLoading: boolean
  displayPrice: string
  renderDigitSlot: (digit: string, index: number) => JSX.Element
}) {
  return (
    <div className="text-center w-full mb-[3%] mt-4">
      {isLoading ? (
        <p className="text-3xl font-bold opacity-50">$---</p>
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="mr-2 text-3xl font-bold text-white">$</div>
          {displayPrice.split("").map((digit, index) => renderDigitSlot(digit, index))}
        </div>
      )}
    </div>
  )
}
