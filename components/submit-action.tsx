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
} from "lucide-react"

interface SubmitActionProps {
  onBack: () => void
  onSubmit: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bike: Bike, zap: Zap, droplet: Droplets, recycle: Recycle, users: Users, book: BookOpen,
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

  const handleDone = () => {
    setResult(null)
    setSelectedCategory(null)
    setTitle("")
    setDescription("")
    setImageAdded(false)
    onSubmit()
  }

  // ── Success screen ────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-5">
        {result.leveledUp && (
          <div className="w-full px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
            <Star className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-primary">Level Up!</p>
              <p className="text-xs text-muted-foreground">You are now a {result.newLevelTitle}</p>
            </div>
          </div>
        )}

        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Action Recorded!</h2>
          <p className="text-muted-foreground text-sm">Your impact has been added to the feed.</p>
        </div>

        <Card className="w-full p-5 bg-card border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">You earned</p>
          <p className="text-4xl font-semibold text-primary mb-0.5">+{result.points}</p>
          <p className="text-sm text-muted-foreground">points</p>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-5 flex-wrap">
            {result.impact.co2 && (
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-medium text-foreground">{result.impact.co2} kg</span>
                <span className="text-xs text-muted-foreground">CO₂</span>
              </div>
            )}
            {result.impact.water && (
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-chart-2" />
                <span className="text-sm font-medium text-foreground">{result.impact.water} L</span>
                <span className="text-xs text-muted-foreground">water</span>
              </div>
            )}
            {result.impact.waste && (
              <div className="flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-chart-3" />
                <span className="text-sm font-medium text-foreground">{result.impact.waste} kg</span>
                <span className="text-xs text-muted-foreground">waste</span>
              </div>
            )}
            {result.impact.community && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-chart-4" />
                <span className="text-sm font-medium text-foreground">+{result.impact.community}</span>
                <span className="text-xs text-muted-foreground">community</span>
              </div>
            )}
          </div>
        </Card>

        <Button onClick={handleDone} className="w-full h-12 text-sm font-medium">
          See it in the Feed
        </Button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────
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
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs font-medium", isSelected ? "text-primary" : "text-foreground")}>
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

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
