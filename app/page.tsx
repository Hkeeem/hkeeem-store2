"use client"
import { useState } from "react"

const STORES = [
  { id: "tamimi", name: "أسواق التميمي", color: "bg-[#E53935]" },
  { id: "panda", name: "بنده", color: "bg-[#2E7D32]" },
  { id: "danube", name: "الدانوب", color: "bg-[#1565C0]" },
  { id: "lulu", name: "لولو", color: "bg-[#EF6C00]" },
  { id: "othaim", name: "العثيم", color: "bg-[#4527A0]" },
]

const OFFERS = [
  {
    id: 1,
    title: "زيت عافية دوار الشمس 1.8 لتر",
    icon: "🫒",
    tag: "أرخص سعر",
    prices: [
      { s: "tamimi", p: 19, old: 32 },
      { s: "danube", p: 19 },
      { s: "othaim", p: 24 },
    ]
  },
  {
    id: 2,
    title: "حليب المراعي طويل الأجل 12×1 لتر",
    icon: "🥛",
    prices: [
      { s: "panda", p: 27, old: 39 },
      { s: "tamimi", p: 27 },
      { s: "othaim", p: 29 },
    ]
  },
  {
    id: 3,
    title: "أرز بسمتي أبو كاس 5 كجم",
    icon: "🍚",
    best: true,
    prices: [
      { s: "panda", p: 45, old: 69 },
      { s: "othaim", p: 45 },
      { s: "tamimi", p: 52 },
    ]
  },
]

export default function Page(){
  const [active, setActive] = useState("all")
  const [toast, setToast] = useState("")

  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),1500) }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBEB] max-w-[430px] mx-auto pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FFFBEB]/90 backdrop-blur px-4 h-14 flex justify-between items-center border-b border-black/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0E3311] to-[#D4A017] grid place-items-center text-white font-black text-sm">و</div>
          <div>
            <div className="font-black text-sm leading-none">وفّر</div>
            <div className="text-[10px] text-zinc-500 -mt-0.5">كل عروض المملكة</div>
          </div>
        <div className="text-[11px] bg-white border px-3 py-1 rounded-full">📍 أبها</div>
      </header>

      {/* Hero - نفس تدرج وفّر */}
      <div className="p-4">
        <div className="rounded-[28px] p-5 text-white bg-gradient-to-br from-[#0D2810] via-[#1B5E20] to-[#C69A0E] relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <span className="inline-block text-[10px] bg-white/15 border border-white/10 px-2.5 py-1 rounded-full">✨ مدعوم بذكاء اصطناعي</span>
          <h1 className="text-[24px] font-black leading-[1.15] mt-3">كل عروض المملكة<br/>في مكان واحد.</h1>
          <p className="text-[12px] leading-5 opacity-80 mt-2">جمعنا لك عروض بنده، العثيم، الدانوب، لولو وجرير ورتبناها لك بالأرخص</p>
          <div className="flex gap-2 mt-4">
            <button onClick={()=>show("جاري تحميل العروض")} className="bg-white text-[#123917] text-xs font-bold h-9 px-4 rounded-full">تصفّح كل العروض ←</button>
            <button className="bg-white/15 border border-white/20 text-xs h-9 px-4 rounded-full">قائمة تسوق ذكية</button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black text-sm">+14</div><div className="text-[10px] opacity-60">متجر مشارك</div></div>
            <div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black text-sm">60%</div><div className="text-[10px] opacity-60">متوسط التوفير</div></div>
            <div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black text-sm">24/7</div><div className="text-[10px] opacity-60">مراقبة العروض</div></div>
          </div>
        </div>

        {/* الأقسام */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[{n:"سوبرماركت",i:"🛒"},{n:"مطاعم",i:"🍔"},{n:"إلكترونيات",i:"📱"},{n:"صيدلية",i:"💊"}].map(c=>(
            <div key={c.n} className="bg-white border rounded-2xl h-[72px] grid place-items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div><div className="text-[20px]">{c.i}</div><div className="text-[11px] mt-0.5 font-medium">{c.n}</div></div>
            </div>
          ))}
        </div>

        {/* فلتر */}
        <div className="flex gap-2 overflow-x-auto mt-5 scrollbar-hide pb-1">
          <button onClick={()=>setActive("all")} className={`h-8 px-4 rounded-full text-xs border whitespace-nowrap transition ${active==="all"?"bg-black text-white border-black":"bg-white"}`}>الكل</button>
          {STORES.map(s=>(
            <button key={s.id} onClick={()=>setActive(s.id)} className={`h-8 px-3 rounded-full text-xs border flex items-center gap-1.5 whitespace-nowrap transition ${active===s.id?"bg-black text-white":"bg-white"}`}>
              <span className={`w-2 h-2 rounded-full ${s.color}`}></span>{s.name}
            </button>
          ))}
        </div>

        {/* كروت المقارنة - أهم جزء من تصميم وفّر */}
        <div className="mt-4 space-y-3">
          {OFFERS.map(o=>(
            <div key={o.id} className="bg-white rounded-[18px] border border-black/5 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] border border-[#F5E6B8]/60 grid place-items-center text-[18px]">{o.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[13px] leading-tight truncate">{o.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{o.prices.length} عروض متاحة</div>
                </div>
                {o.best && <span className="text-[10px] font-bold bg-[#FFF1E0] text-[#E65100] border border-orange-100 px-2 py-0.5 rounded-full">أرخص سعر</span>}
              </div>
              <div className="px-2 pb-2 space-y-1.5">
                {o.prices.filter(p=>active==="all"||p.s===active).map((pr,i)=>(
                  <div key={i} className="flex justify-between items-center h-[36px] px-3 rounded-full bg-[#FFFEF6] border border-[#F3E5B5]/80">
                    <div className="flex items-center gap-2 text-[12px]">
                      <span className={`w-5 h-5 rounded-full ${STORES.find(s=>s.id===pr.s)?.color} text-white grid place-items-center text-[9px] font-bold`}>{pr.s[0]}</span>
                      <span className="text-zinc-700">{STORES.find(s=>s.id===pr.s)?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {pr.old && <span className="text-[11px] text-zinc-400 line-through">{pr.old} ر.س</span>}
                      <span className="text-[12px] font-black text-[#B91C1C] bg-[#FFF1F2] border border-red-100 px-2.5 py-0.5 rounded-full">{pr.p} ر.س</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur border-t flex justify-around py-2 text-[11px]">
        <span className="flex flex-col items-center text-[#1B5E20] font-bold">🏠 الرئيسية</span>
        <span className="flex flex-col items-center text-zinc-400">🏷️ العروض</span>
        <span className="flex flex-col items-center text-zinc-400">🎟️ كوبونات</span>
        <span className="flex flex-col items-center text-zinc-400">⭐ نقاطي</span>
      </nav>

      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-full">{toast}</div>}
    </div>
  )
      }
