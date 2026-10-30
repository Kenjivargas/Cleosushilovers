import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Button, EmptyState } from '@/shared/components/ui'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-10">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="This page drifted out to sea."
        action={
          <Button as={Link} to="/">
            Back to the menu
          </Button>
        }
      />
    </div>
  )
}
