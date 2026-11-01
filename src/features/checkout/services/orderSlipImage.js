import { formatCents, formatPrice } from '@/shared/lib/money'
import { LOGO_URL, SHOP_MOTTO } from '@/shared/lib/config'
import { lineTotalCents } from '@/features/cart/services/cartService'
import { formatCoordinates, isValidLocation, toGoogleMapsUrl } from './locationService'
import { formatOrderDate } from './orderSlipService'

// The slip is drawn on a canvas so it looks the same on every device and
// always uses the light palette, regardless of the site theme.
const WIDTH = 1080
const PAD = 72
const CONTENT_WIDTH = WIDTH - PAD * 2
const AMOUNT_COLUMN = 240

// Palette lifted from the logo: cream paper, ink, salmon, anchor tan.
const COLORS = {
  background: '#f8f4ef',
  ink: '#1c1a18',
  muted: '#76695d',
  tan: '#b8956a',
  line: '#e6dccf',
  brand: '#d4572e',
  panel: '#efe6db',
}

const SANS = '"Plus Jakarta Sans", system-ui, sans-serif'
const DISPLAY = '"Montserrat", system-ui, sans-serif'
const LOGO_SIZE = 340
const QR_SIZE = 220

const FONTS = {
  title: `800 30px ${DISPLAY}`,
  label: `700 24px ${DISPLAY}`,
  value: `600 32px ${SANS}`,
  item: `600 32px ${SANS}`,
  small: `400 26px ${SANS}`,
  totalLabel: `700 38px ${SANS}`,
  totalValue: `800 48px ${SANS}`,
  footer: `500 28px ${SANS}`,
}

const FOOTER_TEXT =
  'Please send this slip to our Facebook page on Messenger so we can confirm your order. Thank you!'

async function ensureFontsLoaded() {
  try {
    await Promise.all([FONTS.title, FONTS.label, FONTS.value, FONTS.small, FONTS.totalValue].map((f) => document.fonts.load(f)))
  } catch {
    // Fallback fonts are fine.
  }
}

function loadLogo() {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null) // the slip still works without the logo
    image.src = LOGO_URL
  })
}

function wrapText(ctx, text, maxWidth) {
  const lines = []
  for (const paragraph of String(text).split('\n')) {
    let line = ''
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word
      if (!line || ctx.measureText(candidate).width <= maxWidth) line = candidate
      else {
        lines.push(line)
        line = word
      }
    }
    lines.push(line)
  }
  return lines
}

/**
 * Lays out (and when `draw` is true, paints) the slip. Returns the total height,
 * so the same code is used once to measure and once to draw.
 */
