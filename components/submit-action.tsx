"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { actionCategories } from "@/lib/data"
import { useApp, CATEGORY_IMPACT, AddActionResult } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import {
  Bike, Zap, Droplets, Recycle, Users, BookOpen,
  ImagePlus, CheckCircle2, ArrowLeft, Leaf, Trash2, Star,
  Heart, Watch, Activity, Home, ShoppingBag, Calendar,
  Wifi, ShieldCheck, Sparkles, RotateCcw, Trophy,
} from "lucide-react"

interface SubmitActionProps {
  onBack: () => void
  onSubmit: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike, zap: Zap, droplet: Droplets, recycle: Recycle, users: Users, book: BookOpen,
}

// ── Per-category brand colors ────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  transport:  { border: "border-green-500",  bg: "bg-green-500/8",  text: "text-green-500" },
  energy:     { border: "border-amber-500",  bg: "bg-amber-500/8",  text: "text-amber-500" },
  water:      { border: "border-blue-500",   bg: "bg-blue-500/8",   text: "text-blue-500"  },
  waste:      { border: "border-orange-500", bg: "bg-orange-500/8", text: "text-orange-500"},
  community:  { border: "border-purple-500", bg: "bg-purple-500/8", text: "text-purple-500"},
  education:  { border: "border-indigo-500", bg: "bg-indigo-500/8", text: "text-indigo-500"},
}

