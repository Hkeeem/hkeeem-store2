"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      {/* الهيدر بتصميم أبيض فاتح */}
      <header className="p-4 flex justify-between items-center border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold text-gray-800">حكيم ستور</h1>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-violet-600 transition">
            دخول
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-violet-50 text-violet-700 rounded-xl hover:bg-violet-100 transition">
            إنشاء حساب
          </Link>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">أحدث العروض</h2>
        {/* العروض ستظهر هنا */}
      </main>
    </div>
  );
}
