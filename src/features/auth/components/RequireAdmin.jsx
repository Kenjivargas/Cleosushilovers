import { Navigate, useLocation } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button, EmptyState, PageSpinner } from '@/shared/components/ui'
import { useAuth } from '../hooks/useAuth'

export function RequireAdmin({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const location = useLocation()

  if (loading) return <PageSpinner label="Checking your access" />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <EmptyState
          icon={ShieldAlert}
          title="Admins only"
          description={`${user.email} is signed in but doesn't have admin access. Ask the shop owner to grant it.`}
          action={
            <Button variant="secondary" onClick={signOut}>
              Sign out
            </Button>
          }
        />
      </div>
    )
  }

  return children
}
