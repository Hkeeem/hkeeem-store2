"use client"
import { useState, useEffect } from "react"

const STORES = ["الكل","نون","أمازون","جرير","إكسترا","كارفور","العثيم"]
const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك","القصيم","حائل","جازان"]

const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.71,lng:46.67}, "جدة":{lat:21.54,lng:39.17}, "مكة":{lat:21.38,lng:39.85},
  "المدينة":{lat:24.46,lng:39.61}, "الدمام":{lat:26.42,lng:50.08}, "أبها":{lat:18.21,lng:42.5},
  "تبوك":{lat:28.38,lng:36.56}, "القصيم":{lat:26.32,lng:43.97},
}

const ECOM = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة - خصم حتى 75% + كوبون", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"نون", city:"جدة", title:"عطور فاخرة - عرض جدة", price:149, old:599, disc:75, coupon:"JED75", ship:"توصيل جدة", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:3, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل صفقة اليوم", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل لكل المدن", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:4, store:"جرير", city:"الرياض", title:"آيباد برو M2 ضمان جرير", price:2199, old:3999, disc:45, coupon:"J10", ship:"توصيل جرير", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
  { id:5, store:"إكسترا", city:"الدمام", title:"ثلاجة LG تقسيط", price:2899, old:4299, disc:32, coupon:"EXTRA20", ship:"تركيب منزلي", img:"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600" },
]

const HARAJ = [
  { t:"سييرا 2026 حرق 169 ألف", pr:"169,000 ر.س", city:"الرياض", tag:"حرق نار" },
  { t:"اكسنت 2026 سمارت", pr:"59,900 ر.س", city:"الرياض", tag:"يا بلاش" },
  { t:"فيلا بمسبح طيبة الرحيلي", pr:"1,750,000 ر.س", city:"جدة", tag:"فرصة" },
  { t:"شقة تمليك أبها", pr:"420,000 ر.س", city:"أبها", tag:"مرخص فال" },
  { t:"أرض مكة ولي العهد", pr:"380,000 ر.س", city:"مكة", tag:"صك" },
  { t:"هايلوكس ديزل القصيم", pr:"112,000 ر.س", city:"القصيم", tag:"نظيف" },
]

function nearestCity(lat:number,lng:number){
  let best="الرياض", dmin=Infinity
  for(const [c,co] of Object.entries(CITY_COORDS)){ const d=Math.hypot(lat-co.lat,lng-co.lng); if(d<dmin){dmin=d;best=c} }
  return best
}

