const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

// Money math is done in whole centavos to avoid floating point drift.
export function toCents(amount) {
  return Math.round(Number(amount) * 100)
}

export function formatCents(cents) {
  return pesoFormatter.format(cents / 100)
}

export function formatPrice(amount) {
  return formatCents(toCents(amount))
}
