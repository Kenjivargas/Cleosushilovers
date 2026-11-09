import { formatCents, formatPrice } from '@/shared/lib/money'
import { ProductImage } from '@/features/menu/components/ProductImage'
import { lineTotalCents } from '../services/cartService'
import { QuantityStepper } from './QuantityStepper'

export function CartItemRow({ item, imageUrl, onQuantityChange }) {
  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
      <ProductImage src={imageUrl} alt={item.name} className="size-[4.5rem] shrink-0 rounded-xl sm:size-24 sm:rounded-2xl" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 leading-snug font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <QuantityStepper value={item.quantity} onChange={onQuantityChange} label={item.name} />
          <span className="font-bold tabular-nums">{formatCents(lineTotalCents(item))}</span>
        </div>
      </div>
    </li>
  )
}
