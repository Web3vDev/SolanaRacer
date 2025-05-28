"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { sdk } from '@farcaster/frame-sdk'
import type { Context } from "@farcaster/frame-sdk"
import { initializeUserData } from "@/lib/user-data-manager"
import { supabase } from "@/lib/supabase"

// Giá trị mặc định cho context khi không có dữ liệu từ Farcaster
const DEFAULT_FARCASTER_CONTEXT: Context.FrameContext = {
  user: {
    fid: 0,
    username: "",
    displayName: "",
    pfpUrl: "",
    location: {
      placeId: "",
      description: "",
    },
  },
  client: {
    clientFid: 0,
    added: false,
    safeAreaInsets: {
      top: 0,
      bottom: 34,
      left: 0,
      right: 0,
    },
  },
  location: {
    type: "launcher"
  }
}

// Định nghĩa kiểu dữ liệu cho context
type FarcasterContextType = {
  context: Context.FrameContext | null
  isLoading: boolean
  isInFarcaster: boolean
}

// Tạo context với giá trị mặc định
const FarcasterContext = createContext<FarcasterContextType>({
  context: null,
  isLoading: true,
  isInFarcaster: false
})

// Hook để sử dụng context
export const useFarcasterContext = () => useContext(FarcasterContext)

// Provider component
export function FarcasterContextProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<Context.FrameContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInFarcaster, setIsInFarcaster] = useState(false)

  useEffect(() => {
    const loadFarcasterContext = async () => {
      try {
        console.log("Đang tải Farcaster context...")
        // Tải context từ SDK
        const sdkContext = await sdk.context
        console.log("Farcaster context đã tải:", sdkContext)
        
        if (sdkContext) {
          setContext(sdkContext)
          setIsInFarcaster(true)
          
          // Kiểm tra và tải hoặc tạo mới dữ liệu user trên Supabase nếu có FID
          if (sdkContext.user?.fid) {
            console.log("Kiểm tra dữ liệu user trên Supabase với FID:", sdkContext.user.fid)
            const userContext = {
              fid: sdkContext.user.fid,
              displayName: sdkContext.user.displayName,
              username: sdkContext.user.username,
              pfpUrl: sdkContext.user.pfpUrl,
            }
            
            try {
              // Kiểm tra user đã tồn tại chưa và tải dữ liệu hoặc tạo mới
              const { data: existingUser, error } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("fid", userContext.fid)
                .single()

              if (error && error.code !== "PGRST116") {
                console.error("Lỗi khi kiểm tra user trên Supabase:", error)
              } else if (existingUser) {
                console.log("Đã tìm thấy user trên Supabase, tải dữ liệu:", existingUser)
                const userData = await initializeUserData(userContext)
                console.log("Dữ liệu user đã được tải:", userData)
              } else {
                console.log("Không tìm thấy user trên Supabase, tạo mới user")
                const userData = await initializeUserData(userContext)
                console.log("Dữ liệu user đã được tạo mới:", userData)
              }
            } catch (supabaseError) {
              console.error("Lỗi khi xử lý dữ liệu user trên Supabase:", supabaseError)
            }
          } else {
            console.log("Không tìm thấy FID trong context, không thể lưu dữ liệu vào Supabase")
          }
        } else {
          console.log("Không tìm thấy Farcaster context, sử dụng giá trị mặc định")
          // Sử dụng giá trị mặc định nếu không có context
          setContext(DEFAULT_FARCASTER_CONTEXT)
        }
        
        // Đăng ký các event listeners
        sdk.on("frameAdded", ({ notificationDetails }) => {
          console.log("Frame added", notificationDetails ? "with notifications" : "")
        })

        sdk.on("frameRemoved", () => {
          console.log("Frame removed")
        })
        
        // Báo cho SDK biết rằng app đã sẵn sàng
        sdk.actions.ready()
      } catch (error) {
        console.error("Lỗi khi tải Farcaster context:", error)
        // Sử dụng giá trị mặc định nếu có lỗi
        setContext(DEFAULT_FARCASTER_CONTEXT)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFarcasterContext()
    
    return () => {
      // Cleanup listeners khi component unmount
      sdk.removeAllListeners()
    }
  }, [])

  return (
    <FarcasterContext.Provider value={{ context, isLoading, isInFarcaster }}>
      {children}
    </FarcasterContext.Provider>
  )
}
