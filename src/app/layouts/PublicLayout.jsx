import { Link, Outlet, useLocation } from 'react-router-dom'
import { Anchor, Heart } from 'lucide-react'
import { BrandMark } from '@/shared/components/BrandMark'
import { FindUsSection } from '@/shared/components/shop/FindUsSection'
import { SHOP_MOTTO, SHOP_NAME } from '@/shared/lib/config'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { CartBar } from '@/features/cart/components/CartBar'
import { CartButton } from '@/features/cart/components/CartButton'

export function PublicLayout() {
  // "Find us" (map, Facebook, Messenger, location) belongs on the landing/menu page only,
  // not during ordering (review order, delivery details, order slip).
  const { pathname } = useLocation()
  const showFindUs = pathname === '/'

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <BrandMark />
          </div>
          <ThemeToggle />
          <CartButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-32">
        <Outlet />
      </main>

      <footer className="border-t border-border pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
          {showFindUs && (
            <div className="mb-5 w-full">
              <FindUsSection />
            </div>
          )}
          <p className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] text-accent uppercase">
            <Anchor className="size-4" aria-hidden="true" />
            {SHOP_MOTTO}
            <Heart className="size-3.5 fill-heart text-heart" aria-hidden="true" />
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SHOP_NAME} ·{' '}
            <Link to="/admin" className="underline-offset-4 hover:text-foreground hover:underline">
              Staff
            </Link>
          </p>
        </div>
      </footer>

      <CartBar />
    </div>
  )
}
