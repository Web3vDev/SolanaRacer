"use client"

import { useEffect, useRef } from "react"

interface RoadLinesSvgProps {
  speed?: number
}

export function RoadLinesSvg({ speed = 5 }: RoadLinesSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>(0)
  const linesRef = useRef<SVGRectElement[]>([])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Set SVG dimensions
    const updateSize = () => {
      svg.setAttribute("width", window.innerWidth.toString())
      svg.setAttribute("height", window.innerHeight.toString())
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    // Create line elements - reduced from 10 to 6
    const lineCount = 6
    const lineHeight = 80
    const lineWidth = 30
    const lineGap = 180 // Increased gap between lines

    // Cố định vị trí X của đường line ở chính giữa SVG
    // Sử dụng 50% thay vì tính toán dựa trên kích thước màn hình
    const svgMiddle = "50%"

    // Clear existing lines
    linesRef.current.forEach((line) => line.remove())
    linesRef.current = []

    // Create new lines
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "rect")

      // Sử dụng thuộc tính x với giá trị phần trăm và transform để căn giữa chính xác
      line.setAttribute("x", svgMiddle)
      line.setAttribute("transform", `translate(-${lineWidth / 2}, 0)`)
      line.setAttribute("y", (-100 - i * lineGap).toString())
      line.setAttribute("width", lineWidth.toString())
      line.setAttribute("height", lineHeight.toString())
      line.setAttribute("fill", "white")
      line.setAttribute("opacity", "0.4") // Reduced opacity from 0.7 to 0.4
      line.setAttribute("rx", "2")

      svg.appendChild(line)
      linesRef.current.push(line)
    }

    // Animation function with dynamic speed
    const animate = () => {
      linesRef.current.forEach((line) => {
        const currentY = Number.parseFloat(line.getAttribute("y") || "0")
        if (currentY > window.innerHeight) {
          // Reset line position when it goes off screen
          line.setAttribute("y", (-100).toString())
        } else {
          // Move line down with current speed
          line.setAttribute("y", (currentY + speed).toString())
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [speed]) // Re-run effect when speed changes

  return <svg ref={svgRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -7 }} />
}
