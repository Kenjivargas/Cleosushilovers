// Links that open a spot in Google Maps (the app on phones, the website elsewhere).

export function toGoogleMapsUrl({ lat, lng }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`
}

export function toGoogleDirectionsUrl({ lat, lng }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}`
}
