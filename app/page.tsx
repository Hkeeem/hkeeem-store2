"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // أضفنا استيراد Link

// (باقي المصفوفات مثل placeholders و categories و offers كما هي في كودك)

export default function Page() {
  // ... (نفس الـ useState الخاصة بك)

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900">

      {/* الهيدر الجديد (فاتح + تسجيل ودخول فوق) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-[480px] px-4 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             {/* أيقونة القائمة */}
             <button onClick={() => setDrawerOpen(true)} className="text-xl">☰</button>
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-1.5 text-sm font-bold text-gray-600 hover:text-violet-600">دخول</Link>
            <Link href="/register" className="px-4 py-1.5 text-sm font-bold bg-violet-600 text-white rounded-full shadow-lg shadow-violet-200">تسجيل</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28">
        {/* باقي محتوى الصفحة بنفس التنسيق ولكن مع تغيير الألوان لخلفية فاتحة والنصوص لرمادي داكن */}
        {/* مثال لتعديل لون البطاقة: bg-white border border-gray-100 shadow-sm */}
        
        {/* قم بتغيير أي bg-white/10 إلى bg-gray-100 */}
        {/* وقم بتغيير نصوص text-white إلى text-gray-800 */}
      </main>

      {/* ... (باقي المكونات مثل Drawer والـ Modals) */}
    </div>
  );
}
