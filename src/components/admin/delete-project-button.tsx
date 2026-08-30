"use client";

import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ confirmMessage }: { confirmMessage: string }) {
  return (
    <button
      type="submit"
      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
