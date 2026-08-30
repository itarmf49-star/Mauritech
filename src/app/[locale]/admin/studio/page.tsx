"use client";

import { useState } from "react";
import { uploadImageAction } from "@/actions/admin-actions";

export default function MauriStudioPage() {
  // حالة التحكم الشاملة (هذه القيم ستُربط لاحقاً بقاعدة البيانات)
  const [settings, setSettings] = useState({
    primaryColor: "#F5C542",
    borderRadius: 16,
    glassOpacity: 0.15,
    fontFamily: "Cairo",
    isMaintenanceMode: false,
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {/* رأس الصفحة */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#F5C542]">MauriStudio Pro</h1>
          <p className="text-gray-600">نظام التحكم المركزي في MauriTech</p>
        </div>
        <button className="bg-[#F5C542] text-black font-bold px-6 py-2 rounded-xl hover:scale-105 transition">
          حفظ التغييرات النهائية
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-150px)]">
        
        {/* العمود الأيسر: لوحة الإعدادات (Inputs) */}
        <div className="col-span-4 bg-gray-100 p-6 rounded-3xl border border-gray-300 overflow-y-auto space-y-8">
          
          {/* إعدادات الهوية */}
          <section>
            <h2 className="font-bold mb-4 flex items-center gap-2">🎨 الهوية البصرية</h2>
            <div className="space-y-4">
              <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({...settings, primaryColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" />
              <select onChange={(e) => setSettings({...settings, fontFamily: e.target.value})} className="w-full bg-white p-3 rounded-xl border border-gray-300">
                <option>Cairo</option>
                <option>Tajawal</option>
                <option>Inter</option>
              </select>
            </div>
          </section>

          {/* إعدادات البطاقات والزجاج */}
          <section>
            <h2 className="font-bold mb-4">🔲 البطاقات والزجاج</h2>
            <div className="space-y-4">
              <label className="flex justify-between text-sm">الزوايا (Radius): <span>{settings.borderRadius}px</span>
                <input type="range" min="0" max="50" value={settings.borderRadius} onChange={(e) => setSettings({...settings, borderRadius: Number(e.target.value)})} />
              </label>
              <label className="flex justify-between text-sm">الشفافية: <span>{settings.glassOpacity}</span>
                <input type="range" min="0" max="1" step="0.1" value={settings.glassOpacity} onChange={(e) => setSettings({...settings, glassOpacity: Number(e.target.value)})} />
              </label>
            </div>
          </section>

          {/* إعدادات متقدمة */}
          <section>
            <h2 className="font-bold mb-4">⚙️ إعدادات النظام</h2>
            <button 
              onClick={() => setSettings({...settings, isMaintenanceMode: !settings.isMaintenanceMode})}
              className={`w-full p-4 rounded-xl font-bold ${settings.isMaintenanceMode ? 'bg-red-500' : 'bg-green-500'}`}
            >
              {settings.isMaintenanceMode ? "وضع الصيانة مفعل" : "الموقع يعمل بشكل طبيعي"}
            </button>
          </section>
        </div>

        {/* العمود الأيمن: شاشة المعاينة الحية (Live Preview) */}
        <div className="col-span-8 bg-gray-50 rounded-3xl p-8 border border-gray-300 flex flex-col items-center justify-center">
          <h3 className="text-gray-600 uppercase tracking-[0.5em] mb-8">معاينة حية للموقع</h3>
          
          <div 
            className="w-full max-w-lg p-8 transition-all duration-300 border border-gray-300"
            style={{ 
              borderRadius: `${settings.borderRadius}px`,
              backgroundColor: `rgba(255, 255, 255, ${settings.glassOpacity})`,
              fontFamily: settings.fontFamily
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: settings.primaryColor }}>نموذج للمتجر</h2>
            <p className="text-gray-700 mb-6">هذا هو شكل البطاقات في موقعك الآن، سيتم تطبيق جميع التعديلات أعلاه على كامل واجهة المستخدم فور الحفظ.</p>
            <button className="px-6 py-2 rounded-lg text-black font-bold" style={{ backgroundColor: settings.primaryColor }}>
              زر تجريبي
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
