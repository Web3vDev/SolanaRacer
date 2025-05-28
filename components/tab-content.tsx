import type React from "react"
interface TabContentProps {
  children: React.ReactNode
  isActive: boolean
}

export function TabContent({ children, isActive }: TabContentProps) {
  if (!isActive) return null

  return <div className="w-full h-full flex-1 flex flex-col">{children}</div>
}
