"use client"
import React, { useState, useEffect } from "react";
import { Sparkles, Copy, Check, Crown } from "lucide-react";

const placeholders = [
  "أبغى غسالة أقل من 1500 ريال",
  "وين أرخص آيفون اليوم؟",
  "كوّن لي سلة مقاضي تكفي أسبوع بـ300 ريال",
];

const categories = [
  { id: "electronics", name: "الإلكترونيات", emoji: "💻" },
  { id: "grocery", name: "السوبرماركت", emoji: "🛒" },
  { id: "fashion", name: "الأزياء", emoji: "👗" },
  { id: "perfume", name: "العطور", emoji: "🌸" },
  { id: "pharmacy", name: "الصيدليات", emoji: "💊" },
  { id: "travel", name: "السفر", emoji: "✈️" },
  { id: "restaurants", name: "المطاعم", emoji: "🍔" },
  { id: "cars", name: "السيارات", emoji: "🚗" },
  { id: "home", name: "المنزل", emoji: "🏠" },
  { id: "kids", name: "الأطفال", emoji: "🧸" },
];

const offers = [
  { id:"1", store:"أمازون", product:"iPhone 15 Pro 256GB تيتانيوم أزرق", price:4199, old:4619, saving:420, coupon:"HKEEM50", rating:4.8, uses:1243, dist:0.8, time:"قبل ساعتين", img:"https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80", cat:"electronics", isDrop:true },
  { id:"2", store:"إكسترا", product:"غسالة LG 7 كيلو أوتوماتيك أقل من 1500", price:1449, old:1799, saving:350, coupon:"EXTRA30", rating:4.6, uses:890, dist:1.2, time:"قبل 45 دقيقة", img:"https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80", cat:"home", isDrop:true },
  { id:"3", store:"نون", product:"Apple Watch Series 9 GPS 45mm", price:1699, old:1999, saving:300, coupon:"WATCH100", rating:4.9, uses:2100, dist:2.5, time:"قبل 5 ساعات", img:"https://images.unsplash.com/photo-1579811217875-89b34b0d2c5b?w=700&q=80", cat:"electronics", isDrop:false },
  { id:"4", store:"جرير", product:"سماعة Sony WH-1000XM5 عزل ضوضاء", price:1299, old:1499, saving:200, coupon:"SONY80", rating:4.7, uses:650, dist:0.4, time:"قبل 15 دقيقة", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80", cat:"electronics", isDrop:true },
];

export default function Page() {
  const [phIndex, setPhIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [radius, setRadius] = useState<number|null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const [showMap, setShowMap] = useState(false);
  const [result, setResult] = useState<string|null>(null);

  useEffect(()=>{ const id=setInterval(()=>setPhIndex(i=>(i+1)%placeholders.length),2500); return ()=>clearInterval(id)},[]);

  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(null),2200) }
  const handleAsk=()=>{
    const q=query||placeholders[phIndex];
    if(q.includes("غسالة")) setResult("وجدنا 3 غسالات أقل من 1500 ر.س - أفضلها LG بـ 1399 ر.س مع كوبون WASH20");
    else if(q.includes("آيفون")||q.includes("ايفون")) setResult("أرخص iPhone 15 Pro اليوم: جرير 4199 ر.س (وفّر 420 ر.س) مع كوبون HKEEM50");
    else setResult(`حكيم يحلل: "${q}" - وجدنا ${Math.floor(Math.random()*4+2)} عروض مطابقة`);
  };
  const filtered = offers.filter(o=>{
    if(activeCat!=="all" && o.cat!==activeCat) return false;
    if(radius!==null && o.dist>radius) return false;
    if(query &&!o.product.includes(query) &&!o.store.includes(query)) return false;
    return true;
  });

  return (
  <div dir="rtl" className="min-h-screen text-white" style={{background:`radial-gradient(1200px 600px at 80% -10%, #7C3AED33, transparent), linear-gradient(180deg, #0B0618 0%, #1A1033 100%)`}}>
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0618]/80 border-b border-white/10">
      <div className="mx-auto max-w-[480px] px-4 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-2.5"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center font-black">ح</div><span className="font-black text-[18px]">حكيم <b className="text-violet-300">AI</b></span></div>
        <button className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-bold">📍 جدة</button>
      </div>
    </nav>

    <main className="mx-auto max-w-[480px] px-3 pb-28">
      <div className="mt-4 h-[56px] flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center shrink-0">🤖</div>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholders[phIndex]} className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40"/>
        <button onClick={()=>showToast("🎙️ البحث الصوتي قريباً")} className="w-10 h-10 rounded-full bg-white/10 grid place-items-center border border-white/10">🎙️</button>
        <button onClick={()=>showToast("📷 البحث بالصورة قريباً")} className="w-10 h-10 rounded-full bg-white/10 grid place-items-center border border-white/10">📷</button>
      </div>

      <div className="mt-3 flex gap-1.5">
        <button onClick={handleAsk} className="flex-1 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-[13px]">اسأل حكيم</button>
        <button onClick={()=>{setQuery("");setResult(null)}} className="h-10 px-4 rounded-full bg-white/10 border border-white/10 text-[13px]">مسح</button>
      </div>
      {result && <div className="mt-3 p-3 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-[13px]">{result}</div>}
      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1E1342] border border-violet-400/30 px-4 py-2 rounded-full text-[12px]">{toast}</div>}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={()=>setRadius(null)} className={`h-9 px-4 rounded-full text-[13px] font-bold border whitespace-nowrap ${radius===null?"bg-white text-black":"bg-white/10 border-white/10 text-white/70"}`}>كل المناطق</button>
        {[1,3,5,10].map(k=><button key={k} onClick={()=>setRadius(k)} className={`h-9 px-4 rounded-full text-[13px] font-bold border whitespace-nowrap ${radius===k?"bg-amber-400 text-black border-amber-400 shadow":"bg-white/10 border-white/10 text-white/70"}`}>داخل {k} كم</button>)}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {filtered.map(o=>{
          const isFav=favorites.includes(o.id);
          return(
          <div key={o.id} className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur">
            <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-black/30">
              <img src={o.img} className="w-full h-full object-cover" alt=""/>
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[11px] font-black">وفر {o.saving} ر.س</span>
              <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/70 text-[11px] font-bold border border-white/10">📍 {o.dist} كم</span>
              <button onClick={()=>setFavorites(p=>isFav?p.filter(x=>x!==o.id):[...p,o.id])} className={`absolute bottom-2 left-2 w-8 h-8 rounded-full grid place-items-center border ${isFav?"bg-pink-500 text-white":"bg-black/60 text-white border-white/15"}`}>{isFav?"❤️":"🤍"}</button>
              {o.isDrop && <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold">نزل اليوم</span>}
            </div>
            <div className="px-3.5 pb-3.5 pt-1">
              <div className="flex justify-between text-[11px] text-white/50 mb-1"><span>{o.store} • {o.time}</span><span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[10px]">-{Math.round((1-o.price/o.old)*100)}%</span></div>
              <div className="text-[13px] font-bold leading-[18px] line-clamp-2 min-h-[36px]">{o.product}</div>
              <div className="mt-1 flex gap-1.5 items-baseline"><span className="text-amber-300 font-black text-[14px]">{o.price} ر.س</span><span className="text-[11px] text-white/30 line-through">{o.old}</span></div>
              <div className="mt-1.5 flex justify-between text-[11px]"><span>⭐ {o.rating} <span className="text-white/40">({o.uses})</span></span><span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">🔥 {o.uses}</span></div>
              <button onClick={()=>{navigator.clipboard.writeText(o.coupon); setCopied(o.coupon); setTimeout(()=>setCopied(null),1500)}} className="mt-2 w-full h-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-[11px] font-bold">🎟️ {copied===o.coupon?"تم النسخ ✓":`كوبون: ${o.coupon}`}</button>
            </div>
          </div>
        )})}
      </div>

      <div className="mt-8 grid grid-cols-5 gap-2">
        {categories.map(c=><button key={c.id} onClick={()=>setActiveCat(c.id===activeCat?"all":c.id)} className={`h-[72px] rounded-2xl border flex flex-col items-center justify-center gap-1 ${activeCat===c.id?"bg-white text-black border-white":"bg-white/5 border-white/10 text-white/80"}`}><span className="text-[20px]">{c.emoji}</span><span className="text-[11px] font-bold">{c.name}</span></button>)}
      </div>
      {showMap && <div className="mt-6 h-[280px] rounded-2xl bg-white/10 border border-white/10 grid place-items-center">🗺️ {filtered.length} عرض</div>}
    </main>

    <button onClick={()=>setShowMap(v=>!v)} className="fixed bottom-[88px] left-4 w-12 h-12 rounded-full bg-white text-black shadow-xl grid place-items-center text-[18px]">🗺️</button>
    <button className="fixed bottom-[88px] right-4 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 grid place-items-center text-[24px] shadow-[0_8px_30px_rgba(124,58,237,0.5)] border-2 border-white/20"><span className="relative">🤖<span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-violet-600 animate-ping"></span><span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-violet-600"></span></span></button>

    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#0E0A1F]/90 backdrop-blur border-t border-white/10 px-2 py-2 flex justify-around">
      {[{i:"🏠",l:"حكيم",a:true},{i:"🏬",l:"قريبة"},{i:"🔍",l:"بحث"},{i:"❤️",l:"مفضلتي"}].map(b=><button key={b.l} className={`flex flex-col items-center px-5 py-1 rounded-2xl ${b.a?"text-violet-300 bg-white/10":"text-white/45"}`}><span className="text-[26px]">{b.i}</span><span className="text-[11px] font-bold">{b.l}</span></button>)}
    </nav>
  </div>
  )
}
