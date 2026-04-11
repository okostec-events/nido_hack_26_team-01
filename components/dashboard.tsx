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
  ChevronRight,
  TrendingUp
} from "lucide-react"

interface DashboardProps {
  onSubmitAction: () => void
  onViewFeed: () => void
}

export function Dashboard({ onSubmitAction, onViewFeed }: DashboardProps) {
  const { user, impact } = useApp()

  const currentTier = levelTiers.find((t) => t.level === user.level)
  const progress = currentTier?.maxPoints
    ? ((user.totalPoints - (currentTier.minPoints || 0)) /
        ((currentTier.maxPoints || 0) - (currentTier.minPoints || 0))) *
      100
    : 100

  const impactCards = [
    {
      label: "CO2 Saved",
      value: impact.co2Saved.toFixed(1),
      unit: "kg",
      icon: Leaf,
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
    {
      label: "Water Saved",
      value: (impact.waterSaved / 1000).toFixed(1),
      unit: "m³",
      icon: Droplets,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      label: "Waste Reduced",
      value: impact.wasteReduced.toFixed(1),
      unit: "kg",
      icon: Trash2,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      label: "Community",
      value: `${impact.communityScore}`,
      unit: "pts",
      icon: Users,
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ]

  return (
    <div className="flex flex-col gap-6 pb-24">
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
            <span className="text-foreground font-medium">
              {user.pointsToNextLevel - user.totalPoints} pts to next level
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {user.totalPoints.toLocaleString()} / {user.pointsToNextLevel.toLocaleString()} points
          </p>
        </div>
      </Card>

      {/* Impact Summary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-foreground">Your Impact</h2>
          <button
            onClick={onViewFeed}
            className="text-xs text-muted-foreground flex items-center gap-0.5 hover:text-foreground transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {impactCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.label}
                className="p-4 bg-card border-border"
              >
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{card.label}</p>
                <p className="text-lg font-semibold text-foreground">
                  {card.value}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {card.unit}
                  </span>
                </p>
              </Card>
            )
          })}
        </div>
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
