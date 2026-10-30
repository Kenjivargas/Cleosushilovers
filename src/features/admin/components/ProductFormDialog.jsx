import { useState } from 'react'
import { Check } from 'lucide-react'
import { Alert, Button, Dialog, SelectField, Switch, TextField } from '@/shared/components/ui'
import { cn } from '@/shared/lib/cn'
import { focusRing } from '@/shared/lib/styles'
import { useProductForm } from '../hooks/useProductForm'
import { ImagePicker } from './ImagePicker'

export function ProductFormDialog({ product, categories, tags, onSave, onDelete, onClose }) {
  const form = useProductForm({ product, categories, onSave })
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const formId = 'product-form'

  const handleDelete = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(product)
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  const busy = form.saving || deleting || form.processingImage

  return (
    <Dialog
      open
      onClose={busy ? () => {} : onClose}
      title={product ? 'Edit product' : 'Add product'}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={form.saving} disabled={busy}>
            {product ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      }
    >
      <form id={formId} onSubmit={form.handleSubmit} noValidate className="space-y-5">
        {form.submitError && <Alert tone="error" title="Couldn't save">{form.submitError}</Alert>}

        <ImagePicker
          previewUrl={form.previewUrl}
          onChoose={form.chooseImage}
          onRemove={form.removeImage}
          processing={form.processingImage}
          error={form.imageError}
        />

        <TextField
          label="Name"
          required
          value={form.values.name}
          onChange={(e) => form.setField('name', e.target.value)}
          error={form.errors.name}
          placeholder="California Maki (8 pcs)"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Price (₱)"
            required
            inputMode="decimal"
            value={form.values.price}
            onChange={(e) => form.setField('price', e.target.value)}
            error={form.errors.price}
            placeholder="250.00"
          />
          <SelectField
            label="Category"
            required
            value={form.values.categoryId}
            onChange={(e) => form.setField('categoryId', e.target.value)}
            error={form.errors.categoryId}
          >
            {categories.length === 0 && <option value="">Add a category first</option>}
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          label="Description"
          multiline
          rows={3}
          value={form.values.description}
          onChange={(e) => form.setField('description', e.target.value)}
          error={form.errors.description}
          hint="Optional. Shown under the name on the menu."
        />

        <Switch
          checked={form.values.isAvailable}
          onChange={(v) => form.setField('isAvailable', v)}
          label="Available to order"
          description="Turn off to show it as sold out."
        />

        {tags.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="px-1 text-sm font-semibold">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = form.values.tagIds.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => form.toggleTag(tag.id)}
                    className={cn(
                      focusRing,
                      'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition',
                      selected
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card/95 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {selected && <Check className="size-4" aria-hidden="true" />}
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {product && (
          <div className="space-y-2 border-t border-border pt-5">
            {deleteError && <Alert tone="error">{deleteError}</Alert>}
            {confirmingDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex-1 text-sm">Delete “{product.name}” permanently?</span>
                <Button variant="secondary" size="sm" onClick={() => setConfirmingDelete(false)} disabled={deleting}>
                  Keep
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>
                  Delete
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmingDelete(true)}>
                Delete this product
              </Button>
            )}
          </div>
        )}
      </form>
    </Dialog>
  )
}
