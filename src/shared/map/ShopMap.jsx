import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SHOP_NAME } from '@/shared/lib/config'
import { pinIcon } from './baseTiles'
import { useBaseTiles } from './useBaseTiles'

/** Small map with the shop's pin. Loaded lazily. */
export default function ShopMap({ location, className }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: [location.lat, location.lng],
      zoom: 16,
      scrollWheelZoom: false,
      // One-finger dragging would hijack page scrolling on phones; the buttons below open full maps.
      dragging: !L.Browser.mobile,
    })
    L.marker([location.lat, location.lng], { icon: pinIcon, title: SHOP_NAME, keyboard: false }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [location.lat, location.lng])

  const tileSource = useBaseTiles(mapRef)

  return (
    <div
      ref={containerRef}
      data-tiles={tileSource}
      role="img"
      aria-label={`Map showing where ${SHOP_NAME} is`}
      className={`location-map z-0 overflow-hidden ${className ?? ''}`}
    />
  )
}
