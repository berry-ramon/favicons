export function buildSVGWrapper(sourceDataURL: string, isSVG: boolean, svgContent?: string): string {
  if (isSVG && svgContent) {
    return svgContent
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" width="32" height="32">
  <image href="${sourceDataURL}" x="0" y="0" width="32" height="32"/>
</svg>`
  return svg
}

export function svgToDataURL(svgContent: string): string {
  const b64 = btoa(unescape(encodeURIComponent(svgContent)))
  return `data:image/svg+xml;base64,${b64}`
}
