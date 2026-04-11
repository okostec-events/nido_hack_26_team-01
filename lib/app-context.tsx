"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import {
  currentUser,
  userImpact,
  recentActions,
  levelTiers,
  actionCategories,
  User,
  ImpactMetrics,
  Action,
} from "@/lib/data"

// Fixed impact values per category — deterministic for a reliable demo
export const CATEGORY_IMPACT: Record<
  string,
  { points: number; co2?: number; water?: number; waste?: number; community?: number }
> = {
  transport:  { points: 45,  co2: 2.8 },
  energy:     { points: 80,  co2: 5.0 },
  water:      { points: 60,  water: 200 },
  waste:      { points: 50,  waste: 3.0 },
  community:  { points: 70,  community: 15 },
  education:  { points: 40,  community: 8 },
}

function computeLevel(points: number) {
  let tier = levelTiers[0]
  for (const t of levelTiers) {
    if (points >= t.minPoints) tier = t
  }
  return {
    level: tier.level,
    levelTitle: tier.title,
    // pointsToNextLevel = the ceiling of the current tier
    pointsToNextLevel: tier.maxPoints ?? points + 1000,
  }
}

export interface AddActionResult {
  points: number
  leveledUp: boolean
  newLevelTitle?: string
  impact: { co2?: number; water?: number; waste?: number; community?: number }
}

interface AppState {
  user: User
  impact: ImpactMetrics
  actions: Action[]
  addAction: (category: string, title: string, description: string) => AddActionResult
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(currentUser)
  const [impact, setImpact] = useState<ImpactMetrics>(userImpact)
  const [actions, setActions] = useState<Action[]>(recentActions)

  function addAction(category: string, title: string, description: string): AddActionResult {
    const categoryMeta = actionCategories.find((c) => c.id === category)
    const { points, ...impactDelta } = CATEGORY_IMPACT[category] ?? { points: 40 }

    const newAction: Action = {
      id: `act_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      category: categoryMeta?.label ?? category,
      title: title.slice(0, 80),
      description,
      points,
      impact: impactDelta,
      timestamp: new Date().toISOString(),
      verified: false,
    }

    const newPoints = user.totalPoints + points
    const { level, levelTitle, pointsToNextLevel } = computeLevel(newPoints)
    const leveledUp = level > user.level

    setUser((prev) => ({ ...prev, totalPoints: newPoints, level, levelTitle, pointsToNextLevel }))

    setImpact((prev) => ({
      co2Saved:       prev.co2Saved       + (impactDelta.co2       ?? 0),
      waterSaved:     prev.waterSaved     + (impactDelta.water     ?? 0),
      wasteReduced:   prev.wasteReduced   + (impactDelta.waste     ?? 0),
      communityScore: Math.min(100, prev.communityScore + (impactDelta.community ?? 0)),
    }))

    setActions((prev) => [newAction, ...prev])

    return { points, leveledUp, newLevelTitle: leveledUp ? levelTitle : undefined, impact: impactDelta }
  }

  return (
    <AppContext.Provider value={{ user, impact, actions, addAction }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
