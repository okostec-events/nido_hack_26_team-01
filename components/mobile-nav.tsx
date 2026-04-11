"use client"

import { cn } from "@/lib/utils"
import { Home, PlusCircle, Activity, Gift, BarChart3 } from "lucide-react"

export type TabId = "dashboard" | "submit" | "feed" | "rewards" | "analytics"

interface MobileNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs = [
  { id: "dashboard" as const, label: "Home", icon: Home },
  { id: "feed" as const, label: "Activity", icon: Activity },
  { id: "submit" as const, label: "Submit", icon: PlusCircle },
  { id: "rewards" as const, label: "Rewards", icon: Gift },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
]

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isSubmit = tab.id === "submit"

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-colors",
                isSubmit
                  ? "relative -mt-4"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isSubmit ? (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </>
              )}
            </button>
          )
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
