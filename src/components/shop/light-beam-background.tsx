"use client";

import { useEffect, useState } from "react";

interface LightBeamBackgroundProps {
  children: React.ReactNode;
}

export function LightBeamBackground({ children }: LightBeamBackgroundProps) {
  const [beams, setBeams] = useState<Array<{ id: number; left: number; delay: number; duration: number; width: number }>>([]);
  const [orbs, setOrbs] = useState<Array<{ id: number; top: number; left: number; size: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate random light beams
    const newBeams = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 6,
      width: 60 + Math.random() * 80,
    }));
    setBeams(newBeams);

    // Generate random glowing orbs
    const newOrbs = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      top: 20 + Math.random() * 60,
      left: 10 + Math.random() * 80,
      size: 150 + Math.random() * 200,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 4,
    }));
    setOrbs(newOrbs);
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Light Beams - Subtle Vertical Light */}
      {beams.map((beam) => (
        <div
          key={beam.id}
          className="absolute top-0 bottom-0 opacity-15 pointer-events-none"
          style={{
            left: `${beam.left}%`,
            width: `${beam.width}px`,
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(234, 179, 8, 0.08) 20%, 
              rgba(234, 179, 8, 0.15) 50%, 
              rgba(234, 179, 8, 0.08) 80%, 
              transparent 100%)`,
            animation: `moveBeam ${beam.duration}s ease-in-out infinite`,
            animationDelay: `${beam.delay}s`,
            filter: 'blur(40px)',
          }}
        />
      ))}

      {/* Glowing Ambient Light Orbs - Floating and Pulsing */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, 
              rgba(234, 179, 8, 0.12) 0%, 
              rgba(234, 179, 8, 0.06) 40%, 
              rgba(234, 179, 8, 0.02) 70%, 
              transparent 100%)`,
            animation: `floatOrb ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            filter: 'blur(60px)',
          }}
        />
      ))}

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-white pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes moveBeam {
          0%, 100% {
            transform: translateY(-100%) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.15;
          }
          50% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0.15;
          }
          80% {
            opacity: 0.15;
          }
        }

        @keyframes floatOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(30px, -20px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
            opacity: 0.7;
          }
          75% {
            transform: translate(-30px, -10px) scale(1.05);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
}
