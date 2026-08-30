"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";

interface SystemStatus {
  database: "connected" | "disconnected" | "slow";
  api: "operational" | "degraded" | "down";
  cache: "active" | "inactive";
  uptime: string;
}

export function AdminStatusBar() {
  const [status, setStatus] = useState<SystemStatus>({
    database: "connected",
    api: "operational",
    cache: "active",
    uptime: "99.9%"
  });

  const statusIcons = {
    connected: <CheckCircle className="h-4 w-4 text-green-600" />,
    disconnected: <AlertCircle className="h-4 w-4 text-red-600" />,
    slow: <Clock className="h-4 w-4 text-yellow-600" />,
    operational: <CheckCircle className="h-4 w-4 text-green-600" />,
    degraded: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    down: <AlertCircle className="h-4 w-4 text-red-600" />,
    active: <Zap className="h-4 w-4 text-blue-600" />,
    inactive: <Clock className="h-4 w-4 text-gray-600" />,
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-white border border-gray-300 rounded-lg">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">Database:</span>
        {statusIcons[status.database]}
        <span className={`font-medium ${
          status.database === "connected" ? "text-green-600" :
          status.database === "disconnected" ? "text-red-600" : "text-yellow-600"
        }`}>
          {status.database}
        </span>
      </div>

      <div className="w-px h-4 bg-gray-300" />

      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">API:</span>
        {statusIcons[status.api]}
        <span className={`font-medium ${
          status.api === "operational" ? "text-green-600" :
          status.api === "degraded" ? "text-yellow-600" : "text-red-600"
        }`}>
          {status.api}
        </span>
      </div>

      <div className="w-px h-4 bg-gray-300" />

      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">Cache:</span>
        {statusIcons[status.cache]}
        <span className={`font-medium ${
          status.cache === "active" ? "text-blue-600" : "text-gray-600"
        }`}>
          {status.cache}
        </span>
      </div>

      <div className="w-px h-4 bg-gray-300" />

      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">Uptime:</span>
        <span className="font-medium text-green-600">{status.uptime}</span>
      </div>
    </div>
  );
}