import { useEffect, useState } from 'react'

/** Tracks which section is currently near the top of the viewport. */
export function useActiveSection(ids, toElementId) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)
  const key = ids.join('|')

  useEffect(() => {
    if (ids.length === 0) return
    setActiveId((current) => (ids.includes(current) ? current : ids[0]))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        setActiveId(topMost.target.dataset.sectionId)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )

    ids.forEach((id) => {
      const el = document.getElementById(toElementId(id))
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
    // `key` captures changes to the id list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return activeId
}
