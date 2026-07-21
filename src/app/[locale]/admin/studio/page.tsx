"use client";

import { useState } from "react";
import { uploadImageAction } from "@/actions/admin-actions";

export default function MauriStudioPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14] p-8 text-white">
      <header className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-black text-[#F5C542]">MauriStudio V1</h1>
        <p className="text-white/50">التحكم الشامل في هوية وهيكلية MauriTech</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. إدارة الوسائط */}
        <section className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <h2 className="font-bold mb-4">🖼️ الوسائط والبانرات</h2>
          <form action={uploadImageAction} className="flex flex-col gap-3">
            <input type="file" name="image" className="text-xs p-2 bg-black/50 rounded-lg" />
            <button className="bg-[#F5C542] text-black font-bold p-2 rounded-lg">رفع الصورة</button>
          </form>
        </section>

        {/* 2. تحكم الهوية البصرية (ألوان + خطوط) */}
        <section className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <h2 className="font-bold mb-4">🎨 الخطوط والألوان</h2>
          <div className="space-y-4">
            <input type="color" className="w-full h-10 rounded cursor-pointer" />
            <select className="w-full bg-black/50 p-2 rounded text-sm">
              <option>Cairo (الافتراضي)</option>
              <option>Tajawal</option>
              <option>Inter</option>
            </select>
          </div>
        </section>

        {/* 3. التحكم في البطاقات (Cards) */}
        <section className="bg-[#111827] p-6 rounded-3xl border border-white/5">
          <h2 className="font-bold mb-4">🔲 البطاقات (Cards)</h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between">
              زوايا البطاقات (Radius)
              <input type="range" className="accent-[#F5C542]" />
            </label>
            <label className="flex items-center justify-between">
              شفافية الزجاج
              <input type="range" className="accent-[#F5C542]" />
            </label>
          </div>
        </section>

        {/* 4. تخصيص واجهة التحكم (Sidebar/UI) */}
        <section className="bg-[#111827] p-6 rounded-3xl border border-white/5 lg:col-span-3">
          <h2 className="font-bold mb-4">⚙️ واجهة التحكم</h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            {['إخفاء/إظهار القائمة', 'تغيير لون الخلفية', 'تغيير أيقونة النظام', 'وضع الصيانة'].map((btn) => (
              <button key={btn} className="p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-[#F5C542] transition">
                {btn}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
