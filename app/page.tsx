"use client"
import { useState, useEffect } from "react"

const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها"]
const STORES = ["الكل","نون","أمازون","جرير","إكسترا"]

const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.71,lng:46.67}, "جدة":{lat:21.54,lng:39.17},
  "مكة":{lat:21.38,lng:39.85}, "المدينة":{lat:24.46,lng:39.61},
}

const ECOM = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة - خصم حتى 75% + كوبون", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل - صفقة اليوم", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل أمازون", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
]

function nearestCity(lat:number,lng:number){
  let best="الرياض", d=Infinity
  for(const [c,co] of Object.entries(CITY_COORDS)){ const cur=Math.hypot(lat-co.lat,lng-co.lng); if(cur<d){d=cur;best=c} }
  return best
}

export default function Page(){
  const [ecomCity,setEcomCity]=useState("الكل")
  const [store,setStore]=useState("الكل")
  const [loc,setLoc]=useState<"idle"|"loading"|"granted"|"denied">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [showLogin,setShowLogin]=useState(false)
  const [saved,setSaved]=useState(1242)

  useEffect(()=>{
    const s=localStorage.getItem("hakeem_city")
    if(s){ setUserCity(s); setEcomCity(s); setLoc("granted") }
  },[])

  const requestLoc=()=>{
    if(!navigator.geolocation) return
    setLoc("loading")
    navigator.geolocation.getCurrentPosition(p=>{
      const near=nearestCity(p.coords.latitude,p.coords.longitude)
      setUserCity(near); setEcomCity(near); setLoc("granted")
      localStorage.setItem("hakeem_city",near)
    },()=>setLoc("denied"),{enableHighAccuracy:true,timeout:8000})
  }
  const clearLoc=()=>{ localStorage.removeItem("hakeem_city"); setUserCity(null); setEcomCity("الكل"); setLoc("idle") }

  const filtered = ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل"))

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    {/* هيدر نظيف بدون فال مرخص وبدون الحراج */}
    <header className="h-14 flex items-center justify-end px-4 border-b border-[#12182F] bg-[#070A18]">
      <div className="font-black text-lg">حكيم.</div>
    </header>

    {/* زر الدخول بجانب السماح بالموقع - نفس السطر */}
    <div className="mx-3 mt-3 flex gap-2.5 items-stretch">
      {/* دخول */}
      <button onClick={()=>setShowLogin(true)} className="h-14 w-20 shrink-0 rounded-2xl bg-[#151B31] border border-[#1E2744] font-black text-sm">دخول</button>

      {/* السماح بالموقع */}
      {loc==="idle" && (
        <button onClick={requestLoc} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] flex items-center justify-between px-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="text-right leading-4">
              <div className="font-black text-[13px]">السماح بمعرفة موقعك</div>
              <div className="text-[11px] text-violet-200">عشان نجيب العروض القريبة منك</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white text-violet-700 flex items-center justify-center font-black">‹</div>
        </button>
      )}
      {loc==="loading" && <div className="flex-1 h-14 rounded-2xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center gap-2 text-sm text-slate-400"><span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span> جاري تحديد موقعك...</div>}
      {loc==="granted" && userCity && <div className="flex-1 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4"><span className="font-bold text-emerald-300 text-sm">موقعك: {userCity} ✓ محفوظ</span><button onClick={clearLoc} className="text-xs text-slate-400 underline">تغيير</button></div>}
      {loc==="denied" && <div className="flex-1 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-between px-4"><span className="text-sm text-red-300">تم رفض الإذن</span><button onClick={requestLoc} className="h-8 px-3 rounded-full bg-white text-black text-xs font-bold">حاول</button></div>}
    </div>

    {/* المربعات الأربعة */}
    <div className="px-3 py-3 grid grid-cols-4 gap-2">
      <button className="h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center text-sm font-bold leading-4">الذكاء<br/>الاقتصادي</button>
      <button className="h-20 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black font-black">الحراج</button>
      <button className="h-20 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 font-bold text-sm">عروضكم</button>
      <button className="h-20 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-sm">متجر<br/>حكيم</button>
    </div>

    {/* الهيرو */}
    <div className="mx-3 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-5 text-center">
      <h1 className="font-black">متجر حكيم - عروضكم<br/><span className="text-amber-200 text-sm">أقوى عروض اليوم في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 font-bold">تصميم ملكي بنفسجي AI</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 font-bold">يجلب العروض كل ساعة</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 font-bold">التوصيل حسب سياسة المتجر</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 font-bold">كوبونات جاهزة بنقرة</div>
      </div>
      <div className="mt-3 inline-flex bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-full px-4 py-1 text-xs font-bold">وفرت حتى الآن: {saved.toLocaleString()} ر.س</div>
    </div>

    <div className="mt-5 px-3 flex justify-between"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-violet-500 rounded-full"></span>عروض المتاجر {userCity?`القريبة من ${userCity}`:""}</h2></div>
    <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setEcomCity(c); if(c!=="الكل"){localStorage.setItem("hakeem_city",c)}}} className={`h-8 px-3.5 rounded-full text-xs font-bold border whitespace-nowrap ${ecomCity===c?"bg-white text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
    <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{STORES.map(s=><button key={s} onClick={()=>setStore(s)} className={`h-8 px-4 rounded-full text-xs font-bold border ${store===s?"bg-violet-600 border-violet-600 text-white":"bg-[#151B31] border-[#1E2744] text-slate-400"}`}>{s}</button>)}</div>

    <div className="grid grid-cols-2 gap-2.5 p-3">
      {filtered.map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded-2xl overflow-hidden"><div className="relative h-32 bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">{o.city}</span></div><div className="p-2.5"><div className="text-xs font-bold leading-5 h-9 overflow-hidden">{o.title}</div><div className="text-[11px] text-slate-400 mt-1">{o.ship}</div><div className="mt-1 font-black">{o.price} ر.س</div></div></div>
      ))}
    </div>

    <div className="m-3 rounded-xl bg-[#10162F] border border-[#1E2A5A] p-4 mb-20">
      <p className="text-xs leading-6 text-slate-200">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
      <p className="font-black text-amber-200 mt-1 text-sm">(محسن الحكمي)</p>
      <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-2 block bg-[#0A1024] border border-[#1B2547] rounded-xl p-2.5 text-xs text-sky-300 break-all text-center">dealapp.sa - ملفي العقاري</a>
    </div>

    {showLogin && <><div onClick={()=>setShowLogin(false)} className="fixed inset-0 bg-black/70 z-50"/><div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[340px] bg-[#12182F] border border-[#1B2547] rounded-2xl p-5"><div className="flex justify-between"><b>دخول</b><button onClick={()=>setShowLogin(false)}>✕</button></div><input placeholder="05xxxxxxxx" className="mt-4 w-full h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 outline-none"/><button className="mt-3 w-full h-11 bg-violet-600 rounded-full font-bold">دخول</button></div></>}
  </div>
  )
}
