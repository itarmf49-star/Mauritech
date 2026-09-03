"use client";

import { useCallback, useRef, useState } from "react";
import { X, Loader2, Video } from "lucide-react";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

async function uploadFile(file: File, folder: string, locale: Locale): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t(locale, "adminVideoUploadFailed"));
  return data.url as string;
}

type MultiVideoUploadProps = {
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  locale?: Locale;
};

/** رفع عدة فيديوهات من الجهاز (سحب وإفلات أو تصفح)، مع معاينة فورية وإمكانية الحذف —
 *  تُستخدم لتغذية لوحة العرض الكبيرة المتحركة في صفحة الخدمة. */
export function MultiVideoUpload({ folder, value, onChange, label, hint, className, locale = defaultLocale }: MultiVideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progressCount, setProgressCount] = useState<{ done: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[] | undefined) => {
      const list = Array.from(files || []).filter((f) => f.type.startsWith("video/"));
      if (list.length === 0) return;
      setError(null);
      setUploading(true);
      setProgressCount({ done: 0, total: list.length });
      try {
        const urls: string[] = [];
        for (const f of list) {
          const url = await uploadFile(f, folder, locale);
          urls.push(url);
          setProgressCount((p) => (p ? { ...p, done: p.done + 1 } : p));
        }
        onChange([...value, ...urls]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading(false);
        setProgressCount(null);
      }
    },
    [folder, onChange, value, locale],
  );

  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {value.map((url, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 bg-black group aspect-video">
              <video src={url} className="h-full w-full object-cover" muted playsInline />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                aria-label={t(locale, "adminRemoveVideo")}
              >
                <X className="h-5 w-5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-white text-[9px] text-center py-0.5">{t(locale, "adminFirstVideoInPanel")}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed transition-colors flex items-center gap-3 p-3 ${
          dragOver ? "border-[#3b82f6] bg-[#3b82f6]/5" : "border-gray-200 hover:border-gray-300 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files ?? undefined)}
        />
        <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
          {uploading ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <Video className="h-5 w-5 text-gray-300" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-700">
            {uploading
              ? `${t(locale, "adminUploadingVideo")} ${progressCount ? `${progressCount.done + 1}/${progressCount.total}` : ""}...`
              : t(locale, "adminDragVideosHere")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{hint || t(locale, "adminVideoFormatHint")}</p>
        </div>
      </div>
      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
