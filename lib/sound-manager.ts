"use client"

export type SoundType = "notification" | "correct" | "wrong" | "button" | "nav" | "background"

interface SoundConfig {
  src: string
  volume: number
  loop: boolean
  preload: boolean
}

interface CachedSound {
  audio: HTMLAudioElement
  lastUsed: number
  config: SoundConfig
}

class SoundManager {
  private sounds: Map<SoundType, SoundConfig> = new Map()
  private audioCache: Map<SoundType, CachedSound> = new Map()
  private isEnabled = true
  private masterVolume = 1.0
  private backgroundMusic: HTMLAudioElement | null = null
  private isInitialized = false
  private initPromise: Promise<void> | null = null

  constructor() {
    // Định nghĩa cấu hình âm thanh
    this.sounds.set("notification", {
      src: "/sounds/notification.mp3",
      volume: 0.7,
      loop: false,
      preload: true,
    })

    this.sounds.set("correct", {
      src: "/sounds/correct.mp3",
      volume: 0.8,
      loop: false,
      preload: true,
    })

    this.sounds.set("wrong", {
      src: "/sounds/wrong.mp3",
      volume: 0.8,
      loop: false,
      preload: true,
    })

    this.sounds.set("button", {
      src: "/sounds/bump-dump-button-sound.mp3",
      volume: 0.6,
      loop: false,
      preload: true,
    })

    this.sounds.set("nav", {
      src: "/sounds/nav-button-click.mp3",
      volume: 0.5,
      loop: false,
      preload: true,
    })

    this.sounds.set("background", {
      src: "/sounds/background-sound.mp3",
      volume: 0.3,
      loop: true,
      preload: true,
    })

    // Load settings từ localStorage
    this.loadSettings()
  }

