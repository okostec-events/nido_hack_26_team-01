"use client"

import { useState, useEffect } from "react"
import { Onboarding } from "@/components/onboarding"
import { MobileNav, type TabId } from "@/components/mobile-nav"
import { Dashboard } from "@/components/dashboard"
import { SubmitAction } from "@/components/submit-action"
import { ActivityFeed } from "@/components/activity-feed"
import { RewardsPage } from "@/components/rewards-page"
import { Analytics } from "@/components/analytics"
import { AppProvider } from "@/lib/app-context"

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onSubmitAction={() => setActiveTab("submit")} onViewFeed={() => setActiveTab("feed")} />
      case "submit":
        return (
          <SubmitAction
            onBack={() => setActiveTab("dashboard")}
            onSubmit={() => setActiveTab("feed")}
          />
        )
      case "feed":
        return <ActivityFeed />
      case "rewards":
        return <RewardsPage />
      case "analytics":
        return <Analytics />
      default:
        return <Dashboard onSubmitAction={() => setActiveTab("submit")} />
    }
  }

  return (
    <AppProvider>
      <main className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6">
          {renderContent()}
        </div>
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </AppProvider>
  )
}
