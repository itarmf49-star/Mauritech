import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg";
  border?: boolean;
  glow?: boolean;
}

export function GlassCard({ 
  children, 
  className = "", 
  blur = "md",
  border = true,
  glow = false
}: GlassCardProps) {
  const blurStyles = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg",
  };

  return (
    <div
      className={`
        relative bg-slate-800/60
        ${blurStyles[blur]}
        ${border ? "border border-yellow-500/30" : ""}
        ${glow ? "shadow-[0_0_40px_rgba(212,175,55,0.3)]" : "shadow-xl"}
        rounded-2xl
        overflow-hidden
        transition-all duration-300
        hover:bg-slate-800/70 hover:border-yellow-500/50
        ${className}
      `}
    >
      {children}
    </div>
  );
}