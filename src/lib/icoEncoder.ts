import { dataURLToBytes } from './resize'

function readUint32BE(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0
}

export function buildIco(dataURLs: string[]): Uint8Array {
  const pngs = dataURLs.map(dataURLToBytes)

  const HEADER_SIZE = 6
  const DIR_ENTRY_SIZE = 16
  const dirSize = DIR_ENTRY_SIZE * pngs.length
  const dataStart = HEADER_SIZE + dirSize

  let totalSize = dataStart
  for (const png of pngs) totalSize += png.length

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)
  const result = new Uint8Array(buffer)

  // ICONDIR header
  view.setUint16(0, 0, true)           // reserved
  view.setUint16(2, 1, true)           // type: 1 = icon
  view.setUint16(4, pngs.length, true) // image count

  // Directory entries + copy image data
  let offset = dataStart
  for (let i = 0; i < pngs.length; i++) {
    const png = pngs[i]
    const dirOffset = HEADER_SIZE + i * DIR_ENTRY_SIZE

    // Read dimensions from PNG IHDR (at byte 16 and 20)
    const w = readUint32BE(png, 16)
    const h = readUint32BE(png, 20)

    view.setUint8(dirOffset + 0, w >= 256 ? 0 : w)
    view.setUint8(dirOffset + 1, h >= 256 ? 0 : h)
    view.setUint8(dirOffset + 2, 0)             // color count (0 = true color)
    view.setUint8(dirOffset + 3, 0)             // reserved
    view.setUint16(dirOffset + 4, 1, true)      // color planes
    view.setUint16(dirOffset + 6, 32, true)     // bits per pixel
    view.setUint32(dirOffset + 8, png.length, true)  // size of image data
    view.setUint32(dirOffset + 12, offset, true)     // offset of image data

    result.set(png, offset)
    offset += png.length
  }

  return result
}

export function icoToDataURL(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:image/x-icon;base64,${btoa(binary)}`
}
