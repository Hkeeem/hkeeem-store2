"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {/* الهيدر الجديد: خلفية متدرجة ونظيفة */}
      <header className="px-4 py-3 flex justify-between items-center bg-gradient-to-r from-violet-50 to-white border-b border-violet-100">
        <h1 className="text-2xl font-black text-violet-950">hkeeem</h1>
        
        <nav className="flex gap-2 items-center">
          <Link href="/login" className="px-3 py-1.5 text-sm font-bold text-violet-700 hover:text-violet-900 transition">
            دخول
          </Link>
          <Link href="/register" className="px-4 py-1.5 text-sm font-bold bg-violet-600 text-white rounded-full shadow-md shadow-violet-200 hover:bg-violet-700 transition">
            تسجيل
          </Link>
        </nav>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-4">
        <h2 className="text-lg font-bold text-gray-700 mb-4">قائمة العروض المتاحة</h2>
        {/* هنا ستظهر بطاقات العروض لاحقاً */}
      </main>
    </div>
  );
}
