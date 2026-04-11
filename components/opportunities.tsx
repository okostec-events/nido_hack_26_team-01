"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { opportunities } from "@/lib/data"
import {
  Leaf, Droplets, Trash2, Users,
  MapPin, Calendar, CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categoryColors: Record<string, { bg: string; text: string }> = {
  Environment: { bg: "bg-chart-1/10", text: "text-chart-1" },
  Transport:   { bg: "bg-chart-2/10", text: "text-chart-2" },
  Education:   { bg: "bg-chart-3/10", text: "text-chart-3" },
  Waste:       { bg: "bg-chart-4/10", text: "text-chart-4" },
  Community:   { bg: "bg-chart-5/10", text: "text-chart-5" },
}

const filters = ["All", "Environment", "Community", "Education", "Transport"]

export function Opportunities() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [joined, setJoined] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setJoined((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const visible = activeFilter === "All"
    ? opportunities
    : opportunities.filter((o) => o.category === activeFilter)

  return (
    <div className="flex flex-col gap-5">

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0",
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No opportunities in this category yet.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((opp) => {
            const colors = categoryColors[opp.category] ?? { bg: "bg-secondary", text: "text-foreground" }
            const isJoined = joined.has(opp.id)
            const participantCount = opp.participants + (isJoined ? 1 : 0)

            return (
              <Card key={opp.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {opp.category}
                  </span>
                  <span className="text-sm font-semibold text-primary">+{opp.points} pts</span>
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-1">{opp.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                  {opp.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {opp.location}
                  </span>
                  {opp.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {participantCount} joined
                  </span>
                </div>

                {/* Impact + Join */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    {opp.expectedImpact.co2 && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Leaf className="w-3 h-3 text-chart-1" />
                        {opp.expectedImpact.co2} kg CO₂
                      </span>
                    )}
                    {opp.expectedImpact.water && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Droplets className="w-3 h-3 text-chart-2" />
                        {opp.expectedImpact.water} L
                      </span>
                    )}
                    {opp.expectedImpact.waste && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Trash2 className="w-3 h-3 text-chart-4" />
                        {opp.expectedImpact.waste} kg
                      </span>
                    )}
                  </div>

                  {isJoined ? (
                    <button
                      onClick={() => toggle(opp.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-chart-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Joined
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => toggle(opp.id)}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
