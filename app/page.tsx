"use client"
import { useState, useEffect } from "react"

const OFFERS = [
  { id:1, store:"نون", title:"عطور فاخرة - خصم حتى 75% + كوبون", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", title:"سماعة Anker عزل كامل - صفقة اليوم", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل أمازون", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
]

const HARAJ = [
  { t:"سييرا 2026 حرق 169 ألف", pr:"169,000 ر.س", city:"الرياض" },
  { t:"اكسنت 2026 سمارت", pr:"59,900 ر.س", city:"الرياض" },
  { t:"النترا 2026 فل", pr:"78,500 ر.س", city:"الرياض" },
  { t:"فيلا بمسبح طيبة", pr:"1,750,000 ر.س", city:"جدة" },
]

export default function Page(){
  const [cat,setCat]=useState("الكل")
  const [city,setCity]=useState("الكل")
  const [showHaraj,setShowHaraj]=useState(false)
  const [showAI,setShowAI]=useState(false)
  const [showEcon,setShowEcon]=useState(false)
  const [toast,setToast]=useState("")
  const [saved,setSaved]=useState(1254)

  useEffect(()=>{ const i=setInterval(()=>setSaved(s=>s+Math.floor(Math.random()*2)),6000); return()=>clearInterval(i)},[])

  const harajF = city==="الكل"? HARAJ : HARAJ.filter(h=>h.city===city)
  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2000)}

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    {/* هيدر مثل صورتك */}
    <header className="sticky top-0 z-30 bg-[#0B0F1E]/90 backdrop-blur-xl border-b border-[#161D36] h-[64px] flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <button className="h-10 px-5 rounded-full bg-[#151B31] border border-[#1E2744] text-[13px] font-bold">دخول</button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12px] px-3 py-1.5 rounded-full bg-[#1A1B2E] border border-[#2A2A4A] text-amber-200">فال مرخص</span>
        <div className="font-black text-[16px] flex items-center gap-1">حكيم<span className="w-1 h-1 bg-violet-500 rounded-full"></span></div>
      </div>
    </header>

    {/* مربعات فوق مثل الحراج - هذا طلبك */}
    <div className="px-3 py-3 flex gap-3 overflow-auto no-scrollbar">
      {/* متجر حكيم */}
      <button onClick={()=>show("متجر حكيم")} className="relative shrink-0 w-[82px] h-[76px] rounded-[18px] bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(124,58,237,.35)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <span className="text-[11px] font-bold text-white">متجر حكيم</span>
      </button>

      {/* الذكاء الاقتصادي */}
      <button onClick={()=>setShowEcon(true)} className="relative shrink-0 w-[82px] h-[76px] rounded-[18px] bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(16,185,129,.35)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M9.5 2A7.5 7.5 0 002 9.5c0 5.424 7.5 11.5 7.5 11.5S17 14.924 17 9.5A7.5 7.5 0 009.5 2z"/><circle cx="9.5" cy="9.5" r="2.5"/></svg>
        <span className="text-[10px] font-bold text-white leading-3 text-center">الذكاء<br/>الاقتصادي</span>
        <span className="absolute -top-1.5 -right-1.5 bg-black text-emerald-300 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-emerald-400">AI</span>
      </button>

      {/* عروضكم */}
      <button onClick={()=>document.getElementById('offers')?.scrollIntoView({behavior:'smooth'})} className="relative shrink-0 w-[82px] h-[76px] rounded-[18px] bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(14,165,233,.35)]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        <span className="text-[11px] font-bold text-white">عروضكم</span>
        <span className="absolute -top-1.5 -right-1.5 bg-black text-sky-300 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-sky-400">HOT</span>
      </button>

      {/* الحراج - نفس تصميم صورتك */}
      <button onClick={()=>setShowHaraj(true)} className="relative shrink-0 w-[82px] h-[76px] rounded-[18px] bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex flex-col items-center justify-center gap-1 shadow-[0_6px_18px_rgba(245,158,11,.35)]">
        <span className="absolute -top-2 -right-2 bg-black text-amber-400 text-[10px] font-black w-6 h-6 rounded-full border border-amber-400 flex items-center justify-center">{harajF.length}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>
        <span className="text-[11px] font-black text-black">الحراج</span>
      </button>
    </div>

    {/* هيرو نفس صورتك */}
    <div className="mx-3 rounded-[26px] bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-5 overflow-hidden relative">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-violet-500/20 blur-[30px] rounded-full"/>
      <h1 className="text-[20px] font-black leading-8 text-center">متجر حكيم - عروضكم<br/><span className="text-amber-200 text-[18px]">أقوى عروض اليوم في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2.5 mt-5">
        <div className="bg-white/[0.08] backdrop-blur border border-white/10 rounded-2xl p-3 text-[12px] font-bold text-center leading-5">تصميم ملكي بنفسجي AI</div>
        <div className="bg-white/[0.08] backdrop-blur border border-white/10 rounded-2xl p-3 text-[12px] font-bold text-center leading-5">يجلب العروض كل ساعة</div>
        <div className="bg-white/[0.08] backdrop-blur border border-white/10 rounded-2xl p-3 text-[12px] font-bold text-center leading-5">التوصيل حسب سياسة<br/>المتجر</div>
        <div className="bg-white/[0.08] backdrop-blur border border-white/10 rounded-2xl p-3 text-[12px] font-bold text-center leading-5">كوبونات جاهزة بنقرة</div>
      </div>
      <div className="mt-4 flex justify-center"><div className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 rounded-full px-4 py-1.5 text-[12px] font-bold">وفرت حتى الآن: {saved.toLocaleString()} ر.س</div></div>
    </div>

    {/* فلاتر */}
    <div className="px-3 mt-4 flex gap-2 overflow-auto no-scrollbar pb-1">
      {["الكل","نون","أمازون","جرير","إكسترا"].map(s=>(
        <button key={s} onClick={()=>setCat(s)} className={`h-10 px-5 rounded-full text-[13px] font-bold whitespace-nowrap border transition ${cat===s?"bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20":"bg-[#151B31] border-[#1E2744] text-slate-400"}`}>{s}</button>
      ))}
    </div>

    {/* عروض */}
    <div id="offers" className="grid grid-cols-2 gap-3 p-3">
      {OFFERS.filter(o=>cat==="الكل"||o.store===cat).map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded-[20px] overflow-hidden">
          <div className="relative h-[148px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full">-{o.disc}%-</span></div>
          <div className="p-3">
            <div className="text-[12px] font-bold leading-5 h-[40px] overflow-hidden">{o.title}</div>
            <div className="text-[11px] text-slate-400 mt-1">{o.ship}</div>
            <div className="flex gap-2 items-baseline mt-2"><b className="text-[15px]">{o.price} ر.س</b><s className="text-[11px] text-slate-500 line-through">{o.old}</s></div>
            <div className="mt-2.5 flex gap-2"><div className="flex-1 h-9 bg-[#0A1024] border border-dashed border-[#2A3655] rounded-xl flex items-center justify-center text-[11px] font-mono text-violet-300">{o.coupon}</div><button onClick={()=>{navigator.clipboard.writeText(o.coupon);show("نسخ "+o.coupon)}} className="w-14 h-9 bg-white text-violet-900 rounded-xl text-[12px] font-black">نسخ</button></div>
            <button className="mt-2.5 w-full h-10 bg-violet-600 rounded-xl text-[13px] font-bold">احصل على العرض</button>
          </div>
        </div>
      ))}
    </div>

    {/* قسم العقار الرسمي */}
    <div className="m-3 rounded-[20px] bg-[#10162F] border border-[#1E2A5A] p-4">
      <p className="text-[13px] leading-7 text-slate-200">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
      <p className="font-black text-amber-200 mt-1">(محسن الحكمي)</p>
      <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-3 block bg-[#0A1024] border border-[#1B2547] rounded-xl p-3 text-[11px] text-sky-300 break-all text-center">https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile</a>
    </div>

    {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-full text-[12px] z-50">{toast}</div>}

    {/* شيت الحراج */}
    {showHaraj && <><div onClick={()=>setShowHaraj(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"/><div className="fixed bottom-0 inset-x-0 z-50 bg-[#12182F] border-t border-[#1B2547] rounded-t-[22px] max-h-[80vh] flex flex-col"><div className="w-9 h-1 bg-[#2A3655] rounded-full mx-auto mt-3"/><div className="p-4 flex justify-between border-b border-[#1A2340]"><b>أفضل عروض الحراج</b><button onClick={()=>setShowHaraj(false)} className="w-8 h-8 rounded-xl bg-[#0A1024] border border-[#1B2547]">✕</button></div><div className="overflow-auto p-3 flex flex-col gap-2 pb-6">{harajF.map((h,i)=><div key={i} className="p-3 bg-[#0A1024] border border-[#1B2547] rounded-2xl"><div className="text-[13px] font-bold">{h.t}</div><div className="text-amber-300 font-black mt-1">{h.pr} • {h.city}</div></div>)}</div></div></>}

    {/* الذكاء الاقتصادي */}
    {showEcon && <><div onClick={()=>setShowEcon(false)} className="fixed inset-0 bg-black/70 z-50"/><div className="fixed inset-0 z-[60] bg-[#070A18] p-4 flex flex-col"><div className="flex justify-between items-center h-12 border-b border-[#1B2547]"><b>الذكاء الاقتصادي - المساعد الذكي</b><button onClick={()=>setShowEcon(false)} className="w-8 h-8 rounded-full bg-[#12182F] border border-[#1B2547]">✕</button></div><div className="flex-1 pt-6 space-y-4"><div className="bg-[#12182F] border border-[#1B2547] p-4 rounded-2xl text-[13px] leading-6">هلا يا محسن! أنا الذكاء الاقتصادي. أحلل لك العروض من نون وأمازون وجرير وأقولك وين أوفر سعر. قل ميزانيتك مثل: 500 ريال عطر، وأنا أجيب لك أرخص 3 خيارات مع كوبونات.</div><div className="grid grid-cols-2 gap-2"><div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[12px]"><b className="text-emerald-300">وفّر تلقائياً</b><br/>يقارن 5 متاجر بثانية</div><div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-[12px]"><b className="text-violet-300">كوبون ذكي</b><br/>يجيب كود خصم إضافي</div></div><button onClick={()=>{setShowEcon(false); show("تم تفعيل الذكاء الاقتصادي")}} className="h-12 bg-violet-600 rounded-full font-bold">ابدأ الآن</button></div></>}

  </div>
  )
    }
