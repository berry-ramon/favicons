import {
  useRef,
  useState,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";

interface Props {
  sourceFile: File | null;
  sourceImage: HTMLImageElement | null;
  onFile: (file: File) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
  compact?: boolean;
}

const ACCEPTED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);

export function UploadZone({
  sourceFile,
  sourceImage,
  onFile,
  onToast,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.has(file.type)) {
        onToast("Please upload a PNG, JPG, SVG, or WEBP file.", "error");
        return;
      }
      onFile(file);
    },
    [onFile, onToast],
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const onClick = useCallback(() => inputRef.current?.click(), []);

  if (compact && sourceImage && sourceFile) {
    return (
      <div className="rounded-xl p-4" style={{ background: "var(--c-muted)" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 checkerboard">
            <img
              src={sourceImage.src}
              alt="Source icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--c-fg)" }}
            >
              {sourceFile.name}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--c-fg-muted)" }}
            >
              {sourceImage.naturalWidth}×{sourceImage.naturalHeight}px
            </p>
          </div>
          <button
            onClick={onClick}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ background: "var(--c-card)", color: "var(--c-primary)" }}
          >
            Change
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          aria-label="Upload source image"
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload source image - drag and drop or click to browse"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-200 select-none ${compact ? "p-6 min-h-24" : "p-12 min-h-64"}`}
      style={{
        border: `2px dashed ${dragging ? "var(--c-primary)" : "var(--c-border-strong)"}`,
        background: dragging
          ? "color-mix(in srgb, var(--c-primary) 5%, var(--c-card))"
          : "var(--c-card)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="sr-only"
        aria-label="Upload source image"
        onChange={onChange}
      />

      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
        style={{
          background:
            "color-mix(in srgb, var(--c-primary) 12%, var(--c-muted))",
        }}
      >
        🖼
      </div>

      <p
        className="font-heading font-semibold text-lg mb-1 text-center"
        style={{ color: "var(--c-fg)" }}
      >
        {dragging ? "Drop it here" : "Drop your image here"}
      </p>
      <p
        className="text-sm text-center mb-4"
        style={{ color: "var(--c-fg-muted)" }}
      >
        or click to browse - PNG, JPG, SVG, WEBP
      </p>

      <div
        className="text-xs px-3 py-1.5 rounded-full border"
        style={{
          borderColor: "var(--c-border-strong)",
          color: "var(--c-fg-muted)",
        }}
      >
        Recommended: 1024×1024 or larger
      </div>
    </div>
  );
}
