import { MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { FACEBOOK_PAGE_URL, MESSENGER_URL, SHOP_LOCATION } from '@/shared/lib/config'
import { toGoogleMapsUrl } from '@/shared/lib/maps'
import { FacebookIcon } from './FacebookIcon'

const external = { target: '_blank', rel: 'noopener noreferrer' }

/** Facebook page, Messenger and shop location, as three equal buttons. */
export function ShopLinks({ className }) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      <Button as="a" href={FACEBOOK_PAGE_URL} {...external} variant="secondary" size="sm" className="px-2">
        <FacebookIcon className="size-4 shrink-0 text-[#1877f2]" />
        Facebook
      </Button>
      <Button as="a" href={MESSENGER_URL} {...external} variant="secondary" size="sm" className="px-2">
        <MessageCircle className="size-4 shrink-0 text-[#0a7cff]" aria-hidden="true" />
        Message
      </Button>
      <Button as="a" href={toGoogleMapsUrl(SHOP_LOCATION)} {...external} variant="secondary" size="sm" className="px-2">
        <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Location
      </Button>
    </div>
  )
}
