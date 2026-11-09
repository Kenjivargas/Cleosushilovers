import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react'
import { Alert, Button, Card, EmptyState } from '@/shared/components/ui'
import { formatCents } from '@/shared/lib/money'
import { CheckoutSteps } from '@/features/checkout/components/CheckoutSteps'
import { CartItemRow } from '../components/CartItemRow'
import { useCart } from '../hooks/useCart'
import { useCartSync } from '../hooks/useCartSync'

export function CartPage() {
  const navigate = useNavigate()
  const { items, itemCount, totalCents, setQuantity, clearCart } = useCart()
  const { ready, menuError, changes, products } = useCartSync()
  // Prefer the live menu photo (the admin may have changed it); fall back to the one saved with the item.
  const imageFor = (item) => products.find((p) => p.id === item.productId)?.imageUrl ?? item.imageUrl ?? null

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        {changes.length > 0 && <SyncNotice changes={changes} />}
        <EmptyState
          icon={ShoppingBag}
          title="Your order is empty"
          description="Browse the menu and tap “Add” on the sushi you'd like."
          action={
            <Button as={Link} to="/">
              Browse the menu
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CheckoutSteps current={0} />

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Review your order</h1>
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
          <Button variant="ghost" size="sm" onClick={clearCart} className="-mr-3 whitespace-nowrap text-destructive">
            <Trash2 className="size-4" aria-hidden="true" />
            Clear all
          </Button>
        </div>
      </div>

      {changes.length > 0 && <SyncNotice changes={changes} />}
      {menuError && (
        <Alert tone="error" title="Couldn't check the latest prices">
          Prices shown are from when you added the items. We'll confirm the final total on Messenger.
        </Alert>
      )}

      <Card padding="sm" className="sm:p-6">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              imageUrl={imageFor(item)}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
            />
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary tabular-nums">{formatCents(totalCents)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Delivery fee, if any, will be confirmed on Messenger.</p>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button as={Link} to="/" variant="secondary">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Add more items
        </Button>
        <Button size="lg" onClick={() => navigate('/checkout')} loading={!ready} disabled={!ready}>
          Confirm order
        </Button>
      </div>
    </div>
  )
}

function SyncNotice({ changes }) {
  return (
    <Alert tone="info" title="We updated your order to match the current menu">
      <ul className="list-disc space-y-0.5 pl-4">
        {changes.map((change) => (
          <li key={change}>{change}</li>
        ))}
      </ul>
    </Alert>
  )
}
