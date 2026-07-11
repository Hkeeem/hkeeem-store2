"use client"
import { useState, useEffect } from "react"

const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها"]
const STORES = ["الكل","نون","أمازون","جرير","إكسترا"]

const ECOM = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة - خصم حتى 75% + كوبون", price:149, old:599, ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل", price:199, old:399, ship:"توصيل لكل المدن", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
]

function nearestCity(lat:number,lng:number){
  const coords: any = {"الرياض":[24.71,46.67],"جدة":[21.54,39.17]}
  let best="الرياض", d=Infinity
  for(const [c,co] of Object.entries(coords)){ const cur=Math.hypot(lat-(co as any)[0],lng-(co as any)[1]); if(cur<d){d=cur;best=c} }
  return best
}

export default function Page(){
  const [ecomCity,setEcomCity]=useState("الكل")
  const [store,setStore]=useState("الكل")
  const [loc,setLoc]=useState<"idle"|"loading"|"granted">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [showLogin,setShowLogin]=useState(false)

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
    },()=>setLoc("idle"),{enableHighAccuracy:true,timeout:8000})
  }

  const filtered = ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل"))

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    {/* بدون هيدر حكيم - محذوف تماماً */}

    {/* زر الدخول بجانب السماح بالموقع */}
    <div className="mx-3 pt-4 flex gap-2.5 items-stretch">
      <button onClick={()=>setShowLogin(true)} className="h-14 w-20 shrink-0 rounded-2xl bg-[#151B31] border border-[#1E2744] font-black text-sm">دخول</button>

      {loc==="idle" && (
        <button onClick={requestLoc} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] flex items-center justify-between px-3.5 shadow-[0_8px_20px_rgba(124,58,237,.3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="text-right leading-4">
              <div className="font-black text-sm">السماح بمعرفة موقعك</div>
              <div className="text-xs text-violet-200">عشان نجيب العروض القريبة منك</div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white text-violet-700 flex items-center justify-center font-black text-sm">‹</div>
        </button>
      )}
      {loc==="loading" && <div className="flex-1 h-14 rounded-2xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center gap-2 text-sm text-slate-400"><span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span> جاري التحديد...</div>}
      {loc==="granted" && userCity && <div className="flex-1 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4"><span className="font-bold text-emerald-300 text-sm">موقعك: {userCity} ✓</span><button onClick={()=>{localStorage.removeItem("hakeem_city"); setLoc("idle"); setUserCity(null); setEcomCity("الكل")}} className="text-xs text-slate-400 underline">تغيير</button></div>}
    </div>

    {/* المربعات */}
    <div className="px-3 py-3 grid grid-cols-4 gap-2">
      <div className="h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold leading-4 text-center">الذكاء<br/>الاقتصادي</div>
      <div className="h-20 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black font-black flex items-center justify-center">الحراج</div>
      <div className="h-20 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold">عروضكم</div>
      <div className="h-20 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">متجر<br/>حكيم</div>
    </div>

    <div className="mx-3 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-5 text-center">
      <h1 className="font-black">عروضكم<br/><span className="text-amber-200 text-sm">أقوى عروض اليوم في مكان واحد!</span></h1>
    </div>

    <div className="px-3 mt-4 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>setEcomCity(c)} className={`h-8 px-3.5 rounded-full text-xs font-bold border whitespace-nowrap ${ecomCity===c?"bg-white text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>

    <div className="grid grid-cols-2 gap-2.5 p-3 pb-24">
      {filtered.map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded-2xl overflow-hidden"><div className="h-32 bg-white"><img src={o.img} className="w-full h-full object-cover"/></div><div className="p-2.5"><div className="text-xs font-bold h-9 leading-5 overflow-hidden">{o.title}</div><div className="mt-1 font-black">{o.price} ر.س</div></div></div>
      ))}
    </div>

    {showLogin && <><div onClick={()=>setShowLogin(false)} className="fixed inset-0 bg-black/70 z-50"/><div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[340px] bg-[#12182F] border border-[#1B2547] rounded-2xl p-5"><div className="flex justify-between"><b>دخول</b><button onClick={()=>setShowLogin(false)}>✕</button></div><input placeholder="05xxxxxxxx" className="mt-4 w-full h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 outline-none"/><button className="mt-3 w-full h-11 bg-violet-600 rounded-full font-bold">دخول</button></div></>}
  </div>
  )
    }
