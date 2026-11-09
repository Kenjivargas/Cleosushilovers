import { useState } from 'react'
import { Anchor, Heart } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import { ImageLightbox } from '@/shared/components/ImageLightbox'
import { ShopLinks } from '@/shared/components/shop/ShopLinks'
import { cn } from '@/shared/lib/cn'
import { LOGO_URL, SHOP_MOTTO, SHOP_NAME } from '@/shared/lib/config'
import { focusRing } from '@/shared/lib/styles'

export function MenuHero() {
  const [logoOpen, setLogoOpen] = useState(false)

  return (
    <Card as="section" padding="none" className="relative overflow-hidden p-4 sm:p-6">
      {/* Faint anchor watermark, like the one behind the logo. */}
      <Anchor
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-8 -bottom-8 size-36 text-tan opacity-15 sm:-right-10 sm:-bottom-10 sm:size-64"
      />

      {/*
        Phones: logo beside the motto + headline, then the text and links full width.
        From `sm` up: a big logo on the left with everything else stacked beside it.
      */}
      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 sm:gap-x-6">
        <button
          type="button"
          onClick={() => setLogoOpen(true)}
          aria-label={`View ${SHOP_NAME} logo`}
          className={cn(
            focusRing,
            'group relative size-20 shrink-0 overflow-hidden rounded-2xl border border-border shadow-sm transition active:scale-95 sm:row-span-2 sm:size-44 sm:rounded-3xl',
          )}
        >
          <img
            src={LOGO_URL}
            alt=""
            width="176"
            height="176"
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        </button>

        <div className="space-y-2 sm:space-y-3 sm:self-end">
          <p className="flex items-start gap-1.5 text-[0.65rem] leading-snug font-bold tracking-[0.1em] text-balance text-accent uppercase sm:items-center sm:gap-2 sm:text-xs sm:tracking-[0.2em]">
            <Anchor className="mt-px size-3 shrink-0 sm:mt-0 sm:size-4" aria-hidden="true" />
            {SHOP_MOTTO}
          </p>
          <h1 className="font-display text-[1.4rem] leading-[1.15] font-extrabold tracking-tight sm:text-4xl sm:leading-tight">
            Sushi made with
            {/* Phones always break before "love" so the headline reads as two even lines. */}
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            <span className="whitespace-nowrap text-primary">
              love{' '}
              <Heart className="mb-1 inline size-5 fill-heart text-heart sm:size-7" aria-hidden="true" />
            </span>
          </h1>
        </div>

        <div className="col-span-2 space-y-3 sm:col-span-1 sm:col-start-2 sm:self-start">
          <p className="max-w-lg text-sm text-pretty text-muted-foreground sm:text-base">
            Add what you're craving, confirm your order, then send us your order slip on Messenger.
          </p>
          <ShopLinks className="w-full sm:max-w-md" />
        </div>
      </div>

      <ImageLightbox
        open={logoOpen}
        onClose={() => setLogoOpen(false)}
        src={LOGO_URL}
        alt={`${SHOP_NAME} logo`}
        caption={
          <>
            <p className="font-display text-lg font-bold">{SHOP_NAME}</p>
            <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-white/70 uppercase">{SHOP_MOTTO}</p>
          </>
        }
      />
    </Card>
  )
}
