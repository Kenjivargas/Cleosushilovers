import { readJson, removeKey, writeJson } from '@/shared/lib/storage'
import { formatCents, formatPrice } from '@/shared/lib/money'
import { SHOP_NAME } from '@/shared/lib/config'
import { cartTotalCents, lineTotalCents } from '@/features/cart/services/cartService'
import { isValidLocation, toGoogleMapsUrl } from './locationService'

const STORAGE_KEY = 'cleo-last-order'

const dateFormatter = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' })

export function formatOrderDate(iso) {
  return dateFormatter.format(new Date(iso))
}

/** Short reference like CSL-261030-7KQ2 that the shop can quote back on Messenger. */
export function createOrderRef(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  const ymd = `${String(date.getFullYear()).slice(2)}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(4, '0').slice(-4)
  return `CSL-${ymd}-${random}`
}

export function buildOrder(items, customer) {
  const createdAt = new Date()
  return {
    ref: createOrderRef(createdAt),
    createdAt: createdAt.toISOString(),
    items: items.map(({ name, price, quantity }) => ({ name, price, quantity })),
    totalCents: cartTotalCents(items),
    customer,
  }
}

// The slip lives in sessionStorage so a refresh on the slip page keeps it.
export function saveLastOrder(order) {
  writeJson(sessionStorage, STORAGE_KEY, order)
}

export function loadLastOrder() {
  const order = readJson(sessionStorage, STORAGE_KEY)
  return order && Array.isArray(order.items) && order.customer ? order : null
}

export function clearLastOrder() {
  removeKey(sessionStorage, STORAGE_KEY)
}

export function getSlipFileName(order) {
  return `cleosushilovers-order-${order.ref}.png`
}

/** Plain-text version of the slip, for pasting into Messenger. */
export function formatOrderAsText(order) {
  const { customer } = order
  return [
    `${SHOP_NAME} order ${order.ref}`,
    formatOrderDate(order.createdAt),
    '',
    ...order.items.map((i) => `${i.quantity} x ${i.name} — ${formatCents(lineTotalCents(i))} (${formatPrice(i.price)} each)`),
    '',
    `Total: ${formatCents(order.totalCents)}`,
    '',
    `Name: ${customer.fullName}`,
    `Contact: ${customer.phone}`,
    `Address: ${customer.address}`,
    ...(customer.notes ? [`Notes: ${customer.notes}`] : []),
    ...(isValidLocation(customer.location) ? [`Map pin: ${toGoogleMapsUrl(customer.location)}`] : []),
  ].join('\n')
}
