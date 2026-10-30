import { cn } from '@/shared/lib/cn'
import { surface } from '@/shared/lib/styles'

const paddings = {
  default: 'p-6',
  sm: 'p-4',
  none: '',
}

export function Card({ as: Component = 'div', padding = 'default', className, ...props }) {
  return <Component className={cn(surface, paddings[padding], 'text-card-foreground', className)} {...props} />
}
