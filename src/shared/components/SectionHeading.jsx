import { cn } from '@/shared/lib/cn'

/** "—— TITLE ——" heading with tan rules, echoing the logo's tagline. */
export function SectionHeading({ as: Component = 'h2', id, className, children }) {
  return (
    <Component
      id={id}
      className={cn(
        'ruled-heading font-display text-sm font-bold tracking-[0.22em] text-foreground uppercase sm:text-base',
        className,
      )}
    >
      <span className="text-center">{children}</span>
    </Component>
  )
}
