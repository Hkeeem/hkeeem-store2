"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { offers, Offer } from "@/lib/data"; // استيراد البيانات من ملفك الجديد

// --- المكونات الفرعية (Sub-components) ---

const OfferCard = ({ offer, onCopy, copied }: { offer: Offer; onCopy: (c: string) => void; copied: string | null }) => (
  <div className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.06]">
    <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-black/30">
      <Image src={offer.img} alt={offer.product} fill sizes="50vw" className="object-cover" />
      <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold">وفر {offer.saving} ر.س</span>
      <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-[11px]">📍 {offer.dist} كم</span>
      {offer.isDrop && <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-xs">نزل اليوم</span>}
    </div>
    <div className="px-3 pb-3">
      <div className="text-[11px] text-white/50">{offer.store} • {offer.time}</div>
      <div className="mt-1 text-[13px] font-bold line-clamp-2 min-h-[36px]">{offer.product}</div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-amber-300 font-black">{offer.price} ر.س</span>
        <span className="text-xs text-white/30 line-through">{offer.old}</span>
      </div>
      <button onClick={() => onCopy(offer.coupon)} className="mt-3 w-full h-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs font-bold">
        🎟️ {copied === offer.coupon ? "تم النسخ ✓" : `كوبون: ${offer.coupon}`}
      </button>
    </div>
  </div>
);

// --- المكون الرئيسي ---

export default function Page() {
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // منطق الفلترة (يعتمد على البيانات المستوردة)
  const filtered = offers.filter((o) => {
    const search = query.trim().toLowerCase();
    return (!search || o.product.toLowerCase().includes(search) || o.store.toLowerCase().includes(search)) &&
           (radius === null || o.dist <= radius);
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const copyCoupon = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    showToast("تم نسخ الكوبون ✅");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div dir="rtl" className="min-h-screen text-white bg-[#0B0618]">
      <main className="mx-auto max-w-[480px] px-3 pb-28">
        {/* شريط البحث */}
        <div className="mt-4 flex gap-2 p-1.5 rounded-full bg-white/10 border border-white/15">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن عرض..." className="flex-1 bg-transparent p-2 outline-none text-[14px]" />
        </div>

        {/* قائمة العروض */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {filtered.map((o) => (
            <OfferCard key={o.id} offer={o} onCopy={copyCoupon} copied={copied} />
          ))}
        </div>
      </main>
      
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#1E1342] px-4 py-2 rounded-full">{toast}</div>}
    </div>
  );
}
