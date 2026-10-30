import { UtensilsCrossed } from 'lucide-react'
import { Alert, Button, EmptyState } from '@/shared/components/ui'
import { SectionHeading } from '@/shared/components/SectionHeading'
import { CategoryNav, categoryAnchorId } from '../components/CategoryNav'
import { MenuHero } from '../components/MenuHero'
import { MenuSkeleton } from '../components/MenuSkeleton'
import { ProductCard } from '../components/ProductCard'
import { useActiveSection } from '../hooks/useActiveSection'
import { useMenu } from '../hooks/useMenu'

export function MenuPage() {
  const { categories, status, error, reload } = useMenu()
  const activeId = useActiveSection(
    categories.map((c) => c.id),
    categoryAnchorId,
  )

  return (
    <div className="space-y-6">
      <MenuHero />

      {status === 'loading' && <MenuSkeleton />}

      {status === 'error' && (
        <Alert
          tone="error"
          title="The menu didn't load"
          action={
            <Button variant="secondary" size="sm" onClick={reload}>
              Try again
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {status === 'success' && categories.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title="Menu coming soon"
          description="We're preparing something delicious. Please check back shortly."
        />
      )}

      {status === 'success' && categories.length > 0 && (
        <>
          <CategoryNav categories={categories} activeId={activeId} />
          <div className="space-y-10">
            {categories.map((category) => (
              <section
                key={category.id}
                id={categoryAnchorId(category.id)}
                data-section-id={category.id}
                aria-labelledby={`${categoryAnchorId(category.id)}-title`}
                className="scroll-mt-36 space-y-4"
              >
                <SectionHeading id={`${categoryAnchorId(category.id)}-title`}>{category.name}</SectionHeading>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
