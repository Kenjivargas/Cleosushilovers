import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../hooks/useAuth'
import { checkIsAdmin, getSession, onAuthChange, signOut } from '../services/authService'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  // { userId, isAdmin } for the last user checked; compared against the current user below.
  const [adminCheck, setAdminCheck] = useState(null)

  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setSessionLoaded(true))
    return onAuthChange(setSession)
  }, [])

  const userId = session?.user?.id ?? null

  // Checked in an effect, not inside the auth callback, which must not await Supabase calls.
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    checkIsAdmin()
      .catch(() => false)
      .then((isAdmin) => {
        if (!cancelled) setAdminCheck({ userId, isAdmin })
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const handleSignOut = useCallback(async () => {
    await signOut()
    setAdminCheck(null)
  }, [])

  const value = useMemo(() => {
    const checked = adminCheck?.userId === userId
    return {
      session,
      user: session?.user ?? null,
      isAdmin: Boolean(userId && checked && adminCheck.isAdmin),
      loading: !sessionLoaded || Boolean(userId && !checked),
      signOut: handleSignOut,
    }
  }, [session, userId, sessionLoaded, adminCheck, handleSignOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
