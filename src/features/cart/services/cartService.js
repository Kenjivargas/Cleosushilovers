import { readJson, removeKey, writeJson } from '@/shared/lib/storage'
import { toCents } from '@/shared/lib/money'

const STORAGE_KEY = 'cleo-cart-v1'
export const MAX_QUANTITY = 99

function isValidItem(item) {
  return (
    item &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    Number.isFinite(item.price) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  )
}

export function loadCart() {
  const items = readJson(localStorage, STORAGE_KEY, [])
  return Array.isArray(items) ? items.filter(isValidItem) : []
}

export function saveCart(items) {
  if (items.length === 0) removeKey(localStorage, STORAGE_KEY)
  else writeJson(localStorage, STORAGE_KEY, items)
}

export function clampQuantity(quantity) {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.trunc(quantity) || 0))
}

export function lineTotalCents(item) {
  return toCents(item.price) * item.quantity
}

export function cartTotalCents(items) {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0)
}

/**
 * Brings saved cart lines in line with the live menu: drops products that were
 * removed or sold out and refreshes names/prices the admin changed.
 * Also picks up each product's current photo.
 * Returns the new items, human-readable notes about what changed, and whether anything changed at all.
 */
export function reconcileCart(items, products) {
  const byId = new Map(products.map((p) => [p.id, p]))
  const changes = []
  const next = []
  let changed = false

  for (const item of items) {
    const product = byId.get(item.productId)
    if (!product) {
      changes.push(`${item.name} is no longer on the menu and was removed.`)
      changed = true
      continue
    }
    if (!product.isAvailable) {
      changes.push(`${product.name} is sold out and was removed.`)
      changed = true
      continue
    }
    if (toCents(product.price) !== toCents(item.price)) {
      changes.push(`${product.name} price was updated.`)
    }
    const imageUrl = product.imageUrl ?? null
    if (product.name !== item.name || toCents(product.price) !== toCents(item.price) || imageUrl !== (item.imageUrl ?? null)) {
      changed = true
    }
    next.push({ ...item, name: product.name, price: product.price, imageUrl })
  }

  return { items: next, changes, changed }
}
