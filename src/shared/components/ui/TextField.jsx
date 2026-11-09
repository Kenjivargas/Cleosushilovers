import { useId } from 'react'
import { describedBy, FieldShell } from './FieldShell'
import { fieldClass } from './fieldStyles'

export function TextField({ id, label, hint, error, multiline = false, required, optional, className, ...props }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const Component = multiline ? 'textarea' : 'input'

  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required} optional={optional}>
      <Component
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, { error, hint })}
        className={fieldClass({
          invalid: Boolean(error),
          // A multiline field's className may set its own min height; otherwise it gets min-h-28.
          className: multiline ? `resize-y py-3 ${className ?? 'min-h-28'}` : `h-12 ${className ?? ''}`,
        })}
        {...props}
      />
    </FieldShell>
  )
}
