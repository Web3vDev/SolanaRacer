interface PointsBalanceProps {
  points: number
  countdownActive?: boolean
  countdownTime?: number
}

export function PointsBalance({ points, countdownActive = false, countdownTime = 0 }: PointsBalanceProps) {
  return (
    <div className="relative w-full z-10">
      {countdownActive ? (
        <>
          <h2 className="text-sm font-medium text-center mb-2">⏱️ Predicting...</h2>
          <div className="text-center mb-4">
            <span className="text-5xl font-bold text-white">{`00:0${countdownTime}`}</span>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-sm font-medium text-center mb-2">🏆 Your Balance</h2>
          <div className="text-center mb-4">
            <span className="text-5xl font-bold text-white">{points}</span>
          </div>
        </>
      )}
    </div>
  )
}
