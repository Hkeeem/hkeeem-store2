"use client"
import { useMemo, useState, useRef } from "react"

type Offer = {
  id: string
  title: string
  store_name: string
  price: number
  old_price: number
  image_url: string
  rating: number
  reviews_count: number
  usage_count: number
  coupon_code: string
  distance: number
  district: string
  updated_minutes: number
  is_drop: boolean
}

const OFFERS: Offer[] = [
  { id:"1", title:"iPhone 15 Pro 256GB - تيتانيوم أزرق", store_name:"جرير", price:4199, old_price:4619, image_url:"https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80", rating:4.8, reviews_count:2100, usage_count:1243, coupon_code:"HKEEM50", distance:0.8, district:"الروضة", updated_minutes: 110, is_drop:true },
  { id:"2", title:"غسالة LG 7 كيلو أوتوماتيك أقل من 1500", store_name:"إكسترا", price:1449, old_price:1799, image_url:"https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80", rating:4.6, reviews_count:890, usage_count:890, coupon_code:"EXTRA30", distance:1.2, district:"التحلية", updated_minutes: 45, is_drop:true },
  { id:"3", title:"Apple Watch Series 9 GPS 45mm", store_name:"أمازون", price:1699, old_price:1999, image_url:"https://images.unsplash.com/photo-1579811217875-89b34b0d2c5b?w=700&q=80", rating:4.9, reviews_count:3400, usage_count:2100, coupon_code:"WATCH100", distance:2.5, district:"السلامة", updated_minutes: 320, is_drop:false },
  { id:"4", title:"سماعة Sony WH-1000XM5 عزل ضوضاء", store_name:"نون", price:1299, old_price:1499, image_url:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80", rating:4.7, reviews_count:1200, usage_count:650, coupon_code:"SONY80", distance:0.4, district:"الشاطئ", updated_minutes: 15, is_drop:true },
]

function timeAgo(min:number){
  if(min<60) return `قبل ${min} دقيقة`
  if(min<1440) return `قبل ${Math.floor(min/60)} ساعة`
  return `قبل ${Math.floor(min/1440)} يوم`
}

export default function Page(){
  const [search,setSearch]=useState("")
  const [radius,setRadius]=useState<number|null>(null)
  const [favorites,setFavorites]=useState<string[]>([])
  const [showMap,setShowMap]=useState(false)
  const [hasNewSuggestion,setHasNewSuggestion]=useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(()=>{
    let list=[...OFFERS]
    if(search.trim()){ const q=search.toLowerCase(); list=list.filter(o=>o.title.toLowerCase().includes(q)||o.store_name.toLowerCase().includes(q)) }
    if(radius!==null) list=list.filter(o=>o.distance<=radius)
    return list
  },[search,radius])

  const startVoice = ()=>{
    const w = window as any
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition
    if(!Rec){ alert("المتصفح لا يدعم البحث الصوتي"); return }
    const rec = new Rec(); rec.lang="ar-SA"; rec.onresult=(e:any)=>setSearch(e.results[0][0].transcript); rec.start()
  }

  return(
  <div dir="rtl" className="min-h-screen bg-[#1A1033] text-white selection:bg-violet-500/30">
    {/* Header */}
    <header className="sticky top-0 z-30 bg-[#2A1A5A]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[480px] mx-auto px-4 h-[60px] flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 grid place-items-center font-black text-[16px] shadow-lg">ح</div>
          <span className="font-black text-[18px] tracking-tight">حكيم AI</span>
        </div>
        <button className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-bold flex items-center gap-1.5 shadow">📍 جدة</button>
      </div>
    </header>

    <main className="max-w-[480px] mx-auto px-3 pb-32">
      {/* Search - أطول + مايك + كاميرا */}
      <div className="mt-4 h-[56px] flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur shadow-inner">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center shrink-0">🤖</div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='اسأل حكيم: "أرخص آيفون أقل من 4000"' className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40"/>
        <button onClick={startVoice} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center border border-white/10">🎙️</button>
        <button onClick={()=>fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center border border-white/10">📷</button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e=>{ if(e.target.files?.[0]) setSearch("بحث بالصورة: "+e.target.files[0].name) }} />
      </div>

      {/* Distance - مع كل المناطق ومميز للمختار */}
      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <button onClick={()=>setRadius(null)} className={`h-9 px-4 rounded-full text-[13px] font-bold border whitespace-nowrap transition ${radius===null?"bg-white text-black border-white shadow":"bg-white/10 border-white/10 text-white/70 hover:bg-white/15"}`}>كل المناطق</button>
        {[1,3,5,10].map(km=>(
          <button key={km} onClick={()=>setRadius(km)} className={`h-9 px-4 rounded-full text-[13px] font-bold border whitespace-nowrap transition ${radius===km?"bg-amber-400 text-black border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]":"bg-white/10 border-white/10 text-white/70 hover:bg-white/15"}`}>داخل {km} كم</button>
        ))}
      </div>

      {/* Offers Grid - صور aspect-[4/3] object-cover */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {filtered.map(o=>{
          const discount = Math.round((1 - o.price/o.old_price)*100)
          const save = o.old_price - o.price
          const isFav = favorites.includes(o.id)
          return(
            <article key={o.id} className="group rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur-xl hover:bg-white/[0.09] transition flex flex-col">
              {/* Image 4/3 */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/30 m-1.5 rounded-[16px]">
                <img src={o.image_url} alt={o.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" loading="lazy"/>
                {/* Badges */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[11px] font-black shadow">وفر {save} ر.س</span>
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[11px] font-bold border border-white/10">📍 {o.distance} كم</span>
                <button onClick={()=>setFavorites(p=>isFav?p.filter(x=>x!==o.id):[...p,o.id])} className={`absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full backdrop-blur grid place-items-center text-[15px] border transition ${isFav?"bg-pink-500 border-pink-400 text-white":"bg-black/60 border-white/15 text-white hover:bg-black/80"}`}>{isFav?"❤️":"🤍"}</button>
                {o.is_drop&&<span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold shadow">نزل اليوم</span>}
              </div>

              {/* Content مرتب حسب طلبك */}
              <div className="px-3.5 pb-3.5 pt-1 flex flex-col flex-1">
                {/* اسم المتجر + وقت + خصم % */}
                <div className="flex items-center justify-between text-[11px] text-white/50 mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>{o.store_name} • {timeAgo(o.updated_minutes)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">-{discount}%</span>
                </div>

                <div className="text-[13.5px] font-bold leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</div>

                {/* السعر 6119 → 4199 */}
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-amber-300 font-black text-[15px]">{o.price.toLocaleString("ar-SA")} ر.س</span>
                  <span className="text-[12px] text-white/30 line-through">{o.old_price.toLocaleString("ar-SA")}</span>
                </div>

                {/* ⭐ 4.8 (2100) + 🔥 */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[12px]">⭐ {o.rating} <span className="text-white/40">({o.reviews_count})</span></span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/70">🔥 {o.usage_count} استخدام</span>
                </div>

                {/* 🎟️ الكوبون + ❤️ */}
                <div className="mt-2.5 flex gap-1.5">
                  <div className="flex-1 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 grid place-items-center text-[11px] font-bold text-violet-200">🎟️ {o.coupon_code}</div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {showMap&&<div className="mt-6 h-[320px] rounded-[20px] bg-white/10 border border-white/10 grid place-items-center text-white/60">🗺️ الخريطة - {filtered.length} عرض داخل {radius??"كل"} كم</div>}
    </main>

    {/* زر الخريطة صغير دائري لا يغطي */}
    <button onClick={()=>setShowMap(v=>!v)} className="fixed bottom-[88px] left-4 z-20 w-12 h-12 rounded-full bg-white text-black shadow-xl grid place-items-center text-[18px] border border-black/5 hover:scale-105 transition">🗺️</button>

    {/* زر AI بنبض Pulse */}
    <button onClick={()=>setHasNewSuggestion(false)} className="fixed bottom-[88px] right-4 z-20 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_8px_30px_rgba(124,58,237,0.5)] grid place-items-center text-[26px] border-2 border-white/20">
      <span className="relative">
        🤖
        {hasNewSuggestion&&<span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-violet-600 animate-ping"></span>}
        {hasNewSuggestion&&<span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-violet-600"></span>}
      </span>
    </button>

    {/* Bottom Nav - أيقونات 26px مع تمييز */}
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#0E0A1F]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2">
      <div className="flex justify-around items-center">
        {[
          {k:"hakim", icon:"🏠", label:"حكيم", active:true},
          {k:"near", icon:"🏬", label:"قريبة", active:false},
          {k:"search", icon:"🔍", label:"بحث", active:false},
          {k:"fav", icon:"❤️", label:"مفضلتي", active:false},
        ].map(it=>(
          <button key={it.k} className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition ${it.active?"text-violet-300 bg-white/10":"text-white/45 hover:text-white/70"}`}>
            <span className="text-[26px] leading-none">{it.icon}</span>
            <span className="text-[11px] font-bold">{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  </div>
  )
}
