import { supabase } from '@/shared/lib/supabase'

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}

// Supabase Auth needs an email, so a bare username like "ballesterosadmin"
// signs in as "ballesterosadmin@cleosushilovers.app".
const USERNAME_EMAIL_DOMAIN = 'cleosushilovers.app'

export function toLoginEmail(emailOrUsername) {
  const value = emailOrUsername.trim().toLowerCase()
  return value.includes('@') ? value : `${value}@${USERNAME_EMAIL_DOMAIN}`
}

export async function signIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email: toLoginEmail(email), password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Asks the database (public.is_admin) whether the signed-in user is an admin. */
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) throw error
  return data === true
}
