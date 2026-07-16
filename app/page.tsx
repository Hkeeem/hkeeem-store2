"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      
      {/* الهيدر: ألوان بنفسجية فاتحة وذهبية هادئة */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="mx-auto max-w-[480px] px-4 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setDrawerOpen(true)} className="text-xl text-violet-900">☰</button>
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* أيقونة السلة (الشعار) */}
            <div className="w-9 h-9 relative">
                <Image src="/logo.png" alt="logo" fill className="object-contain" />
            </div>
            {/* التسجيل فوق السلة */}
            <div className="flex flex-col items-center">
                <Link href="/register" className="text-[10px] font-bold text-violet-700">تسجيل</Link>
                <Link href="/login" className="text-[10px] font-bold text-stone-400">دخول</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-4 pb-28 pt-4">
        
        {/* المساعد الاقتصادي AI: مصغر ومرفوع في المنتصف */}
        <div className="flex justify-center mb-6">
            <div className="w-fit px-4 py-2 rounded-full bg-violet-100 border border-violet-200 shadow-sm flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="font-bold text-violet-900 text-[13px]">المساعد الاقتصادي AI</span>
            </div>
        </div>

        <h3 className="text-md font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h3>
        {/* منطقة العروض */}
      </main>
    </div>
  );
}
