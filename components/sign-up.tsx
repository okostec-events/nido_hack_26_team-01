"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowRight } from "lucide-react"

interface SignUpProps {
  onComplete: (name: string, email: string) => void
}

export function SignUp({ onComplete }: SignUpProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const canContinue = email.trim().includes("@") && email.trim().length > 3

  const handleSubmit = () => {
    if (!canContinue) return
    // Derive a display name: use entered name, or the local part of the email
    const displayName = name.trim() || email.split("@")[0]
    onComplete(displayName, email.trim())
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canContinue) handleSubmit()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 pb-10">
      {/* Top spacer */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full max-w-sm mx-auto">

        {/* Branding */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">ImpactOS</h1>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xs">
              Track your sustainable actions, earn rewards, and make a measurable difference.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="w-full space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              className="bg-card border-border h-12 text-base"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-1.5">
              Name
              <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKey}
              className="bg-card border-border h-12 text-base"
              autoComplete="name"
            />
          </div>
        </div>
      </div>

      {/* CTA — pinned to bottom */}
      <div className="w-full max-w-sm mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={!canContinue}
          className="w-full h-12 text-sm font-medium"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-center text-[11px] text-muted-foreground mt-3">
          No account needed — just jump in.
        </p>
      </div>
    </div>
  )
}
