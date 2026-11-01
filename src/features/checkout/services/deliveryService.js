import { readJson, writeJson } from '@/shared/lib/storage'
import { isValidLocation, roundLocation } from './locationService'

const STORAGE_KEY = 'cleo-delivery-details'

// `location` is the optional map pin: { lat, lng } or null.
export const EMPTY_DELIVERY_DETAILS = { fullName: '', phone: '', address: '', notes: '', location: null }

/** Returning customers get their last details pre-filled. */
export function loadDeliveryDetails() {
  const saved = readJson(localStorage, STORAGE_KEY, {})
  const details = { ...EMPTY_DELIVERY_DETAILS, ...(saved && typeof saved === 'object' ? saved : {}) }
  if (!isValidLocation(details.location)) details.location = null
  return details
}

export function saveDeliveryDetails(details) {
  writeJson(localStorage, STORAGE_KEY, details)
}

export function normalizePhone(value) {
  return value.replace(/[\s()-]/g, '')
}

export function cleanDeliveryDetails(details) {
  return {
    fullName: details.fullName.trim().replace(/\s+/g, ' '),
    phone: details.phone.trim(),
    address: details.address.trim(),
    notes: details.notes.trim(),
    location: isValidLocation(details.location) ? roundLocation(details.location) : null,
  }
}

/** Returns a map of field -> message; empty when everything is valid. */
export function validateDeliveryDetails(details) {
  const errors = {}
  const { fullName, phone, address, notes } = cleanDeliveryDetails(details)

  if (fullName.length < 2) errors.fullName = 'Please enter your name.'
  else if (fullName.length > 80) errors.fullName = 'Name is too long.'

  if (!phone) errors.phone = 'Please enter your contact number.'
  else if (!/^\+?\d{10,13}$/.test(normalizePhone(phone)))
    errors.phone = 'Enter a valid mobile number, e.g. 0917 123 4567.'

  if (address.length < 10) errors.address = 'Please enter your complete delivery address.'
  else if (address.length > 300) errors.address = 'Address is too long.'

  if (notes.length > 200) errors.notes = 'Please keep notes under 200 characters.'

  return errors
}
