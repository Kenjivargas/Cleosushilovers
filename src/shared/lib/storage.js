// Browser storage can throw (private mode, blocked site data), so every access is guarded.
export function readJson(storage, key, fallback = null) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Not persisting is acceptable; the in-memory state still works.
  }
}

export function removeKey(storage, key) {
  try {
    storage.removeItem(key)
  } catch {
    // ignore
  }
}
