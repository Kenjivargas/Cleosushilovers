import { formatCents, formatPrice } from '@/shared/lib/money'
import { lineTotalCents } from '../services/cartService'
import { QuantityStepper } from './QuantityStepper'

export function CartItemRow({ item, onQuantityChange }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
      <div className="min-w-0 flex-1 basis-40">
        <p className="font-semibold leading-snug">{item.name}</p>
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
      </div>
      <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
        <QuantityStepper value={item.quantity} onChange={onQuantityChange} label={item.name} />
        <span className="min-w-24 text-right font-bold tabular-nums">{formatCents(lineTotalCents(item))}</span>
      </div>
    </li>
  )
}
