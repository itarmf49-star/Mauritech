"use client";

import { useEffect, useRef, useState } from "react";

type ShowcaseItem = { url: string; title: string };

type VideoShowcaseProps = {
  items: ShowcaseItem[];
};

/** لوحة عرض كبيرة تُشغّل فيديوهات الخدمات تلقائياً وتتنقّل بينها بحركة انتقالية سلسة. */
export function VideoShowcase({ items }: VideoShowcaseProps) {
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActive((a) => (a >= items.length ? 0 : a));
  }, [items.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // بعض المتصفحات تمنع التشغيل التلقائي قبل تفاعل المستخدم — لا مشكلة، يبقى أول إطار ظاهراً
      });
    }
  }, [active]);

  function goTo(idx: number) {
    setActive(((idx % items.length) + items.length) % items.length);
  }

  function handleEnded() {
    if (items.length > 1) goTo(active + 1);
  }

  if (items.length === 0) return null;

  return (
    <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] rounded-3xl overflow-hidden bg-gray-900 shadow-lg">
      {items.map((item, idx) => (
        <video
          key={item.url + idx}
          ref={idx === active ? videoRef : undefined}
          src={item.url}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${idx === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          muted
          playsInline
          autoPlay={idx === active}
          onEnded={idx === active ? handleEnded : undefined}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 flex items-end justify-between gap-4">
        <p className="text-white font-bold text-lg sm:text-2xl drop-shadow-md line-clamp-1">{items[active]?.title}</p>

        {items.length > 1 && (
          <div className="flex gap-1.5 shrink-0">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={`عرض ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === active ? "w-6 bg-[#FF9900]" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={() => goTo(active - 1)}
            aria-label="السابق"
            className="absolute top-1/2 -translate-y-1/2 start-3 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(active + 1)}
            aria-label="التالي"
            className="absolute top-1/2 -translate-y-1/2 end-3 h-9 w-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
