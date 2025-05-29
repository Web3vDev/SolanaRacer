"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="bottom-nav fixed bottom-4 left-0 right-0 flex justify-center items-center px-4 z-40">
      <div className="max-w-3xl w-full">
        <Tabs defaultValue="home" value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 h-16 bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl w-full shadow-xl">
            <TabsTrigger
              value="home"
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
            >
              <div className="w-5 h-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <span className="text-xs">Home</span>
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
            >
              <div className="w-5 h-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </div>
              <span className="text-xs">Profile</span>
            </TabsTrigger>

            <TabsTrigger
              value="racing"
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium relative h-full"
            >
              <div className="absolute -top-6">
                <div
                  className="bg-zinc-800 rounded-full p-5 border-4 border-black shadow-lg flex items-center justify-center"
                  style={{ width: "56px", height: "56px" }}
                >
                  <span className="text-lg font-bold">Vs</span>
                </div>
              </div>
              <div className="w-5 h-5 mt-1"></div>
              <span className="text-xs">Racing</span>
            </TabsTrigger>

            <TabsTrigger
              value="leaderboard"
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
            >
              <div className="w-5 h-5 flex items-center justify-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <rect x="4" y="12" width="8" height="14" rx="1.2" />
    <rect x="11.5" y="6" width="8" height="20" rx="1.2" />
    <rect x="19" y="16" width="8" height="10" rx="1.2" />
  </svg>
</div>
<span className="text-xs">Leaderboard</span>
            </TabsTrigger>

            <TabsTrigger
              value="task"
              className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
            >
              <div className="w-5 h-5 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-xs">Task</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