export default function Page(){
  const [store,setStore]=useState("الكل")
  const [ecomCity,setEcomCity]=useState("الكل")
  const [harajCity,setHarajCity]=useState("الكل")
  const [loc,setLoc]=useState<"idle"|"loading"|"granted"|"denied">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [showHaraj,setShowHaraj]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [showPrivacy,setShowPrivacy]=useState(false)
  const [showTerms,setShowTerms]=useState(false)
  const [loginTab,setLoginTab]=useState<"phone"|"email">("phone")
  const [toast,setToast]=useState("")
  const [saved,setSaved]=useState(1241)

  useEffect(()=>{
    const s = localStorage.getItem("hakeem_city")
    if(s){ setUserCity(s); setEcomCity(s); setHarajCity(s); setLoc("granted") }
    const t=setInterval(()=>setSaved(x=>x+1),7000); return()=>clearInterval(t)
  },[])

  const saveCity = (c:string)=>{ if(c!=="الكل"){ localStorage.setItem("hakeem_city",c); localStorage.setItem("hakeem_loc_granted","1"); setUserCity(c); setLoc("granted") } }
  const requestLoc = ()=>{
    if(!navigator.geolocation){ setToast("المتصفح لا يدعم"); return }
    setLoc("loading")
    navigator.geolocation.getCurrentPosition(p=>{
      const near=nearestCity(p.coords.latitude,p.coords.longitude)
      setUserCity(near); setEcomCity(near); setHarajCity(near); setLoc("granted")
      localStorage.setItem("hakeem_city",near); localStorage.setItem("hakeem_loc_granted","1")
      setToast(`تم تحديد موقعك: ${near}`)
    }, e=>{ if(e.code===1) setLoc("denied"); else setLoc("idle") }, {enableHighAccuracy:true,timeout:10000})
  }
  const clearLoc = ()=>{ localStorage.removeItem("hakeem_city"); localStorage.removeItem("hakeem_loc_granted"); setUserCity(null); setEcomCity("الكل"); setHarajCity("الكل"); setLoc("idle") }

  const fEcom = ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل"))
  const fHaraj = harajCity==="الكل"? HARAJ : HARAJ.filter(h=>h.city===harajCity)

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    <header className="sticky top-0 z-30 bg-[#0B0F1E]/90 backdrop-blur-xl border-b border-[#161D36] h-14 flex items-center justify-between px-3">
      <button onClick={()=>setShowLogin(true)} className="h-10 px-5 rounded-full bg-[#151B31] border border-[#1E2744] font-bold text-">دخول</button>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <button onClick={()=>setShowHaraj(true)} className="relative w- h- rounded- bg-gradient-to-br from-amber-300 to-amber-600 flex flex-col items-center justify-center px-3 shadow">
            <span className="absolute -top-2 -right-2 bg-black text-amber-400 text-[10px] w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center font-black">6</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="1.4"/><circle cx="17" cy="17" r="1.4"/></svg>
            <span className="text-[10px] font-black text-black">الحراج</span>
          </button>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-[#1A1B2E] border border-[#2A2A4A] text-amber-200 text-">فال مرخص</span>
        <b>حكيم.</b>
      </div>
    </header>

    {/* زر الموقع يحفظ */}
    <div className="mx-3 mt-3">
      {loc==="idle" && <button onClick={requestLoc} className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500/30 flex items-center justify-between px-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div className="text-right"><div className="font-black text-">السماح بمعرفة موقعك</div><div className="text- text-violet-200">عشان نجيب العروض القريبة منك</div></div></div><span className="w-8 h-8 rounded-full bg-white text-violet-700 flex items-center justify-center">›</span></button>}
      {loc==="loading" && <div className="h-14 rounded-2xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center gap-2 text-slate-400"><span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin inline-block"></span> جاري تحديد موقعك...</div>}
      {loc==="granted" && userCity && <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4 py-3"><div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</span><div><div className="font-bold text-emerald-300 text-">موقعك المحفوظ: {userCity}</div><div className="text- text-slate-400">نعرض القريب منك - محفوظ تلقائياً</div></div></div><button onClick={clearLoc} className="text- text-slate-400 underline">تغيير</button></div>}
      {loc==="denied" && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-3 flex justify-between items-center"><span className="text- text-red-300">تم رفض الإذن</span><button onClick={requestLoc} className="h-8 px-3 rounded-full bg-white text-black text- font-bold">حاول</button></div>}
    </div>

    {/* مربعات فوق مثل حراج - طلبك */}
    <div className="px-3 py-3 flex gap-2.5 overflow-auto no-scrollbar">
      <button className="shrink-0 w- h-14 rounded- bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center gap-1 px-4"><span className="text- font-bold">متجر حكيم</span></button>
      <button onClick={()=>document.getElementById('ecom')?.scrollIntoView({behavior:'smooth'})} className="shrink-0 w-14 h-14 rounded- bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col items-center justify-center gap-1"><span className="text- font-bold">عروضكم</span></button>
      <button onClick={()=>setShowHaraj(true)} className="shrink-0 w-14 h-14 rounded- bg-gradient-to-br from-amber-300 to-amber-600 flex flex-col items-center justify-center relative"><span className="text- font-black text-black">الحراج</span></button>
      <button className="shrink-0 w- h-14 rounded- bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center px-3"><span className="text- font-bold leading-3 text-center">الذكاء<br/>الاقتصادي</span></button>
    </div>

    <div className="mx-3 rounded- bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-5 text-center">
      <h1 className="font-black leading-7">متجر حكيم - عروضكم<br/><span className="text-amber-200 text-">أقوى عروض اليوم في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 text- font-bold">تصميم ملكي بنفسجي AI</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 text- font-bold">يجلب العروض كل ساعة</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 text- font-bold">التوصيل حسب سياسة المتجر</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 text- font-bold">كوبونات جاهزة بنقرة</div>
      </div>
      <div className="mt-3 inline-flex bg-emerald-500/15 border-emerald-500/25 text-emerald-300 rounded-full px-4 py-1.5 text- font-bold">وفرت حتى الآن: {saved.toLocaleString()} ر.س</div>
    </div>

    <div id="ecom" className="mt-5 px-3 flex justify-between items-center"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-violet-500 rounded-full"></span>عروض المتاجر {userCity?`القريبة من ${userCity}`:"الإلكترونية"}</h2></div>
    <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar pb-1">{CITIES.map(c=><button key={c} onClick={()=>{setEcomCity(c); saveCity(c)}} className={`h-8 px-3.5 rounded-full text- font-bold whitespace-nowrap border ${ecomCity===c?"bg-white text-black border-white":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
    <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{STORES.map(s=><button key={s} onClick={()=>setStore(s)} className={`h-8 px-4 rounded-full text- font-bold whitespace-nowrap border ${store===s?"bg-violet-600 border-violet-600 text-white":"bg-[#151B31] border-[#1E2744] text-slate-400"}`}>{s}</button>)}</div>

    <div className="grid grid-cols-2 gap-2.5 p-3">
      {fEcom.map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded- overflow-hidden"><div className="relative h-[132px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute bottom-2 right-2 bg-black/70 text-white text- px-2 py-0.5 rounded-full">{o.city}</span></div><div className="p-2.5"><div className="text- font-bold h- leading-5">{o.title}</div><div className="text- text-slate-400 mt-1">{o.ship}</div><div className="flex gap-2 mt-1"><b>{o.price} ر.س</b><s className="text- text-slate-500 line-through">{o.old}</s></div></div></div>
      ))}
    </div>

    <div className="px-3 mt-2 flex justify-between items-center"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-amber-400 rounded-full"></span>حراج - أقوى العروض جميع المدن</h2></div>
    <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setHarajCity(c); saveCity(c)}} className={`h-8 px-3.5 rounded-full text- font-bold border ${harajCity===c?"bg-amber-400 border-amber-400 text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
    <div className="grid grid-cols-2 gap-2.5 p-3 pb-24">
      {fHaraj.map((h,i)=><div key={i} className="bg-[#0A1024] border border-[#1B2547] rounded- p-3"><div className="text- font-bold leading-5">{h.t}</div><div className="text- font-black text-amber-300 mt-1">{h.pr}</div><div className="text- text-slate-400">{h.city}</div></div>)}
    </div>

    <div className="m-3 rounded- bg-[#10162F] border border-[#1E2A5A] p-4 mb-20">
      <p className="text- leading-6 text-slate-200">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
      <p className="font-black text-amber-200 mt-1">(محسن الحكمي)</p>
      <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-2 block bg-[#0A1024] border border-[#1B2547] rounded-xl p-2.5 text- text-sky-300 break-all text-center">https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4</a>
    </div>

    {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 px-4 py-2 rounded-full text- z-50">{toast}</div>}
  </div>
  )
}
