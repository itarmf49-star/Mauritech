import { ReactNode } from "react";

interface AdminTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export function AdminTable({ headers, children, className = "" }: AdminTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="admin-table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface AdminTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AdminTableRow({ children, className = "", onClick }: AdminTableRowProps) {
  return (
    <tr 
      className={`admin-table-row ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface AdminTableCellProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableCell({ children, className = "" }: AdminTableCellProps) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}