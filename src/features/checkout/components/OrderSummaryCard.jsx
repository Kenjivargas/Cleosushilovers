import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { formatCents, formatPrice } from '@/shared/lib/money'
import { focusRing } from '@/shared/lib/styles'
import { lineTotalCents } from '@/features/cart/services/cartService'
import { ProductImage } from '@/features/menu/components/ProductImage'

export function OrderSummaryCard({ items, totalCents }) {
  return (
    <Card padding="sm" className="space-y-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-bold sm:text-xl">Order summary</h2>
        <Link
          to="/order"
          className={cn(
            focusRing,
            '-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-primary hover:bg-muted',
          )}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit
        </Link>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3">
            <ProductImage src={item.imageUrl} alt="" className="size-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm leading-snug font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">{formatCents(lineTotalCents(item))}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-primary tabular-nums">{formatCents(totalCents)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Delivery fee, if any, will be confirmed on Messenger.</p>
      </div>
    </Card>
  )
}
