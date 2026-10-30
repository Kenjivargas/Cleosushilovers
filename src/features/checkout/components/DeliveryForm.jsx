import { Button, Card, TextField } from '@/shared/components/ui'

export function DeliveryForm({ values, errors, onFieldChange, onSubmit }) {
  const bind = (field) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event) => onFieldChange(field, event.target.value),
  })

  return (
    <Card as="form" onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField label="Full name" autoComplete="name" required placeholder="Juan Dela Cruz" {...bind('fullName')} />
      <TextField
        label="Contact number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        placeholder="0917 123 4567"
        hint="We'll text or call this number about your delivery."
        {...bind('phone')}
      />
      <TextField
        label="Delivery address"
        multiline
        rows={3}
        autoComplete="street-address"
        required
        placeholder="House no., street, barangay, city"
        {...bind('address')}
      />
      <TextField
        label="Notes or landmark"
        multiline
        rows={2}
        placeholder="e.g. Blue gate beside the sari-sari store"
        hint="Optional"
        {...bind('notes')}
      />
      <Button type="submit" size="lg" className="w-full">
        Generate order slip
      </Button>
    </Card>
  )
}
