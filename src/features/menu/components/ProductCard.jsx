import { useState } from 'react'
import { Expand, Plus } from 'lucide-react'
import { Badge, Button, Card } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/money'
import { focusRing } from '@/shared/lib/styles'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'
import { useCart } from '@/features/cart/hooks/useCart'
import { ProductImage } from './ProductImage'
import { ProductImageViewer } from './ProductImageViewer'

const imageSize = 'size-24 shrink-0 self-start rounded-2xl min-[380px]:size-28 sm:aspect-[4/3] sm:size-auto sm:w-full'

export function ProductCard({ product }) {
  const { getQuantity, addItem, setQuantity } = useCart()
  const quantity = getQuantity(product.id)
  const soldOut = !product.isAvailable
  const [viewerOpen, setViewerOpen] = useState(false)

  return (
    <Card padding="sm" as="article" className="flex gap-3.5 sm:flex-col sm:gap-4">
      {product.imageUrl ? (
        <button
          type="button"
          onClick={() => setViewerOpen(true)}
          aria-label={`View photo of ${product.name}`}
          className={cn(focusRing, imageSize, 'group relative overflow-hidden transition active:scale-[0.97]')}
        >
          <ProductImage
            src={product.imageUrl}
            alt=""
            className="size-full transition duration-300 group-hover:scale-105"
            dimmed={soldOut}
          />
          <span className="absolute right-1.5 bottom-1.5 grid size-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
            <Expand className="size-3.5" aria-hidden="true" />
          </span>
        </button>
      ) : (
        <ProductImage src={product.imageUrl} alt={product.name} className={imageSize} dimmed={soldOut} />
      )}

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
          <h3 className="line-clamp-2 leading-snug font-semibold">{product.name}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-1">
          <span className="font-display text-base whitespace-nowrap sm:text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
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

      <ProductImageViewer
        product={product}
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        quantity={quantity}
        onAdd={() => addItem(product)}
        onQuantityChange={(next) => setQuantity(product.id, next)}
      />
    </Card>
  )
}
