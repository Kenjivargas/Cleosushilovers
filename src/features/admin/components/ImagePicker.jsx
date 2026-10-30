import { useRef } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Button, Spinner } from '@/shared/components/ui'
import { ProductImage } from '@/features/menu/components/ProductImage'

export function ImagePicker({ previewUrl, onChoose, onRemove, processing, error }) {
  const inputRef = useRef(null)

  return (
    <div className="space-y-2">
      <p className="px-1 text-sm font-semibold">Photo</p>
      <div className="relative">
        <ProductImage src={previewUrl} alt="Product photo preview" className="aspect-[4/3] w-full rounded-3xl border border-border" />
        {processing && (
          <div className="absolute inset-0 grid place-items-center rounded-3xl bg-background/70" role="status">
            <Spinner className="size-7" label="Preparing photo" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          onChoose(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={processing}>
          <ImagePlus className="size-4" />
          {previewUrl ? 'Change photo' : 'Add photo'}
        </Button>
        <Button variant="secondary" size="sm" onClick={onRemove} disabled={!previewUrl || processing} className="text-destructive">
          <Trash2 className="size-4" />
          Remove
        </Button>
      </div>
      {error ? (
        <p className="px-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="px-1 text-sm text-muted-foreground">Photos are resized automatically before uploading.</p>
      )}
    </div>
  )
}
