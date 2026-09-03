"use client";

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  empty,
}: {
  columns: { key: string; header: string }[];
  rows: T[];
  empty: string;
}) {
  if (rows.length === 0) {
    return <div className="px-5 py-10 text-center text-gray-400 text-sm">{empty}</div>;
  }

  return (
    <div className="overflow-hidden bg-white rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-5 py-3 text-left font-bold text-gray-500 text-xs uppercase tracking-wide">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-5 py-3 border-t border-gray-100 text-gray-700">
                  {(r as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
