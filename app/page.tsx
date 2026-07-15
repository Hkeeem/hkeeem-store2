"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {/* الهيدر مع تدرج بنفسجي فاتح */}
      <header className="p-4 flex justify-between items-center bg-gradient-to-r from-violet-50 to-white border-b border-violet-100 shadow-sm">
        <h1 className="text-2xl font-black text-violet-900">hkeeem</h1>
        
        {/* القائمة: أزرار التسجيل والدخول */}
        <nav className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-bold text-violet-700 hover:text-violet-900 transition">
            دخول
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-bold bg-violet-600 text-white rounded-full shadow-lg shadow-violet-200 hover:bg-violet-700 transition">
            تسجيل
          </Link>
        </nav>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-6">قائمة العروض المتاحة</h2>
        {/* العروض ستظهر هنا */}
      </main>
    </div>
  );
}
