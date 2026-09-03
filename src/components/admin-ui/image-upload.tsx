"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

async function uploadFile(file: File, folder: string, locale: Locale): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t(locale, "adminImageUploadFailed"));
  return data.url as string;
}

type ImageUploadProps = {
  folder: string;
  /** صورة واحدة: value/onChange نصّيان. صور متعددة: مرّر value/onChange كمصفوفة عبر multiple. */
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  error?: string | null;
  onErrorClear?: () => void;
  className?: string;
  aspect?: "square" | "wide";
  /** "contain" يعرض الصورة كاملة دون قص (مناسب للشعارات والأغلفة التي تأتي بأبعاد
   *  حرة)، بينما "cover" يملأ الإطار ويقصّ الزوائد (مناسب لصور المنتجات). */
  fit?: "cover" | "contain";
  locale?: Locale;
};

/** رفع صورة واحدة بالسحب والإفلات أو التصفح من الجهاز، مع معاينة فورية. */
export function ImageUpload({ folder, value, onChange, label, hint, error, onErrorClear, className, aspect = "square", fit = "cover", locale = defaultLocale }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const shownError = error ?? localError;

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setLocalError(t(locale, "adminImagesOnlyAllowed"));
        return;
      }
      setLocalError(null);
      onErrorClear?.();
      setUploading(true);
      try {
        const url = await uploadFile(file, folder, locale);
        onChange(url);
      } catch (e) {
        setLocalError((e as Error).message);
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, onErrorClear, locale],
  );

  return (
    <div className={className}>
      {label && <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-colors flex items-center gap-4 p-3 ${
          dragOver ? "border-[#3b82f6] bg-[#3b82f6]/5" : "border-gray-200 hover:border-gray-300 bg-gray-50"
        } ${aspect === "wide" ? "min-h-[96px]" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />

        <div className={`shrink-0 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center ${aspect === "wide" ? "h-16 w-24" : "h-16 w-16"}`}>
          {uploading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={`h-full w-full ${fit === "contain" ? "object-contain p-1.5" : "object-cover"}`} />
          ) : (
            <UploadCloud className="h-6 w-6 text-gray-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-700">
            {uploading ? t(locale, "adminUploading") : value ? t(locale, "adminChangeImage") : t(locale, "adminDragImageHere")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{hint || t(locale, "adminImageFormatHint")}</p>
        </div>

        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="shrink-0 h-7 w-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 flex items-center justify-center"
            aria-label={t(locale, "adminRemoveImage")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {shownError && <p className="text-red-600 text-xs mt-1.5">{shownError}</p>}
    </div>
  );
}

type MultiImageUploadProps = {
  folder: string;
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  locale?: Locale;
};

/** رفع عدة صور (سحب وإفلات أو تصفح، يقبل تحديد أكثر من ملف دفعة واحدة) مع معاينة شبكية وإمكانية الحذف وإعادة الترتيب البسيطة. */
export function MultiImageUpload({ folder, value, onChange, label, hint, className, locale = defaultLocale }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[] | undefined) => {
      const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) return;
      setError(null);
      setUploading(true);
      try {
        const urls = await Promise.all(list.map((f) => uploadFile(f, folder, locale)));
        onChange([...value, ...urls]);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setUploading(false);
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
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((url, idx) => (
            <div key={idx} className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                aria-label={t(locale, "adminRemoveImage")}
              >
                <X className="h-4 w-4" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-white text-[9px] text-center py-0.5">{t(locale, "adminMainBadge")}</span>
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
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files ?? undefined)}
        />
        <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
          {uploading ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <UploadCloud className="h-5 w-5 text-gray-300" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-700">{uploading ? t(locale, "adminUploading") : t(locale, "adminDragImagesHere")}</p>
          <p className="text-xs text-gray-400 mt-0.5">{hint || t(locale, "adminMultiImageHint")}</p>
        </div>
      </div>
      {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
