import { MapPin, MessageCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { FACEBOOK_PAGE_URL, MESSENGER_URL } from '@/shared/lib/config'
import { FacebookIcon } from './FacebookIcon'
import { FIND_US_ID } from './FindUsSection'

const external = { target: '_blank', rel: 'noopener noreferrer' }

// Icon beside the label in a single slim row; small text on phones keeps all three on one line.
const linkClass = 'min-h-11 gap-1.5 px-1 text-xs sm:px-2 sm:text-sm'

// "Location" jumps to the Find us section (map, pick-up note, directions) instead of leaving the site.
function scrollToFindUs(event) {
  const target = document.getElementById(FIND_US_ID)
  if (!target) return // not on this page: let the link navigate normally
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Facebook page, Messenger and shop location, as three equal buttons. */
export function ShopLinks({ className }) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      <Button as="a" href={FACEBOOK_PAGE_URL} {...external} variant="secondary" size="sm" className={linkClass}>
        <FacebookIcon className="size-4 shrink-0 text-[#1877f2]" />
        Facebook
      </Button>
      <Button as="a" href={MESSENGER_URL} {...external} variant="secondary" size="sm" className={linkClass}>
        <MessageCircle className="size-4 shrink-0 text-[#0a7cff]" aria-hidden="true" />
        Message
      </Button>
      <Button as="a" href={`/#${FIND_US_ID}`} onClick={scrollToFindUs} variant="secondary" size="sm" className={linkClass}>
        <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
        Location
      </Button>
    </div>
  )
}
