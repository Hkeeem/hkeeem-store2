"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      
      {/* الهيدر: تصميم جديد بالذهبي والبنفسجي */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="mx-auto max-w-[480px] px-4 py-3 flex items-center justify-between">
          
          {/* الشعار المستطيل المزخرف + الاسم */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm">
               <span className="text-xl">🧺</span>
            </div>
            <span className="font-black text-violet-950 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          {/* التسجيل والدخول */}
          <div className="flex flex-col gap-1">
            <Link href="/register" className="text-[10px] font-bold text-violet-700 hover:text-violet-900">تسجيل</Link>
            <Link href="/login" className="text-[10px] font-bold text-stone-400 hover:text-stone-600">دخول</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-4 pb-28 pt-6">
        
        {/* المساعد الاقتصادي AI في المنتصف */}
        <div className="flex justify-center mb-8">
            <div className="px-5 py-2.5 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="font-bold text-[13px]">المساعد الاقتصادي AI</span>
            </div>
        </div>

        <h3 className="text-md font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h3>
        {/* منطقة العروض هنا */}
      </main>
    </div>
  );
}
