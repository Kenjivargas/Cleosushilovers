import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, ExternalLink, MapPin, X } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { MAPTILER_KEY } from '@/shared/lib/config'
import { useTheme } from '@/shared/theme/useTheme'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  formatCoordinates,
  getCurrentLocation,
  isValidLocation,
  PINNED_ZOOM,
  roundLocation,
  toGoogleMapsUrl,
} from '../services/locationService'

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Free, keyless OpenStreetMap tiles. Used when there's no MapTiler key or MapTiler fails.
const OSM_LAYER = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: { maxZoom: 19, attribution: OSM_ATTRIBUTION },
}

// MapTiler "Streets": sharp on high-DPI phones ({r} = @2x) with a matching dark style.
function mapTilerLayer(theme) {
  const style = theme === 'dark' ? 'streets-v2-dark' : 'streets-v2'
  return {
    url: `https://api.maptiler.com/maps/${style}/{z}/{x}/{y}{r}.png?key=${MAPTILER_KEY}`,
    options: {
      tileSize: 512,
      zoomOffset: -1,
      maxZoom: 20,
      crossOrigin: true,
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">&copy; MapTiler</a> ${OSM_ATTRIBUTION}`,
    },
  }
}

// MapTiler answers a bad/blocked key with a 403 *image*, which the browser displays
// without an error event. So check the key once per visit before using its tiles.
let mapTilerCheck = null
function checkMapTilerKey() {
  if (!MAPTILER_KEY) return Promise.resolve(false)
  mapTilerCheck ??= fetch(`https://api.maptiler.com/maps/streets-v2/tiles.json?key=${MAPTILER_KEY}`)
    .then((response) => response.ok)
    .catch(() => false)
  return mapTilerCheck
}

// Brand-colored pin drawn with SVG, so no marker image files are needed.
const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true">
    <path d="M18 47C18 47 34 29.5 34 18A16 16 0 0 0 2 18C2 29.5 18 47 18 47Z" fill="#d4572e" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="18" cy="18" r="6" fill="#ffffff"/>
  </svg>`,
  iconSize: [36, 48],
  iconAnchor: [18, 47],
})

/** Map where the customer drops a pin on their exact delivery spot. Loaded lazily. */
export default function LocationPicker({ value, onChange }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const tileLayerRef = useRef(null)
  const { theme } = useTheme()
  // 'checking' until the MapTiler key is verified, then 'maptiler' or 'osm'.
  const [tileSource, setTileSource] = useState(MAPTILER_KEY ? 'checking' : 'osm')
  const onChangeRef = useRef(onChange)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)
  const hasPin = isValidLocation(value)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  // Create the map once.
  useEffect(() => {
    const start = isValidLocation(value) ? value : DEFAULT_MAP_CENTER
    const map = L.map(containerRef.current, {
      center: [start.lat, start.lng],
      zoom: isValidLocation(value) ? PINNED_ZOOM : DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false, // page scrolling shouldn't zoom the map by accident
    })
    map.on('click', (event) => onChangeRef.current(roundLocation(event.latlng)))
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      tileLayerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  // Map style follows the site theme. If MapTiler is unusable (bad key, quota used up,
  // network errors), fall back to OpenStreetMap so checkout keeps working.
  useEffect(() => {
    const map = mapRef.current
    if (!map || tileSource === 'checking') return
    const { url, options } = tileSource === 'maptiler' ? mapTilerLayer(theme) : OSM_LAYER
    const layer = L.tileLayer(url, options)
    if (tileSource === 'maptiler') {
      let failures = 0
      layer.on('tileerror', () => {
        failures += 1
        if (failures === 3) setTileSource('osm')
      })
    }
    tileLayerRef.current?.remove()
    tileLayerRef.current = layer.addTo(map)
  }, [theme, tileSource])

  // Keep the marker in sync with the selected location.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!isValidLocation(value)) {
      markerRef.current?.remove()
      markerRef.current = null
      return
    }
    if (!markerRef.current) {
      markerRef.current = L.marker([value.lat, value.lng], { icon: pinIcon, draggable: true, keyboard: true })
        .on('dragend', (event) => onChangeRef.current(roundLocation(event.target.getLatLng())))
        .addTo(map)
    } else {
      markerRef.current.setLatLng([value.lat, value.lng])
    }
  }, [value])

  const useMyLocation = async () => {
    setLocating(true)
    setError(null)
    try {
      const location = await getCurrentLocation()
      onChange(location)
      mapRef.current?.setView([location.lat, location.lng], PINNED_ZOOM)
    } catch (err) {
      setError(err.message)
    } finally {
      setLocating(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <p className="text-sm font-semibold">Pin your exact location</p>
        <span className="text-sm text-muted-foreground">Optional</span>
      </div>
      <p className="px-1 text-sm text-muted-foreground">
        Helps our rider find you. Tap the map or use your location, then drag the pin to adjust.
      </p>

      <div
        ref={containerRef}
        role="application"
        aria-label="Map. Tap to place your delivery pin."
        data-tiles={tileSource}
        className="location-map relative z-0 h-64 overflow-hidden rounded-3xl border border-border sm:h-72"
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button variant="secondary" size="sm" onClick={useMyLocation} loading={locating}>
          {!locating && <Crosshair className="size-4" />}
          Use my current location
        </Button>
        {hasPin && (
          <Button variant="secondary" size="sm" onClick={() => onChange(null)} className="text-destructive">
            <X className="size-4" />
            Remove pin
          </Button>
        )}
      </div>

      {error && (
        <p className="px-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {hasPin && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-sm">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          <span className="font-semibold">Pinned:</span>
          <span className="text-muted-foreground tabular-nums">{formatCoordinates(value)}</span>
          <a
            href={toGoogleMapsUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            Check on Google Maps
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </p>
      )}
    </div>
  )
}
