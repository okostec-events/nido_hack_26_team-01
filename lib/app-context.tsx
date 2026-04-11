"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import {
  currentUser,
  userImpact,
  recentActions,
  levelTiers,
  actionCategories,
  mockLeaderboard,
  User,
  ImpactMetrics,
  Action,
  LeaderboardEntry,
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
    pointsToNextLevel: tier.maxPoints ?? points + 1000,
  }
}

function makeAvatar(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface AddActionResult {
  points: number
  leveledUp: boolean
  newLevelTitle?: string
  impact: { co2?: number; water?: number; waste?: number; community?: number }
  rankBefore: number
  rankAfter: number
}

interface AppState {
  user: User
  impact: ImpactMetrics
  actions: Action[]
  leaderboard: LeaderboardEntry[]
  addAction: (category: string, title: string, description: string) => AddActionResult
}

const AppContext = createContext<AppState | null>(null)

interface AppProviderProps {
  children: ReactNode
  userName: string
  userEmail: string
}

export function AppProvider({ children, userName, userEmail }: AppProviderProps) {
  // Build the initial user from sign-up data, keeping demo points/level
  const initialUser: User = {
    ...currentUser,
    name: userName || currentUser.name,
    email: userEmail || currentUser.email,
    avatar: makeAvatar(userName || currentUser.name),
  }

  const [user, setUser] = useState<User>(initialUser)
  const [impact, setImpact] = useState<ImpactMetrics>(userImpact)
  const [actions, setActions] = useState<Action[]>(recentActions)

  // Seed the leaderboard: inject the current user and sort by points
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() =>
    [
      ...mockLeaderboard,
      {
        id: initialUser.id,
        name: initialUser.name,
        avatar: initialUser.avatar,
        points: initialUser.totalPoints,
        levelTitle: initialUser.levelTitle,
      },
    ].sort((a, b) => b.points - a.points)
  )

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

    // Calculate rank change and update leaderboard
    const oldRank = leaderboard.findIndex((e) => e.id === user.id) + 1
    const newBoard = leaderboard
      .map((entry) =>
        entry.id === user.id
          ? { ...entry, points: newPoints, levelTitle }
          : entry
      )
      .sort((a, b) => b.points - a.points)
    const newRank = newBoard.findIndex((e) => e.id === user.id) + 1
    setLeaderboard(newBoard)

    return { points, leveledUp, newLevelTitle: leveledUp ? levelTitle : undefined, impact: impactDelta, rankBefore: oldRank, rankAfter: newRank }
  }

  return (
    <AppContext.Provider value={{ user, impact, actions, leaderboard, addAction }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
