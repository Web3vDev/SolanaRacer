interface PriceDisplayProps {
  price: string
}

export function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <div className="text-center w-full">
      <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold">${price}</p>
    </div>
  )
}
