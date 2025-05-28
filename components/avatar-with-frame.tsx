"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BadgeFrame } from "@/types/badge-frame"

interface AvatarWithFrameProps {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
  badgeFrame?: BadgeFrame | null
  className?: string
}

export function AvatarWithFrame({
  src,
  alt = "User avatar",
  fallback = "SR",
  size = "md",
  badgeFrame,
  className = "",
}: AvatarWithFrameProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  }

  const frameSize = sizeClasses[size]

  return (
    <div className={`relative ${frameSize} ${className}`}>
      {/* Avatar */}
      <Avatar className={`${frameSize} relative z-10`}>
        <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      {/* Badge Frame Overlay */}
      {badgeFrame && (
        <div className={`absolute inset-0 ${frameSize} z-20 pointer-events-none`}>
          <Image
            src={badgeFrame.icon || "/placeholder.svg"}
            alt={badgeFrame.name}
            fill
            className="object-contain"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
      )}
    </div>
  )
}
