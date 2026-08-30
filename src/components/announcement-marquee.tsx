"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, Gift, AlertCircle } from "lucide-react";

interface Announcement {
  id: string;
  text: string;
  icon: React.ReactNode;
  type: "promo" | "info" | "urgent";
}

const announcements: Announcement[] = [
  {
    id: "1",
    text: "🚀 New Wi-Fi 6 Installation Services Available - Get 50% Faster Speeds!",
    icon: <Zap className="w-4 h-4" />,
    type: "promo"
  },
  {
    id: "2", 
    text: "🎁 Free Site Survey for New Business Customers - Contact Us Today!",
    icon: <Gift className="w-4 h-4" />,
    type: "promo"
  },
  {
    id: "3",
    text: "⚡ 24/7 Emergency Support Available for All Clients",
    icon: <Sparkles className="w-4 h-4" />,
    type: "info"
  },
  {
    id: "4",
    text: "🔔 System Maintenance Scheduled: Sunday 2AM-4AM UTC",
    icon: <AlertCircle className="w-4 h-4" />,
    type: "urgent"
  }
];

export function AnnouncementMarquee() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentAnnouncement = announcements[currentIndex];
  const typeColors = {
    promo: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
    info: "from-green-500/20 to-emerald-500/20 border-green-500/30", 
    urgent: "from-red-500/20 to-orange-500/20 border-red-500/30",
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900 border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse" />
      
      <div className="relative flex items-center justify-center py-2 px-4">
        <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r ${typeColors[currentAnnouncement.type]} border animate-in slide-in-from-bottom-4 duration-500`}>
          <span className="text-white/80">{currentAnnouncement.icon}</span>
          <span className="text-sm font-medium text-white">{currentAnnouncement.text}</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-4000 ease-linear"
          style={{ width: `${((currentIndex + 1) / announcements.length) * 100}%` }}
        />
      </div>
    </div>
  );
}