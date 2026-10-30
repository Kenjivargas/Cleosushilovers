import { cn } from '@/shared/lib/cn'
import { focusRing, surfaceShape, surfaceShapeFlat, surfaceTone } from '@/shared/lib/styles'
import { Spinner } from './Spinner'

const variants = {
  primary: 'border-primary bg-primary text-primary-foreground hover:brightness-105',
  secondary: `${surfaceTone} text-foreground hover:bg-muted`,
  danger: 'border-destructive bg-destructive text-destructive-foreground hover:brightness-105',
  ghost: 'border-transparent bg-transparent text-foreground hover:bg-muted',
}

// Every size keeps a 44px+ touch target.
const sizes = {
  sm: 'min-h-11 px-4 text-sm gap-1.5',
  md: 'min-h-12 px-5 text-sm gap-2',
  lg: 'min-h-14 px-6 text-base gap-2',
  icon: 'size-11 shrink-0',
}

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  const isButton = Component === 'button'
  return (
    <Component
      className={cn(
        // Ghost buttons sit inside cards, so they skip the floating shadow and blur.
        variant === 'ghost' ? surfaceShapeFlat : surfaceShape,
        variants[variant],
        sizes[size],
        focusRing,
        'inline-flex items-center justify-center font-semibold transition active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...(isButton ? { type: 'button', disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </Component>
  )
}
