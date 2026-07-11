"use client"
import { useState, useEffect } from "react"

const STORES = ["الكل","نون","أمازون","جرير","إكسترا","كارفور"]
const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك","القصيم"]

// إحداثيات المدن لحساب الأقرب
const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.7136,lng:46.6753},
  "جدة":{lat:21.5433,lng:39.1728},
  "مكة":{lat:21.3891,lng:39.8579},
  "المدينة":{lat:24.4672,lng:39.6111},
  "الدمام":{lat:26.4207,lng:50.0888},
  "أبها":{lat:18.2164,lng:42.5053},
  "تبوك":{lat:28.3835,lng:36.5662},
  "القصيم":{lat:26.3260,lng:43.9750},
}

const ECOM_OFFERS = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة خصم حتى 75%", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"نون", city:"جدة", title:"عطور فاخرة - عرض جدة", price:149, old:599, disc:75, coupon:"JED75", ship:"توصيل جدة", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:3, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل لكل المدن", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:4, store:"جرير", city:"الرياض", title:"آيباد برو M2 ضمان جرير", price:2199, old:3999, disc:45, coupon:"JARIR100", ship:"توصيل جرير", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
]

const HARAJ_ALL = [
  { t:"سييرا 2026 حرق", pr:"169,000 ر.س", city:"الرياض", tag:"حرق نار" },
  { t:"اكسنت 2026 سمارت", pr:"59,900 ر.س", city:"الرياض", tag:"يا بلاش" },
  { t:"فيلا بمسبح طيبة", pr:"1,750,000 ر.س", city:"جدة", tag:"فرصة" },
  { t:"شقة تمليك أبها", pr:"420,000 ر.س", city:"أبها", tag:"مرخص فال" },
  { t:"أرض مكة ولي العهد", pr:"380,000 ر.س", city:"مكة", tag:"صك" },
]

function nearestCity(lat:number,lng:number){
  let best="الرياض", bestD=Infinity
  for(const [city,c] of Object.entries(CITY_COORDS)){
    const d = Math.hypot(lat-c.lat, lng-c.lng)
    if(d<bestD){bestD=d; best=city}
  }
  return best
}

export default function Page(){
  const [store,setStore]=useState("الكل")
  const [ecomCity,setEcomCity]=useState("الكل")
  const [harajCity,setHarajCity]=useState("الكل")
  const [locStatus,setLocStatus]=useState<"idle"|"loading"|"granted"|"denied">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [toast,setToast]=useState("")
  const [showHaraj,setShowHaraj]=useState(false)

  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2200)}

  const requestLocation = ()=>{
    if(!navigator.geolocation){ show("المتصفح لا يدعم تحديد الموقع"); return }
    setLocStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const {latitude,longitude}=pos.coords
        const near = nearestCity(latitude,longitude)
        setUserCity(near)
        setEcomCity(near)
        setHarajCity(near)
        setLocStatus("granted")
        show(`تم تحديد موقعك: ${near} - بنجيب لك العروض القريبة`)
      },
      (err)=>{
        if(err.code===1){ setLocStatus("denied"); show("رفضت إذن الموقع - تقدر تفعله من إعدادات المتصفح") }
        else { setLocStatus("idle"); show("تعذر تحديد الموقع، حاول مرة ثانية") }
      },
      { enableHighAccuracy:true, timeout:10000, maximumAge:60000 }
    )
  }

  const filteredEcom = ECOM_OFFERS.filter(o=>{
    const byStore = store==="الكل"||o.store===store
    const byCity = ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل"
    return byStore&&byCity
  })
  const filteredHaraj = harajCity==="الكل"? HARAJ_ALL : HARAJ_ALL.filter(h=>h.city===harajCity)

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    <header className="sticky top-0 z-30 bg-[#0B0F1E]/90 backdrop-blur-xl border-b border-[#161D36] h-12 flex items-center justify-between px-3">
      <button className="h-9 px-4 rounded-full bg-[#151B31] border border-[#1E2744] text-[12px] font-bold">دخول</button>
      <div className="flex items-center gap-2"><span className="text-[11px] px-2.5 py-1 rounded-full bg-[#1A1B2E] border border-[#2A2A4A] text-amber-200">فال مرخص</span><b>حكيم</b></div>
    </header>

    {/* زر السماح بالموقع - جديد */}
    <div className="mx-3 mt-3">
      {locStatus==="idle" && (
        <button onClick={requestLocation} className="w-full h-[56px] rounded-[16px] bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500/30 flex items-center justify-between px-4 shadow-[0_8px_24px_rgba(124,58,237,.3)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="text-right"><div className="text-[13px] font-black">السماح بمعرفة موقعك</div><div className="text-[11px] text-violet-200">عشان نجيب لك العروض القريبة منك</div></div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white text-violet-700 flex items-center justify-center font-black">›</div>
        </button>
      )}
      {locStatus==="loading" && (
        <div className="w-full h-[56px] rounded-[16px] bg-[#12182F] border border-[#1B2547] flex items-center justify-center gap-2 text-[13px] text-slate-400">
          <span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block"></span> جاري تحديد موقعك...
        </div>
      )}
      {locStatus==="granted" && userCity && (
        <div className="w-full h-[56px] rounded-[16px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg></div><div className="text-[13px] font-bold text-emerald-300">تم تحديد موقعك: {userCity}</div><div className="text-[11px] text-slate-400">نعرض لك العروض القريبة منك الآن</div></div></div>
          <button onClick={()=>{setLocStatus("idle");setUserCity(null);setEcomCity("الكل");setHarajCity("الكل")}} className="text-[11px] text-slate-400 underline">تغيير</button>
        </div>
      )}
      {locStatus==="denied" && (
        <div className="w-full rounded-[16px] bg-red-500/10 border border-red-500/20 p-3 flex items-center justify-between">
          <div className="text-[12px] leading-5"><b className="text-red-300">تم رفض إذن الموقع</b><br/><span className="text-slate-400">فعل الموقع من إعدادات المتصفح عشان نجيب القريب منك</span></div>
          <button onClick={requestLocation} className="h-9 px-4 rounded-full bg-white text-black text-[12px] font-bold">حاول مرة ثانية</button>
        </div>
      )}
    </div>

    {/* مربعات فوق مثل حراج */}
    <div className="px-3 py-3 flex gap-2.5 overflow-auto no-scrollbar">
      <button className="shrink-0 w-[82px] h-[76px] rounded-[18px] bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center gap-1"><svg width="20" height="20" viewBox="0 0 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg>
