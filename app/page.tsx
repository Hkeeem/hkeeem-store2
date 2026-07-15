"use client";

import Link from "next/link";
import { offers } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* الهيدر الجديد بالألوان الفاتحة */}
      <header className="p-4 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">حكيم ستور</h1>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-600 transition">
            دخول
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition shadow-sm">
            تسجيل
          </Link>
        </div>
      </header>

      {/* محتوى الصفحة */}
      <main className="p-4">
        {/* يمكنك هنا وضع بطاقات العروض الخاصة بك */}
        <h2 className="text-lg font-semibold mb-4">أحدث العروض</h2>
        {/* هنا سيتم عرض المنتجات */}
      </main>
    </div>
  );
}
