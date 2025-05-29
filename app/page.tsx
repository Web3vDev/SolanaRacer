"use client"

import { useState, Suspense, lazy } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabContent } from "@/components/tab-content"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Header } from "@/components/header"
import type { Badge } from "@/types/badge"
import type { BadgeFrame } from "@/types/badge-frame"
import { sdk } from '@farcaster/frame-sdk'
// Import sound function at the top
import { playSound } from "@/lib/sound-manager"

// Lazy load tab components
const RaceTab = lazy(() => import("@/components/tabs/race-tab"))
const LeaderboardTab = lazy(() => import("@/components/tabs/leaderboard-tab"))
const TeamsTab = lazy(() => import("@/components/tabs/teams-tab"))
const TasksTab = lazy(() => import("@/components/tabs/tasks-tab"))
const ProfileTab = lazy(() => import("@/components/tabs/profile-tab"))

//context
import { FarcasterContextDebug } from "@/components/farcaster-context-debug"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [isRacing, setIsRacing] = useState(false)
  const [raceData, setRaceData] = useState({
    points: 0,
    winRate: 65,
    totalRaces: 0,
    predictionsRemaining: 10,
    unlockedBadges: [] as Badge[],
    unlockedFrames: [] as BadgeFrame[],
  })
sdk.actions.ready();
  // Add sound effect when tab changes
  const handleTabChange = async (newTab: string) => {
    // Play navigation sound
    await playSound("nav")
    setActiveTab(newTab)
  }

  return (
    <main className="flex flex-col items-center h-screen w-full relative overflow-hidden">
      {/* Header - hidden when racing, pass current tab */}
      {!isRacing && <Header currentTab={activeTab} />}

      <div className="w-full max-w-md mx-auto flex flex-col items-center h-screen pb-20">
        <div className="w-full flex-1 flex flex-col overflow-hidden">
          {/* Home Tab (Race) */}
          <TabContent isActive={activeTab === "home"}>
            {/* Farcaster Context Debug Component */}
            <FarcasterContextDebug />
            <Suspense fallback={<LoadingSpinner />}>
              <RaceTab onDataUpdate={setRaceData} />
            </Suspense>
          </TabContent>

          {/* Profile Tab */}
          <TabContent isActive={activeTab === "profile"}>
            <Suspense fallback={<LoadingSpinner />}>
              <ProfileTab
                points={raceData.points}
                winRate={raceData.winRate}
                totalRaces={raceData.totalRaces}
                predictionsRemaining={raceData.predictionsRemaining}
                unlockedBadges={raceData.unlockedBadges}
              />
            </Suspense>
          </TabContent>

          {/* Racing Tab (Teams) */}
          <TabContent isActive={activeTab === "racing"}>
            <Suspense fallback={<LoadingSpinner />}>
              <TeamsTab onRaceStateChange={setIsRacing} />
            </Suspense>
          </TabContent>

          {/* Leaderboard Tab */}
          <TabContent isActive={activeTab === "leaderboard"}>
            <Suspense fallback={<LoadingSpinner />}>
              <LeaderboardTab userPoints={raceData.points} />
            </Suspense>
          </TabContent>

          {/* Task Tab */}
          <TabContent isActive={activeTab === "task"}>
            <Suspense fallback={<LoadingSpinner />}>
              <TasksTab />
            </Suspense>
          </TabContent>
        </div>

        {/* Modal Portal Container - Highest Z-Index */}
        <div 
          id="modal-portal" 
          className="fixed inset-0" 
          style={{ 
            zIndex: 9999,
            pointerEvents: 'none', // Chỉ áp dụng với container, không áp dụng với nội dung bên trong
            isolation: 'isolate' // Tạo ngữ cảnh xếp chồng mới
          }}
        ></div>

        {/* Bottom navigation - hidden when racing */}
        {!isRacing && (
          <div className="bottom-nav w-full flex justify-center items-center">
            {/* Update the Tabs component to use the new handler */}
            <Tabs defaultValue="home" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-5 h-20 bg-gradient-to-r from-zinc-900 to-zinc-800 border-t border-zinc-700 rounded-none w-full">
                <TabsTrigger
                  value="home"
                  className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
                >
                  <div className="w-6 h-6">
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
                  <div className="w-6 h-6">
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
                  <div className="absolute -top-8">
                    <div
                      className="bg-zinc-800 rounded-full p-6 border-4 border-black shadow-lg flex items-center justify-center"
                      style={{ width: "64px", height: "64px" }}
                    >
                      <span className="text-xl font-bold">Vs</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 mt-6"></div>
                  <span className="text-xs">Racing</span>
                </TabsTrigger>

                <TabsTrigger
                  value="leaderboard"
                  className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
                >
                  <div className="w-6 h-6">
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
                      <path d="M7 7v10" />
                      <path d="M11 10v7" />
                      <path d="M15 7v10" />
                    </svg>
                  </div>
                  <span className="text-xs">Leaderboard</span>
                </TabsTrigger>

                <TabsTrigger
                  value="task"
                  className="flex flex-col items-center justify-center gap-1 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:font-medium h-full"
                >
                  <div className="w-6 h-6 relative">
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
        )}
      </div>
    </main>
  )
}
