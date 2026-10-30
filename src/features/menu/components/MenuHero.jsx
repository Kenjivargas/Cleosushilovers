import { Anchor, Heart } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import { LOGO_URL, SHOP_MOTTO, SHOP_NAME } from '@/shared/lib/config'

export function MenuHero() {
  return (
    <Card as="section" className="relative overflow-hidden">
      {/* Faint anchor watermark, like the one behind the logo. */}
      <Anchor
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-10 -bottom-10 size-64 text-tan opacity-15"
      />
      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <img
          src={LOGO_URL}
          alt={`${SHOP_NAME} logo`}
          width="176"
          height="176"
          className="size-40 shrink-0 rounded-3xl border border-border object-cover sm:size-44"
        />
        <div className="space-y-3">
          <p className="flex flex-col items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-accent uppercase sm:flex-row sm:gap-2">
            <Anchor className="size-4 shrink-0" aria-hidden="true" />
            {SHOP_MOTTO}
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sushi made with{' '}
            <span className="whitespace-nowrap text-primary">
              love <Heart className="mb-1 inline size-7 fill-heart text-heart" aria-hidden="true" />
            </span>
          </h1>
          <p className="max-w-lg text-muted-foreground">
            Add what you're craving, confirm your order, then send us your order slip on Messenger.
          </p>
        </div>
      </div>
    </Card>
  )
}
