import { Link } from 'react-router-dom'
import { ExternalLink, LogOut } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { BrandMark } from '@/shared/components/BrandMark'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function AdminLayout({ children }) {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-5xl items-center gap-3 px-4">
          <div className="min-w-0 flex-1">
            <BrandMark to="/admin" subtitle="Admin" />
          </div>
          <Button as={Link} to="/" variant="secondary" size="icon" aria-label="View public menu" title="View menu">
            <ExternalLink className="size-5" />
          </Button>
          <ThemeToggle />
          <Button variant="secondary" size="icon" onClick={signOut} aria-label="Sign out" title="Sign out">
            <LogOut className="size-5" />
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-16">
        {user && <p className="mb-4 truncate text-sm text-muted-foreground">Signed in as {user.email}</p>}
        {children}
      </main>
    </div>
  )
}
