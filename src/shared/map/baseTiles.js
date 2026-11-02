import L from 'leaflet'
import { MAPTILER_KEY } from '@/shared/lib/config'

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// Free, keyless OpenStreetMap tiles. Used when there's no MapTiler key or MapTiler fails.
export const OSM_LAYER = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: { maxZoom: 19, attribution: OSM_ATTRIBUTION },
}

// MapTiler "Streets": sharp on high-DPI phones ({r} = @2x) with a matching dark style.
export function mapTilerLayer(theme) {
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
export function checkMapTilerKey() {
  if (!MAPTILER_KEY) return Promise.resolve(false)
  mapTilerCheck ??= fetch(`https://api.maptiler.com/maps/streets-v2/tiles.json?key=${MAPTILER_KEY}`)
    .then((response) => response.ok)
    .catch(() => false)
  return mapTilerCheck
}

export const INITIAL_TILE_SOURCE = MAPTILER_KEY ? 'checking' : 'osm'

// Brand-colored pin drawn with SVG, so no marker image files are needed.
export const pinIcon = L.divIcon({
  className: '',
  html: `<svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true">
    <path d="M18 47C18 47 34 29.5 34 18A16 16 0 0 0 2 18C2 29.5 18 47 18 47Z" fill="#d4572e" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="18" cy="18" r="6" fill="#ffffff"/>
  </svg>`,
  iconSize: [36, 48],
  iconAnchor: [18, 47],
})
