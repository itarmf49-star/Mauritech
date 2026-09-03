type StarRatingProps = {
  rating: number;
  count?: number;
  size?: "sm" | "md";
};

export function StarRating({ rating, count, size = "sm" }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2; // نصف نجمة
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = rounded >= i + 1 ? "full" : rounded >= i + 0.5 ? "half" : "none";
          return (
            <svg key={i} viewBox="0 0 20 20" className={starSize}>
              <defs>
                <linearGradient id={`star-half-${i}`}>
                  <stop offset="50%" stopColor="#FF9900" />
                  <stop offset="50%" stopColor="#E3E6E6" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85z"
                fill={fill === "full" ? "#FF9900" : fill === "half" ? `url(#star-half-${i})` : "#E3E6E6"}
              />
            </svg>
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-[#007185] font-medium">{count > 0 ? `(${count})` : ""}</span>
      )}
    </div>
  );
}
