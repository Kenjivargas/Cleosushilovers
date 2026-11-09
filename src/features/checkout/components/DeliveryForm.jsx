import { lazy, Suspense } from 'react'
import { MapPin, UserRound } from 'lucide-react'
import { Button, Card, TextField } from '@/shared/components/ui'

// Leaflet is only downloaded when the checkout form is shown.
const LocationPicker = lazy(() => import('./LocationPicker'))

function MapPlaceholder() {
  return <div className="h-64 animate-pulse rounded-3xl border border-border bg-muted sm:h-72" aria-hidden="true" />
}

function FormSection({ icon: Icon, title, children }) {
  return (
    <fieldset className="min-w-0 space-y-4">
      <legend className="flex items-center gap-2 font-display text-lg font-bold">
        <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export function DeliveryForm({ values, errors, onFieldChange, onSubmit }) {
  const bind = (field) => ({
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event) => onFieldChange(field, event.target.value),
  })

  return (
    <Card as="form" onSubmit={onSubmit} noValidate padding="sm" className="space-y-7 sm:p-6">
      <FormSection icon={UserRound} title="Your details">
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
      </FormSection>

      <div className="border-t border-border" aria-hidden="true" />

      <FormSection icon={MapPin} title="Where to deliver">
        <TextField
          label="Delivery address"
          multiline
          rows={2}
          autoComplete="street-address"
          required
          placeholder="House no., street, barangay, city"
          className="min-h-24"
          {...bind('address')}
        />
        <Suspense fallback={<MapPlaceholder />}>
          <LocationPicker value={values.location} onChange={(location) => onFieldChange('location', location)} />
        </Suspense>
        <TextField
          label="Notes or landmark"
          multiline
          rows={2}
          optional
          placeholder="e.g. Blue gate beside the sari-sari store"
          className="min-h-20"
          {...bind('notes')}
        />
      </FormSection>

      <div className="space-y-2">
        <Button type="submit" size="lg" className="w-full">
          Generate order slip
        </Button>
        <p className="px-1 text-center text-sm text-muted-foreground">
          Next, you'll save the slip and send it to us on Messenger.
        </p>
      </div>
    </Card>
  )
}
