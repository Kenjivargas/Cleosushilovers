import { useState } from 'react'
import { Fish } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function ProductImage({ src, alt, className, dimmed = false }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('size-full object-cover', dimmed && 'opacity-50 grayscale')}
        />
      ) : (
        <div className="grid size-full place-items-center text-muted-foreground/60" aria-hidden="true">
          <Fish className="size-10" />
        </div>
      )}
    </div>
  )
}
