import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Check, CircleCheck, Copy, ImageDown, MessageCircle, PencilLine, RotateCcw } from 'lucide-react'
import { Alert, Button, Card, Spinner } from '@/shared/components/ui'
import { MESSENGER_URL } from '@/shared/lib/config'
import { useCart } from '@/features/cart/hooks/useCart'
import { CheckoutSteps } from '../components/CheckoutSteps'
import { useOrderSlip } from '../hooks/useOrderSlip'
import { isValidLocation } from '../services/locationService'
import { clearLastOrder, formatOrderAsText, loadLastOrder } from '../services/orderSlipService'

export function OrderSlipPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [order] = useState(loadLastOrder)
  const slip = useOrderSlip(order)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!order) return <Navigate to="/order" replace />

  const hasPin = isValidLocation(order.customer.location)

  const handleSave = async () => {
    setSaving(true)
    if ((await slip.saveToPhotos()) === 'saved') setSaved(true)
    setSaving(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatOrderAsText(order))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const startNewOrder = () => {
    clearCart()
    clearLastOrder()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CheckoutSteps current={2} />
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Your order slip is ready</h1>
        <p className="text-muted-foreground">
          Order <span className="font-semibold text-foreground">{order.ref}</span>. Send it to us on Messenger to
          confirm.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        <Card padding="sm" className="space-y-3 overflow-hidden">
          {slip.status === 'loading' && (
            <div className="grid aspect-[3/4] place-items-center text-muted-foreground" role="status">
              <Spinner className="size-8" label="Creating your order slip" />
            </div>
          )}
          {slip.status === 'error' && (
            <Alert tone="error" title="We couldn't create the image">
              Use “Copy order details” instead and paste it into Messenger.
            </Alert>
          )}
          {slip.status === 'ready' && (
            <>
              <img
                src={slip.imageUrl}
                alt={`Order slip ${order.ref}`}
                className="w-full rounded-2xl border border-border"
              />
              <p className="px-2 pb-1 text-center text-sm text-muted-foreground">
                Tip: you can also <span className="font-semibold text-foreground">press and hold</span> the image and
                choose <span className="font-semibold text-foreground">Save to Photos</span>.
              </p>
            </>
          )}
        </Card>

        {/* Actions come first on phones so customers don't scroll past the long slip to find them. */}
        <div className="order-first space-y-4 lg:sticky lg:top-24 lg:order-none">
          <Card className="space-y-4">
            <h2 className="font-display text-xl font-semibold">How to send your order</h2>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className={saved ? 'line-through decoration-success/60' : undefined}>
                <span className="font-semibold text-foreground">1.</span> Save your order slip to your Photos.
              </li>
              <li>
                <span className="font-semibold text-foreground">2.</span> Open our page on Messenger.
              </li>
              <li>
                <span className="font-semibold text-foreground">3.</span> Send the photo in the chat.
                {hasPin && ' Paste your copied order details too, so we get your map pin.'}
              </li>
            </ol>

            {saved && (
              <p className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm font-semibold">
                <CircleCheck className="size-5 shrink-0 text-success" aria-hidden="true" />
                Saved! Now send it to us on Messenger.
              </p>
            )}

            <div className="grid gap-3">
              {saved ? (
                <>
                  <Button as="a" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" size="lg">
                    <MessageCircle className="size-5" />
                    Open Messenger
                  </Button>
                  <Button variant="secondary" onClick={handleSave} loading={saving}>
                    {!saving && <ImageDown className="size-5" />}
                    Save again
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={handleSave}
                      loading={saving}
                      disabled={slip.status !== 'ready'}
                    >
                      {!saving && <ImageDown className="size-5" />}
                      Save to Photos
                    </Button>
                    <p className="px-2 text-center text-xs text-muted-foreground">
                      {slip.savesViaShareSheet ? (
                        <>
                          In the menu that opens, tap <span className="font-semibold text-foreground">Save Image</span>.
                        </>
                      ) : (
                        "It'll be saved to your phone's gallery."
                      )}
                    </p>
                  </div>
                  <Button as="a" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                    <MessageCircle className="size-5 text-[#0a7cff]" />
                    Open Messenger
                  </Button>
                </>
              )}
              <Button variant={hasPin ? 'secondary' : 'ghost'} onClick={handleCopy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copied!' : 'Copy order details'}
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button as={Link} to="/checkout" variant="secondary" size="sm">
              <PencilLine className="size-4" />
              Edit details
            </Button>
            <Button variant="secondary" size="sm" onClick={startNewOrder}>
              <RotateCcw className="size-4" />
              New order
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
