import { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'

export function categoryAnchorId(categoryId) {
  return `category-${categoryId}`
}

export function CategoryNav({ categories, activeId }) {
  const listRef = useRef(null)

  const jumpTo = (id) => {
    document.getElementById(categoryAnchorId(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Keep the active chip visible as the visitor scrolls through the menu.
  // Only the strip scrolls sideways; scrollIntoView would also move the page.
  useEffect(() => {
    const list = listRef.current
    const chip = list?.querySelector('[aria-current="true"]')
    if (!list || !chip) return
    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2
    list.scrollTo({ left, behavior: 'smooth' })
  }, [activeId])

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-16 z-20 -mx-4 bg-background/85 py-2 backdrop-blur-xl sm:top-[4.5rem] sm:mx-0"
    >
      <ul
        ref={listRef}
        className="scrollbar-none flex gap-2 overflow-x-auto overscroll-x-contain px-4 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-2rem),transparent)] sm:px-0 sm:[mask-image:none]"
      >
        {categories.map((category) => {
          const active = category.id === activeId
          return (
            <li key={category.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jumpTo(category.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  focusRing,
                  'min-h-11 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition active:scale-95',
                  active
                    ? 'border-foreground bg-foreground text-background shadow-md'
                    : 'border-border bg-card/95 text-muted-foreground hover:text-foreground',
                )}
              >
                {category.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
