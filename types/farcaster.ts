export interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}

export interface FrameNotificationDetails {
  url: string
  token: string
}

export interface AccountLocation {
  placeId: string
  description: string
}

export interface UserContext {
  fid: number
  username?: string
  displayName?: string
  pfpUrl?: string
  bio?: string
  location?: AccountLocation
}

export interface ClientContext {
  clientFid: number
  added: boolean
  safeAreaInsets?: SafeAreaInsets
  notificationDetails?: FrameNotificationDetails
}

export interface CastEmbedLocationContext {
  type: "cast_embed"
  embed: string
  cast: {
    fid: number
    hash: string
  }
}

export interface NotificationLocationContext {
  type: "notification"
  notification: {
    notificationId: string
    title: string
    body: string
  }
}

export interface LauncherLocationContext {
  type: "launcher"
}

export interface ChannelLocationContext {
  type: "channel"
  channel: {
    key: string
    name: string
    imageUrl?: string
  }
}

export type FrameLocationContext =
  | CastEmbedLocationContext
  | NotificationLocationContext
  | LauncherLocationContext
  | ChannelLocationContext

export interface FrameContext {
  user: UserContext
  location?: FrameLocationContext
  client: ClientContext
}