// ── Data source registry ─────────────────────────────────────────────────────
const sourceConfig = {
  apple:       { label: "Apple Health",   icon: Heart,       color: "text-rose-400",    bg: "bg-rose-400/10"    },
  garmin:      { label: "Garmin",         icon: Watch,       color: "text-blue-400",    bg: "bg-blue-400/10"    },
  strava:      { label: "Strava",         icon: Activity,    color: "text-orange-400",  bg: "bg-orange-400/10"  },
  tesla:       { label: "Tesla",          icon: Zap,         color: "text-red-400",     bg: "bg-red-400/10"     },
  nest:        { label: "Nest",           icon: Home,        color: "text-teal-400",    bg: "bg-teal-400/10"    },
  sense:       { label: "Sense",          icon: Zap,         color: "text-yellow-400",  bg: "bg-yellow-400/10"  },
  flume:       { label: "Flume",          icon: Droplets,    color: "text-blue-400",    bg: "bg-blue-400/10"    },
  rachio:      { label: "Rachio",         icon: Droplets,    color: "text-cyan-400",    bg: "bg-cyan-400/10"    },
  irecycle:    { label: "iRecycle",       icon: Recycle,     color: "text-green-400",   bg: "bg-green-400/10"   },
  tgtg:        { label: "Too Good To Go", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  eventbrite:  { label: "Eventbrite",     icon: Calendar,    color: "text-purple-400",  bg: "bg-purple-400/10"  },
  volunteerhub:{ label: "Volunteer Hub",  icon: Users,       color: "text-violet-400",  bg: "bg-violet-400/10"  },
  coursera:    { label: "Coursera",       icon: BookOpen,    color: "text-indigo-400",  bg: "bg-indigo-400/10"  },
  khan:        { label: "Khan Academy",   icon: BookOpen,    color: "text-teal-400",    bg: "bg-teal-400/10"    },
} as const

type SourceKey = keyof typeof sourceConfig

interface DetectedActivity {
  source: SourceKey
  label: string
  detail: string
  suggestedTitle: string
  verifiedBy: string
  confidence: number
}

// ── Detected activities per category ────────────────────────────────────────
const CATEGORY_ACTIVITIES: Record<string, DetectedActivity[]> = {
  transport: [
    {
      source: "apple",
      label: "Morning Cycle",
      detail: "12.1 km · 42 min · Today, 07:34 · Avg HR 134 bpm",
      suggestedTitle: "Cycled 12.1 km to work",
      verifiedBy: "GPS + Heart Rate",
      confidence: 98,
    },
    {
      source: "strava",
      label: "Trail Run",
      detail: "8.2 km · 1h 04 min · Today, 06:10 · Pace 7:47/km",
      suggestedTitle: "Morning trail run instead of driving",
      verifiedBy: "GPS + Strava",
      confidence: 97,
    },
    {
      source: "garmin",
      label: "Walk to Market",
      detail: "3.4 km · 42 min · Yesterday · 4,821 steps · GPS verified",
      suggestedTitle: "Walked to the market instead of driving",
      verifiedBy: "Garmin GPS",
      confidence: 95,
    },
  ],
  energy: [
    {
      source: "tesla",
      label: "Solar Generation",
      detail: "14.2 kWh generated · Today · Grid export: 8.7 kWh",
      suggestedTitle: "Generated 14.2 kWh from rooftop solar",
      verifiedBy: "Tesla API",
      confidence: 99,
    },
    {
      source: "nest",
      label: "Eco Mode Savings",
      detail: "Saved 3.8 kWh · Eco Mode 6 h · Avg 18°C · Today",
      suggestedTitle: "Reduced heating with smart thermostat eco mode",
      verifiedBy: "Nest API",
      confidence: 94,
    },
    {
      source: "sense",
      label: "Off-Peak Appliance Shift",
      detail: "Dishwasher + Laundry shifted · Saved 1.9 kWh peak load",
      suggestedTitle: "Shifted appliances to off-peak hours",
      verifiedBy: "Sense Energy Monitor",
      confidence: 91,
    },
  ],
  water: [
    {
      source: "flume",
      label: "Short Shower",
      detail: "4 min shower · 38 L used · Saved 60 L vs avg · Today, 07:12",
      suggestedTitle: "Took a 4-minute shower to conserve water",
      verifiedBy: "Flume Smart Meter",
      confidence: 96,
    },
    {
      source: "rachio",
      label: "Irrigation Skip",
      detail: "Watering skipped · Rain forecast detected · Saved 180 L",
      suggestedTitle: "Skipped garden irrigation due to rain forecast",
      verifiedBy: "Rachio + Weather API",
      confidence: 99,
    },
    {
      source: "flume",
      label: "Efficient Dishwasher Cycle",
      detail: "Full-load cycle · 12 L used · Saved ~48 L vs hand-washing",
      suggestedTitle: "Used full-load dishwasher instead of hand washing",
      verifiedBy: "Flume Smart Meter",
      confidence: 88,
    },
  ],
  waste: [
    {
      source: "irecycle",
      label: "Electronics Drop-off",
      detail: "3 items · 4.2 kg · Certified e-waste centre · Today, 10:30",
      suggestedTitle: "Recycled electronics at certified drop-off centre",
      verifiedBy: "iRecycle QR Scan",
      confidence: 97,
    },
    {
      source: "tgtg",
      label: "Rescued Food Bag",
      detail: "1 Magic Bag · Green Cafe · 1.2 kg food saved · Today",
      suggestedTitle: "Rescued surplus food via Too Good To Go",
      verifiedBy: "TGTG Order Confirmed",
      confidence: 100,
    },
    {
      source: "irecycle",
      label: "Weekly Compost",
      detail: "2.8 kg organic waste composted · Kitchen scraps · This week",
      suggestedTitle: "Composted 2.8 kg of organic kitchen waste",
      verifiedBy: "Photo + Weight Log",
      confidence: 85,
    },
  ],
  community: [
    {
      source: "eventbrite",
      label: "Park Cleanup",
      detail: "2 h volunteered · Central Park · Today, 09:00 · 15 attendees",
      suggestedTitle: "Participated in community park cleanup",
      verifiedBy: "Eventbrite Check-in",
      confidence: 98,
    },
    {
      source: "volunteerhub",
      label: "Food Bank Shift",
      detail: "3 h shift · City Food Bank · Yesterday, 14:00",
      suggestedTitle: "Volunteered at local food bank for 3 hours",
      verifiedBy: "Organisation Verified",
      confidence: 100,
    },
    {
      source: "eventbrite",
      label: "Skill Share Session",
      detail: "Taught composting · 6 neighbours · Today, 11:00 · 1 h",
      suggestedTitle: "Led neighbourhood composting workshop",
      verifiedBy: "Eventbrite + Attendance",
      confidence: 90,
    },
  ],
  education: [
    {
      source: "coursera",
      label: "Climate Science Module",
      detail: "Module 4/6 completed · 45 min · Sustainability 101 cert",
      suggestedTitle: "Completed Climate Science module on Coursera",
      verifiedBy: "Coursera Completion",
      confidence: 100,
    },
    {
      source: "khan",
      label: "Environmental Science",
      detail: "3 lessons · 32 min · Mastery: 78% · Today",
      suggestedTitle: "Completed environmental science lessons on Khan Academy",
      verifiedBy: "Khan Academy API",
      confidence: 100,
    },
    {
      source: "coursera",
      label: "Circular Economy Webinar",
      detail: "Live webinar · 90 min · 420 attendees · Certificate issued",
      suggestedTitle: "Attended circular economy webinar",
      verifiedBy: "Certificate Issued",
      confidence: 95,
    },
  ],
}

function getCategorySources(category: string): SourceKey[] {
  const seen = new Set<SourceKey>()
  const out: SourceKey[] = []
  for (const a of CATEGORY_ACTIVITIES[category] ?? []) {
    if (!seen.has(a.source)) { seen.add(a.source); out.push(a.source) }
  }
  return out
}

export function SubmitAction({ onBack, onSubmit }: SubmitActionProps) {
  const { addAction } = useApp()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageAdded, setImageAdded] = useState(false)
  const [result, setResult] = useState<AddActionResult | null>(null)

  const preview = selectedCategory ? CATEGORY_IMPACT[selectedCategory] : null
  const canSubmit = !!selectedCategory && title.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const res = addAction(selectedCategory!, title.trim(), description.trim() || title.trim())
    setResult(res)
  }

  // Reset form state without navigating
  const resetForm = () => {
    setResult(null)
    setSelectedCategory(null)
    setTitle("")
    setDescription("")
    setImageAdded(false)
  }

  // Impact chips shared between both success variants
  const ImpactChips = () => (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {result?.impact.co2 && (
        <div className="flex flex-col items-center gap-1">
          <Leaf className="w-5 h-5 text-chart-1" />
          <span className="text-xl font-bold text-foreground">{result.impact.co2} kg</span>
          <span className="text-xs text-muted-foreground">CO₂</span>
        </div>
      )}
      {result?.impact.water && (
        <div className="flex flex-col items-center gap-1">
          <Droplets className="w-5 h-5 text-chart-2" />
          <span className="text-xl font-bold text-foreground">{result.impact.water} L</span>
          <span className="text-xs text-muted-foreground">water</span>
        </div>
      )}
      {result?.impact.waste && (
        <div className="flex flex-col items-center gap-1">
          <Trash2 className="w-5 h-5 text-chart-3" />
          <span className="text-xl font-bold text-foreground">{result.impact.waste} kg</span>
          <span className="text-xs text-muted-foreground">waste</span>
        </div>
      )}
      {result?.impact.community && (
        <div className="flex flex-col items-center gap-1">
          <Users className="w-5 h-5 text-chart-4" />
          <span className="text-xl font-bold text-foreground">+{result.impact.community}</span>
          <span className="text-xs text-muted-foreground">community</span>
        </div>
      )}
    </div>
  )

  // ── Success screen ────────────────────────────────────────────────────────
  if (result) {
    // ── Level-up variant ──────────────────────────────────────────────────
    if (result.leveledUp) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
          {/* Celebration icon */}
          <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>

          {/* Level-up headline */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Level Up!
            </p>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              {result.newLevelTitle}
            </h2>
            <p className="text-muted-foreground text-sm">
              Congratulations — you reached the next tier.
            </p>
          </div>

          {/* Points + impact card */}
          <Card className="w-full p-6 bg-card border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
              Points earned
            </p>
            <p className="text-7xl font-black text-primary mb-1">+{result.points}</p>
            <p className="text-sm text-muted-foreground mb-5">points</p>
            <div className="pt-4 border-t border-border">
              <ImpactChips />
            </div>
          </Card>

          {/* CTAs */}
          <div className="w-full space-y-2">
            <Button
              onClick={() => { resetForm(); onSubmit() }}
              className="w-full h-12 text-sm font-medium"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={resetForm}
              className="w-full h-11 text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Log Another Action
            </Button>
          </div>
        </div>
      )
    }

    // ── Normal success variant ─────────────────────────────────────────────
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">
            Impact recorded
          </p>
          <h2 className="text-2xl font-bold text-foreground">Action Complete!</h2>
          {result.rankBefore > result.rankAfter && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm font-bold text-amber-400">
                Moved to #{result.rankAfter}!
              </span>
            </div>
          )}
        </div>

        <Card className="w-full p-6 bg-card border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Points earned
          </p>
          <p className="text-7xl font-black text-primary mb-1">+{result.points}</p>
          <p className="text-sm text-muted-foreground mb-5">points</p>
          <div className="pt-4 border-t border-border">
            <ImpactChips />
          </div>
        </Card>

        {/* CTAs */}
        <div className="w-full space-y-2">
          <Button
            onClick={() => { resetForm(); onSubmit() }}
            className="w-full h-12 text-sm font-medium"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            className="w-full h-11 text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Log Another Action
          </Button>
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">Log Action</h1>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {actionCategories.map((category) => {
            const Icon = iconMap[category.icon] || Recycle
            const isSelected = selectedCategory === category.id
            const colors = CATEGORY_COLORS[category.id]
            return (
              <button
                key={category.id}
                onClick={() => { setSelectedCategory(category.id); setTitle("") }}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                  isSelected && colors
                    ? cn(colors.border, colors.bg)
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected && colors ? colors.text : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isSelected && colors ? colors.text : "text-foreground"
                  )}
                >
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detected Activities — shown for every category */}
      {selectedCategory && CATEGORY_ACTIVITIES[selectedCategory]?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Detected Activity</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end max-w-[58%]">
              {getCategorySources(selectedCategory).map((key) => {
                const src = sourceConfig[key]
                const SrcIcon = src.icon
                return (
                  <span
                    key={key}
                    className={cn(
                      "flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full",
                      src.bg, src.color
                    )}
                  >
                    <SrcIcon className="w-2 h-2" /> {src.label}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            {CATEGORY_ACTIVITIES[selectedCategory].map((a, i) => {
              const src = sourceConfig[a.source]
              const SrcIcon = src.icon
              const isSelected = title === a.suggestedTitle
              const catColors = CATEGORY_COLORS[selectedCategory]
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTitle(a.suggestedTitle)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                    isSelected && catColors
                      ? cn(catColors.border, catColors.bg)
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0", src.bg)}>
                    <SrcIcon className={cn("w-3.5 h-3.5", src.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{a.detail}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] font-medium text-emerald-500 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> {a.verifiedBy}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-semibold",
                          a.confidence >= 95 ? "text-emerald-500" :
                          a.confidence >= 85 ? "text-amber-500" : "text-muted-foreground"
                        )}
                      >
                        {a.confidence}%
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", catColors?.text ?? "text-primary")} />
                  ) : (
                    <span className="text-[10px] font-medium text-primary flex-shrink-0">Use →</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">What did you do?</label>
        <Input
          placeholder="e.g. Cycled to work, Planted 3 trees..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-card border-border"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Details{" "}
          <span className="text-muted-foreground font-normal text-xs">(optional)</span>
        </label>
        <Textarea
          placeholder="Add more context about your action..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] bg-card border-border resize-none"
        />
      </div>

      {/* Photo */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Photo{" "}
          <span className="text-muted-foreground font-normal text-xs">(optional)</span>
        </label>
        {imageAdded ? (
          <div className="w-full h-24 rounded-lg bg-secondary/60 border border-border flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Photo added</span>
            <button
              onClick={() => setImageAdded(false)}
              className="text-[10px] text-muted-foreground underline ml-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => setImageAdded(true)}
            className="w-full h-24 rounded-lg border border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-muted-foreground/50 transition-colors"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-xs">Upload image</span>
          </button>
        )}
      </div>

      {/* Impact Preview */}
      {preview && selectedCategory && (
        <Card className="p-4 bg-secondary/40 border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">You will earn</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              {preview.co2 && (
                <div>
                  <p className="text-lg font-semibold text-foreground">{preview.co2}</p>
                  <p className="text-[10px] text-muted-foreground">kg CO₂</p>
                </div>
              )}
              {preview.water && (
                <div>
                  <p className="text-lg font-semibold text-foreground">{preview.water}</p>
                  <p className="text-[10px] text-muted-foreground">L water</p>
                </div>
              )}
              {preview.waste && (
                <div>
                  <p className="text-lg font-semibold text-foreground">{preview.waste}</p>
                  <p className="text-[10px] text-muted-foreground">kg waste</p>
                </div>
              )}
              {preview.community && (
                <div>
                  <p className="text-lg font-semibold text-foreground">+{preview.community}</p>
                  <p className="text-[10px] text-muted-foreground">community</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-primary">+{preview.points}</p>
              <p className="text-[10px] text-muted-foreground">points</p>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full h-12 text-sm font-medium"
      >
        Submit Action
      </Button>
    </div>
  )
}
