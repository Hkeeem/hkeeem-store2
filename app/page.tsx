"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      
      {/* الهيدر: بدون أسود أو أصفر */}
      <nav className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
        <div className="mx-auto max-w-[480px] px-4 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setDrawerOpen(true)} className="text-xl text-stone-600">☰</button>
             {/* اسم المتجر الرئيسي hkeeem */}
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:text-violet-700 transition">دخول</Link>
            <Link href="/register" className="px-4 py-1.5 text-sm font-bold bg-violet-600 text-white rounded-full shadow-md hover:bg-violet-700 transition">تسجيل</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28 pt-4">
        
        {/* تغيير العنوان الفرعي إلى المساعد الاقتصادي AI */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xl">🤖</div>
           <div>
             <h2 className="font-bold text-stone-800">المساعد الاقتصادي AI</h2>
             <p className="text-xs text-stone-500">أنا هنا لأساعدك في العثور على أفضل الأسعار</p>
           </div>
        </div>

        <h3 className="text-lg font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h3>
        
        {/* منطقة العروض ستظهر هنا */}
      </main>
    </div>
  );
}
