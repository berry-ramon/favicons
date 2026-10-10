export function buildHTMLSnippet(selectedFiles: Set<string>, basePath: string): string {
  const base = basePath.endsWith('/') ? basePath : basePath + '/'
  const lines: string[] = ['<!-- Favicon & App Icons -->']

  if (selectedFiles.has('favicon.ico')) {
    lines.push(`<link rel="shortcut icon" href="${base}favicon.ico">`)
  }
  if (selectedFiles.has('favicon.svg')) {
    lines.push(`<link rel="icon" type="image/svg+xml" href="${base}favicon.svg">`)
  }
  if (selectedFiles.has('favicon-16x16.png')) {
    lines.push(`<link rel="icon" type="image/png" sizes="16x16" href="${base}favicon-16x16.png">`)
  }
  if (selectedFiles.has('favicon-32x32.png')) {
    lines.push(`<link rel="icon" type="image/png" sizes="32x32" href="${base}favicon-32x32.png">`)
  }
  if (selectedFiles.has('favicon-48x48.png')) {
    lines.push(`<link rel="icon" type="image/png" sizes="48x48" href="${base}favicon-48x48.png">`)
  }
  if (selectedFiles.has('favicon-96x96.png')) {
    lines.push(`<link rel="icon" type="image/png" sizes="96x96" href="${base}favicon-96x96.png">`)
  }
  if (selectedFiles.has('apple-touch-icon.png')) {
    lines.push(`<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">`)
  }
  if (selectedFiles.has('apple-icon-57x57.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="57x57" href="${base}apple-icon-57x57.png">`)
  }
  if (selectedFiles.has('apple-icon-60x60.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="60x60" href="${base}apple-icon-60x60.png">`)
  }
  if (selectedFiles.has('apple-icon-72x72.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="72x72" href="${base}apple-icon-72x72.png">`)
  }
  if (selectedFiles.has('apple-icon-76x76.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="76x76" href="${base}apple-icon-76x76.png">`)
  }
  if (selectedFiles.has('apple-icon-114x114.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="114x114" href="${base}apple-icon-114x114.png">`)
  }
  if (selectedFiles.has('apple-icon-120x120.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="120x120" href="${base}apple-icon-120x120.png">`)
  }
  if (selectedFiles.has('apple-icon-144x144.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="144x144" href="${base}apple-icon-144x144.png">`)
  }
  if (selectedFiles.has('apple-icon-152x152.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="152x152" href="${base}apple-icon-152x152.png">`)
  }
  if (selectedFiles.has('apple-icon-180x180.png')) {
    lines.push(`<link rel="apple-touch-icon" sizes="180x180" href="${base}apple-icon-180x180.png">`)
  }

  const msFiles = [
    { filename: 'ms-icon-70x70.png', size: '70x70' },
    { filename: 'ms-icon-144x144.png', size: '144x144' },
    { filename: 'ms-icon-150x150.png', size: '150x150' },
    { filename: 'ms-icon-310x310.png', size: '310x310' },
  ]
  for (const { filename, size } of msFiles) {
    if (selectedFiles.has(filename)) {
      lines.push(`<meta name="msapplication-TileImage" content="${base}${filename}"><!-- ${size} -->`)
    }
  }

  if (selectedFiles.has('android-chrome-192x192.png') || selectedFiles.has('android-chrome-512x512.png')) {
    lines.push(`<link rel="manifest" href="${base}manifest.json">`)
  }

  return lines.join('\n')
}
