"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// المصفوفات والبيانات كما هي...
const categories = [
  { id: "all", name: "الكل", emoji: "✨" },
  { id: "electronics", name: "الإلكترونيات", emoji: "💻" },
  { id: "grocery", name: "السوبرماركت", emoji: "🛒" },
  { id: "fashion", name: "الأزياء", emoji: "👗" },
  { id: "home", name: "المنزل", emoji: "🏠" },
];

// (باقي المصفوفات كما كانت)

export default function Page() {
  const [activeCat, setActiveCat] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    // الخلفية الآن باللون البيج (stone-50)
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-900">
      
      {/* الهيدر بتنسيق بيج متناغم */}
      <nav className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
        <div className="mx-auto max-w-[480px] px-4 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setDrawerOpen(true)} className="text-xl">☰</button>
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-bold text-stone-600 hover:text-violet-700">دخول</Link>
            <Link href="/register" className="px-4 py-1.5 text-sm font-bold bg-violet-700 text-white rounded-full shadow-md">تسجيل</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28 pt-4">
        <h2 className="text-lg font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h2>
        
        {/* الفئات بتصميم متناسق مع اللون البيج */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className={`h-9 px-4 rounded-full whitespace-nowrap text-[13px] border ${activeCat === c.id ? "bg-violet-700 text-white border-violet-700" : "bg-white border-stone-200 text-stone-700"}`}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* العروض */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* البطاقات تظهر بلون أبيض ناصع فوق الخلفية البيج لتعطي تبايناً جميلاً */}
          <div className="rounded-[22px] overflow-hidden border border-stone-100 bg-white shadow-sm">
            {/* محتوى العرض هنا... */}
          </div>
        </div>
      </main>
    </div>
  );
}
