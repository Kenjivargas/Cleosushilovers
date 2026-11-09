import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'

/** Full-screen view of a single image. Tap outside it, the X, or press Escape to close. */
export function ImageLightbox({ open, onClose, src, alt, caption }) {
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-black/90 text-white backdrop-blur-md"
    >
      <div className="flex justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            focusRing,
            'grid size-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-95',
          )}
        >
          <X className="size-6" />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 pb-[max(2rem,env(safe-area-inset-bottom))]"
        onClick={onClose}
      >
        <img
          src={src}
          alt={alt}
          onClick={(event) => event.stopPropagation()}
          className="animate-zoom-in max-h-full w-full max-w-md rounded-3xl object-contain shadow-2xl"
        />
        {caption && <div className="text-center">{caption}</div>}
      </div>
    </div>,
    document.body,
  )
}
