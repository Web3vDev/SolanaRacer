"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Smartphone, Bell, Shield } from "lucide-react"
import { useFarcasterContext } from "@/hooks/use-farcaster-context"

export function FarcasterInfoCard() {
  const { context, isLoading, isInFarcaster } = useFarcasterContext()

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-0 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-zinc-700 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
            <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!isInFarcaster || !context) {
    return (
      <Card className="bg-zinc-900 border-0 p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          Farcaster Context
        </h3>
        <div className="text-center py-4">
          <p className="text-zinc-400 text-sm">Not running in Farcaster</p>
          <p className="text-zinc-500 text-xs mt-1">Open this app in Farcaster to see context data</p>
        </div>
      </Card>
    )
  }

  const getLocationDisplay = () => {
    if (!context.location) return "N/A"

    switch (context.location.type) {
      case "cast_embed":
        return `Cast Embed (FID: ${context.location.cast.fid})`
      case "notification":
        return `Notification: ${context.location.notification.title}`
      case "launcher":
        return "Launcher"
      case "channel":
        return `Channel: ${context.location.channel.name}`
      default:
        return "Unknown"
    }
  }

  const getLocationColor = () => {
    if (!context.location) return "text-zinc-400"

    switch (context.location.type) {
      case "cast_embed":
        return "text-blue-400"
      case "notification":
        return "text-yellow-400"
      case "launcher":
        return "text-green-400"
      case "channel":
        return "text-purple-400"
      default:
        return "text-zinc-400"
    }
  }

  return (
    <Card className="bg-zinc-900 border-0 p-4">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-purple-400" />
        Farcaster Context
      </h3>

      {/* User Info */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-2">User</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">FID:</span>
            <span className="text-white">{context.user.fid || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Username:</span>
            <span className="text-white">@{context.user.username || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Display Name:</span>
            <span className="text-white">{context.user.displayName || "N/A"}</span>
          </div>
          {context.user.location && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Location:
              </span>
              <span className="text-white text-xs">{context.user.location.description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Launch Context */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-zinc-300 mb-2">Launch Context</h4>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Opened from:</span>
          <Badge variant="outline" className={`text-xs ${getLocationColor()} border-current`}>
            {getLocationDisplay()}
          </Badge>
        </div>
      </div>

      {/* Client Info */}
      <div>
        <h4 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-1">
          <Smartphone className="w-3 h-3" />
          Client
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Client FID:</span>
            <span className="text-white">{context.client.clientFid || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Added to Client:</span>
            <Badge variant={context.client.added ? "default" : "secondary"} className="text-xs">
              {context.client.added ? "Yes" : "No"}
            </Badge>
          </div>
          {context.client.notificationDetails && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1">
                <Bell className="w-3 h-3" />
                Notifications:
              </span>
              <Badge variant="default" className="text-xs bg-green-600">
                Enabled
              </Badge>
            </div>
          )}
          {context.client.safeAreaInsets && (
            <div className="mt-2 p-2 bg-zinc-800 rounded text-xs">
              <div className="text-zinc-400 mb-1">Safe Area Insets:</div>
              <div className="grid grid-cols-2 gap-1 text-zinc-300">
                <span>Top: {context.client.safeAreaInsets.top}px</span>
                <span>Bottom: {context.client.safeAreaInsets.bottom}px</span>
                <span>Left: {context.client.safeAreaInsets.left}px</span>
                <span>Right: {context.client.safeAreaInsets.right}px</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
