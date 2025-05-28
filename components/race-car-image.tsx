"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface RaceCarImageProps {
  movement?: "none" | "pump" | "dump"
}

export function RaceCarImage({ movement = "none" }: RaceCarImageProps) {
  const [animationClass, setAnimationClass] = useState("")

  useEffect(() => {
    if (movement === "none") {
      setAnimationClass("")
      return
    }

    // Set animation class based on movement type
    if (movement === "pump") {
      setAnimationClass("car-pump-animation")
    } else if (movement === "dump") {
      setAnimationClass("car-dump-animation")
    }

    // Clear animation class after animation completes
    const timer = setTimeout(() => {
      setAnimationClass("")
    }, 3000) // Match the duration in RaceTab

    return () => clearTimeout(timer)
  }, [movement])

  return (
    <div className="relative w-full h-[300px]">
      <style jsx global>{`
        .car-container {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          bottom: -700px; /* Adjusted from -750px to make car more visible */
          z-index: -10;
          transition: bottom 0.3s ease-out; /* Add smooth transition for any position changes */
        }
        
        .car-image {
          object-fit: contain;
          transform: rotate(90deg) scale(2.2);
          transform-origin: center;
        }
        
        @keyframes carPumpAnimation {
          0% { transform: translateY(0) rotate(0deg); }
          10% { transform: translateY(-25px) rotate(-2deg); } /* Increased upward movement */
          30% { transform: translateY(-15px) rotate(2deg); } /* Keep car higher */
          50% { transform: translateY(-20px) rotate(-1deg); } /* Keep car higher */
          70% { transform: translateY(-10px) rotate(1deg); } /* Gradually return */
          90% { transform: translateY(-5px) rotate(0deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes carDumpAnimation {
          0% { transform: translateY(0) rotate(0deg); }
          10% { transform: translateY(-30px) rotate(3deg); } /* Significant upward movement */
          30% { transform: translateY(-20px) rotate(-3deg); } /* Keep car higher */
          50% { transform: translateY(-25px) rotate(4deg); } /* Keep car higher */
          70% { transform: translateY(-15px) rotate(-4deg); } /* Gradually return */
          90% { transform: translateY(-5px) rotate(1deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .car-pump-animation {
          animation: carPumpAnimation 3s ease-in-out;
        }

        .car-dump-animation {
          animation: carDumpAnimation 3s ease-in-out;
        }
      `}</style>

      <div className="car-container">
        <div className={`relative w-full h-full ${animationClass}`}>
          <Image src="/images/f1-car.png" alt="Racing car" fill className="car-image" priority />
        </div>
      </div>
    </div>
  )
}
