import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { LOGO_URL, SHOP_NAME, SHOP_TAGLINE } from '@/shared/lib/config'

export function BrandMark({ to = '/', subtitle = SHOP_TAGLINE }) {
  return (
    <Link to={to} className={cn(focusRing, 'flex min-w-0 items-center gap-2.5 rounded-3xl sm:gap-3')}>
      {/* The logo has a cream background, so it sits in a tile that reads well in both themes. */}
      <img
        src={LOGO_URL}
        alt=""
        width="44"
        height="44"
        className="size-10 shrink-0 rounded-2xl sm:size-11 border border-border object-cover shadow-sm"
      />
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-brand text-[0.72rem] uppercase min-[380px]:text-[0.8rem] min-[380px]:tracking-wide sm:text-sm">{SHOP_NAME}</span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[0.6rem] font-semibold tracking-[0.14em] sm:text-[0.65rem] sm:tracking-[0.18em] text-accent uppercase">
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  )
}
