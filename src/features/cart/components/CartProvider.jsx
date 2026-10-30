import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { CartContext } from '../hooks/useCart'
import { cartTotalCents, clampQuantity, loadCart, MAX_QUANTITY, saveCart } from '../services/cartService'

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { product } = action
      const existing = items.find((i) => i.productId === product.id)
      if (existing) {
        return items.map((i) =>
          i.productId === product.id ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + 1) } : i,
        )
      }
      return [...items, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    }
    case 'setQuantity': {
      const quantity = clampQuantity(action.quantity)
      if (quantity === 0) return items.filter((i) => i.productId !== action.productId)
      return items.map((i) => (i.productId === action.productId ? { ...i, quantity } : i))
    }
    case 'replace':
      return action.items
    case 'clear':
      return []
    default:
      return items
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((product) => dispatch({ type: 'add', product }), [])
  const setQuantity = useCallback((productId, quantity) => dispatch({ type: 'setQuantity', productId, quantity }), [])
  const removeItem = useCallback((productId) => dispatch({ type: 'setQuantity', productId, quantity: 0 }), [])
  const replaceItems = useCallback((next) => dispatch({ type: 'replace', items: next }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const value = useMemo(() => {
    const quantities = new Map(items.map((i) => [i.productId, i.quantity]))
    return {
      items,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      totalCents: cartTotalCents(items),
      getQuantity: (productId) => quantities.get(productId) ?? 0,
      addItem,
      setQuantity,
      removeItem,
      replaceItems,
      clearCart,
    }
  }, [items, addItem, setQuantity, removeItem, replaceItems, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
