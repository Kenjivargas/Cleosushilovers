import { cn } from '@/shared/lib/cn'

const tones = {
  primary: 'bg-primary/15 text-primary',
  accent: 'bg-accent/15 text-accent',
  heart: 'bg-heart/12 text-heart',
  muted: 'bg-muted text-muted-foreground',
  danger: 'bg-destructive/15 text-destructive',
}

export function Badge({ tone = 'primary', className, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}
      {...props}
    />
  )
}
