import { useState } from 'react'
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Alert, Button, Card, TextField } from '@/shared/components/ui'

/** Add / rename / delete (and optionally reorder) a simple list of named records. */
export function NameListManager({ title, description, items, counts, onCreate, onRename, onDelete, onMove, placeholder }) {
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null) // { id, name }
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  const act = async (id, action) => {
    setBusyId(id)
    setError(null)
    try {
      await action()
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusyId(null)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!newName.trim()) return
    if (await act('new', () => onCreate(newName))) setNewName('')
  }

  const handleRename = async (event) => {
    event.preventDefault()
    if (!editing.name.trim()) return
    if (await act(editing.id, () => onRename(editing.id, editing.name))) setEditing(null)
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <ul className="divide-y divide-border">
        {items.map((item, index) => (
          <li key={item.id} className="py-2">
            {editing?.id === item.id ? (
              <form onSubmit={handleRename} className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField
                    aria-label={`Rename ${item.name}`}
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <Button type="submit" size="icon" aria-label="Save name" loading={busyId === item.id}>
                  {busyId !== item.id && <Check className="size-4" />}
                </Button>
                <Button variant="secondary" size="icon" aria-label="Cancel" onClick={() => setEditing(null)}>
                  <X className="size-4" />
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-1">
                <span className="min-w-0 flex-1 truncate font-medium">
                  {item.name}
                  {counts && <span className="ml-2 text-sm text-muted-foreground">({counts.get(item.id) ?? 0})</span>}
                </span>
                {onMove && (
                  <>
                    <Button variant="ghost" size="icon" aria-label={`Move ${item.name} up`} disabled={index === 0 || busyId !== null} onClick={() => act(item.id, () => onMove(item.id, -1))}>
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Move ${item.name} down`} disabled={index === items.length - 1 || busyId !== null} onClick={() => act(item.id, () => onMove(item.id, 1))}>
                      <ArrowDown className="size-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" aria-label={`Rename ${item.name}`} onClick={() => setEditing({ id: item.id, name: item.name })}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  aria-label={`Delete ${item.name}`}
                  disabled={busyId !== null}
                  onClick={() => {
                    if (window.confirm(`Delete “${item.name}”?`)) act(item.id, () => onDelete(item.id))
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="py-3 text-sm text-muted-foreground">Nothing here yet.</li>}
      </ul>

      <form onSubmit={handleCreate} className="flex items-end gap-2">
        <div className="flex-1">
          <TextField aria-label={`New ${title.toLowerCase()} name`} placeholder={placeholder} value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <Button type="submit" size="icon" aria-label="Add" loading={busyId === 'new'} disabled={!newName.trim()}>
          {busyId !== 'new' && <Plus className="size-5" />}
        </Button>
      </form>
    </Card>
  )
}
