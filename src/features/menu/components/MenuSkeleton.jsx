import { Card } from '@/shared/components/ui'

export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} padding="sm" className="flex animate-pulse flex-col gap-2.5 sm:gap-4">
          <div className="aspect-square w-full rounded-xl bg-muted sm:aspect-[4/3] sm:rounded-2xl" />
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
