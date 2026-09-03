export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-[#FF9900] animate-spin" />
        <p className="text-gray-400 text-sm">...</p>
      </div>
    </div>
  );
}
