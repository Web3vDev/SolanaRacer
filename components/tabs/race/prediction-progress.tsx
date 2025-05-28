interface PredictionProgressProps {
  predictionsRemaining: number
  totalPredictions: number
}

export function PredictionProgress({ predictionsRemaining, totalPredictions }: PredictionProgressProps) {
  return (
    <div className="w-full flex items-center justify-between mb-6">
      {/* Left side - Icon */}
      <div className="flex items-center">
        <div className="mb-2 ml-1">
          <svg width="28" height="28" viewBox="0 0 323 460" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M171.114 460C112.464 448.5 -3.81382 396.29 0.0961807 280.14H0.351742C-0.823813 257.14 9.75618 199.308 61.4039 152.49C126.034 93.9678 140.626 74.3922 137.994 0C161.556 13.8 208.706 55.3278 209.856 110.4C208.995 128.962 205.669 147.327 199.966 165.012C190.664 192.382 206.074 215.382 229.074 216.532C252.304 217.58 269.324 201.48 270.806 173.088C289.206 191.488 325.316 241.168 322.096 293.148C317.956 358.11 285.654 381.314 265.516 393.658C259.332 397.466 251.077 400.583 241.954 404.059C217.216 413.438 185.987 425.296 171.088 460M263.778 52.21V68.77C263.65 71.53 261.12 79.4522 252.278 88.4478C243.538 97.52 241.34 111.448 241.34 117.172C241.287 125.539 243.885 133.707 248.761 140.506C253.636 147.305 260.539 152.386 268.48 155.02C271.445 147.021 276.786 140.121 283.763 135.24C292.963 130.18 293.218 118.91 292.963 113.39C289.924 90.4308 279.71 69.0185 263.778 52.21ZM69.0961 241.5V287.5H138.096V368H184.096V287.5H253.096V241.5H69.0961Z"
              fill="url(#paint0_linear_2018_132)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2018_132"
                x1="241.392"
                y1="32.5322"
                x2="-1.33514"
                y2="364.729"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9945FF" />
                <stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Center - Progress bar */}
      <div className="flex-1 mx-3">
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${(predictionsRemaining / totalPredictions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Right side - Count */}
      <div className="text-xs text-white font-medium">
        {predictionsRemaining}/{totalPredictions}
      </div>
    </div>
  )
}
