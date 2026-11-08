import { useState } from 'react'
import { signIn } from '../services/authService'

export function useLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email or username and password.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await signIn({ email, password })
    } catch (err) {
      setError(err?.message === 'Invalid login credentials' ? 'Wrong username or password.' : err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  return { email, setEmail, password, setPassword, error, submitting, handleSubmit }
}
