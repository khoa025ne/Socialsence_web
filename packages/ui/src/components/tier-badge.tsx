import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface TierBadgeProps {
  tier: "Free" | "Pro" | "Ultra" | "Enterprise" | string
  className?: string
}

/**
 * TierBadge — Pill-shaped tier indicator
 */
export function TierBadge({ tier, className }: TierBadgeProps) {
  const displayTier = tier === "Enterprise" ? "Ultra" : tier
  const variant =
    tier === "Free"
      ? "bg-muted text-muted-foreground"
      : tier === "Pro"
        ? "bg-foreground text-background"
        : "bg-foreground text-background"

  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center rounded-full px-2.5 py-0.5",
        variant,
        className
      )}
    >
      {displayTier}
    </span>
  )
}
