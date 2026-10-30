import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { describedBy, FieldShell } from './FieldShell'
import { fieldClass } from './fieldStyles'

export function PasswordField({ id, label = 'Password', hint, error, required, ...props }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const [visible, setVisible] = useState(false)

  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, { error, hint })}
          className={fieldClass({ invalid: Boolean(error), className: 'h-12 pr-14' })}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className={cn(
            focusRing,
            'absolute inset-y-0 right-1 my-auto grid size-11 place-items-center rounded-3xl text-muted-foreground hover:text-foreground',
          )}
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
    </FieldShell>
  )
}
