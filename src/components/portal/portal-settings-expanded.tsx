"use client";

import { useState } from "react";
import { User, Lock, Bell, Globe, Key, Shield, Database, Download, Upload, Save, Eye, EyeOff } from "lucide-react";

interface ExpandedSettingsProps {
  locale: "fr" | "ar";
  email: string;
  userName?: string;
}

export function PortalSettingsExpanded({ locale, email, userName }: ExpandedSettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "language" | "notifications" | "api" | "roles" | "backup">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: userName || "",
    email: email,
    phone: "",
    company: "",
    address: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    invoiceReminders: true,
    orderUpdates: true,
    supportMessages: true,
  });

  const [apiKeys, setApiKeys] = useState({
    whatsappApiKey: "",
    whatsappBusinessId: "",
    apiKey: "",
    apiSecret: "",
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
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{profile.name || userName}</h3>
          <p className="text-slate-400">{email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Nom complet" : "Full Name"}
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Telephone" : "الهاتف"}
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Entreprise" : "الشركة"}
          </label>
          <input
            type="text"
            value={profile.company}
            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Adresse" : "Address"}
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <button className="btn btn-primary">
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
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
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
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
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
      <p className="text-sm text-slate-400">
        {locale === "fr" 
          ? "La langue selectionnee sera appliquee a toute l'interface." 
          : "Selected language will be applied to the entire interface."}
      </p>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
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
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-white">
              {locale === "fr" ? "Notifications push" : "Push Notifications"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Recevoir les notifications en temps reel" : "Receive real-time notifications"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.push}
          onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
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
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
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

  const renderApiTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Cle API WhatsApp" : "WhatsApp API Key"}
        </label>
        <input
          type="password"
          value={apiKeys.whatsappApiKey}
          onChange={(e) => setApiKeys({ ...apiKeys, whatsappApiKey: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="••••••••••••"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "ID Business WhatsApp" : "WhatsApp Business ID"}
        </label>
        <input
          type="text"
          value={apiKeys.whatsappBusinessId}
          onChange={(e) => setApiKeys({ ...apiKeys, whatsappBusinessId: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Cle API Application" : "Application API Key"}
        </label>
        <input
          type="password"
          value={apiKeys.apiKey}
          onChange={(e) => setApiKeys({ ...apiKeys, apiKey: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="••••••••••••"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-2">
          {locale === "fr" ? "Secret API" : "API Secret"}
        </label>
        <input
          type="password"
          value={apiKeys.apiSecret}
          onChange={(e) => setApiKeys({ ...apiKeys, apiSecret: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          placeholder="••••••••••••"
        />
      </div>
      <p className="text-sm text-slate-400">
        {locale === "fr" 
          ? "Ces cles sont utilisees pour l'integration avec WhatsApp et les services externes." 
          : "These keys are used for WhatsApp and external service integration."}
      </p>
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-4">
      <div className="p-4 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">
              {locale === "fr" ? "Role actuel" : "Current Role"}
            </span>
          </div>
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            Client
          </span>
        </div>
        <p className="text-sm text-slate-400">
          {locale === "fr" 
            ? "Vous avez acces au portail client pour gerer vos commandes et factures." 
            : "You have access to the client portal to manage your orders and invoices."}
        </p>
      </div>
      <div className="p-4 bg-white/5 rounded-lg opacity-50">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-slate-400" />
          <span className="text-white font-semibold">Admin</span>
        </div>
        <p className="text-sm text-slate-400">
          {locale === "fr" 
            ? "Acces complet au tableau de bord administratif" 
            : "Full access to administrative dashboard"}
        </p>
      </div>
      <div className="p-4 bg-white/5 rounded-lg opacity-50">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-slate-400" />
          <span className="text-white font-semibold">Support</span>
        </div>
        <p className="text-sm text-slate-400">
          {locale === "fr" 
            ? "Acces aux tickets de support" 
            : "Access to support tickets"}
        </p>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          {locale === "fr" ? "Exporter vos donnees" : "Export Your Data"}
        </h3>
        <div className="space-y-3">
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Commandes" : "Orders"}</span>
          </button>
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Factures" : "Invoices"}</span>
          </button>
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Historique des messages" : "Message History"}</span>
          </button>
          <button className="w-full btn btn-primary flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Tout exporter" : "Export All"}</span>
          </button>
        </div>
      </div>
      <div className="p-6 bg-white/5 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          {locale === "fr" ? "Importer des donnees" : "Import Data"}
        </h3>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">
            {locale === "fr" 
              ? "Glissez-deposez votre fichier ici ou cliquez pour selectionner" 
              : "Drag and drop your file here or click to select"}
          </p>
          <button className="btn btn-ghost">
            {locale === "fr" ? "Selectionner un fichier" : "Select File"}
          </button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "profile" as const, icon: User, label: locale === "fr" ? "Profil" : "الملف الشخصي" },
    { id: "security" as const, icon: Lock, label: locale === "fr" ? "Securite" : "الأمان" },
    { id: "language" as const, icon: Globe, label: locale === "fr" ? "Langue" : "اللغة" },
    { id: "notifications" as const, icon: Bell, label: locale === "fr" ? "Notifications" : "الإشعارات" },
    { id: "api" as const, icon: Key, label: "API" },
    { id: "roles" as const, icon: Shield, label: locale === "fr" ? "Roles" : "الأدوار" },
    { id: "backup" as const, icon: Database, label: locale === "fr" ? "Sauvegarde" : "النسخ الاحتياطي" },
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
          <Save className="w-4 h-4" />
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
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "language" && renderLanguageTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "api" && renderApiTab()}
        {activeTab === "roles" && renderRolesTab()}
        {activeTab === "backup" && renderBackupTab()}
      </div>
    </div>
  );
}