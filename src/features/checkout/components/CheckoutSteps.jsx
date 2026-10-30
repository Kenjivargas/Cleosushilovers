import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const STEPS = ['Review order', 'Delivery details', 'Order slip']

export function CheckoutSteps({ current }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold sm:text-sm" aria-label="Checkout progress">
      {STEPS.map((label, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border',
                done && 'border-success bg-success text-white',
                active && 'border-primary bg-primary text-primary-foreground',
                !done && !active && 'border-border bg-card text-muted-foreground',
              )}
            >
              {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className={cn('leading-tight', active ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
            {index < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
