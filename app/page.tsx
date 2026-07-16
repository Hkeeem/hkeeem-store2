"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const placeholders = ["أبغى غسالة أقل من 1500 ريال", "وين أرخص آيفون اليوم؟", "كوّن لي سلة مقاضي تكفي أسبوع بـ300 ريال"];
const categories = [
  { id: "all", name: "الكل", emoji: "✨" },
  { id: "electronics", name: "الإلكترونيات", emoji: "💻" },
  { id: "grocery", name: "السوبرماركت", emoji: "🛒" },
  { id: "fashion", name: "الأزياء", emoji: "👗" },
  { id: "perfume", name: "العطور", emoji: "🌸" },
  { id: "home", name: "المنزل", emoji: "🏠" },
];

type Offer = {
  id: string; store: string; product: string;
  price: number; old: number; saving: number;
  coupon: string; rating: number; uses: number;
  dist: number; time: string; img: string; cat: string; isDrop: boolean;
};

const offers: Offer[] = [
  {
    id: "1", store: "أمازون", product: "iPhone 15 Pro 256GB تيتانيوم أزرق",
    price: 4199, old: 4619, saving: 420, coupon: "HKEEM50", rating: 4.8, uses: 1243, dist: 0.8, time: "قبل ساعتين",
    img: "https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80", cat: "electronics", isDrop: true,
  },
  {
    id: "2", store: "إكسترا", product: "غسالة LG 7 كيلو أوتوماتيك",
    price: 1449, old: 1799, saving: 350, coupon: "EXTRA30", rating: 4.6, uses: 890, dist: 1.2, time: "قبل 45 دقيقة",
    img: "https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80", cat: "home", isDrop: true,
  },
];

export default function Page() {
  const [phIndex, setPhIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 2500);
    return () => clearInterval(timer);
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  async function copyCoupon(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    showToast("تم النسخ ✅");
    setTimeout(() => setCopied(null), 1500);
  }

  const filtered = offers.filter((o) => (activeCat === "all" || o.cat === activeCat));

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900">
      {/* الهيدر الفاتح */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-[480px] px-4 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <button onClick={() => setDrawerOpen(true)} className="text-xl">☰</button>
             <span className="font-black text-violet-900 text-xl tracking-tighter">hkeeem</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-bold text-gray-600 hover:text-violet-600">دخول</Link>
            <Link href="/register" className="px-4 py-1.5 text-sm font-bold bg-violet-600 text-white rounded-full">تسجيل</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28 pt-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">قائمة العروض المتاحة</h2>
        
        {/* فئات */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className={`h-9 px-4 rounded-full whitespace-nowrap text-[13px] border ${activeCat === c.id ? "bg-violet-600 text-white border-violet-600" : "bg-white border-gray-200"}`}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* عروض */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {filtered.map((o) => (
            <div key={o.id} className="rounded-[22px] overflow-hidden border border-gray-100 bg-white shadow-sm">
              <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-gray-100">
                <Image src={o.img} alt={o.product} fill sizes="50vw" className="object-cover" />
                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-[10px] font-bold">وفر {o.saving} ر.س</span>
              </div>
              <div className="px-3 pb-3">
                <div className="text-[11px] text-gray-500">{o.store}</div>
                <div className="mt-1 text-[13px] font-bold line-clamp-2">{o.product}</div>
                <div className="mt-2 font-black text-violet-700">{o.price} ر.س</div>
                <button onClick={() => copyCoupon(o.coupon)} className="mt-3 w-full h-8 rounded-full bg-gray-100 text-[11px] font-bold">🎟️ {copied === o.coupon ? "تم ✓" : o.coupon}</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {toast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full text-sm">{toast}</div>}
    </div>
  );
}
