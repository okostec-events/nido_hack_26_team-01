"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { levelTiers } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import {
  Leaf,
  Droplets,
  Trash2,
  Users,
  TrendingUp,
  Medal,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardProps {
  onSubmitAction: () => void
  onViewFeed: () => void
}

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-3.5 h-3.5 text-amber-400" />
  if (rank === 2) return <Medal className="w-3.5 h-3.5 text-slate-400" />
  if (rank === 3) return <Medal className="w-3.5 h-3.5 text-amber-600" />
  return <span className="text-xs font-semibold text-muted-foreground w-3.5 text-center">{rank}</span>
}

export function Dashboard({ onSubmitAction, onViewFeed }: DashboardProps) {
  const { user, impact, actions, leaderboard } = useApp()

  const currentTier = levelTiers.find((t) => t.level === user.level)
  const progress = currentTier?.maxPoints
    ? ((user.totalPoints - (currentTier.minPoints || 0)) /
        ((currentTier.maxPoints || 0) - (currentTier.minPoints || 0))) *
      100
    : 100

  // Only show top 5 entries
  const topEntries = leaderboard.slice(0, 5)

  // Rank callout for the signed-in user
  const userRankIdx = leaderboard.findIndex((e) => e.id === user.id)
  const userRank = userRankIdx + 1
  const personAhead = userRankIdx > 0 ? leaderboard[userRankIdx - 1] : null
  const gapToNextRank = personAhead ? personAhead.points - user.totalPoints : null

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h1 className="text-xl font-semibold text-foreground">
            {user.name.split(" ")[0]}
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {user.avatar}
          </span>
        </div>
      </div>

      {/* Points & Level Card */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
              Total Points
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {user.totalPoints.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Level {user.level}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{user.levelTitle}</span>
            <span className="text-primary font-semibold text-xs">
              {(user.pointsToNextLevel - user.totalPoints).toLocaleString()} pts to next level
            </span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {user.totalPoints.toLocaleString()} / {user.pointsToNextLevel.toLocaleString()} pts
          </p>
        </div>
      </Card>

      {/* Your Impact */}
      <div>
        <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-3">
          Your Impact
        </p>
        {/* CO2 + Water — primary big metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card className="p-5 bg-primary/8 border-primary/20">
            <div className="w-9 h-9 rounded-lg bg-chart-1/15 flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5 text-chart-1" />
            </div>
            <p className="text-3xl font-bold text-foreground leading-none">
              {impact.co2Saved.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">kg</span>
            </p>
            <p className="text-xs font-semibold text-chart-1 mt-1.5">CO₂ Saved</p>
          </Card>
          <Card className="p-5 bg-chart-2/5 border-chart-2/20">
            <div className="w-9 h-9 rounded-lg bg-chart-2/15 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5 text-chart-2" />
            </div>
            <p className="text-3xl font-bold text-foreground leading-none">
              {(impact.waterSaved / 1000).toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">m³</span>
            </p>
            <p className="text-xs font-semibold text-chart-2 mt-1.5">Water Saved</p>
          </Card>
        </div>
        {/* Secondary metrics row */}
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{actions.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Actions</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{impact.wasteReduced.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">kg Waste</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{impact.communityScore}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Community</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Community Leaderboard */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-foreground">Community Rankings</h2>
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Rank callout */}
        <div className="mb-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Your Rank</p>
            <p className="text-2xl font-bold text-primary leading-none mt-0.5">#{userRank}</p>
          </div>
          {gapToNextRank !== null && gapToNextRank > 0 ? (
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">To reach #{userRank - 1}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{gapToNextRank} pts away</p>
            </div>
          ) : userRank === 1 ? (
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">Top of the board!</span>
            </div>
          ) : null}
        </div>
        <Card className="bg-card border-border overflow-hidden">
          {topEntries.map((entry, idx) => {
            const rank = idx + 1
            const isCurrentUser = entry.id === user.id
            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  idx < topEntries.length - 1 && "border-b border-border",
                  isCurrentUser && "bg-primary/10 border-l-2 border-l-primary"
                )}
              >
                {/* Rank */}
                <div className="w-5 flex items-center justify-center flex-shrink-0">
                  {rankIcon(rank)}
                </div>

                {/* Avatar */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    isCurrentUser ? "bg-primary/20" : "bg-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {entry.avatar}
                  </span>
                </div>

                {/* Name + level */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium truncate",
                      isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {entry.name}
                    {isCurrentUser && (
                      <span className="ml-1.5 text-[10px] font-normal text-primary/70">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{entry.levelTitle}</p>
                </div>

                {/* Points */}
                <span
                  className={cn(
                    "text-sm font-semibold flex-shrink-0",
                    isCurrentUser ? "text-primary" : "text-foreground"
                  )}
                >
                  {entry.points.toLocaleString()}
                </span>
              </div>
            )
          })}
        </Card>
      </div>

      {/* CTA */}
      <Button
        onClick={onSubmitAction}
        className="w-full h-12 text-sm font-medium"
      >
        Submit New Action
      </Button>
    </div>
  )
}
