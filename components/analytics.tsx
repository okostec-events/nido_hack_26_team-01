"use client"

import { Card } from "@/components/ui/card"
import { institutionalMetrics } from "@/lib/data"
import { Leaf, Droplets, Activity, Users, TrendingUp } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const chartData = institutionalMetrics.weeklyTrend.map((value, index) => ({
  day: weekDays[index],
  actions: value,
}))

const metrics = [
  {
    label: "Total Actions",
    value: institutionalMetrics.totalActions.toLocaleString(),
    sub: "Completed this period",
    icon: Activity,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    trend: "+8.2%",
  },
  {
    label: "CO2 Saved",
    value: `${(institutionalMetrics.totalCO2Saved / 1000).toFixed(1)}t`,
    sub: "Tonnes of CO₂ avoided",
    icon: Leaf,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    trend: "+15.7%",
  },
  {
    label: "Water Saved",
    value: `${(institutionalMetrics.totalWaterSaved / 1000).toFixed(0)}m³`,
    sub: "Cubic metres recovered",
    icon: Droplets,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    trend: "+9.3%",
  },
  {
    label: "Participants",
    value: institutionalMetrics.totalParticipants.toLocaleString(),
    sub: `${institutionalMetrics.engagementRate}% engagement rate`,
    icon: Users,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
    trend: "+12.4%",
  },
]

export function Analytics() {
  return (
    <div className="flex flex-col gap-6 pb-24">

      {/* Header */}
      <div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Organization View
        </span>
        <h1 className="text-xl font-semibold text-foreground mt-1">Impact Overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Aggregate data across all participants
        </p>
      </div>

      {/* 4 primary metric cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <Card key={m.label} className="p-4 bg-card border-border">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-chart-1" />
                  <span className="text-[10px] font-medium text-chart-1">{m.trend}</span>
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground leading-none mb-1">
                {m.value}
              </p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{m.sub}</p>
            </Card>
          )
        })}
      </div>

      {/* Weekly trend chart */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Weekly Activity</h3>
            <p className="text-xs text-muted-foreground">Actions completed per day</p>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-chart-1/10 text-chart-1">
            This week
          </span>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Area
                type="monotone"
                dataKey="actions"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-4 bg-secondary/30 border-border">
        <p className="text-xs font-medium text-foreground mb-2">Summary</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">
            {institutionalMetrics.totalParticipants.toLocaleString()} participants
          </span>{" "}
          completed{" "}
          <span className="text-foreground font-medium">
            {institutionalMetrics.totalActions.toLocaleString()} actions
          </span>
          , saving{" "}
          <span className="text-primary font-medium">
            {(institutionalMetrics.totalCO2Saved / 1000).toFixed(1)}t of CO₂
          </span>{" "}
          and{" "}
          <span className="text-primary font-medium">
            {(institutionalMetrics.totalWaterSaved / 1000).toFixed(0)}m³ of water
          </span>
          . Engagement is at{" "}
          <span className="text-foreground font-medium">
            {institutionalMetrics.engagementRate}%
          </span>
          , above the platform average.
        </p>
      </Card>

    </div>
  )
}
