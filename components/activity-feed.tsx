"use client"

import { Card } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import {
  Bike, Zap, Droplets, Recycle, Users, BookOpen,
  Leaf, Trash2, CheckCircle2, Clock,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Per-category visual config
const categoryMeta: Record<string, {
  icon: React.ComponentType<{ className?: string }>
  imageBg: string
  pillBg: string
  pillText: string
  iconColor: string
}> = {
  Transport: { icon: Bike,     imageBg: "bg-chart-1/10", pillBg: "bg-chart-1/10", pillText: "text-chart-1",  iconColor: "text-chart-1"  },
  Energy:    { icon: Zap,      imageBg: "bg-chart-3/10", pillBg: "bg-chart-3/10", pillText: "text-chart-3",  iconColor: "text-chart-3"  },
  Water:     { icon: Droplets, imageBg: "bg-chart-2/10", pillBg: "bg-chart-2/10", pillText: "text-chart-2",  iconColor: "text-chart-2"  },
  Waste:     { icon: Recycle,  imageBg: "bg-chart-4/10", pillBg: "bg-chart-4/10", pillText: "text-chart-4",  iconColor: "text-chart-4"  },
  Community: { icon: Users,    imageBg: "bg-chart-5/10", pillBg: "bg-chart-5/10", pillText: "text-chart-5",  iconColor: "text-chart-5"  },
  Education: { icon: BookOpen, imageBg: "bg-primary/8",  pillBg: "bg-primary/10", pillText: "text-primary",  iconColor: "text-primary"  },
}

const fallbackMeta = categoryMeta.Community

// Impact chip config
const impactConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; unit: string; label: string; color: string }> = {
  co2:       { icon: Leaf,     unit: " kg", label: "CO₂",       color: "text-chart-1" },
  water:     { icon: Droplets, unit: " L",  label: "water",     color: "text-chart-2" },
  waste:     { icon: Trash2,   unit: " kg", label: "waste",     color: "text-chart-4" },
  community: { icon: Users,    unit: "",    label: "community", color: "text-chart-5" },
}

export function ActivityFeed() {
  const { actions } = useApp()

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Activity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {actions.length} community actions
        </p>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {actions.map((action) => {
          const meta = categoryMeta[action.category] ?? fallbackMeta
          const CatIcon = meta.icon
          const impactEntries = Object.entries(action.impact).filter(([, v]) => v && v > 0)

          return (
            <Card key={action.id} className="overflow-hidden bg-card border-border">

              {/* Image area — category-colored placeholder */}
              <div className={`relative h-28 flex items-center justify-center ${meta.imageBg}`}>
                <CatIcon className={`w-12 h-12 ${meta.iconColor} opacity-20`} />

                {/* Status badge */}
                <div className="absolute top-2.5 right-2.5">
                  {action.verified ? (
                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-background/90 text-chart-1 border border-chart-1/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-background/90 text-muted-foreground border border-border">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                {/* Category pill */}
                <div className="absolute bottom-2.5 left-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-background/90 border border-border ${meta.pillText}`}>
                    {action.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                {/* User row */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-semibold text-foreground">{action.userAvatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-none">{action.userName}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary">+{action.points} pts</span>
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-foreground mb-1">{action.title}</p>

                {/* Description — only show if different from title */}
                {action.description && action.description !== action.title && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {action.description}
                  </p>
                )}

                {/* Impact chips */}
                {impactEntries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {impactEntries.map(([key, value]) => {
                      const cfg = impactConfig[key]
                      if (!cfg) return null
                      const Icon = cfg.icon
                      return (
                        <span
                          key={key}
                          className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border"
                        >
                          <Icon className={`w-3 h-3 ${cfg.color}`} />
                          <span className="text-foreground">
                            {key === "community" ? `+${value}` : value}
                            {cfg.unit}
                          </span>
                          <span className="text-muted-foreground">{cfg.label}</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
