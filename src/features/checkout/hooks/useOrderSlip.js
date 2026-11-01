import { useCallback, useEffect, useMemo, useState } from 'react'
import { isIOS } from '@/shared/lib/device'
import { renderOrderSlip } from '../services/orderSlipImage'
import { getSlipFileName } from '../services/orderSlipService'

/** Generates the slip image for an order and exposes a "save to photos" action. */
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

  // iPhones save downloads to the Files app, not Photos. Their share sheet has
  // "Save Image", which goes straight to Photos, so use it there.
  const savesViaShareSheet = canShare && isIOS()

  /**
   * Saves the slip where customers find it: share sheet on iPhone, download elsewhere
   * (Android galleries show downloaded images). Resolves to 'saved' or 'cancelled'.
   */
  const saveToPhotos = useCallback(async () => {
    if (!file) return 'cancelled'
    if (!savesViaShareSheet) {
      download()
      return 'saved'
    }
    try {
      await navigator.share({ files: [file] })
      return 'saved'
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled'
      // Share sheet unavailable (e.g. inside some in-app browsers): download instead.
      download()
      return 'saved'
    }
  }, [file, savesViaShareSheet, download])

  return { status, imageUrl, fileName, saveToPhotos, savesViaShareSheet }
}
