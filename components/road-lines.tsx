"use client"

import { useEffect, useRef } from "react"

export function RoadLines() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create multiple line elements
    const lineCount = 10
    const lines: HTMLDivElement[] = []

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement("div")
      line.className = "absolute left-1/2 -translate-x-1/2 bg-white rounded-sm opacity-70"
      line.style.width = "10px"
      line.style.height = "80px"
      line.style.top = `${-100 - i * 120}px`
      lines.push(line)
      container.appendChild(line)
    }

    // Animation function
    let animationId: number
    const speed = 10

    const animate = () => {
      lines.forEach((line) => {
        const currentTop = Number.parseFloat(line.style.top)
        if (currentTop > window.innerHeight) {
          // Reset line position when it goes off screen
          line.style.top = `${-100}px`
        } else {
          // Move line down
          line.style.top = `${currentTop + speed}px`
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      lines.forEach((line) => container.removeChild(line))
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -4 }} />
}
