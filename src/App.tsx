import { useState, useEffect, useCallback, useRef } from "react";
import type { AppOptions, ManifestConfig, ToastItem } from "./types/icon";
import { PRESETS } from "./lib/presets";
import { generateAllIcons } from "./lib/generateIcons";
import { UploadZone } from "./components/UploadZone";
import { OptionsPanel } from "./components/OptionsPanel";
import { ManifestPanel } from "./components/ManifestPanel";
import { PreviewGrid } from "./components/PreviewGrid";
import { DownloadBar } from "./components/DownloadBar";
import { ThemeToggle } from "./components/ThemeToggle";
import { ToastContainer } from "./components/Toast";

const DEFAULT_OPTIONS: AppOptions = {
  transparent: true,
  bgColor: "#ffffff",
  padding: 0,
  cornerRadius: 0,
  preset: "complete",
  selectedFiles: new Set(PRESETS.complete.files),
  generateManifest: true,
  generateSnippet: true,
  basePath: "/",
};

const DEFAULT_MANIFEST: ManifestConfig = {
  name: "",
  shortName: "",
  description: "",
  themeColor: "#A91E8A",
  backgroundColor: "#FAF7F2",
};

export default function App() {
  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceDataURL, setSourceDataURL] = useState<string>("");
  const [isSVGSource, setIsSVGSource] = useState(false);
  const [svgContent, setSVGContent] = useState<string | undefined>();
  const [options, setOptions] = useState<AppOptions>(DEFAULT_OPTIONS);
  const [manifest, setManifest] = useState<ManifestConfig>(DEFAULT_MANIFEST);
  const [generatedIcons, setGeneratedIcons] = useState<Map<string, string>>(
    new Map(),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [hasImage, setHasImage] = useState(false);
  const genVersionRef = useRef(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const addToast = useCallback(
    (message: string, type: ToastItem["type"] = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const dataURL = e.target?.result as string;
        const isSVG = file.type === "image/svg+xml";
        let svgStr: string | undefined;

        if (isSVG) {
          const text = await file.text();
          svgStr = text;
        }

        const img = new Image();
        img.onload = () => {
          const minDim = Math.min(img.naturalWidth, img.naturalHeight);
          if (minDim < 512) {
            addToast(
              `Image is ${img.naturalWidth}×${img.naturalHeight}px. For best results use 1024×1024 or larger.`,
              "info",
            );
          }
          if (img.naturalWidth !== img.naturalHeight) {
            addToast(
              "Image is not square - will be center-cropped to square.",
              "info",
            );
          }
          setSourceImage(img);
          setSourceFile(file);
          setSourceDataURL(dataURL);
          setIsSVGSource(isSVG);
          setSVGContent(svgStr);
          setHasImage(true);
        };
        img.onerror = () => {
          addToast(
            "Could not load image. The file may be corrupt or unsupported.",
            "error",
          );
        };
        img.src = dataURL;
      };

      reader.readAsDataURL(file);
    },
    [addToast],
  );

  // Regenerate icons when source or options change (debounced)
  useEffect(() => {
    if (!sourceImage) return;

    const version = ++genVersionRef.current;
    const delay = setTimeout(async () => {
      setIsGenerating(true);
      try {
        const icons = await generateAllIcons(
          sourceImage,
          options,
          sourceDataURL,
          isSVGSource,
          svgContent,
        );
        if (genVersionRef.current === version) {
          setGeneratedIcons(icons);
        }
      } catch (err) {
        console.error("Icon generation failed:", err);
        addToast("Generation failed. Check console for details.", "error");
      } finally {
        if (genVersionRef.current === version) {
          setIsGenerating(false);
        }
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [sourceImage, options, sourceDataURL, isSVGSource, svgContent, addToast]);

  const handleReset = useCallback(() => {
    setSourceImage(null);
    setSourceFile(null);
    setSourceDataURL("");
    setIsSVGSource(false);
    setSVGContent(undefined);
    setGeneratedIcons(new Map());
    setOptions(DEFAULT_OPTIONS);
    setManifest(DEFAULT_MANIFEST);
    setHasImage(false);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--c-bg)" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14 border-b"
        style={{
          background: "var(--c-card)",
          borderColor: "var(--c-border)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "var(--c-primary)", color: "#fff" }}
            aria-hidden
          >
            ✦
          </div>
          <div>
            <h1
              className="font-heading font-bold text-base leading-none"
              style={{ color: "var(--c-fg)" }}
            >
              Favicon Studio
            </h1>
            <p
              className="text-xs leading-none mt-0.5"
              style={{ color: "var(--c-fg-muted)" }}
            >
              Client-side favicon generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasImage && (
            <button
              onClick={handleReset}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer"
              style={{
                borderColor: "var(--c-border-strong)",
                color: "var(--c-fg-muted)",
                background: "transparent",
              }}
              aria-label="Reset and start over"
            >
              Reset
            </button>
          )}
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
        </div>
      </header>

      {/* Hero upload state */}
      {!hasImage && (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6 py-12">
          <div className="w-full max-w-xl">
            <div className="text-center mb-8">
              <h2
                className="font-heading font-bold text-3xl mb-3"
                style={{ color: "var(--c-fg)" }}
              >
                Generate every favicon
                <br />
                you'll ever need
              </h2>
              <p className="text-base" style={{ color: "var(--c-fg-muted)" }}>
                Upload one image. Download 47 files optimised for browsers,
                <br />
                iOS, Android, Windows, and PWAs - all in one ZIP.
              </p>
            </div>

            <UploadZone
              sourceFile={null}
              sourceImage={null}
              onFile={handleFile}
              onToast={addToast}
            />

            <div className="flex justify-center gap-6 mt-8">
              {["100% client-side", "Works offline", "No uploads"].map(
                (label) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span style={{ color: "var(--c-primary)" }}>✓</span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--c-fg-muted)" }}
                    >
                      {label}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </main>
      )}

      {/* Main two-column layout */}
      {hasImage && (
        <main className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-3.5rem)]">
          {/* Preview grid (left / bottom on mobile) */}
          <div className="flex-1 overflow-auto p-6 order-2 lg:order-1">
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-heading font-semibold text-lg"
                  style={{ color: "var(--c-fg)" }}
                >
                  Preview
                </h2>
                {isGenerating && (
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "var(--c-fg-muted)" }}
                  >
                    <span
                      className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                      aria-hidden
                    />
                    Generating…
                  </div>
                )}
                {!isGenerating && generatedIcons.size > 0 && (
                  <p className="text-xs" style={{ color: "var(--c-fg-muted)" }}>
                    {generatedIcons.size} files ready
                  </p>
                )}
              </div>

              <PreviewGrid
                icons={generatedIcons}
                isGenerating={isGenerating}
                onToast={addToast}
              />
            </div>
          </div>

          {/* Options panel (right / top on mobile, sticky on desktop) */}
          <aside
            className="w-full lg:w-80 xl:w-96 border-l flex-shrink-0 order-1 lg:order-2 overflow-y-auto"
            style={{
              borderColor: "var(--c-border)",
              background: "var(--c-card2)",
            }}
          >
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Compact upload zone */}
                <UploadZone
                  sourceFile={sourceFile}
                  sourceImage={sourceImage}
                  onFile={handleFile}
                  onToast={addToast}
                  compact
                />

                {/* Options */}
                <OptionsPanel options={options} onChange={setOptions} />

                {/* Manifest panel (conditional) */}
                {options.generateManifest && (
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "var(--c-card)",
                      border: "1px solid var(--c-border)",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "var(--c-border)" }}
                    >
                      <h3
                        className="font-heading font-semibold text-sm"
                        style={{ color: "var(--c-fg)" }}
                      >
                        Manifest Options
                      </h3>
                    </div>
                    <div className="px-4 py-4">
                      <ManifestPanel
                        manifest={manifest}
                        onChange={setManifest}
                      />
                    </div>
                  </div>
                )}

                {/* Download bar */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--c-card)",
                    border: "1px solid var(--c-border)",
                  }}
                >
                  <h3
                    className="font-heading font-semibold text-sm mb-3"
                    style={{ color: "var(--c-fg)" }}
                  >
                    Download
                  </h3>
                  <DownloadBar
                    icons={generatedIcons}
                    options={options}
                    manifest={manifest}
                    onToast={addToast}
                  />
                </div>
              </div>
            </div>
          </aside>
        </main>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
