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
  return (
    <div className="overflow-hidden bg-[#111827] rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.02]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-5 py-3 text-left font-extrabold text-white/70">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-white/[0.03]">
              {columns.map((c) => (
                // هنا نستخدم خاصية الوصول للبيانات مباشرة
                <td key={c.key} className="px-5 py-3 border-t border-white/5 text-white/85">
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
