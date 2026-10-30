import { cn } from '@/shared/lib/cn'
import { focusRing, surfaceShape, surfaceTone } from '@/shared/lib/styles'

// text-base (16px) stops iOS Safari from zooming into focused fields.
export function fieldClass({ invalid, className } = {}) {
  return cn(
    surfaceShape,
    invalid ? 'border-destructive bg-card/95' : surfaceTone,
    focusRing,
    'w-full px-4 text-base text-foreground placeholder:text-muted-foreground/70 transition',
    'disabled:cursor-not-allowed disabled:opacity-60',
    className,
  )
}
