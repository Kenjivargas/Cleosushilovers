import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '@/shared/lib/errors'
import { fetchMenu } from '../services/menuService'

export function useMenu() {
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      setCategories(await fetchMenu())
      setStatus('success')
    } catch (err) {
      setError(getErrorMessage(err, 'We could not load the menu.'))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const products = useMemo(() => categories.flatMap((c) => c.products), [categories])

  return { categories, products, status, error, reload: load }
}
