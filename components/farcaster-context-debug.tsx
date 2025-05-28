"use client"

import { useState } from "react"
import { useFarcasterContext } from "@/contexts/farcaster-context-provider"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FarcasterContextDebug() {
  const { context, isLoading, isInFarcaster } = useFarcasterContext()
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (isLoading) return <div className="p-2 bg-black/80 text-xs">Đang tải Farcaster context...</div>
  
  return (
    <div className="w-full bg-black/80 text-xs">
      <div 
        className="p-2 flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="font-bold">Farcaster Context {isInFarcaster ? '✅' : '❌'}</div>
        <div className="flex items-center gap-2">
          <span>FID: {context?.user?.fid || 'None'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-2 overflow-auto max-h-60">
          <div className="mb-1">SDK Loaded: {context ? 'Yes' : 'No'}</div>
          <div className="mb-1">Username: {context?.user?.username || 'None'}</div>
          <div className="mb-1">Display Name: {context?.user?.displayName || 'None'}</div>
          <div className="mb-1">Safe Area Insets:</div>
          <div className="pl-4">
            Top: {context?.client?.safeAreaInsets?.top || 0}, 
            Bottom: {context?.client?.safeAreaInsets?.bottom || 0}, 
            Left: {context?.client?.safeAreaInsets?.left || 0}, 
            Right: {context?.client?.safeAreaInsets?.right || 0}
          </div>
          <div className="mt-2 mb-1 font-bold">Full Context:</div>
          <pre className="whitespace-pre-wrap break-all text-[10px]">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
