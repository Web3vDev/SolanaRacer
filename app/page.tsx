"use client"

import { useState, Suspense, lazy } from "react"
import { TabContent } from "@/components/tab-content"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Header } from "@/components/header"
import { BottomNavigation } from "@/components/bottom-navigation"
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
  const [showUpgradesModal, setShowUpgradesModal] = useState(false)
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
      {/* Header - hidden when racing, upgrades modal is open, or on leaderboard tab */}
      {!isRacing && <Header currentTab={activeTab} showUpgradesModal={showUpgradesModal} />}

      <div className="w-full max-w-md mx-auto flex flex-col items-center h-screen pb-20">
        <div className="w-full flex-1 flex flex-col overflow-hidden">
          {/* Home Tab (Race) */}
          <TabContent isActive={activeTab === "home"}>
            {/* Farcaster Context Debug Component */}
            {/* <FarcasterContextDebug /> */}
            <Suspense fallback={<LoadingSpinner />}>
              <RaceTab 
                onDataUpdate={setRaceData} 
                showUpgradesModal={showUpgradesModal}
                setShowUpgradesModal={setShowUpgradesModal}
              />
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
          <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </div>
    </main>
  )
}
