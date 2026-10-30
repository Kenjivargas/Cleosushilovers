import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui'
import { formatCents } from '@/shared/lib/money'
import { lineTotalCents } from '@/features/cart/services/cartService'

export function OrderSummaryCard({ items, totalCents }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <Link to="/order" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
          Edit
        </Link>
      </div>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4">
            <span className="min-w-0">
              <span className="font-semibold">{item.quantity}×</span> {item.name}
            </span>
            <span className="shrink-0 tabular-nums">{formatCents(lineTotalCents(item))}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold text-primary tabular-nums">{formatCents(totalCents)}</span>
      </div>
    </Card>
  )
}
