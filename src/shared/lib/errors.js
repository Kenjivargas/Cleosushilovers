// Turns Supabase/Postgres errors into messages a shop owner can act on.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback
  switch (error.code) {
    case '23505':
      return 'That name is already in use.'
    case '23001': // ON DELETE RESTRICT
    case '23503':
      return 'This is still in use by other items. Move or delete those first.'
    case '23514':
      return 'Some values are not allowed. Check the form and try again.'
    case '42501':
      return 'You do not have permission to do that.'
    default:
      return error.message || fallback
  }
}
