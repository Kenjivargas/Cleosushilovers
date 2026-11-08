import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, ExternalLink, MapPin, X } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { keepMapSized, pinIcon } from '@/shared/map/baseTiles'
import { useBaseTiles } from '@/shared/map/useBaseTiles'
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

/** Map where the customer drops a pin on their exact delivery spot. Loaded lazily. */
export default function LocationPicker({ value, onChange }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
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
    const stopResizeWatch = keepMapSized(map, containerRef.current)
    return () => {
      stopResizeWatch()
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Base map follows the site theme, with an OpenStreetMap fallback.
  const tileSource = useBaseTiles(mapRef)

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
