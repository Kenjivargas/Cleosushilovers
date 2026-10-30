import { Alert, Button, Card, PasswordField, TextField } from '@/shared/components/ui'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginForm() {
  const form = useLoginForm()

  return (
    <Card as="form" onSubmit={form.handleSubmit} noValidate className="space-y-5">
      {form.error && <Alert tone="error">{form.error}</Alert>}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={form.email}
        onChange={(e) => form.setEmail(e.target.value)}
      />
      <PasswordField
        autoComplete="current-password"
        required
        value={form.password}
        onChange={(e) => form.setPassword(e.target.value)}
      />
      <Button type="submit" size="lg" className="w-full" loading={form.submitting}>
        Sign in
      </Button>
    </Card>
  )
}
