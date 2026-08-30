import { Loader2 } from "lucide-react";

interface AdminLoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function AdminLoading({ size = "md", text }: AdminLoadingProps) {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className={`animate-spin text-blue-500 ${sizeStyles[size]}`} />
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}

export function AdminPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <AdminLoading size="lg" text="Loading admin dashboard..." />
    </div>
  );
}