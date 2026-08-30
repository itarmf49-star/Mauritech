"use client";

import { useState } from "react";
import { User, Lock, Globe, Bell, Shield, Database, Download, Upload, Save, Eye, EyeOff, Smartphone, RefreshCw } from "lucide-react";

interface CompleteAdminSettingsProps {
  locale: "fr" | "ar";
}

export function CompleteAdminSettings({ locale }: CompleteAdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "language" | "notifications" | "roles" | "backup">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin Manager",
    email: "admin@mauritech.mr",
    phone: "+222 333 4444",
    company: "MauriTech",
    address: "Nouakchott, Mauritanie",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orderAlerts: true,
    stockAlerts: true,
    customerMessages: true,
  });

  const [roles, setRoles] = useState([
    { id: 1, name: "Admin", permissions: "Full access", users: 2 },
    { id: 2, name: "Editor", permissions: "Content management", users: 3 },
    { id: 3, name: "Viewer", permissions: "Read only", users: 5 },
  ]);

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
          <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
          <p className="text-slate-400">{profile.email}</p>
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
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            {locale === "fr" ? "Adresse" : "العنوان"}
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gray-900"
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
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gray-900"
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
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <button className="btn btn-primary w-full">
        {locale === "fr" ? "Mettre a jour le mot de passe" : "Update Password"}
      </button>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-gray-900 font-medium">
                {locale === "fr" ? "Authentification a deux facteurs" : "Two-Factor Authentication"}
              </p>
              <p className="text-sm text-slate-400">
                {locale === "fr" ? "Securite supplementaire" : "Additional security"}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={security.twoFactorEnabled}
            onChange={(e) => setSecurity({ ...security, twoFactorEnabled: e.target.checked })}
            className="rounded w-5 h-5 accent-yellow-500"
          />
        </div>
      </div>
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
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
          ? "La langue selectionnee sera appliquee a toute l'interface administrative." 
          : "Selected language will be applied to the entire admin interface."}
      </p>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-gray-900">
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
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-gray-900">
              {locale === "fr" ? "Alertes de commandes" : "Order Alerts"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Notifications pour les nouvelles commandes" : "Notifications for new orders"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.orderAlerts}
          onChange={(e) => setNotifications({ ...notifications, orderAlerts: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-gray-900">
              {locale === "fr" ? "Alertes de stock" : "Stock Alerts"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Notifications pour le stock faible" : "Notifications for low stock"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.stockAlerts}
          onChange={(e) => setNotifications({ ...notifications, stockAlerts: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-gray-900">
              {locale === "fr" ? "Messages clients" : "Customer Messages"}
            </p>
            <p className="text-sm text-slate-400">
              {locale === "fr" ? "Notifications pour les messages" : "Notifications for messages"}
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={notifications.customerMessages}
          onChange={(e) => setNotifications({ ...notifications, customerMessages: e.target.checked })}
          className="rounded w-5 h-5 accent-yellow-500"
        />
      </div>
    </div>
  );

  const renderRolesTab = () => (
    <div className="space-y-4">
      {roles.map((role) => (
        <div key={role.id} className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-900 font-semibold">{role.name}</span>
            </div>
            <span className="text-sm text-slate-400">{role.users} {locale === "fr" ? "utilisateurs" : "users"}</span>
          </div>
          <p className="text-sm text-slate-400">{role.permissions}</p>
        </div>
      ))}
      <button className="btn btn-ghost w-full flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        {locale === "fr" ? "Ajouter un role" : "Add Role"}
      </button>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Exporter les donnees" : "Export Data"}
        </h3>
        <div className="space-y-3">
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Inventaire" : "Inventory"}</span>
          </button>
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Commandes" : "Orders"}</span>
          </button>
          <button className="w-full btn btn-ghost flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Clients" : "Customers"}</span>
          </button>
          <button className="w-full btn btn-primary flex items-center gap-3">
            <Download className="w-5 h-5" />
            <span>{locale === "fr" ? "Tout exporter" : "Export All"}</span>
          </button>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {locale === "fr" ? "Importer des donnees" : "Import Data"}
        </h3>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
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
    { id: "roles" as const, icon: Shield, label: locale === "fr" ? "Roles" : "الأدوار" },
    { id: "backup" as const, icon: Database, label: locale === "fr" ? "Sauvegarde" : "النسخ الاحتياطي" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {locale === "fr" ? "Parametres Admin" : "Admin Settings"}
        </h2>
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
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white backdrop-blur-md border border-gray-200 rounded-xl p-6">
        {activeTab === "profile" && renderProfileTab()}
        {activeTab === "security" && renderSecurityTab()}
        {activeTab === "language" && renderLanguageTab()}
        {activeTab === "notifications" && renderNotificationsTab()}
        {activeTab === "roles" && renderRolesTab()}
        {activeTab === "backup" && renderBackupTab()}
      </div>
    </div>
  );
}
