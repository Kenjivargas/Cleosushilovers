import { getProductImageUrl, PRODUCT_IMAGES_BUCKET, supabase } from '@/shared/lib/supabase'

const PRODUCT_COLUMNS = 'id, category_id, name, description, price, image_path, is_available, sort_order, product_tags ( tag_id )'

function toProduct(row) {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    imagePath: row.image_path,
    imageUrl: getProductImageUrl(row.image_path),
    isAvailable: row.is_available,
    tagIds: row.product_tags.map((pt) => pt.tag_id),
  }
}

function unwrap({ data, error }) {
  if (error) throw error
  return data
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function fetchAdminMenu() {
  const [categories, products, tags] = await Promise.all([
    supabase.from('categories').select('id, name, sort_order').order('sort_order').order('name').then(unwrap),
    supabase.from('products').select(PRODUCT_COLUMNS).order('sort_order').order('name').then(unwrap),
    supabase.from('tags').select('id, name').order('name').then(unwrap),
  ])
  return { categories, products: products.map(toProduct), tags }
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

async function uploadImage(productId, file) {
  const extension = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg'
  const path = `${productId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
  if (error) throw error
  return path
}

async function removeImages(paths) {
  const list = paths.filter(Boolean)
  if (list.length === 0) return
  // Best effort: an orphaned file is harmless, so don't fail the save over it.
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(list)
}

async function syncProductTags(productId, tagIds) {
  let remove = supabase.from('product_tags').delete().eq('product_id', productId)
  if (tagIds.length > 0) remove = remove.not('tag_id', 'in', `(${tagIds.join(',')})`)
  unwrap(await remove)

  if (tagIds.length > 0) {
    unwrap(
      await supabase
        .from('product_tags')
        .upsert(
          tagIds.map((tagId) => ({ product_id: productId, tag_id: tagId })),
          { onConflict: 'product_id,tag_id', ignoreDuplicates: true },
        ),
    )
  }
}

/**
 * Creates or updates a product, its photo and its tags.
 * `image` is { file } to replace the photo, { remove: true } to delete it, or null to keep it.
 */
export async function saveProduct({ id, values, tagIds, image, currentImagePath }) {
  const row = {
    category_id: values.categoryId,
    name: values.name.trim(),
    description: values.description.trim() || null,
    price: values.price,
    is_available: values.isAvailable,
  }

  const productId = id
    ? (unwrap(await supabase.from('products').update(row).eq('id', id).select('id').single()), id)
    : unwrap(await supabase.from('products').insert(row).select('id').single()).id

  if (image?.file) {
    const path = await uploadImage(productId, image.file)
    unwrap(await supabase.from('products').update({ image_path: path }).eq('id', productId))
    await removeImages([currentImagePath])
  } else if (image?.remove && currentImagePath) {
    unwrap(await supabase.from('products').update({ image_path: null }).eq('id', productId))
    await removeImages([currentImagePath])
  }

  await syncProductTags(productId, tagIds)
  return productId
}

export async function setProductAvailability(id, isAvailable) {
  unwrap(await supabase.from('products').update({ is_available: isAvailable }).eq('id', id))
}

export async function deleteProduct(product) {
  unwrap(await supabase.from('products').delete().eq('id', product.id))
  await removeImages([product.imagePath])
}

// ---------------------------------------------------------------------------
// Categories & tags
// ---------------------------------------------------------------------------

export async function createCategory(name, sortOrder) {
  unwrap(await supabase.from('categories').insert({ name: name.trim(), sort_order: sortOrder }))
}

export async function renameCategory(id, name) {
  unwrap(await supabase.from('categories').update({ name: name.trim() }).eq('id', id))
}

export async function deleteCategory(id) {
  unwrap(await supabase.from('categories').delete().eq('id', id))
}

/** Persists a new category order (array of ids, first = top of the menu). */
export async function reorderCategories(orderedIds) {
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from('categories').update({ sort_order: index + 1 }).eq('id', id)),
  )
  results.forEach(unwrap)
}

export async function createTag(name) {
  unwrap(await supabase.from('tags').insert({ name: name.trim() }))
}

export async function renameTag(id, name) {
  unwrap(await supabase.from('tags').update({ name: name.trim() }).eq('id', id))
}

export async function deleteTag(id) {
  unwrap(await supabase.from('tags').delete().eq('id', id))
}
