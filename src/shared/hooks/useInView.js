import { useEffect, useRef, useState } from 'react'

/** True once the element has come near the viewport (stays true afterwards). */
export function useInView(rootMargin = '200px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView || !ref.current) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return [ref, inView]
}
