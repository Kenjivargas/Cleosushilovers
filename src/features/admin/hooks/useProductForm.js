import { useEffect, useState } from 'react'
import { prepareProductImage } from '../services/imageService'

const PRICE_PATTERN = /^\d{1,8}(\.\d{1,2})?$/

function initialValues(product, categories) {
  return {
    name: product?.name ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    price: product ? String(product.price) : '',
    description: product?.description ?? '',
    isAvailable: product?.isAvailable ?? true,
    tagIds: product?.tagIds ?? [],
  }
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Enter the product name.'
  else if (values.name.trim().length > 80) errors.name = 'Keep the name under 80 characters.'
  if (!values.categoryId) errors.categoryId = 'Choose a category.'
  if (!PRICE_PATTERN.test(values.price.trim())) errors.price = 'Enter a price like 250 or 249.50.'
  if (values.description.length > 500) errors.description = 'Keep the description under 500 characters.'
  return errors
}

/** Form state for the add/edit product dialog, including the pending photo. */
export function useProductForm({ product, categories, onSave }) {
  const [values, setValues] = useState(() => initialValues(product, categories))
  const [errors, setErrors] = useState({})
  // { file, previewUrl } when a new photo is chosen; { remove: true } when cleared.
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [processingImage, setProcessingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    const url = image?.previewUrl
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [image])

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  const toggleTag = (tagId) =>
    setField(
      'tagIds',
      values.tagIds.includes(tagId) ? values.tagIds.filter((id) => id !== tagId) : [...values.tagIds, tagId],
    )

  const chooseImage = async (file) => {
    if (!file) return
    setImageError(null)
    setProcessingImage(true)
    try {
      const prepared = await prepareProductImage(file)
      setImage({ file: prepared, previewUrl: URL.createObjectURL(prepared) })
    } catch (err) {
      setImageError(err.message)
    } finally {
      setProcessingImage(false)
    }
  }

  const removeImage = () => setImage({ remove: true })

  const previewUrl = image?.previewUrl ?? (image?.remove ? null : product?.imageUrl ?? null)

  const handleSubmit = async (event) => {
    event?.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    setSubmitError(null)
    try {
      await onSave({
        id: product?.id,
        values: { ...values, price: Number(values.price.trim()) },
        tagIds: values.tagIds,
        image,
        currentImagePath: product?.imagePath ?? null,
      })
    } catch (err) {
      setSubmitError(err.message)
      setSaving(false)
    }
  }

  return {
    values,
    errors,
    setField,
    toggleTag,
    previewUrl,
    chooseImage,
    removeImage,
    imageError,
    processingImage,
    saving,
    submitError,
    handleSubmit,
  }
}
