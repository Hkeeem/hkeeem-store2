"use client"
import { useEffect, useMemo, useState } from "react"

type Offer={id:string;title:string;store_name:string;price:number;old_price:number;image_url:string;rating:number;reviews_count:number;usage_count:number;coupon_code:string;distance?:number|null;district:string;is_drop:boolean}

const STATIC_OFFERS:Offer[]=[
{id:"1",title:"iPhone 15 Pro 256GB - تيتانيوم أزرق",store_name:"جرير",price:4199,old_price:4619,image_url:"https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=600&q=80",rating:4.8,reviews_count:2100,usage_count:1243,coupon_code:"HKEEM50",district:"الروضة",is_drop:true,distance:0.8},
{id:"2",title:"غسالة LG 7 كيلو أوتوماتيك أقل من 1500",store_name:"إكسترا",price:1449,old_price:1799,image_url:"https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=600&q=80",rating:4.6,reviews_count:890,usage_count:890,coupon_code:"EXTRA30",district:"التحلية",is_drop:true,distance:1.2},
{id:"3",title:"Apple Watch Series 9 GPS 45mm",store_name:"أمازون",price:1699,old_price:1999,image_url:"https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=600&q=80",rating:4.9,reviews_count:3400,usage_count:2100,coupon_code:"WATCH100",district:"السلامة",is_drop:false,distance:2.5},
{id:"4",title:"سماعة Sony WH-1000XM5 عزل ضوضاء",store_name:"نون",price:1299,old_price:1499,image_url:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",rating:4.7,reviews_count:1200,usage_count:650,coupon_code:"SONY80",district:"الشاطئ",is_drop:true,distance:0.4},
]

export default function Page(){
 const [search,setSearch]=useState("")
 const [radius,setRadius]=useState(5)
 const [nearbyOnly,setNearbyOnly]=useState(false)
 const [showMap,setShowMap]=useState(false)
 const [favorites,setFavorites]=useState<string[]>([])

 const filtered=useMemo(()=>{
  let list=[...STATIC_OFFERS]
  if(search.trim()){const q=search.toLowerCase(); list=list.filter(o=>o.title.toLowerCase().includes(q)||o.store_name.toLowerCase().includes(q))}
  if(nearbyOnly) list=list.filter(o=>(o.distance||0)<=radius)
  return list
 },[search,nearbyOnly,radius])

 return(
 <div dir="rtl" className="min-h-screen pb-28 text-white" style={{background:"linear-gradient(180deg,#533A7A 0%,#25124A 35%,#0B0618 75%,#000 100%)"}}>
  <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10">
   <div className="max-w-[440px] mx-auto px-4 h-14 flex justify-between items-center">
    <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 grid place-items-center font-black">ح</div><span className="font-black">حكيم AI</span></div>
    <button className="px-3 h-8 rounded-full bg-white text-black text-xs font-bold">📍 جدة</button>
   </div>
  </header>

  <main className="max-w-[440px] mx-auto px-4">
   <div className="mt-4 flex gap-2 p-1 rounded-full bg-white/10 border border-white/10">
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="اسأل حكيم: أرخص آيفون أقل من 4000" className="flex-1 bg-transparent outline-none px-3 text-sm placeholder:text-white/40"/>
    <button className="w-8 h-8 rounded-full bg-violet-600 grid place-items-center">🤖</button>
   </div>

   <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
    {[1,3,5,10].map(km=>(
     <button key={km} onClick={()=>{setRadius(km);setNearbyOnly(true)}} className={`px-4 h-8 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 ${nearbyOnly&&radius===km?"bg-amber-400 text-black border-amber-400":"bg-white/10 border-white/10 text-white/70"}`}>داخل {km} كم</button>
    ))}
    <label className={`px-3 h-8 rounded-full border text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ${nearbyOnly?"bg-black text-white border-black":"bg-white/10 border-white/10"}`}><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="w-3 h-3"/>قريبة فقط</label>
   </div>

   <div className="mt-6 grid grid-cols-2 gap-3">
    {filtered.map(o=>(
     <article key={o.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
      <div className="relative h-[148px] m-2 rounded-[14px] overflow-hidden bg-black/20">
       <img src={o.image_url} alt={o.title} className="w-full h-full object-cover"/>
       <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black">وفر {o.old_price-o.price} ر.س</span>
       <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-[10px]">📍 {o.distance} كم</span>
       {o.is_drop&&<span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-[10px] font-bold">نزل اليوم</span>}
       <button onClick={()=>setFavorites(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-black/60 grid place-items-center text-sm">{favorites.includes(o.id)?"❤️":"🤍"}</button>
      </div>
      <div className="px-3 pb-3">
       <div className="text-[13px] font-bold leading-5 line-clamp-2 min-h-[40px]">{o.title}</div>
       <div className="mt-1 flex items-baseline gap-1"><span className="font-black text-amber-300 text-[14px]">{o.price.toLocaleString("ar-SA")} ر.س</span><span className="text-[11px] text-white/30 line-through">{o.old_price.toLocaleString("ar-SA")} ر.س</span></div>
       <div className="mt-2 flex justify-between items-center"><span className="text-[11px]">★ {o.rating} <span className="text-white/40">({o.reviews_count})</span></span><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">🔥 {o.usage_count} استخدام</span></div>
       <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-violet-500/20 border border-violet-400/20 text-center">🎟️ كوبون: {o.coupon_code}</div>
      </div>
     </article>
    ))}
   </div>

   {showMap&&<div className="mt-6 h-[300px] rounded-2xl bg-white/10 border border-white/10 grid place-items-center text-sm text-white/60">🗺️ الخريطة - {filtered.length} عرض داخل {radius} كم حولك</div>}
  </main>

  <button onClick={()=>setShowMap(v=>!v)} className="fixed bottom-24 left-4 z-20 h-11 px-4 rounded-full bg-white text-black text-xs font-black shadow-xl">🗺️ خريطة كل العروض</button>
  <button className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-white/20 grid place-items-center text-xl shadow-xl">🤖</button>

  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-black/80 backdrop-blur border-t border-white/10 px-7 py-3 flex justify-between text-[10.5px]">
   <div className="flex flex-col items-center gap-1 text-violet-300"><span>🏠</span>حكيم</div>
   <div className="flex flex-col items-center gap-1 text-white/40"><span>🏬</span>قريبة</div>
   <div className="flex flex-col items-center gap-1 text-white/40"><span>🔍</span>بحث</div>
   <div className="flex flex-col items-center gap-1 text-white/40"><span>❤️</span>مفضلتي</div>
  </div>
 </div>
 )
}
