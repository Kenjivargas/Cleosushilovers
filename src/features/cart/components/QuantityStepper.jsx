import { Minus, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { focusRing, surface } from '@/shared/lib/styles'
import { MAX_QUANTITY } from '../services/cartService'

const stepButton = cn(focusRing, 'grid size-11 place-items-center rounded-3xl transition hover:bg-muted active:scale-95')

export function QuantityStepper({ value, onChange, label }) {
  return (
    <div className={cn(surface, 'inline-flex items-center')} role="group" aria-label={`Quantity of ${label}`}>
      <button
        type="button"
        className={stepButton}
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? `Remove ${label}` : `Decrease ${label}`}
      >
        {value === 1 ? <Trash2 className="size-4 text-destructive" /> : <Minus className="size-4" />}
      </button>
      <span className="min-w-8 text-center font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={cn(stepButton, 'disabled:opacity-40')}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={`Increase ${label}`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
