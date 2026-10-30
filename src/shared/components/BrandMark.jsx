import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { LOGO_URL, SHOP_NAME, SHOP_TAGLINE } from '@/shared/lib/config'

export function BrandMark({ to = '/', subtitle = SHOP_TAGLINE }) {
  return (
    <Link to={to} className={cn(focusRing, 'flex min-w-0 items-center gap-3 rounded-3xl')}>
      {/* The logo has a cream background, so it sits in a tile that reads well in both themes. */}
      <img
        src={LOGO_URL}
        alt=""
        width="44"
        height="44"
        className="size-11 shrink-0 rounded-2xl border border-border object-cover shadow-sm"
      />
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-brand text-[0.8rem] tracking-wide uppercase sm:text-sm">{SHOP_NAME}</span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[0.65rem] font-semibold tracking-[0.18em] text-accent uppercase">
            {subtitle}
          </span>
        )}
      </span>
    </Link>
  )
}