function paint(ctx, order, { logo, qr, background }, draw) {
  const text = (value, x, y, font, color = COLORS.ink, align = 'left') => {
    ctx.font = font
    if (!draw) return
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.fillText(value, x, y)
  }
  const fill = (x, y, w, h, color, radius = 0) => {
    if (!draw) return
    ctx.fillStyle = color
    ctx.beginPath()
    if (radius && ctx.roundRect) ctx.roundRect(x, y, w, h, radius)
    else ctx.rect(x, y, w, h)
    ctx.fill()
  }
  const divider = (y) => fill(PAD, y, CONTENT_WIDTH, 2, COLORS.line)
  const wrap = (value, font, maxWidth) => {
    ctx.font = font
    return wrapText(ctx, value, maxWidth)
  }

  fill(0, 0, WIDTH, ctx.canvas.height, background)

  // Logo header. The slip paper uses the logo's own backdrop color, so it blends in seamlessly.
  let y = 40
  if (logo) {
    if (draw) ctx.drawImage(logo, (WIDTH - LOGO_SIZE) / 2, y, LOGO_SIZE, LOGO_SIZE)
    y += LOGO_SIZE + 30
  } else {
    y += 60
  }
  // "—— ORDER SLIP ——" in the style of the logo's tagline.
  ctx.font = FONTS.title
  const titleWidth = ctx.measureText('ORDER SLIP').width
  fill(PAD, y - 11, (CONTENT_WIDTH - titleWidth) / 2 - 28, 2, COLORS.tan)
  fill(WIDTH / 2 + titleWidth / 2 + 28, y - 11, (CONTENT_WIDTH - titleWidth) / 2 - 28, 2, COLORS.tan)
  text('ORDER SLIP', WIDTH / 2, y, FONTS.title, COLORS.ink, 'center')

  // Reference and date
  y += 84
  text('ORDER NO.', PAD, y, FONTS.label, COLORS.tan)
  text('DATE', WIDTH - PAD, y, FONTS.label, COLORS.tan, 'right')
  y += 48
  text(order.ref, PAD, y, `800 36px ${SANS}`)
  text(formatOrderDate(order.createdAt), WIDTH - PAD, y, FONTS.value, COLORS.ink, 'right')
  y += 44
  divider(y)
  y += 72

  // Items
  text('YOUR ORDER', PAD, y, FONTS.label, COLORS.brand)
  y += 60
  for (const item of order.items) {
    const lines = wrap(`${item.quantity} × ${item.name}`, FONTS.item, CONTENT_WIDTH - AMOUNT_COLUMN)
    text(formatCents(lineTotalCents(item)), WIDTH - PAD, y, FONTS.item, COLORS.ink, 'right')
    lines.forEach((line, i) => text(line, PAD, y + i * 44, FONTS.item))
    y += (lines.length - 1) * 44 + 40
    text(`${formatPrice(item.price)} each`, PAD, y, FONTS.small, COLORS.muted)
    y += 62
  }
  divider(y - 20)
  y += 52

  // Total
  text('Total', PAD, y, FONTS.totalLabel)
  text(formatCents(order.totalCents), WIDTH - PAD, y + 4, FONTS.totalValue, COLORS.brand, 'right')
  y += 50
  text('Delivery fee, if any, will be confirmed on Messenger.', PAD, y, FONTS.small, COLORS.muted)
  y += 48
  divider(y)
  y += 72

  // Delivery details
  text('DELIVERY DETAILS', PAD, y, FONTS.label, COLORS.brand)
  y += 60
  const { customer } = order
  const fields = [
    ['Name', customer.fullName],
    ['Contact number', customer.phone],
    ['Delivery address', customer.address],
    ...(customer.notes ? [['Notes / landmark', customer.notes]] : []),
  ]
  for (const [label, value] of fields) {
    text(label.toUpperCase(), PAD, y, FONTS.label, COLORS.tan)
    y += 44
    const lines = wrap(value, FONTS.value, CONTENT_WIDTH)
    lines.forEach((line, i) => text(line, PAD, y + i * 44, FONTS.value))
    y += (lines.length - 1) * 44 + 64
  }

  // Map pin: QR code (opens Google Maps) beside the coordinates.
  if (qr) {
    const location = customer.location
    const textX = PAD + QR_SIZE + 40
    const textWidth = CONTENT_WIDTH - QR_SIZE - 40
    fill(PAD - 12, y - 12, QR_SIZE + 24, QR_SIZE + 24, '#ffffff', 20)
    if (draw) ctx.drawImage(qr, PAD, y, QR_SIZE, QR_SIZE)
    let ty = y + 34
    text('MAP PIN', textX, ty, FONTS.label, COLORS.tan)
    ty += 46
    text(formatCoordinates(location), textX, ty, FONTS.value)
    ty += 48
    wrap('Scan to open the exact delivery spot in Google Maps.', FONTS.small, textWidth).forEach((line) => {
      text(line, textX, ty, FONTS.small, COLORS.muted)
      ty += 36
    })
    y += QR_SIZE + 64
  }

  // Footer note
  const footerLines = wrap(FOOTER_TEXT, FONTS.footer, CONTENT_WIDTH - 96)
  const boxHeight = footerLines.length * 40 + 60
  fill(PAD, y, CONTENT_WIDTH, boxHeight, COLORS.panel, 32)
  footerLines.forEach((line, i) => text(line, WIDTH / 2, y + 50 + i * 40, FONTS.footer, COLORS.ink, 'center'))
  y += boxHeight + 64
  text(SHOP_MOTTO.toUpperCase(), WIDTH / 2, y, FONTS.label, COLORS.tan, 'center')
  y += PAD - 16

  return Math.ceil(y)
}

// Reads the logo's corner pixel so the slip background matches the logo exactly.
function sampleBackground(logo) {
  if (!logo) return COLORS.background
  try {
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.drawImage(logo, 0, 0, 8, 8, 0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
  } catch {
    return COLORS.background
  }
}

async function createLocationQr(location) {
  if (!isValidLocation(location)) return null
  try {
    // Loaded on demand so customers browsing the menu never download it.
    const { default: QRCode } = await import('qrcode')
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, toGoogleMapsUrl(location), {
      width: QR_SIZE,
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: COLORS.ink, light: '#ffffff' },
    })
    return canvas
  } catch {
    return null // the coordinates are still in the copied text
  }
}

/** Renders the order slip as a PNG blob. */
export async function renderOrderSlip(order) {
  const [logo, qr] = await Promise.all([loadLogo(), createLocationQr(order.customer.location), ensureFontsLoaded()])
  const assets = { logo, qr, background: sampleBackground(logo) }

  const measureCanvas = document.createElement('canvas')
  const height = paint(measureCanvas.getContext('2d'), order, assets, false)

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = height
  paint(canvas.getContext('2d'), order, assets, true)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not create the image.'))), 'image/png')
  })
}
