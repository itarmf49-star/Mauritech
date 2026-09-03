export const IconWrapper = ({ icon: Icon, color = "#F4623A" }: { icon: any, color?: string }) => (
  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100" style={{ color }}>
    <Icon className="h-8 w-8" strokeWidth={1.5} />
  </div>
);
