// "use client"

// import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
// import type { FrameContext } from "@/types/farcaster"

// interface FarcasterContextType {
//   context: FrameContext | null
//   isLoading: boolean
//   isInFarcaster: boolean
// }

// const FarcasterContext = createContext<FarcasterContextType>({
//   context: null,
//   isLoading: true,
//   isInFarcaster: false,
// })

// export function FarcasterProvider({ children }: { children: ReactNode }) {
//   const [context, setContext] = useState<FrameContext | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isInFarcaster, setIsInFarcaster] = useState(false)

//   useEffect(() => {
//     const initializeFarcasterContext = async () => {
//       try {
//         // Check if we're running in a Farcaster environment
//         if (typeof window !== "undefined" && window.parent !== window) {
//           // Try to access Farcaster SDK
//           const sdk = (window as any).sdk

//           if (sdk && sdk.context) {
//             setContext(sdk.context)
//             setIsInFarcaster(true)
//           } else {
//             // Try to get context from postMessage API
//             const getContextFromParent = () => {
//               return new Promise<FrameContext | null>((resolve) => {
//                 const timeout = setTimeout(() => resolve(null), 2000)

//                 const handleMessage = (event: MessageEvent) => {
//                   if (event.data && event.data.type === "farcaster_context") {
//                     clearTimeout(timeout)
//                     window.removeEventListener("message", handleMessage)
//                     resolve(event.data.context)
//                   }
//                 }

//                 window.addEventListener("message", handleMessage)

//                 // Request context from parent
//                 window.parent.postMessage({ type: "get_farcaster_context" }, "*")
//               })
//             }

//             const parentContext = await getContextFromParent()
//             if (parentContext) {
//               setContext(parentContext)
//               setIsInFarcaster(true)
//             }
//           }
//         }
//       } catch (error) {
//         console.log("Not running in Farcaster environment")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     initializeFarcasterContext()
//   }, [])

//   return <FarcasterContext.Provider value={{ context, isLoading, isInFarcaster }}>{children}</FarcasterContext.Provider>
// }

// export function useFarcasterContext() {
//   const context = useContext(FarcasterContext)
//   if (context === undefined) {
//     throw new Error("useFarcasterContext must be used within a FarcasterProvider")
//   }
//   return context
// }
