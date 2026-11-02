import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { useTheme } from '@/shared/theme/useTheme'
import { checkMapTilerKey, INITIAL_TILE_SOURCE, mapTilerLayer, OSM_LAYER } from './baseTiles'

/**
 * Adds the base map tiles to a Leaflet map and keeps them in sync with the site theme.
 * Uses MapTiler when its key works, otherwise OpenStreetMap, so a map always shows.
 * Call it after the effect that creates the map. Returns 'checking' | 'maptiler' | 'osm'.
 */
export function useBaseTiles(mapRef) {
  const { theme } = useTheme()
  const [tileSource, setTileSource] = useState(INITIAL_TILE_SOURCE)
  const layerRef = useRef(null)

  useEffect(() => {
    if (tileSource !== 'checking') return
    let cancelled = false
    checkMapTilerKey().then((ok) => {
      if (!cancelled) setTileSource(ok ? 'maptiler' : 'osm')
    })
    return () => {
      cancelled = true
    }
  }, [tileSource])

  useEffect(() => {
    const map = mapRef.current
    if (!map || tileSource === 'checking') return
    const { url, options } = tileSource === 'maptiler' ? mapTilerLayer(theme) : OSM_LAYER
    const layer = L.tileLayer(url, options)
    if (tileSource === 'maptiler') {
      // Network errors or a quota running out mid-visit: switch to OpenStreetMap.
      let failures = 0
      layer.on('tileerror', () => {
        failures += 1
        if (failures === 3) setTileSource('osm')
      })
    }
    layer.addTo(map)
    layerRef.current = layer
    return () => {
      layer.remove()
      if (layerRef.current === layer) layerRef.current = null
    }
  }, [mapRef, theme, tileSource])

  return tileSource
}
