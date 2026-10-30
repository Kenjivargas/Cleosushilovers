// Shared surface treatment for cards, buttons and fields. Together these equal the
// design reference: "rounded-3xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl".
// Shape and tone are split so variants (e.g. primary buttons, invalid fields) can swap
// the tone without fighting conflicting utility classes. Padding is per component.
export const surfaceShape = 'rounded-3xl border shadow-2xl backdrop-blur-xl'
export const surfaceShapeFlat = 'rounded-3xl border'
export const surfaceTone = 'border-border bg-card/95'
export const surface = `${surfaceShape} ${surfaceTone}`

export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
