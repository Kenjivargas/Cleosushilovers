import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '@/features/cart/hooks/useCart'
import { CheckoutSteps } from '../components/CheckoutSteps'
import { DeliveryForm } from '../components/DeliveryForm'
import { OrderSummaryCard } from '../components/OrderSummaryCard'
import { useDeliveryForm } from '../hooks/useDeliveryForm'
import { buildOrder, saveLastOrder } from '../services/orderSlipService'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalCents } = useCart()
  const form = useDeliveryForm((customer) => {
    saveLastOrder(buildOrder(items, customer))
    navigate('/checkout/slip')
  })

  if (items.length === 0) return <Navigate to="/order" replace />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CheckoutSteps current={1} />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Delivery details</h1>
        <p className="text-muted-foreground">Where should we bring your sushi?</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <DeliveryForm
          values={form.values}
          errors={form.errors}
          onFieldChange={form.setField}
          onSubmit={form.handleSubmit}
        />
        <div className="lg:sticky lg:top-24">
          <OrderSummaryCard items={items} totalCents={totalCents} />
        </div>
      </div>
    </div>
  )
}
