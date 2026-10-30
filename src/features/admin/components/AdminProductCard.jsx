import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Badge, Button, Card, Switch } from '@/shared/components/ui'
import { formatPrice } from '@/shared/lib/money'
import { ProductImage } from '@/features/menu/components/ProductImage'

export function AdminProductCard({ product, tagsById, onEdit, onToggleAvailability }) {
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState(null)

  const toggle = async (next) => {
    setToggling(true)
    setError(null)
    try {
      await onToggleAvailability(product.id, next)
    } catch (err) {
      setError(err.message)
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card padding="sm" as="li" className="flex flex-col gap-3">
      <div className="flex gap-3">
        <ProductImage
          src={product.imageUrl}
          alt=""
          className="size-20 shrink-0 rounded-2xl"
          dimmed={!product.isAvailable}
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{product.name}</p>
          <p className="font-display text-lg font-extrabold text-primary">{formatPrice(product.price)}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {product.tagIds.map((id) =>
              tagsById.get(id) ? (
                <Badge key={id} tone="accent">
                  {tagsById.get(id).name}
                </Badge>
              ) : null,
            )}
            {!product.imageUrl && <Badge tone="muted">No photo</Badge>}
          </div>
        </div>
        <Button variant="secondary" size="icon" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}>
          <Pencil className="size-4" />
        </Button>
      </div>
      <div className="border-t border-border pt-2">
        <Switch
          checked={product.isAvailable}
          onChange={toggle}
          disabled={toggling}
          label={product.isAvailable ? 'Available' : 'Sold out'}
          description={product.isAvailable ? 'Customers can order this.' : 'Shown as sold out on the menu.'}
        />
        {error && <p className="px-1 text-sm text-destructive">{error}</p>}
      </div>
    </Card>
  )
}
