"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { interestCategories } from "@/lib/data"
import { ArrowRight, BarChart3, Users, Leaf, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const steps = [
    // Welcome
    <div key="welcome" className="flex flex-col items-center text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Leaf className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground mb-3 text-balance">
        Welcome to ImpactOS
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
        Track and measure the real-world impact of your sustainable actions. 
        Join a community committed to positive change.
      </p>
    </div>,

    // Value Props
    <div key="value" className="flex flex-col px-6">
      <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
        How it works
      </h2>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-chart-1" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Log Actions</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              Record sustainable behaviors and community participation
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Track Impact</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              See measurable results: CO2 saved, water conserved, waste reduced
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-chart-3" />
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">Earn Rewards</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              Unlock benefits from local partners and organizations
            </p>
          </div>
        </div>
      </div>
    </div>,

    // Interest Selection
    <div key="interests" className="flex flex-col px-6">
      <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
        Select your interests
      </h2>
      <p className="text-muted-foreground text-sm text-center mb-6">
        Choose areas you want to focus on
      </p>
      <div className="grid grid-cols-1 gap-3">
        {interestCategories.map((interest) => (
          <Card
            key={interest.id}
            className={cn(
              "p-4 cursor-pointer transition-all border",
              selectedInterests.includes(interest.id)
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
            onClick={() => toggleInterest(interest.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground text-sm">
                  {interest.label}
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {interest.description}
                </p>
              </div>
              {selectedInterests.includes(interest.id) && (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>,
  ]

  const isLastStep = step === steps.length - 1
  const canProceed = step < 2 || selectedInterests.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress indicator */}
      <div className="flex justify-center gap-1.5 pt-8 pb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-all",
              i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-8">
        {steps[step]}
      </div>

      {/* Actions */}
      <div className="p-6 pb-10">
        <Button
          onClick={() => {
            if (isLastStep) {
              onComplete()
            } else {
              setStep(step + 1)
            }
          }}
          disabled={!canProceed}
          className="w-full h-12 text-sm font-medium"
        >
          {isLastStep ? "Get Started" : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        {step > 0 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="w-full mt-2 text-muted-foreground"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}
