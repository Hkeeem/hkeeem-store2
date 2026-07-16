"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      
      {/* الهيدر بتنسيق ذهبي وبنفسجي فاتح */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="mx-auto max-w-[480px] px-4 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setDrawerOpen(true)} className="text-xl text-stone-600">☰</button>
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* أيقونة السلة المستوحاة من شعارك */}
            <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="سلة hkeeem" fill className="object-contain" />
            </div>
            {/* أزرار التسجيل فوق السلة */}
            <div className="flex flex-col gap-1">
                <Link href="/register" className="text-[10px] font-bold text-violet-700 hover:text-violet-900">تسجيل</Link>
                <Link href="/login" className="text-[10px] font-bold text-stone-500 hover:text-stone-700">دخول</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28 pt-6">
        
        {/* المساعد الاقتصادي AI */}
        <div className="mb-6 p-5 rounded-3xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-2xl shadow-inner">✨</div>
           <div>
             <h2 className="font-black text-stone-900 text-lg">المساعد الاقتصادي AI</h2>
             <p className="text-[13px] text-stone-500 mt-0.5">أنا ذكاؤك الاصطناعي لتوفير أموالك</p>
           </div>
        </div>

        <h3 className="text-md font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h3>
        {/* منطقة العروض */}
      </main>
    </div>
  );
}
