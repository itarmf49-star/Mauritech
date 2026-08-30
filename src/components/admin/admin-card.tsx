import { ReactNode } from "react";

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerAction?: ReactNode;
}

export function AdminCard({ 
  children, 
  title, 
  description, 
  className = "",
  headerAction 
}: AdminCardProps) {
  return (
    <div className={`bg-white backdrop-blur-md border border-gray-200 rounded-xl shadow-lg ${className}`}>
      {(title || description || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}