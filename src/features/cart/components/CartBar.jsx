import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { formatCents } from '@/shared/lib/money'
import { useCart } from '../hooks/useCart'

// Floating "View order" bar shown on the menu once something is in the order.
export function CartBar() {
  const { itemCount, totalCents } = useCart()
  const { pathname } = useLocation()

  if (itemCount === 0 || pathname !== '/') return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Link
        to="/order"
        className={cn(
          focusRing,
          'pointer-events-auto mx-auto flex min-h-14 max-w-xl items-center gap-3 rounded-3xl border border-primary bg-primary px-5 text-primary-foreground shadow-2xl transition active:scale-[0.99]',
        )}
      >
        <span className="relative">
          <ShoppingBag className="size-6" aria-hidden="true" />
          <span className="absolute -top-2 -right-2 grid min-w-5 place-items-center rounded-full bg-primary-foreground px-1 text-xs font-bold text-primary">
            {itemCount}
          </span>
        </span>
        <span className="flex-1 font-semibold">View order</span>
        <span className="font-bold tabular-nums">{formatCents(totalCents)}</span>
      </Link>
    </div>
  )
}
