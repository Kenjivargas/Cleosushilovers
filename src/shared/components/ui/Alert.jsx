import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

const tones = {
  info: { icon: Info, className: 'border-accent/40 bg-accent/10' },
  success: { icon: CircleCheck, className: 'border-success/40 bg-success/10' },
  error: { icon: CircleAlert, className: 'border-destructive/40 bg-destructive/10' },
}

export function Alert({ tone = 'info', title, children, action, className }) {
  const { icon: Icon, className: toneClass } = tones[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-3xl border p-4 text-sm', toneClass, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-muted-foreground">{children}</div>}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
}
