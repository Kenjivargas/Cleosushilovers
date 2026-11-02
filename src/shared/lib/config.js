export const SHOP_NAME = 'Cleosushilovers'
export const SHOP_TAGLINE = 'Japanese Authentic Sushi'
export const SHOP_MOTTO = 'Anchored by grace, served with love.'
export const LOGO_URL = '/logo.jpg'

export const MESSENGER_URL = import.meta.env.VITE_FACEBOOK_MESSENGER_URL || 'https://m.me/cleosushilover'
export const FACEBOOK_PAGE_URL = 'https://www.facebook.com/cleosushilover'

// Shop / pick-up spot, shown on the "Find us" map and used to centre the delivery map.
export const SHOP_LOCATION = { lat: 14.71065, lng: 121.029834 }

// Optional. Without it the delivery map uses free OpenStreetMap tiles.
export const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || ''
