import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { formatPrice } from '@/shared/lib/money'
import { QuantityStepper } from '@/features/cart/components/QuantityStepper'

/**
 * Full-screen photo of a menu item. Tap outside the photo, the X, or press Escape to close.
 * The item can be added to the order straight from here.
 */
export function ProductImageViewer({ product, open, onClose, quantity, onAdd, onQuantityChange }) {
  const titleId = useId()
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus?.()
    }
  }, [open])

  if (!open) return null

  const soldOut = !product.isAvailable

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/90 text-white backdrop-blur-md"
    >
      <div className="flex justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className={cn(
            focusRing,
            'grid size-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-95',
          )}
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Tapping the empty space around the photo closes the viewer. */}
      <div className="flex min-h-0 flex-1 items-center justify-center p-4" onClick={onClose}>
        <img
          src={product.imageUrl}
          alt={product.name}
          onClick={(event) => event.stopPropagation()}
          className="animate-zoom-in max-h-full max-w-full rounded-2xl object-contain shadow-2xl sm:max-w-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-xl">
          <h2 id={titleId} className="font-semibold leading-snug">
            {product.name}
          </h2>
          {product.description && <p className="mt-1 text-sm text-white/75">{product.description}</p>}
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-display text-lg font-extrabold text-primary">{formatPrice(product.price)}</span>
            {quantity > 0 ? (
              <div className="text-foreground">
                <QuantityStepper value={quantity} onChange={onQuantityChange} label={product.name} />
              </div>
            ) : (
              <Button size="sm" onClick={onAdd} disabled={soldOut}>
                {soldOut ? (
                  'Sold out'
                ) : (
                  <>
                    <Plus className="size-4" aria-hidden="true" />
                    Add to order
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
