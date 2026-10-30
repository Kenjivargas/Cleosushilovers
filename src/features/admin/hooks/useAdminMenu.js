import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/shared/lib/errors'
import * as service from '../services/adminMenuService'

const EMPTY = { categories: [], products: [], tags: [] }

export function useAdminMenu() {
  const [data, setData] = useState(EMPTY)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    try {
      setData(await service.fetchAdminMenu())
      setError(null)
      setStatus('success')
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load the menu.'))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  // Runs a mutation, then refreshes so the screen always matches the database.
  // Throws a friendly message for the caller to show next to the action.
  const run = useCallback(
    async (mutation) => {
      try {
        const result = await mutation()
        await reload()
        return result
      } catch (err) {
        throw new Error(getErrorMessage(err))
      }
    },
    [reload],
  )

  const moveCategory = (id, direction) => {
    const ids = data.categories.map((c) => c.id)
    const from = ids.indexOf(id)
    const to = from + direction
    if (from < 0 || to < 0 || to >= ids.length) return Promise.resolve()
    ;[ids[from], ids[to]] = [ids[to], ids[from]]
    return run(() => service.reorderCategories(ids))
  }

  return {
    ...data,
    status,
    error,
    reload,
    saveProduct: (input) => run(() => service.saveProduct(input)),
    deleteProduct: (product) => run(() => service.deleteProduct(product)),
    setAvailability: (id, isAvailable) => run(() => service.setProductAvailability(id, isAvailable)),
    createCategory: (name) =>
      run(() => service.createCategory(name, Math.max(0, ...data.categories.map((c) => c.sort_order)) + 1)),
    renameCategory: (id, name) => run(() => service.renameCategory(id, name)),
    deleteCategory: (id) => run(() => service.deleteCategory(id)),
    moveCategory,
    createTag: (name) => run(() => service.createTag(name)),
    renameTag: (id, name) => run(() => service.renameTag(id, name)),
    deleteTag: (id) => run(() => service.deleteTag(id)),
  }
}
