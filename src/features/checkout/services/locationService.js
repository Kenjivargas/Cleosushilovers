import { SHOP_LOCATION } from '@/shared/lib/config'

export { toGoogleMapsUrl } from '@/shared/lib/maps'

// Before a pin is placed, the map opens around the shop, where most customers are.
export const DEFAULT_MAP_CENTER = SHOP_LOCATION
export const DEFAULT_MAP_ZOOM = 14
export const PINNED_ZOOM = 17

/** True for a { lat, lng } pair within valid ranges. */
export function isValidLocation(location) {
  return (
    location != null &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    Math.abs(location.lat) <= 90 &&
    Math.abs(location.lng) <= 180
  )
}

// 6 decimals ≈ 10 cm, more than enough for a delivery pin.
export function roundLocation({ lat, lng }) {
  return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) }
}

export function formatCoordinates({ lat, lng }) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

/** Asks the browser for the device's position. Rejects with a customer-friendly message. */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error("Your browser can't share your location. Tap the map to place the pin instead."))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(roundLocation({ lat: position.coords.latitude, lng: position.coords.longitude })),
      (error) => {
        const messages = {
          1: 'Location access was blocked. Allow it in your browser settings, or tap the map to place the pin.',
          2: "We couldn't find your location. Check that GPS is on, or tap the map to place the pin.",
          3: 'Finding your location took too long. Try again, or tap the map to place the pin.',
        }
        reject(new Error(messages[error.code] ?? messages[2]))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  })
}
