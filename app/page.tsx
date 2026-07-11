"use client"
import { useState, useEffect } from "react"

const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك","القصيم","حائل","جازان"]
const STORES = ["الكل","نون","أمازون","جرير","إكسترا"]

const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.71,lng:46.67}, "جدة":{lat:21.54,lng:39.17}, "مكة":{lat:21.38,lng:39.85},
  "المدينة":{lat:24.46,lng:39.61}, "الدمام":{lat:26.42,lng:50.08}, "أبها":{lat:18.21,lng:42.5},
}

// عروض متجر حكيم الخاص - فعل
const HAKEEM_STORE = [
  { id:101, title:"باقة ساعة ذكية + محفظة جلد", price:399, old:619, disc:35, city:"جدة", img:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600" },
  { id:102, title:"عطر حكيم الخاص - 100مل", price:249, old:350, disc:29, city:"الكل", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:103, title:"حامل جوال مغناطيسي للسيارة", price:49, old:89, disc:44, city:"الرياض", img:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600" },
]

const ECOM = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة خصم 75%", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"نون", city:"جدة", title:"عطور فاخرة - عرض جدة", price:149, old:599, disc:75, coupon:"JED75", ship:"توصيل جدة", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:3, store:"أمازون", city:"الكل", title:"سماعة Anker عزل كامل", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل لكل المدن", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:4, store:"جرير", city:"الرياض", title:"آيباد برو M2", price:2199, old:3999, disc:45, coupon:"J10", ship:"توصيل جرير", img:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
]

const HARAJ_ALL = [
  { id:201, t:"سييرا 2026 حرق 169 ألف - أرخص سعر", pr:"169,000 ر.س", city:"الرياض", tag:"حرق نار" },
  { id:202, t:"اكسنت 2026 سمارت يا بلاش", pr:"59,900 ر.س", city:"الرياض", tag:"يا بلاش" },
  { id:203, t:"فيلا بمسبح طيبة الرحيلي", pr:"1,750,000 ر.س", city:"جدة", tag:"فرصة" },
  { id:204, t:"شقة تمليك 3 غرف أبها", pr:"420,000 ر.س", city:"أبها", tag:"مرخص فال" },
  { id:205, t:"كامري 2025 ستاندر", pr:"89,900 ر.س", city:"الدمام", tag:"قوي" },
  { id:206, t:"أرض 600م ولي العهد", pr:"380,000 ر.س", city:"مكة", tag:"صك" },
]

function nearestCity(lat:number,lng:number){
  let best="الرياض", dmin=Infinity
  for(const [c,co] of Object.entries(CITY_COORDS)){ const d=Math.hypot(lat-co.lat,lng-co.lng); if(d<dmin){dmin=d;best=c} }
  return best
}

export default function Page(){
  const [active,setActive]=useState<"hakeem"|"offers"|"haraj"|"ai">("offers")
  const [store,setStore]=useState("الكل")
  const [ecomCity,setEcomCity]=useState("الكل")
  const [harajCity,setHarajCity]=useState("الكل")
  const [loc,setLoc]=useState<"idle"|"loading"|"granted"|"denied">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [showLogin,setShowLogin]=useState(false)
  const [isFetching,setIsFetching]=useState(false)
  const [toast,setToast]=useState("")
  const [saved,setSaved]=useState(1247)

  useEffect(()=>{
    const s = localStorage.getItem("hakeem_city")
    if(s){ setUserCity(s); setEcomCity(s); setHarajCity(s); setLoc("granted") }
    const t=setInterval(()=>setSaved(x=>x+1),6000); return()=>clearInterval(t)
  },[])

  const saveCity = (c:string)=>{ if(c!=="الكل"){ localStorage.setItem("hakeem_city",c); setUserCity(c); setLoc("granted") } }
  const requestLoc = ()=>{
    if(!navigator.geolocation){ setToast("المتصفح لا يدعم"); return }
    setLoc("loading")
    navigator.geolocation.getCurrentPosition(p=>{
      const near=nearestCity(p.coords.latitude,p.coords.longitude)
      setUserCity(near); setEcomCity(near); setHarajCity(near); setLoc("granted")
      localStorage.setItem("hakeem_city",near); setToast(`تم تحديد موقعك: ${near} - جبنا القريب منك`)
    }, e=>{ if(e.code===1) setLoc("denied"); else setLoc("idle") }, {enableHighAccuracy:true,timeout:10000})
  }
  const clearLoc = ()=>{ localStorage.removeItem("hakeem_city"); setUserCity(null); setEcomCity("الكل"); setHarajCity("الكل"); setLoc("idle") }
  const fetchOffers = ()=>{ setIsFetching(true); setTimeout(()=>{ setIsFetching(false); setToast("تم تحديث العروض - جلبنا أقوى العروض الآن ✓") },1200) }

  const fEcom = ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل"))
  const fHaraj = harajCity==="الكل"? HARAJ_ALL : HARAJ_ALL.filter(h=>h.city===harajCity)
  const fHakeem = ecomCity==="الكل"? HAKEEM_STORE : HAKEEM_STORE.filter(h=>h.city===ecomCity||h.city==="الكل")

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    {/* هيدر نظيف بدون حراج وبدون فال مرخص */}
    <header className="h-14 flex items-center justify-end px-4 border-b border-[#12182F]"><div className="font-black text-">حكيم.</div></header>

    {/* زر الدخول بجانب السماح بالموقع */}
    <div className="mx-3 mt-3 flex gap-2 items-stretch">
      <button onClick={()=>setShowLogin(true)} className="h-14 px-6 rounded-2xl bg-[#151B31] border border-[#1E2744] font-black shrink-0">دخول</button>
      {loc==="idle" && <button onClick={requestLoc} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between px-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div className="text-right leading-4"><div className="font-black">السماح بمعرفة موقعك</div><div className="text- text-violet-200">عشان نجيب العروض القريبة منك</div></div></div><span className="w-7 h-7 rounded-full bg-white text-violet-700 flex items-center justify-center">‹</span></button>}
      {loc==="loading" && <div className="flex-1 h-14 rounded-2xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center gap-2 text-slate-400"><span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span> جاري التحديد...</div>}
      {loc==="granted" && userCity && <div className="flex-1 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4"><div className="font-bold text-emerald-300">موقعك: {userCity} - محفوظ ✓</div><button onClick={clearLoc} className="text- text-slate-400 underline">تغيير</button></div>}
    </div>

    {/* المربعات - كلها فعالة */}
    <div className="px-3 py-3 grid grid-cols-4 gap-2.5">
      <button onClick={()=>{setActive("hakeem"); fetchOffers()}} className={`h-20 rounded-xl flex flex-col items-center justify-center gap-1 font-bold border transition ${active==="hakeem"?"bg-white text-black border-white shadow-lg":"bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-500/30"}`}><span className="text- leading-4 text-center">متجر<br/>حكيم</span>{active==="hakeem"&&<span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-full">مفعل</span>}</button>
      <button onClick={()=>{setActive("offers"); fetchOffers()}} className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold border ${active==="offers"?"bg-white text-black":"bg-gradient-to-br from-sky-400 to-blue-600 border-blue-400/30"}`}>عروضكم</button>
      <button onClick={()=>{setActive("haraj"); fetchOffers()}} className={`h-20 rounded-xl flex flex-col items-center justify-center font-black border relative ${active==="haraj"?"bg-white text-black":"bg-gradient-to-br from-amber-300 to-amber-500 text-black border-amber-400"}`}><span className="absolute -top-1.5 -right-1.5 bg-black text-amber-400 text- w-5 h-5 rounded-full border border-amber-400 flex items-center justify-center">{fHaraj.length}</span>الحراج</button>
      <button onClick={()=>setActive("ai")} className={`h-20 rounded-xl flex flex-col items-center justify-center font-bold border text-center leading-4 ${active==="ai"?"bg-white text-black":"bg-gradient-to-br from-emerald-400 to-teal-600"}`}>الذكاء<br/>الاقتصادي</button>
    </div>

    {/* زر جلب العروض */}
    <div className="mx-3 flex gap-2">
      <button onClick={fetchOffers} disabled={isFetching} className="flex-1 h-10 rounded-full bg-[#12182F] border border-[#1B2547] text- font-bold flex items-center justify-center gap-2">
        {isFetching?<><span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></span> جاري جلب العروض...</>:<>↻ اجلب العروض الآن - كل المدن</>}
      </button>
    </div>

    <div className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-4 text-center">
      <h1 className="font-black text-">متجر حكيم - عروضكم<br/><span className="text-amber-200 text-">أقوى عروض اليوم في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2 mt-3 text-">
        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-2.5 font-bold">تصميم ملكي AI</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-2.5 font-bold">يجلب العروض كل ساعة</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-2.5 font-bold">التوصيل حسب سياسة المتجر</div>
        <div className="bg-white/[0.07] border border-white/10 rounded-xl p-2.5 font-bold">كوبونات جاهزة</div>
      </div>
      <div className="mt-2 inline-flex bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 rounded-full px-3 py-1 text- font-bold">وفرت: {saved.toLocaleString()} ر.س</div>
    </div>

    {/* محتوى حسب التبويب */}
    {active==="hakeem" && (
      <div className="mt-4">
        <div className="px-3 flex justify-between items-center"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-violet-500 rounded-full"></span>متجر حكيم - مفعل ✓</h2><span className="text- bg-violet-500/15 text-violet-300 px-2 py-1 rounded-full border border-violet-500/20">{fHakeem.length} منتج</span></div>
        <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setEcomCity(c); saveCity(c)}} className={`h-8 px-3.5 rounded-full text- font-bold whitespace-nowrap border ${ecomCity===c?"bg-white text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
        <div className="grid grid-cols-2 gap-2.5 p-3">{fHakeem.map(o=><div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded- overflow-hidden"><div className="relative h-[140px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute top-2 left-2 bg-violet-600 text-white text- font-black px-2 py-0.5 rounded-full">-{o.disc}%</span></div><div className="p-2.5"><div className="font-bold text- leading-5 h-9 overflow-hidden">{o.title}</div><div className="flex gap-2 mt-1"><b>{o.price} ر.س</b><s className="text- text-slate-500 line-through">{o.old}</s></div><button className="mt-2 w-full h-9 bg-white text-black rounded-xl font-bold text-">أضف للسلة - متجر حكيم</button></div></div>)}</div>
      </div>
    )}

    {active==="offers" && (
      <div className="mt-4">
        <div className="px-3 flex justify-between"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-sky-400 rounded-full"></span>عروض المتاجر {userCity?`القريبة من ${userCity}`:""}</h2><span className="text- text-slate-400">{ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل")).length} عرض</span></div>
        <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setEcomCity(c); saveCity(c)}} className={`h-8 px-3.5 rounded-full text- font-bold border ${ecomCity===c?"bg-white text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
        <div className="px-3 mt-1.5 flex gap-2 overflow-auto no-scrollbar">{STORES.map(s=><button key={s} onClick={()=>setStore(s)} className={`h-8 px-4 rounded-full text- font-bold border ${store===s?"bg-violet-600 border-violet-600 text-white":"bg-[#151B31] border-[#1E2744] text-slate-400"}`}>{s}</button>)}</div>
        <div className="grid grid-cols-2 gap-2.5 p-3">{ECOM.filter(o=>(store==="الكل"||o.store===store)&&(ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل")).map(o=><div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded- overflow-hidden"><div className="relative h-[126px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute bottom-2 right-2 bg-black/70 text-white text- px-2 py-0.5 rounded-full">{o.city} • {o.store}</span></div><div className="p-2.5"><div className="font-bold text- h-9 leading-5 overflow-hidden">{o.title}</div><div className="text- text-slate-400">{o.ship}</div><div className="mt-1"><b>{o.price} ر.س</b></div></div></div>)}</div>
      </div>
    )}

    {active==="haraj" && (
      <div className="mt-4">
        <div className="px-3 flex justify-between"><h2 className="font-black flex items-center gap-2"><span className="w-1 h-5 bg-amber-400 rounded-full"></span>حراج - أقوى العروض جميع المدن - مفعل</h2></div>
        <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setHarajCity(c); saveCity(c)}} className={`h-8 px-3.5 rounded-full text- font-bold border ${harajCity===c?"bg-amber-400 border-amber-400 text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
        <div className="grid grid-cols-2 gap-2.5 p-3">{fHaraj.map((h,i)=><div key={i} className="bg-[#0A1024] border border-[#1B2547] rounded- p-3"><div className="font-bold text- leading-5 h-10 overflow-hidden">{h.t}</div><div className="font-black text-amber-300 mt-1">{h.pr}</div><div className="text- text-slate-400 mt-1">{h.city} • {h.tag}</div><button className="mt-2 w-full h-8 bg-amber-400 text-black rounded-xl font-black text-">افتح في الحراج</button></div>)}</div>
      </div>
    )}

    {active==="ai" && <div className="m-3 rounded-2xl bg-[#12182F] border border-[#1B2547] p-4"><h3 className="font-black">الذكاء الاقتصادي</h3><p className="text- text-slate-400 mt-2 leading-6">أنا أجيب لك أرخص سعر بين نون وأمازون وجرير حسب مدينتك {userCity||""} وأوفر لك تلقائياً.</p></div>}

    <div className="m-3 rounded-xl bg-[#10162F] border border-[#1E2A5A] p-4 mb-20">
      <p className="text- leading-6 text-slate-200">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
      <p className="font-black text-amber-200 mt-1">(محسن الحكمي)</p>
      <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-2 block bg-[#0A1024] border border-[#1B2547] rounded-xl p-2.5 text- text-sky-300 break-all text-center">dealapp.sa - ملفي العقاري</a>
    </div>

    {toast
