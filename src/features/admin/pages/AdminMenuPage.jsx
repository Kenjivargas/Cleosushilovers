import { useMemo, useState } from 'react'
import { PackageOpen, Plus, Search } from 'lucide-react'
import { Alert, Button, EmptyState, PageSpinner, SelectField, TextField } from '@/shared/components/ui'
import { SectionHeading } from '@/shared/components/SectionHeading'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { AdminLayout } from '../components/AdminLayout'
import { AdminProductCard } from '../components/AdminProductCard'
import { NameListManager } from '../components/NameListManager'
import { ProductFormDialog } from '../components/ProductFormDialog'
import { useAdminMenu } from '../hooks/useAdminMenu'

const TABS = [
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories & tags' },
]

export function AdminMenuPage() {
  const menu = useAdminMenu()
  const [tab, setTab] = useState('products')
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  // undefined = closed, null = new product, object = editing that product
  const [editing, setEditing] = useState(undefined)

  const tagsById = useMemo(() => new Map(menu.tags.map((t) => [t.id, t])), [menu.tags])

  const productCountByCategory = useMemo(() => {
    const counts = new Map()
    menu.products.forEach((p) => counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1))
    return counts
  }, [menu.products])

  const productCountByTag = useMemo(() => {
    const counts = new Map()
    menu.products.forEach((p) => p.tagIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)))
    return counts
  }, [menu.products])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menu.categories
      .filter((c) => categoryFilter === 'all' || c.id === categoryFilter)
      .map((category) => ({
        category,
        products: menu.products.filter(
          (p) => p.categoryId === category.id && (!q || p.name.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.products.length > 0)
  }, [menu.categories, menu.products, query, categoryFilter])

  const closeEditor = () => setEditing(undefined)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Menu manager</h1>
          {tab === 'products' && (
            <Button onClick={() => setEditing(null)} disabled={menu.categories.length === 0}>
              <Plus className="size-5" />
              Add product
            </Button>
          )}
        </div>

        <div role="tablist" aria-label="Menu sections" className="grid grid-cols-2 gap-1 rounded-3xl border border-border bg-card/95 p-1 shadow-2xl backdrop-blur-xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                focusRing,
                'min-h-11 rounded-3xl px-3 text-sm font-semibold transition',
                tab === t.id ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {menu.status === 'loading' && <PageSpinner label="Loading menu" />}
        {menu.status === 'error' && (
          <Alert tone="error" title="Couldn't load the menu" action={<Button variant="secondary" size="sm" onClick={menu.reload}>Try again</Button>}>
            {menu.error}
          </Alert>
        )}

        {menu.status === 'success' && tab === 'products' && (
          <>
            {menu.categories.length === 0 ? (
              <EmptyState
                icon={PackageOpen}
                title="Start with a category"
                description="Create a category like “Maki Rolls”, then add products to it."
                action={<Button onClick={() => setTab('categories')}>Add a category</Button>}
              />
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-3.5 left-4 z-10 size-5 text-muted-foreground" aria-hidden="true" />
                    <TextField
                      aria-label="Search products"
                      type="search"
                      placeholder="Search products"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                  <SelectField aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="all">All categories</option>
                    {menu.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </SelectField>
                </div>

                {groups.length === 0 && (
                  <EmptyState
                    icon={PackageOpen}
                    title={menu.products.length === 0 ? 'No products yet' : 'No matches'}
                    description={menu.products.length === 0 ? 'Add your first product to show it on the menu.' : 'Try a different search or category.'}
                  />
                )}

                {groups.map(({ category, products }) => (
                  <section key={category.id} className="space-y-3" aria-label={category.name}>
                    <SectionHeading>{category.name}</SectionHeading>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {products.map((product) => (
                        <AdminProductCard
                          key={product.id}
                          product={product}
                          tagsById={tagsById}
                          onEdit={setEditing}
                          onToggleAvailability={menu.setAvailability}
                        />
                      ))}
                    </ul>
                  </section>
                ))}
              </>
            )}
          </>
        )}

        {menu.status === 'success' && tab === 'categories' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <NameListManager
              title="Categories"
              description="Sections of your menu, in the order customers see them. A category must be empty before it can be deleted."
              items={menu.categories}
              counts={productCountByCategory}
              placeholder="e.g. Maki Rolls"
              onCreate={menu.createCategory}
              onRename={menu.renameCategory}
              onDelete={menu.deleteCategory}
              onMove={menu.moveCategory}
            />
            <NameListManager
              title="Tags"
              description="Labels like “Best Seller” or “Spicy” shown on product cards."
              items={menu.tags}
              counts={productCountByTag}
              placeholder="e.g. Best Seller"
              onCreate={menu.createTag}
              onRename={menu.renameTag}
              onDelete={menu.deleteTag}
            />
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ProductFormDialog
          product={editing}
          categories={menu.categories}
          tags={menu.tags}
          onClose={closeEditor}
          onSave={async (input) => {
            await menu.saveProduct(input)
            closeEditor()
          }}
          onDelete={async (product) => {
            await menu.deleteProduct(product)
            closeEditor()
          }}
        />
      )}
    </AdminLayout>
  )
}
