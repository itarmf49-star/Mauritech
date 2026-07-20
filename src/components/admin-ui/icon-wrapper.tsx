export const IconWrapper = ({ icon: Icon, color = "#F5C542" }: { icon: any, color?: string }) => (
  <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg" style={{ color }}>
    <Icon className="h-8 w-8" strokeWidth={1.5} />
  </div>
);
