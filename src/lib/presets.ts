import type { IconSpec, PresetKey } from "../types/icon";

export const ALL_ICONS: IconSpec[] = [
  // Browser
  {
    filename: "favicon-16x16.png",
    width: 16,
    height: 16,
    category: "browser",
    description: "Classic browser tab favicon",
  },
  {
    filename: "favicon-32x32.png",
    width: 32,
    height: 32,
    category: "browser",
    description: "Retina browser tab favicon",
  },
  {
    filename: "favicon-48x48.png",
    width: 48,
    height: 48,
    category: "browser",
    description: "Windows taskbar shortcut",
  },
  {
    filename: "favicon-96x96.png",
    width: 96,
    height: 96,
    category: "browser",
    description: "Google TV, Chrome Web App",
  },

  // Apple / iOS
  {
    filename: "apple-touch-icon.png",
    width: 180,
    height: 180,
    category: "apple",
    description: "Modern iOS home screen icon",
  },
  {
    filename: "apple-icon-57x57.png",
    width: 57,
    height: 57,
    category: "apple",
    description: "iPhone non-retina (legacy)",
  },
  {
    filename: "apple-icon-60x60.png",
    width: 60,
    height: 60,
    category: "apple",
    description: "iPhone non-retina",
  },
  {
    filename: "apple-icon-72x72.png",
    width: 72,
    height: 72,
    category: "apple",
    description: "iPad non-retina (legacy)",
  },
  {
    filename: "apple-icon-76x76.png",
    width: 76,
    height: 76,
    category: "apple",
    description: "iPad non-retina",
  },
  {
    filename: "apple-icon-114x114.png",
    width: 114,
    height: 114,
    category: "apple",
    description: "iPhone retina (legacy)",
  },
  {
    filename: "apple-icon-120x120.png",
    width: 120,
    height: 120,
    category: "apple",
    description: "iPhone retina",
  },
  {
    filename: "apple-icon-144x144.png",
    width: 144,
    height: 144,
    category: "apple",
    description: "iPad retina (legacy)",
  },
  {
    filename: "apple-icon-152x152.png",
    width: 152,
    height: 152,
    category: "apple",
    description: "iPad retina",
  },
  {
    filename: "apple-icon-180x180.png",
    width: 180,
    height: 180,
    category: "apple",
    description: "iPhone 6 Plus retina",
  },
  {
    filename: "apple-icon.png",
    width: 180,
    height: 180,
    category: "apple",
    description: "Generic Apple icon",
  },
  {
    filename: "apple-icon-precomposed.png",
    width: 180,
    height: 180,
    category: "apple",
    description: "Precomposed (no iOS gloss)",
  },

  // Android
  {
    filename: "android-chrome-192x192.png",
    width: 192,
    height: 192,
    category: "android",
    description: "Chrome home screen",
  },
  {
    filename: "android-chrome-512x512.png",
    width: 512,
    height: 512,
    category: "android",
    description: "Chrome splash screen",
  },
  {
    filename: "android-icon-36x36.png",
    width: 36,
    height: 36,
    category: "android",
    description: "Android LDPI",
  },
  {
    filename: "android-icon-48x48.png",
    width: 48,
    height: 48,
    category: "android",
    description: "Android MDPI",
  },
  {
    filename: "android-icon-72x72.png",
    width: 72,
    height: 72,
    category: "android",
    description: "Android HDPI",
  },
  {
    filename: "android-icon-96x96.png",
    width: 96,
    height: 96,
    category: "android",
    description: "Android XHDPI",
  },
  {
    filename: "android-icon-144x144.png",
    width: 144,
    height: 144,
    category: "android",
    description: "Android XXHDPI",
  },
  {
    filename: "android-icon-192x192.png",
    width: 192,
    height: 192,
    category: "android",
    description: "Android XXXHDPI",
  },

  // Microsoft / Windows
  {
    filename: "ms-icon-70x70.png",
    width: 70,
    height: 70,
    category: "windows",
    description: "Small Windows tile",
  },
  {
    filename: "ms-icon-144x144.png",
    width: 144,
    height: 144,
    category: "windows",
    description: "Windows 8 tile",
  },
  {
    filename: "ms-icon-150x150.png",
    width: 150,
    height: 150,
    category: "windows",
    description: "Medium Windows tile",
  },
  {
    filename: "ms-icon-310x310.png",
    width: 310,
    height: 310,
    category: "windows",
    description: "Large Windows tile",
  },
  {
    filename: "mstile-150x150.png",
    width: 150,
    height: 150,
    category: "windows",
    description: "MS tile (browserconfig.xml)",
  },

  // PWA
  {
    filename: "icon-144x144.png",
    width: 144,
    height: 144,
    category: "pwa",
    description: "PWA manifest icon",
  },
  {
    filename: "icon-192x192.png",
    width: 192,
    height: 192,
    category: "pwa",
    description: "PWA manifest icon",
  },
  {
    filename: "icon-512x512.png",
    width: 512,
    height: 512,
    category: "pwa",
    description: "PWA manifest icon",
  },
  {
    filename: "maskable-192.png",
    width: 192,
    height: 192,
    category: "pwa",
    isMaskable: true,
    description: "Android maskable (80% safe zone)",
  },
  {
    filename: "maskable-512.png",
    width: 512,
    height: 512,
    category: "pwa",
    isMaskable: true,
    description: "Android maskable (80% safe zone)",
  },
];

export const SPECIAL_FILES = ["favicon.ico", "favicon.svg"];

export const ALL_FILENAMES = new Set([
  ...ALL_ICONS.map((i) => i.filename),
  ...SPECIAL_FILES,
]);

export const PRESETS: Record<
  PresetKey,
  { label: string; description: string; files: string[] }
> = {
  complete: {
    label: "Complete",
    description: "Every size - maximum compatibility",
    files: [...ALL_ICONS.map((i) => i.filename), ...SPECIAL_FILES],
  },
  modern: {
    label: "Modern Only",
    description: "5 files covering 99% of modern browsers",
    files: [
      "favicon.ico",
      "favicon-32x32.png",
      "favicon-16x16.png",
      "apple-touch-icon.png",
      "favicon.svg",
    ],
  },
  pwa: {
    label: "PWA Focus",
    description: "Manifest-ready icons for Progressive Web Apps",
    files: [
      "favicon.ico",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "icon-144x144.png",
      "icon-192x192.png",
      "icon-512x512.png",
      "maskable-192.png",
      "maskable-512.png",
    ],
  },
  legacy: {
    label: "Legacy Broad",
    description: "All Apple, Android, and Windows tile sizes",
    files: [
      "favicon.ico",
      "favicon.svg",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon-48x48.png",
      "favicon-96x96.png",
      ...ALL_ICONS.filter(
        (i) =>
          i.category === "apple" ||
          i.category === "android" ||
          i.category === "windows",
      ).map((i) => i.filename),
    ],
  },
  custom: {
    label: "Custom",
    description: "Pick exactly which files to generate",
    files: [],
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  browser: "Browser",
  apple: "Apple / iOS",
  android: "Android",
  windows: "Windows / MS",
  pwa: "PWA / Manifest",
};

export const CATEGORY_ORDER = ["browser", "apple", "android", "windows", "pwa"];
