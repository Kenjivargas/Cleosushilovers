import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'

export function Switch({ checked, onChange, label, description, disabled, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        focusRing,
        'flex min-h-11 w-full items-center justify-between gap-4 rounded-3xl text-left disabled:opacity-50',
        className,
      )}
    >
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-semibold">{label}</span>}
          {description && <span className="block text-sm text-muted-foreground">{description}</span>}
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors',
          checked ? 'border-success bg-success' : 'border-border bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5.5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5.5' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}
