import { Card } from './Card'

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-12 text-center">
      {Icon && (
        <span className="grid size-14 place-items-center rounded-full bg-primary/12 text-primary">
          <Icon className="size-7" aria-hidden="true" />
        </span>
      )}
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </Card>
  )
}
