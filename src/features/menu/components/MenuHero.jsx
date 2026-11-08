import { Anchor, Heart } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import { ShopLinks } from '@/shared/components/shop/ShopLinks'
import { LOGO_URL, SHOP_MOTTO, SHOP_NAME } from '@/shared/lib/config'

export function MenuHero() {
  return (
    <Card as="section" padding="none" className="relative overflow-hidden p-5 sm:p-6">
      {/* Faint anchor watermark, like the one behind the logo. */}
      <Anchor
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-tan opacity-15 sm:-right-10 sm:-bottom-10 sm:size-64"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* On phones the logo sits beside the motto so the menu shows up sooner. */}
        <div className="flex items-center gap-4 sm:contents">
          <img
            src={LOGO_URL}
            alt={`${SHOP_NAME} logo`}
            width="176"
            height="176"
            className="size-20 shrink-0 rounded-2xl border border-border object-cover shadow-sm sm:size-44 sm:rounded-3xl"
          />
          <p className="flex items-start gap-1.5 text-[0.7rem] leading-relaxed font-bold tracking-[0.14em] text-balance text-accent uppercase sm:hidden">
            <Anchor className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {SHOP_MOTTO}
          </p>
        </div>

        <div className="space-y-3">
          <p className="hidden items-center gap-2 text-xs font-bold tracking-[0.2em] text-accent uppercase sm:flex">
            <Anchor className="size-4 shrink-0" aria-hidden="true" />
            {SHOP_MOTTO}
          </p>
          <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-tight sm:text-4xl">
            Sushi made with{' '}
            <span className="whitespace-nowrap text-primary">
              love <Heart className="mb-1 inline size-6 fill-heart text-heart sm:size-7" aria-hidden="true" />
            </span>
          </h1>
          <p className="max-w-lg text-[0.95rem] text-pretty text-muted-foreground sm:text-base">
            Add what you're craving, confirm your order, then send us your order slip on Messenger.
          </p>
          <ShopLinks className="w-full pt-1 sm:max-w-md" />
        </div>
      </div>
    </Card>
  )
}
