import { useCallback, useEffect, useMemo, useState } from 'react'
import { renderOrderSlip } from '../services/orderSlipImage'
import { getSlipFileName } from '../services/orderSlipService'

/** Generates the slip image for an order and exposes download / share actions. */
export function useOrderSlip(order) {
  const [blob, setBlob] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!order) return
    let cancelled = false
    let url = null
    setStatus('loading')
    renderOrderSlip(order)
      .then((result) => {
        if (cancelled) return
        url = URL.createObjectURL(result)
        setBlob(result)
        setImageUrl(url)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [order])

  const fileName = order ? getSlipFileName(order) : 'order.png'

  const file = useMemo(() => (blob ? new File([blob], fileName, { type: 'image/png' }) : null), [blob, fileName])
  const canShare = Boolean(file && navigator.canShare?.({ files: [file] }))

  const download = useCallback(() => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [imageUrl, fileName])

  // Returns false if the share sheet was dismissed or failed.
  const share = useCallback(async () => {
    if (!file) return false
    try {
      await navigator.share({ files: [file], title: 'My Cleosushilovers order' })
      return true
    } catch {
      return false
    }
  }, [file])

  return { status, imageUrl, fileName, download, share, canShare }
}
