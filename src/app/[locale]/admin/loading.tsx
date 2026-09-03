export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
        <p className="text-gray-400 text-sm">...</p>
      </div>
    </div>
  );
}
