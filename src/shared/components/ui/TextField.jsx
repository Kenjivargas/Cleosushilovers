import { useId } from 'react'
import { describedBy, FieldShell } from './FieldShell'
import { fieldClass } from './fieldStyles'

export function TextField({ id, label, hint, error, multiline = false, required, className, ...props }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const Component = multiline ? 'textarea' : 'input'

  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required}>
      <Component
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, { error, hint })}
        className={fieldClass({
          invalid: Boolean(error),
          className: multiline ? `min-h-28 resize-y py-3 ${className ?? ''}` : `h-12 ${className ?? ''}`,
        })}
        {...props}
      />
    </FieldShell>
  )
}
