"use client"

import type { JSX } from "react"

interface PriceDisplayProps {
  isLoading: boolean
  displayPrice: string
  renderDigitSlot: (digit: string, index: number) => JSX.Element
}

export function PriceDisplay({ isLoading, displayPrice, renderDigitSlot }: PriceDisplayProps) {
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
