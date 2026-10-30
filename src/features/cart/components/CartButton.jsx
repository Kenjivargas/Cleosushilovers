import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { useCart } from '../hooks/useCart'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Button
      as={Link}
      to="/order"
      variant="secondary"
      size="icon"
      className="relative"
      aria-label={itemCount > 0 ? `View order, ${itemCount} items` : 'View order'}
    >
      <ShoppingBag className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
