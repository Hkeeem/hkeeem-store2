"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { offers, Offer } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0618] text-white">
      {/* الهيدر الذي أردته */}
      <header className="p-4 flex justify-between items-center bg-black/20 border-b border-white/10">
        <h1 className="text-xl font-bold">حكيم ستور</h1>
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition">دخول</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-violet-600 rounded-lg hover:bg-violet-700 transition">تسجيل</Link>
        </div>
      </header>

      {/* باقي محتوى الصفحة (العروض) */}
      <main className="p-4">
        {/* أضف هنا استدعاء لبطاقات العروض الخاصة بك */}
      </main>
    </div>
  );
}
