"use client"

import { useState } from "react"
import { Opportunities } from "@/components/opportunities"
import { Rewards } from "@/components/rewards"
import { cn } from "@/lib/utils"

export function RewardsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"rewards" | "opportunities">("rewards")

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Redeem points for real-world perks
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
        <button
          onClick={() => setActiveSubTab("rewards")}
          className={cn(
            "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
            activeSubTab === "rewards"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Rewards
        </button>
        <button
          onClick={() => setActiveSubTab("opportunities")}
          className={cn(
            "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors",
            activeSubTab === "opportunities"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Opportunities
        </button>
      </div>

      {/* Content */}
      {activeSubTab === "rewards" ? <Rewards /> : <Opportunities />}
    </div>
  )
}
