"use client"

interface TestButtonProps {
  onAddPoints: (points: number) => void
}

export function TestButton({ onAddPoints }: TestButtonProps) {
  const handleClick = () => {
    onAddPoints(1000)
  }

  return (
    <button
      onClick={handleClick}
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg shadow-lg transition-colors duration-200"
      style={{ fontSize: "12px" }}
    >
      +1000 PTS
    </button>
  )
}
