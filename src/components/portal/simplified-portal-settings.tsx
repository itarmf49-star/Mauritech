"use client";

import { useState } from "react";
import { User, Lock, Globe, Bell } from "lucide-react";

interface SimplifiedSettingsProps {
  locale: "fr" | "ar";
  email: string;
  userName?: string;
}

export function SimplifiedSettings({ locale, email, userName }: SimplifiedSettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "language" | "notifications">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: userName || "",
    phone: "",
    company: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    invoiceReminders: true,
    orderUpdates: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert(locale === "fr" ? "Sauvegarde reussie!" : "Saved successfully!");
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{profile.name || userName}</h3>
          <p className="text-slate-400 text-sm">{email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Nom complet" : "Full Name"}
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Telephone" : "الهاتف"}
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Entreprise" : "الشركة"}
          </label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Mot de passe actuel" : "Current Password"}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={security.currentPassword}
            onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Nouveau mot de passe" : "New Password"}
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={security.newPassword}
            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
            className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showNewPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Confirmer le mot de passe" : "Confirm Password"}
        </label>
        <input
          type="password"
          value={security.confirmPassword}
          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
          className="w-full bg-slate-800/60 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <button className="btn btn-primary w-full">
        {locale === "fr" ? "Mettre a jour le mot de passe" : "Update Password"}
      </button>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-4">
          {locale === "fr" ? "Langue preferee" : "Preferred Language"}
        </label>
        <div className="space-y-2">
          <button
            className={`w-full p-4 rounded-lg border transition flex items-center gap-4 ${
              locale === "fr" 
                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" 
                : "bg-slate-800/60 border-yellow-500/30 text-slate-300 hover:bg-slate-800/70"
            }`}
          >
            <span className="text-2xl">🇫🇷</span>
            <div className="text-left">
              <div className="font-semibold">Francais</div>
              <div className="text-sm opacity-70">French</div>
            </div>
          </button>
          <button
            className={`w-full p-4 rounded-lg border transition flex items-center gap-4 ${
              locale === "ar" 
                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" 
                : "bg-slate-800/60 border-yellow-500/30 text-slate-300 hover:bg-slate-800/70"
            }`}
          >
            <span className="text-2xl">🇲🇷</span>
            <div className="text-right">
              <div className="font-semibold">العربية</div>
              <div className="text-sm opacity-70">Arabic</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white">
              {locale === "fr" ? "Notifications par email" : "Email Notifications"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Recevoir les mises a jour par email" : "Receive updates via email"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.email}
          onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white">
              {locale === "fr" ? "Rappels de factures" : "Invoice Reminders"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Notifications avant les echeances" : "Notifications before due dates"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.invoiceReminders}
          onChange={(e) => setNotifications({ ...notifications, invoiceReminders: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg border border-yellow-500/30">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white">
              {locale === "fr" ? "Mises a jour de commandes" : "Order Updates"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Suivi de vos commandes" : "Track your orders"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.orderUpdates}
          onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
    </div>
  );

  const tabs = [
    { id: "profile" as const, icon: User, label: locale === "fr" ? "Profil" : "الملف الشخصي" },
    { id: "security" as const, icon: Lock, label: locale === "fr" ? "Securite" : "الأمان" },
    { id: "language" as const, icon: Globe, label: locale === "fr" ? "Langue" : "اللغة" },
    { id: "notifications" as const, icon: Bell, label: locale === "fr" ? "Notifications" : "الإشعارات" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {locale === "fr" ? "Parametres" : "الإعدادات"}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? "..." : (locale === "fr" ? "Sauvegarder" : "Save")}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-800/70 border border-yellow-500/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-800/60 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "language" && renderLanguageTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
      </div>
    </div>
  );
}