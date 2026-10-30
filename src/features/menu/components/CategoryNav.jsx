import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'

export function categoryAnchorId(categoryId) {
  return `category-${categoryId}`
}

export function CategoryNav({ categories, activeId }) {
  const jumpTo = (id) => {
    document.getElementById(categoryAnchorId(id))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav aria-label="Menu categories" className="sticky top-[4.5rem] z-20 -mx-4 bg-background/80 px-4 py-2 backdrop-blur-xl">
      <ul className="scrollbar-none flex gap-2 overflow-x-auto">
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
                  'min-h-11 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition',
                  active
                    ? 'border-foreground bg-foreground text-background'
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
