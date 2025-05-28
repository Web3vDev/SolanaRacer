import { RoadLinesSvg } from "@/components/road-lines-svg"
import { RaceCarImage } from "@/components/race-car-image"

interface RaceBackgroundProps {
  lineSpeed?: number
  carMovement?: "none" | "pump" | "dump"
}

export const RaceBackground = ({ lineSpeed = 5, carMovement = "none" }: RaceBackgroundProps) => {
  return (
    <>
      {/* Fixed position background that covers the entire viewport */}
      <div className="fixed inset-0 bg-black" style={{ zIndex: -10 }}></div>

      {/* Road lines animation - behind the car but above background */}
      <RoadLinesSvg speed={lineSpeed} />

      {/* Car image with full opacity */}
      <div className="fixed inset-0 w-full h-full overflow-visible opacity-100" style={{ zIndex: -5 }}>
        <RaceCarImage movement={carMovement} />
      </div>

      {/* Black filter overlay with blur effect and opacity */}
      <div
        className="fixed inset-0 bg-black opacity-70 backdrop-blur-lg pointer-events-none"
        style={{ zIndex: -3 }}
      ></div>

      {/* Vignette effect overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          background: "radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      ></div>
    </>
  )
}
