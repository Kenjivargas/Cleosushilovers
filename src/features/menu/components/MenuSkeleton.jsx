import { Card } from '@/shared/components/ui'

export function MenuSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} padding="sm" className="flex animate-pulse gap-4 sm:flex-col">
          <div className="size-28 shrink-0 rounded-2xl bg-muted sm:aspect-[4/3] sm:size-auto sm:w-full" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 w-3/4 rounded-full bg-muted" />
            <div className="h-3 w-full rounded-full bg-muted" />
            <div className="h-3 w-1/2 rounded-full bg-muted" />
          </div>
        </Card>
      ))}
    </div>
  )
}
