import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Check, Copy, Download, MessageCircle, PencilLine, RotateCcw, Share2 } from 'lucide-react'
import { Alert, Button, Card, Spinner } from '@/shared/components/ui'
import { MESSENGER_URL } from '@/shared/lib/config'
import { useCart } from '@/features/cart/hooks/useCart'
import { CheckoutSteps } from '../components/CheckoutSteps'
import { useOrderSlip } from '../hooks/useOrderSlip'
import { clearLastOrder, formatOrderAsText, loadLastOrder } from '../services/orderSlipService'

export function OrderSlipPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [order] = useState(loadLastOrder)
  const slip = useOrderSlip(order)
  const [downloaded, setDownloaded] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!order) return <Navigate to="/order" replace />

  const handleDownload = () => {
    slip.download()
    setDownloaded(true)
  }

  const handleShare = async () => {
    if (await slip.share()) setDownloaded(true)
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
        <Card padding="sm" className="overflow-hidden">
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
            <img
              src={slip.imageUrl}
              alt={`Order slip ${order.ref}`}
              className="w-full rounded-2xl border border-border"
            />
          )}
        </Card>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Card className="space-y-4">
            <h2 className="font-display text-xl font-semibold">How to send your order</h2>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">1.</span> Download (or share) your order slip.
              </li>
              <li>
                <span className="font-semibold text-foreground">2.</span> Open our page on Messenger.
              </li>
              <li>
                <span className="font-semibold text-foreground">3.</span> Attach the image and send it to us.
              </li>
            </ol>

            <div className="grid gap-3">
              <Button size="lg" onClick={handleDownload} disabled={slip.status !== 'ready'}>
                {downloaded ? <Check className="size-5" /> : <Download className="size-5" />}
                {downloaded ? 'Downloaded' : 'Download order slip'}
              </Button>
              {slip.canShare && (
                <Button variant="secondary" onClick={handleShare}>
                  <Share2 className="size-5" />
                  Share image
                </Button>
              )}
              <Button as="a" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
                <MessageCircle className="size-5 text-[#0a7cff]" />
                Open Messenger
              </Button>
              <Button variant="ghost" onClick={handleCopy}>
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
