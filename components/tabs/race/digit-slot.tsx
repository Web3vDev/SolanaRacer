interface DigitSlotProps {
  digit: string
  index: number
  isSpinning: boolean
  displayPrice: string
  priceDirection: string
  spinDelay?: number
}

export function DigitSlot({ digit, index, isSpinning, displayPrice, priceDirection, spinDelay = 0 }: DigitSlotProps) {
  // Special case for decimal point
  if (digit === ".") {
    return (
      <div key={`decimal-${index}`} className="flex items-center justify-center mx-[1px]">
        <span className="text-3xl text-white">.</span>
      </div>
    )
  }

  const digitValue = Number.parseInt(digit, 10)

  // Calculate spin delay based on position
  const isDecimalPart = index > displayPrice.indexOf(".")
  const calculatedSpinDelay = isDecimalPart ? (index - displayPrice.indexOf(".")) * 0.1 : 0

  // Determine digit color based on position and price direction
  let digitColor = "text-white"
  if (isDecimalPart && priceDirection !== "neutral") {
    digitColor = priceDirection === "up" ? "text-green-400" : "text-red-400"
  }

  return (
    <div
      key={`digit-${index}`}
      className={`relative w-[35px] h-[48px] mx-[1px] bg-zinc-800 rounded-md overflow-hidden shadow-md ${
        isDecimalPart ? "decimal-digit" : ""
      }`}
    >
      {/* Static container to prevent layout shifts */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {isSpinning ? (
          <div className="h-[48px] w-[35px] overflow-hidden">
            <div
              className={`casino-reel ${isDecimalPart ? digitColor : ""}`}
              style={{
                animationDelay: `${spinDelay || calculatedSpinDelay}s`,
                animationDuration: `${0.3 + (spinDelay || calculatedSpinDelay)}s`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, digitValue].map((num, i) => (
                <div key={i} className="casino-digit">
                  {num}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`casino-digit static-digit ${isDecimalPart ? digitColor : ""}`}>{digitValue}</div>
        )}
      </div>

      {/* Top shadow overlay */}
      <div className="absolute top-0 left-0 right-0 h-[10px] bg-gradient-to-b from-zinc-900 to-transparent pointer-events-none z-10"></div>

      {/* Bottom shadow overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-10"></div>
    </div>
  )
}
