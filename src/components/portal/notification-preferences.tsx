"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Mail, Check, AlertCircle } from "lucide-react";

type NotificationPreferences = {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  invoiceNotifications: boolean;
  ticketNotifications: boolean;
  projectNotifications: boolean;
  systemNotifications: boolean;
  digestMode: string;
};

export function NotificationPreferences() {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    inAppEnabled: true,
    invoiceNotifications: true,
    ticketNotifications: true,
    projectNotifications: true,
    systemNotifications: true,
    digestMode: "immediate",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchPreferences();
    }
  }, [session]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/portal/notifications/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch("/api/portal/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof NotificationPreferences] }));
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Check className="w-4 h-4" />
            Saved successfully
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* General Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">General Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("emailEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.emailEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-gray-600">Show notifications in the portal</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle("inAppEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.inAppEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.inAppEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Digest Mode</p>
                  <p className="text-sm text-gray-600">How often to receive notifications</p>
                </div>
              </div>
              <select
                value={preferences.digestMode}
                onChange={(e) => setPreferences(prev => ({ ...prev, digestMode: e.target.value }))}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Notification Categories</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">💰 Invoice Notifications</p>
                <p className="text-sm text-gray-600">New invoices, payment reminders, receipts</p>
              </div>
              <button
                onClick={() => handleToggle("invoiceNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.invoiceNotifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.invoiceNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">🎫 Support Ticket Notifications</p>
                <p className="text-sm text-gray-600">Ticket updates, responses, closures</p>
              </div>
              <button
                onClick={() => handleToggle("ticketNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.ticketNotifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.ticketNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">🚀 Project Notifications</p>
                <p className="text-sm text-gray-600">Project updates, milestones, completions</p>
              </div>
              <button
                onClick={() => handleToggle("projectNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.projectNotifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.projectNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">📢 System Notifications</p>
                <p className="text-sm text-gray-600">System announcements, maintenance alerts</p>
              </div>
              <button
                onClick={() => handleToggle("systemNotifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.systemNotifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.systemNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={savePreferences}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}