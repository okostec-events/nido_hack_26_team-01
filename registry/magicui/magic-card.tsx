"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientColor?: string
  gradientSize?: number
}

export function MagicCard({
  children,
  className,
  gradientColor = "#262626",
  gradientSize = 200,
  style,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current || !overlayRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      overlayRef.current.style.background = `radial-gradient(${gradientSize}px circle at ${x}px ${y}px, ${gradientColor}, transparent 100%)`
    },
    [gradientColor, gradientSize],
  )

  const onMouseEnter = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "1"
  }, [])

  const onMouseLeave = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0"
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    el.addEventListener("mousemove", onMouseMove)
    el.addEventListener("mouseenter", onMouseEnter)
    el.addEventListener("mouseleave", onMouseLeave)
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseenter", onMouseEnter)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [onMouseMove, onMouseEnter, onMouseLeave])

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={style}
      {...props}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${gradientSize}px circle at 50% 50%, ${gradientColor}, transparent 100%)`,
        }}
      />
      {children}
    </div>
  )
}
