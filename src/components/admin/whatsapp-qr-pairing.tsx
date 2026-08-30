"use client";

import { useState } from "react";
import { QrCode, RefreshCw, Smartphone, CheckCircle, Clock, AlertCircle, Copy, Trash2 } from "lucide-react";

interface WhatsAppQRPairingProps {
  locale: "fr" | "ar";
}

export function WhatsAppQRPairing({ locale }: WhatsAppQRPairingProps) {
  const [isPaired, setIsPaired] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<"idle" | "scanning" | "paired" | "error">("idle");
  const [qrCode, setQrCode] = useState("wa_pairing_123456789");
  const [linkedDevices, setLinkedDevices] = useState([
    { id: 1, name: "Chrome on Windows", lastActive: "2 minutes ago", status: "active" },
    { id: 2, name: "Safari on iPhone", lastActive: "1 hour ago", status: "active" },
  ]);

  const generateNewQR = () => {
    setPairingStatus("scanning");
    setTimeout(() => {
      setQrCode("wa_pairing_" + Date.now());
      setPairingStatus("idle");
    }, 2000);
  };

  const removeDevice = (id: number) => {
    setLinkedDevices(devices.filter(d => d.id !== id));
  };

  const copyQr = () => {
    navigator.clipboard.writeText(qrCode);
    alert(locale === "fr" ? "Code copie!" : "Code copied!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {locale === "fr" ? "WhatsApp QR Pairing" : "ربط واتساب بالرمز"}
        </h2>
        <button
          onClick={generateNewQR}
          className="btn btn-ghost flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {locale === "fr" ? "Nouveau QR" : "رمز جديد"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <div className="bg-white backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <QrCode className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {locale === "fr" ? "Scanner le QR Code" : "امسح الرمز"}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === "fr"
                  ? "Ouvrez WhatsApp sur votre telephone et scannez ce code"
                  : "افتح واتساب على هاتفك وامسح هذا الرمز"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-4">
            {pairingStatus === "scanning" ? (
              <div className="text-center py-8">
                <RefreshCw className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">
                  {locale === "fr" ? "Generation du QR Code..." : "جاري إنشاء الرمز..."}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-600" />
                </div>
                <div className="text-sm text-gray-500 mb-4 font-mono">
                  {qrCode}
                </div>
                <button
                  onClick={copyQr}
                  className="btn btn-ghost text-sm flex items-center gap-2 mx-auto"
                >
                  <Copy className="w-4 h-4" />
                  {locale === "fr" ? "Copier le code" : "نسخ الرمز"}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {locale === "fr" ? "Le code expire dans 60 secondes" : "الرمز ينتهي خلال 60 ثانية"}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {locale === "fr" ? "Instructions" : "التعليمات"}
          </h3>
          <ol className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-bold">1</span>
              <span>
                {locale === "fr" 
                  ? "Ouvrez WhatsApp sur votre telephone" 
                  : "افتح واتساب على هاتفك"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-bold">2</span>
              <span>
                {locale === "fr" 
                  ? "Allez dans Parametres > Appareils lies" 
                  : "اذهب إلى الإعدادات > الأجهزة المرتبطة"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-bold">3</span>
              <span>
                {locale === "fr" 
                  ? "Appuyez sur Lier un appareil" 
                  : "اضغط على ربط جهاز"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-bold">4</span>
              <span>
                {locale === "fr" 
                  ? "Scannez le QR Code ci-dessus" 
                  : "امسح الرمز أعلاه"}
              </span>
            </li>
          </ol>
        </div>
      </div>

      {/* Linked Devices */}
      <div className="bg-white backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {locale === "fr" ? "Appareils lies" : "الأجهزة المرتبطة"}
          </h3>
          <span className="text-sm text-gray-600">
            {linkedDevices.length} {locale === "fr" ? "appareil(s)" : "جهاز(ا)"}
          </span>
        </div>

        <div className="space-y-3">
          {linkedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-gray-100/50 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-white font-medium">{device.name}</div>
                  <div className="text-sm text-gray-600">
                    {locale === "fr" ? "Derniere activite:" : "آخر نشاط:"} {device.lastActive}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {device.status === "active" && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {locale === "fr" ? "Actif" : "نشط"}
                  </div>
                )}
                <button
                  onClick={() => removeDevice(device.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {linkedDevices.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>
              {locale === "fr" 
                ? "Aucun appareil lie" 
                : "لا توجد أجهزة مرتبطة"}
            </p>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-3 p-4 bg-white border border-yellow-500/30 rounded-lg">
        {isPaired ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-400" />
        )}
        <div>
          <p className="text-white font-medium">
            {isPaired 
              ? (locale === "fr" ? "WhatsApp est connecte" : "واتساب متصل") 
              : (locale === "fr" ? "WhatsApp n'est pas connecte" : "واتساب غير متصل")}
          </p>
          <p className="text-sm text-gray-600">
            {isPaired 
              ? (locale === "fr" ? "Vous pouvez envoyer des messages" : "يمكنك إرسال الرسائل") 
              : (locale === "fr" ? "Scannez le QR Code pour connecter" : "امسح الرمز للاتصال")}
          </p>
        </div>
      </div>
    </div>
  );
}