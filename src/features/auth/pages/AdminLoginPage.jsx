import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageSpinner } from '@/shared/components/ui'
import { SectionHeading } from '@/shared/components/SectionHeading'
import { LOGO_URL, SHOP_NAME } from '@/shared/lib/config'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageSpinner />
  if (user && isAdmin) return <Navigate to={location.state?.from ?? '/admin'} replace />

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to menu
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={LOGO_URL}
            alt={`${SHOP_NAME} logo`}
            width="112"
            height="112"
            className="size-28 rounded-3xl border border-border object-cover shadow-2xl"
          />
          <SectionHeading as="h1" className="w-full">
            Admin sign in
          </SectionHeading>
          <p className="text-sm text-muted-foreground">Manage the menu, prices and photos.</p>
        </div>
        {user && !isAdmin && (
          <p className="text-center text-sm text-destructive">
            {user.email} doesn't have admin access. Sign in with an admin account.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
