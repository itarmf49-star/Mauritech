import { ReactNode } from "react";

interface AdminBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

export function AdminBadge({ children, variant = "default", className = "" }: AdminBadgeProps) {
  const variantStyles = {
    success: "admin-badge-success",
    warning: "admin-badge-warning",
    error: "admin-badge-error",
    info: "admin-badge-info",
    default: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <span className={`admin-badge ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}