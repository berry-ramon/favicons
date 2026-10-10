export type Category = 'browser' | 'apple' | 'android' | 'windows' | 'pwa'
export type PresetKey = 'complete' | 'modern' | 'pwa' | 'legacy' | 'custom'

export interface IconSpec {
  filename: string
  width: number
  height: number
  category: Category
  isMaskable?: boolean
  description?: string
}

export interface RenderOptions {
  transparent: boolean
  bgColor: string
  padding: number
  cornerRadius: number
}

export interface ManifestConfig {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
}

export interface AppOptions {
  transparent: boolean
  bgColor: string
  padding: number
  cornerRadius: number
  preset: PresetKey
  selectedFiles: Set<string>
  generateManifest: boolean
  generateSnippet: boolean
  basePath: string
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
