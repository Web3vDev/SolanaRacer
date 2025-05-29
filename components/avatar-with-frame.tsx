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
    xl: "w-24 h-24",
  }

  const frameSize = sizeClasses[size]

  // Kích thước riêng cho avatar và frame
  const avatarSize = frameSize;
  const frameOverlaySize = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28",
    xl: "w-36 h-36",
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${frameOverlaySize} ${className}`}> 
      {/* Frame overlay to hơn avatar */}
      {badgeFrame && (
        <div className={`absolute flex items-center justify-center ${frameOverlaySize} z-20 pointer-events-none`}>
          <Image
            src={badgeFrame.icon || "/placeholder.svg"}
            alt={badgeFrame.name}
            fill
            className="object-contain"
            style={{ imageRendering: "crisp-edges" }}
          />
        </div>
      )}
      {/* Avatar nhỏ hơn, nằm dưới */}
      <div className={`absolute flex items-center justify-center ${avatarSize} z-10`}>
        <Avatar className={`${avatarSize}`}>
          <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
