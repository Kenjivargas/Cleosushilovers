import { Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/shared/components/ui'
import { formatPrice } from '@/shared/lib/money'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'
import { useCart } from '@/features/cart/hooks/useCart'
import { ProductImage } from './ProductImage'

export function ProductCard({ product }) {
  const { getQuantity, addItem, setQuantity } = useCart()
  const quantity = getQuantity(product.id)
  const soldOut = !product.isAvailable

  return (
    <Card padding="sm" as="article" className="flex gap-4 sm:flex-col">
      <ProductImage
        src={product.imageUrl}
        alt={product.name}
        className="size-28 shrink-0 rounded-2xl sm:aspect-[4/3] sm:size-auto sm:w-full"
        dimmed={soldOut}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {(product.tags.length > 0 || soldOut) && (
          <div className="flex flex-wrap gap-1.5">
            {soldOut && <Badge tone="danger">Sold out</Badge>}
            {product.tags.map((tag) => (
              <Badge key={tag.id} tone={/best/i.test(tag.name) ? 'heart' : 'accent'}>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-semibold leading-snug">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
          {quantity > 0 ? (
            <QuantityStepper
              value={quantity}
              onChange={(next) => setQuantity(product.id, next)}
              label={product.name}
            />
          ) : (
            <Button size="sm" onClick={() => addItem(product)} disabled={soldOut}>
              <Plus className="size-4" aria-hidden="true" />
              Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
