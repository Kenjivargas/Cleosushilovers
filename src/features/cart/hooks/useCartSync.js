import { useEffect, useRef, useState } from 'react'
import { useMenu } from '@/features/menu/hooks/useMenu'
import { reconcileCart } from '../services/cartService'
import { useCart } from './useCart'

/** Re-checks the saved order against the live menu once per visit. */
export function useCartSync() {
  const { products, status } = useMenu()
  const { items, replaceItems } = useCart()
  const [changes, setChanges] = useState([])
  const synced = useRef(false)

  useEffect(() => {
    if (status !== 'success' || synced.current) return
    synced.current = true
    const result = reconcileCart(items, products)
    if (result.changed) replaceItems(result.items)
    if (result.changes.length > 0) setChanges(result.changes)
  }, [status, items, products, replaceItems])

  return { ready: status !== 'loading', menuError: status === 'error', changes, products }
}
