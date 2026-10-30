import { getProductImageUrl, supabase } from '@/shared/lib/supabase'

const MENU_QUERY = `
  id, name, sort_order,
  products (
    id, name, description, price, image_path, is_available, sort_order,
    product_tags ( tag:tags ( id, name ) )
  )
`

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: getProductImageUrl(row.image_path),
    isAvailable: row.is_available,
    tags: row.product_tags.map((pt) => pt.tag).filter(Boolean),
  }
}

/** Categories (in display order) with their products. Empty categories are hidden. */
export async function fetchMenu() {
  const { data, error } = await supabase
    .from('categories')
    .select(MENU_QUERY)
    .order('sort_order')
    .order('name')
    .order('sort_order', { referencedTable: 'products' })
    .order('name', { referencedTable: 'products' })

  if (error) throw error

  return data
    .map((category) => ({
      id: category.id,
      name: category.name,
      products: category.products.map(toProduct),
    }))
    .filter((category) => category.products.length > 0)
}
