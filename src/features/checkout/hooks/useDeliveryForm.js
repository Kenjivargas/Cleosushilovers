import { useCallback, useState } from 'react'
import {
  cleanDeliveryDetails,
  loadDeliveryDetails,
  saveDeliveryDetails,
  validateDeliveryDetails,
} from '../services/deliveryService'

export function useDeliveryForm(onValidSubmit) {
  const [values, setValues] = useState(loadDeliveryDetails)
  const [errors, setErrors] = useState({})

  const setField = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    // Clear a field's error as soon as the customer edits it.
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validateDeliveryDetails(values)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      document.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    const cleaned = cleanDeliveryDetails(values)
    saveDeliveryDetails(cleaned)
    onValidSubmit(cleaned)
  }

  return { values, errors, setField, handleSubmit }
}
