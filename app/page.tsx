"use client"

import { useState, useEffect } from "react"
import { SignUp } from "@/components/sign-up"
import { MobileNav, type TabId } from "@/components/mobile-nav"
import { Dashboard } from "@/components/dashboard"
import { SubmitAction } from "@/components/submit-action"
import { ActivityFeed } from "@/components/activity-feed"
import { RewardsPage } from "@/components/rewards-page"
import { Analytics } from "@/components/analytics"
import { AppProvider } from "@/lib/app-context"

interface SignedInUser {
  name: string
  email: string
}

export default function Home() {
  const [signedInUser, setSignedInUser] = useState<SignedInUser | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Show sign-up if no user yet
  if (!signedInUser) {
    return (
      <SignUp
        onComplete={(name, email) => {
          setSignedInUser({ name, email })
          setActiveTab("dashboard")
        }}
      />
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            onSubmitAction={() => setActiveTab("submit")}
            onViewFeed={() => setActiveTab("feed")}
          />
        )
      case "submit":
        return (
          <SubmitAction
            onBack={() => setActiveTab("dashboard")}
            onSubmit={() => setActiveTab("dashboard")}
          />
        )
      case "feed":
        return <ActivityFeed />
      case "rewards":
        return <RewardsPage />
      case "analytics":
        return <Analytics />
      default:
        return (
          <Dashboard
            onSubmitAction={() => setActiveTab("submit")}
            onViewFeed={() => setActiveTab("feed")}
          />
        )
    }
  }

  return (
    <AppProvider userName={signedInUser.name} userEmail={signedInUser.email}>
      <main className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6">
          {renderContent()}
        </div>
        <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </AppProvider>
  )
}
