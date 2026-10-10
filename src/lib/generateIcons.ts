import type { AppOptions } from '../types/icon'
import { ALL_ICONS, PRESETS } from './presets'
import { renderToDataURL } from './resize'
import { buildIco, icoToDataURL } from './icoEncoder'
import { buildSVGWrapper, svgToDataURL } from './svgWrapper'

export function getSelectedFiles(options: AppOptions): Set<string> {
  if (options.preset === 'custom') {
    return options.selectedFiles
  }
  return new Set(PRESETS[options.preset].files)
}

export async function generateAllIcons(
  img: HTMLImageElement,
  options: AppOptions,
  sourceDataURL: string,
  isSVGSource: boolean,
  svgContent?: string
): Promise<Map<string, string>> {
  const result = new Map<string, string>()
  const selected = getSelectedFiles(options)

  const renderOpts = {
    transparent: options.transparent,
    bgColor: options.bgColor,
    padding: options.padding,
    cornerRadius: options.cornerRadius,
  }

  for (const spec of ALL_ICONS) {
    if (!selected.has(spec.filename)) continue
    const dataURL = renderToDataURL(img, spec.width, renderOpts, spec.isMaskable ?? false)
    result.set(spec.filename, dataURL)
  }

  if (selected.has('favicon.ico')) {
    const pngDataURLs = [16, 32, 48].map(s => renderToDataURL(img, s, renderOpts, false))
    const icoBytes = buildIco(pngDataURLs)
    result.set('favicon.ico', icoToDataURL(icoBytes))
  }

  if (selected.has('favicon.svg')) {
    const svgStr = buildSVGWrapper(sourceDataURL, isSVGSource, svgContent)
    result.set('favicon.svg', svgToDataURL(svgStr))
  }

  return result
}

export function countEstimatedKB(icons: Map<string, string>): number {
  let bytes = 0
  for (const dataURL of icons.values()) {
    const base64 = dataURL.split(',')[1] ?? ''
    bytes += Math.ceil((base64.length * 3) / 4)
  }
  return Math.round(bytes / 1024)
}
