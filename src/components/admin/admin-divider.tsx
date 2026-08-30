interface AdminDividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function AdminDivider({ orientation = "horizontal", className = "" }: AdminDividerProps) {
  return (
    <div
      className={`${
        orientation === "horizontal"
          ? "w-full h-px bg-gray-200"
          : "h-full w-px bg-gray-200"
      } ${className}`}
    />
  );
}