  // Khởi tạo sound manager
  async initialize(): Promise<void> {
    if (this.isInitialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = this.doInitialize()
    return this.initPromise
  }

  private async doInitialize(): Promise<void> {
    try {
      // Preload tất cả sounds cần thiết
      const preloadPromises: Promise<void>[] = []

      for (const [soundType, config] of this.sounds.entries()) {
        if (config.preload) {
          preloadPromises.push(this.preloadSound(soundType, config))
        }
      }

      await Promise.allSettled(preloadPromises)
      this.isInitialized = true
      console.log("Sound Manager initialized successfully")
    } catch (error) {
      console.error("Failed to initialize Sound Manager:", error)
    }
  }

  // Preload một sound cụ thể
  private async preloadSound(soundType: SoundType, config: SoundConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()

      // Set up event listeners
      const onCanPlayThrough = () => {
        audio.removeEventListener("canplaythrough", onCanPlayThrough)
        audio.removeEventListener("error", onError)

        // Cache the audio
        this.audioCache.set(soundType, {
          audio,
          lastUsed: Date.now(),
          config,
        })

        resolve()
      }

      const onError = (error: Event) => {
        audio.removeEventListener("canplaythrough", onCanPlayThrough)
        audio.removeEventListener("error", onError)
        console.warn(`Failed to preload sound: ${soundType}`, error)
        reject(error)
      }

      audio.addEventListener("canplaythrough", onCanPlayThrough)
      audio.addEventListener("error", onError)

      // Configure audio
      audio.preload = "auto"
      audio.volume = config.volume * this.masterVolume
      audio.loop = config.loop

      // Start loading
      audio.src = config.src
      audio.load()

      // Timeout fallback
      setTimeout(() => {
        if (!this.audioCache.has(soundType)) {
          console.warn(`Preload timeout for sound: ${soundType}`)
          resolve() // Resolve anyway to not block initialization
        }
      }, 5000)
    })
  }

  // Phát âm thanh
  async play(soundType: SoundType, options?: { volume?: number; playbackRate?: number }): Promise<void> {
    if (!this.isEnabled) return

    try {
      // Ensure initialized
      await this.initialize()

      let cachedSound = this.audioCache.get(soundType)

      // Nếu chưa có trong cache, tạo mới
      if (!cachedSound) {
        const config = this.sounds.get(soundType)
        if (!config) {
          console.warn(`Sound config not found: ${soundType}`)
          return
        }

        await this.preloadSound(soundType, config)
        cachedSound = this.audioCache.get(soundType)

        if (!cachedSound) {
          console.warn(`Failed to create sound: ${soundType}`)
          return
        }
      }

      const { audio, config } = cachedSound

      // Reset audio nếu đang phát
      if (!audio.paused) {
        audio.currentTime = 0
      }

      // Apply options
      if (options?.volume !== undefined) {
        audio.volume = Math.min(1, Math.max(0, options.volume * this.masterVolume))
      } else {
        audio.volume = config.volume * this.masterVolume
      }

      if (options?.playbackRate !== undefined) {
        audio.playbackRate = options.playbackRate
      }

      // Update last used time
      cachedSound.lastUsed = Date.now()

      // Play audio
      const playPromise = audio.play()
      if (playPromise) {
        await playPromise
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error)
    }
  }

  // Phát nhạc nền
  async playBackgroundMusic(): Promise<void> {
    if (!this.isEnabled) return

    try {
      await this.initialize()

      if (this.backgroundMusic && !this.backgroundMusic.paused) {
        return // Already playing
      }

      const cachedSound = this.audioCache.get("background")
      if (cachedSound) {
        this.backgroundMusic = cachedSound.audio
        this.backgroundMusic.loop = true
        this.backgroundMusic.volume = this.sounds.get("background")!.volume * this.masterVolume

        await this.backgroundMusic.play()
      }
    } catch (error) {
      console.warn("Failed to play background music:", error)
    }
  }

  // Dừng nhạc nền
  stopBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause()
      this.backgroundMusic.currentTime = 0
    }
  }

  // Bật/tắt âm thanh
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    this.saveSettings()

    if (!enabled) {
      this.stopBackgroundMusic()
      // Stop all playing sounds
      for (const [, cachedSound] of this.audioCache) {
        if (!cachedSound.audio.paused) {
          cachedSound.audio.pause()
        }
      }
    }
  }

  // Kiểm tra trạng thái âm thanh
  isAudioEnabled(): boolean {
    return this.isEnabled
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.min(1, Math.max(0, volume))
    this.saveSettings()

    // Update volume for all cached sounds
    for (const [soundType, cachedSound] of this.audioCache) {
      const config = this.sounds.get(soundType)
      if (config) {
        cachedSound.audio.volume = config.volume * this.masterVolume
      }
    }
  }

  // Get master volume
  getMasterVolume(): number {
    return this.masterVolume
  }

  // Lưu settings vào localStorage
  private saveSettings(): void {
    try {
      const settings = {
        enabled: this.isEnabled,
        masterVolume: this.masterVolume,
        timestamp: Date.now(),
      }
      localStorage.setItem("solrace_sound_settings", JSON.stringify(settings))
    } catch (error) {
      console.warn("Failed to save sound settings:", error)
    }
  }

  // Load settings từ localStorage
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem("solrace_sound_settings")
      if (saved) {
        const settings = JSON.parse(saved)
        this.isEnabled = settings.enabled ?? true
        this.masterVolume = settings.masterVolume ?? 1.0
      }
    } catch (error) {
      console.warn("Failed to load sound settings:", error)
      // Use defaults
      this.isEnabled = true
      this.masterVolume = 1.0
    }
  }

  // Cleanup unused sounds từ cache
  cleanup(): void {
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes

    for (const [soundType, cachedSound] of this.audioCache) {
      if (now - cachedSound.lastUsed > maxAge && cachedSound.audio.paused) {
        // Don't cleanup background music or frequently used sounds
        if (soundType !== "background" && soundType !== "button" && soundType !== "nav") {
          this.audioCache.delete(soundType)
        }
      }
    }
  }

  // Destroy sound manager
  destroy(): void {
    this.stopBackgroundMusic()

    for (const [, cachedSound] of this.audioCache) {
      cachedSound.audio.pause()
      cachedSound.audio.src = ""
    }

    this.audioCache.clear()
    this.isInitialized = false
    this.initPromise = null
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager()
  }
  return soundManagerInstance
}

// Convenience functions
export async function playSound(
  soundType: SoundType,
  options?: { volume?: number; playbackRate?: number },
): Promise<void> {
  const manager = getSoundManager()
  return manager.play(soundType, options)
}

export async function playBackgroundMusic(): Promise<void> {
  const manager = getSoundManager()
  return manager.playBackgroundMusic()
}

export function stopBackgroundMusic(): void {
  const manager = getSoundManager()
  manager.stopBackgroundMusic()
}

export function toggleSound(): boolean {
  const manager = getSoundManager()
  const newState = !manager.isAudioEnabled()
  manager.setEnabled(newState)
  return newState
}

export function isSoundEnabled(): boolean {
  const manager = getSoundManager()
  return manager.isAudioEnabled()
}

export function setMasterVolume(volume: number): void {
  const manager = getSoundManager()
  manager.setMasterVolume(volume)
}

export function getMasterVolume(): number {
  const manager = getSoundManager()
  return manager.getMasterVolume()
}

// Initialize sound manager when module loads
if (typeof window !== "undefined") {
  // Auto-initialize after a short delay to avoid blocking
  setTimeout(() => {
    getSoundManager().initialize()
  }, 1000)

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    if (soundManagerInstance) {
      soundManagerInstance.destroy()
    }
  })

  // Periodic cleanup
  setInterval(() => {
    if (soundManagerInstance) {
      soundManagerInstance.cleanup()
    }
  }, 60000) // Every minute
}
