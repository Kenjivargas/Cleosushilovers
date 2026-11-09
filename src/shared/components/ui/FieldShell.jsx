// Label, hint and error wrapper shared by every form field.
export function FieldShell({ id, label, hint, error, required, optional, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-baseline justify-between gap-2 px-1">
          <label htmlFor={id} className="text-sm font-semibold">
            {label}
            {required && <span className="text-primary"> *</span>}
          </label>
          {optional && <span className="text-sm text-muted-foreground">Optional</span>}
        </div>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="px-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="px-1 text-sm text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function describedBy(id, { error, hint }) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
