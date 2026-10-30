const MAX_DIMENSION = 1200
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_BYTES = 20 * 1024 * 1024

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * Phone photos are often 5–10 MB. Resize to at most 1200px and re-encode
 * (WebP, or JPEG where the browser can't encode WebP) before uploading.
 */
export async function prepareProductImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > MAX_INPUT_BYTES) throw new Error('That image is too large (max 20 MB).')

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('This image format is not supported. Use a JPG, PNG or WebP photo.')
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()

  let blob = await canvasToBlob(canvas, 'image/webp', 0.85)
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg', 0.85)
  if (!blob || !ACCEPTED_TYPES.includes(blob.type)) throw new Error('Could not process this image.')

  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
  return new File([blob], `photo.${extension}`, { type: blob.type })
}
