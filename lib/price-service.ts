"use client"

let basePrice = 205
let currentPrice = "205.000"
let priceListeners: ((price: string) => void)[] = []
let animationInterval: number | null = null
let isInitialized = false

// Fetch the base Solana price
async function fetchSolanaPrice() {
  try {
    // Sử dụng Alchemy API để lấy giá SOL
    const apiKey = "v2MzjsPi-TGJea0bGjbewHY7Zg5AMuaO"

    try {
      // Thử gọi API thực tế (có thể gặp lỗi CORS)
      const response = await fetch(`https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-symbol?symbols=SOL`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()

      // Kiểm tra dữ liệu trả về và lấy giá SOL
      if (data && data.data && data.data.length > 0 && data.data[0].prices && data.data[0].prices.length > 0) {
        const price = Number.parseFloat(data.data[0].prices[0].value)
        basePrice = Math.floor(price)
      }
    } catch (apiError) {
      console.warn("Could not fetch from Alchemy API directly, using fallback:", apiError)

      // Fallback: Sử dụng CoinGecko API như trước đây
      const fallbackResponse = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")

      if (!fallbackResponse.ok) {
        throw new Error("Fallback API request failed")
      }

      const fallbackData = await fallbackResponse.json()
      const price = fallbackData.solana.usd

      // Store the integer part of the price
      basePrice = Math.floor(price)
    }
  } catch (error) {
    console.error("Error fetching Solana price:", error)
    // Keep the default price in case of error
  }
}

// Initialize price service
export async function initializePriceService() {
  if (isInitialized) return

  await fetchSolanaPrice()

  // Set up price animation
  const animatePrice = () => {
    // Generate random decimal values between 0 and 999
    const decimals = Math.floor(Math.random() * 1000)
    const formattedDecimals = decimals.toString().padStart(3, "0")
    const newPrice = `${basePrice}.${formattedDecimals}`

    currentPrice = newPrice

    // Notify all listeners
    priceListeners.forEach((listener) => listener(newPrice))
  }

  // Initial animation
  animatePrice()

  // Set up interval for animation - 2s interval
  animationInterval = window.setInterval(animatePrice, 2000)

  // Refresh base price every 2 minutes
  setInterval(fetchSolanaPrice, 120000)

  isInitialized = true
}

// Subscribe to price updates
export function subscribeToPriceUpdates(callback: (price: string) => void) {
  priceListeners.push(callback)

  // Immediately call with current price
  callback(currentPrice)

  // Return unsubscribe function
  return () => {
    priceListeners = priceListeners.filter((listener) => listener !== callback)
  }
}

// Get current price
export function getCurrentPrice() {
  return currentPrice
}

// Get base price
export function getBasePrice() {
  return basePrice
}

// Cleanup
export function cleanupPriceService() {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
  priceListeners = []
  isInitialized = false
}
