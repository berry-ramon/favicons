import type { RenderOptions } from '../types/icon'

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const clampedR = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + clampedR, y)
  ctx.lineTo(x + w - clampedR, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + clampedR)
  ctx.lineTo(x + w, y + h - clampedR)
  ctx.quadraticCurveTo(x + w, y + h, x + w - clampedR, y + h)
  ctx.lineTo(x + clampedR, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - clampedR)
  ctx.lineTo(x, y + clampedR)
  ctx.quadraticCurveTo(x, y, x + clampedR, y)
  ctx.closePath()
}

export function renderToDataURL(
  img: HTMLImageElement,
  size: number,
  opts: RenderOptions,
  maskable = false
): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  const hasBackground = !opts.transparent || maskable
  const radius = opts.cornerRadius * size * 0.5

  if (hasBackground) {
    ctx.fillStyle = opts.bgColor
    if (radius > 0 && !maskable) {
      roundedRect(ctx, 0, 0, size, size, radius)
      ctx.fill()
    } else {
      ctx.fillRect(0, 0, size, size)
    }
  }

  if (radius > 0) {
    ctx.save()
    roundedRect(ctx, 0, 0, size, size, radius)
    ctx.clip()
  }

  // Content scale: maskable uses 80% safe zone, padding reduces further
  const safeScale = maskable ? 0.8 : 1.0
  const padFraction = opts.padding
  const contentSize = size * safeScale * (1 - 2 * padFraction)
  const drawX = (size - contentSize) / 2
  const drawY = (size - contentSize) / 2

  // Center-crop source to square
  const srcW = img.naturalWidth
  const srcH = img.naturalHeight
  const srcSize = Math.min(srcW, srcH)
  const srcX = (srcW - srcSize) / 2
  const srcY = (srcH - srcSize) / 2

  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, drawX, drawY, contentSize, contentSize)

  if (radius > 0) {
    ctx.restore()
  }

  return canvas.toDataURL('image/png')
}

export function dataURLToBytes(dataURL: string): Uint8Array {
  const base64 = dataURL.split(',')[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
