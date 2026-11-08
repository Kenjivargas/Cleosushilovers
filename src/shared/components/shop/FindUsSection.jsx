import { lazy, Suspense } from 'react'
import { MessageCircle, Navigation, Store } from 'lucide-react'
import { Button, Card } from '@/shared/components/ui'
import { MESSENGER_URL, SHOP_LOCATION } from '@/shared/lib/config'
import { toGoogleDirectionsUrl } from '@/shared/lib/maps'
import { useInView } from '@/shared/hooks/useInView'

export const FIND_US_ID = 'find-us'

// The map code only downloads when this section scrolls into view.
const ShopMap = lazy(() => import('@/shared/map/ShopMap'))

function MapPlaceholder() {
  return <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" />
}

export function FindUsSection() {
  const [ref, inView] = useInView()

  return (
    <Card
      as="section"
      id={FIND_US_ID}
      padding="none"
      aria-labelledby="find-us-title"
      className="w-full scroll-mt-24 overflow-hidden text-left"
    >
      <div ref={ref} className="grid sm:grid-cols-2">
        <div className="relative h-48 border-b border-border sm:h-auto sm:min-h-64 sm:border-r sm:border-b-0">
          {inView ? (
            <Suspense fallback={<MapPlaceholder />}>
              <ShopMap location={SHOP_LOCATION} className="absolute inset-0" />
            </Suspense>
          ) : (
            <MapPlaceholder />
          )}
        </div>

        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <h2 id="find-us-title" className="font-display text-lg font-bold">
              Find us
            </h2>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Store className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              Pick-up is available at our shop. Message us first so your order is ready when you arrive.
            </p>
          </div>
          <Button
            as="a"
            href={toGoogleDirectionsUrl(SHOP_LOCATION)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Navigation className="size-4" aria-hidden="true" />
            Get directions
          </Button>
          <Button as="a" href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full">
            <MessageCircle className="size-4 text-[#0a7cff]" aria-hidden="true" />
            Message us before pick-up
          </Button>
        </div>
      </div>
    </Card>
  )
}
