"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { rewards, levelTiers } from "@/lib/data"
import { useApp } from "@/lib/app-context"
import {
  Gift,
  Lock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Rewards() {
  const { user } = useApp()
  const [claimed, setClaimed] = useState<Set<string>>(new Set())

  const claim = (id: string) => setClaimed((prev) => new Set([...prev, id]))

  const currentTier = levelTiers.find((t) => t.level === user.level)
  const nextTier = levelTiers.find((t) => t.level === user.level + 1)
  const progress = currentTier?.maxPoints
    ? ((user.totalPoints - (currentTier.minPoints || 0)) /
        ((currentTier.maxPoints || 0) - (currentTier.minPoints || 0))) *
      100
    : 100

  // Compute dynamically: unlocked when user has enough points
  const unlockedRewards = rewards.filter((r) => user.totalPoints >= r.pointsRequired)
  const lockedRewards   = rewards.filter((r) => user.totalPoints <  r.pointsRequired)

  return (
    <div className="flex flex-col gap-6">

      {/* Membership Card */}
      <Card className="p-5 bg-card border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Membership Level
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-foreground">
                  {user.levelTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Lvl {user.level}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {user.totalPoints.toLocaleString()} / {currentTier?.maxPoints?.toLocaleString() || "Max"} pts
              </span>
              {nextTier && (
                <span className="text-foreground font-medium">
                  Next: {nextTier.title}
                </span>
              )}
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Unlocked Rewards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground">
            Available Rewards ({unlockedRewards.length})
          </h2>
        </div>
        <div className="space-y-3">
          {unlockedRewards.map((reward) => (
            <Card key={reward.id} className="p-4 bg-card border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">
                      {reward.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {reward.pointsRequired.toLocaleString()} pts
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {reward.description}
                  </p>
                  {reward.partner && (
                    <p className="text-[10px] text-muted-foreground">
                      Partner: {reward.partner}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-end">
                {claimed.has(reward.id) ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-chart-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Claimed
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => claim(reward.id)}
                  >
                    Redeem
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Rewards */}
      {lockedRewards.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground">
              Locked ({lockedRewards.length})
            </h2>
          </div>
          <div className="space-y-3">
            {lockedRewards.map((reward) => (
              <Card key={reward.id} className="p-4 bg-card border-border opacity-60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {reward.title}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {reward.pointsRequired.toLocaleString()} pts
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {reward.description}
                    </p>
                    <p className="text-[10px] text-primary mt-2">
                      {(reward.pointsRequired - user.totalPoints).toLocaleString()} more points needed
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
