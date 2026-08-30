"use client";

import { useState } from "react";
import { ShoppingCart, Package, Sparkles, Zap } from "lucide-react";

export function AnimatedShoppingCart() {
  const [isHovered, setIsHovered] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="relative p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110">
        <ShoppingCart className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
        
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
            {cartCount}
          </span>
        )}
      </button>

      {/* Floating Shopping Items Animation */}
      {isHovered && (
        <div className="absolute -right-16 top-0 space-y-2">
          <div className="animate-bounce delay-100">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="animate-bounce delay-200">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="animate-bounce delay-300">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}