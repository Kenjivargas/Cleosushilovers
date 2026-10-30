import { LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function Spinner({ className, label }) {
  return (
    <>
      <LoaderCircle aria-hidden="true" className={cn('size-5 animate-spin', className)} />
      {label && <span className="sr-only">{label}</span>}
    </>
  )
}

export function PageSpinner({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[50dvh] place-items-center text-muted-foreground" role="status">
      <Spinner className="size-8" label={label} />
    </div>
  )
}
