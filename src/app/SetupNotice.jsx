import { Card } from '@/shared/components/ui'

// Shown instead of the app when the Supabase environment variables are missing.
export function SetupNotice() {
  return (
    <div className="mx-auto grid min-h-dvh max-w-lg place-items-center px-4">
      <Card className="space-y-3">
        <h1 className="font-display text-xl font-bold">Connect Supabase to continue</h1>
        <p className="text-sm text-muted-foreground">
          Copy <code className="font-semibold text-foreground">.env.example</code> to{' '}
          <code className="font-semibold text-foreground">.env.local</code>, fill in{' '}
          <code className="font-semibold text-foreground">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-semibold text-foreground">VITE_SUPABASE_ANON_KEY</code>, then restart{' '}
          <code className="font-semibold text-foreground">npm run dev</code>.
        </p>
      </Card>
    </div>
  )
}
