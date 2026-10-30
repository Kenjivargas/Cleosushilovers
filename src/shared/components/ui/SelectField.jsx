import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { describedBy, FieldShell } from './FieldShell'
import { fieldClass } from './fieldStyles'

export function SelectField({ id, label, hint, error, required, children, ...props }) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, { error, hint })}
          className={fieldClass({ invalid: Boolean(error), className: 'h-12 appearance-none pr-12' })}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 my-auto size-5 text-muted-foreground"
        />
      </div>
    </FieldShell>
  )
}
