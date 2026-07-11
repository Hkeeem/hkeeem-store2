"use client"
import { useState, useEffect } from "react"

const OFFERS = [
  { id:1, store:"نون", title:"عطور فاخرة - خصم حتى 75% + كوبون إضافي", price:149, old:599, disc:75, coupon:"ALHKMY75", cat:"عطور", ship:"شحن مجاني جدة والرياض", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", title:"صفقة اليوم - سماعة Anker عزل كامل", price:199, old:399, disc:50, coupon:"AMZ50", cat:"تقنية", ship:"توصيل اليوم", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:3, store:"جرير", title:"جوال سامسونج - ضمان سنتين جرير", price:2199, old:2999, disc:26, coupon:"JARIR100", cat:"جوالات", ship:"ضمان سنتين", img:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600" },
  { id:4, store:"إكسترا", title:"ثلاجة LG - تقسيط بدون فوائد", price:2899, old:4299, disc:32, coupon:"EXTRA20", cat:"أجهزة", ship:"تركيب مجاني", img:"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600" },
  { id:5, store:"كارفور", title:"سلة مقاضي الشهر - توفير كبير", price:89, old:149, disc:40, coupon:"CAR40", cat:"سوبرماركت", ship:"توصيل ساعة", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" },
]

const PROPERTIES = [
  { t:"شقة 4 غرف - جدة الحمراء", city:"جدة", area:"180م²", price:"850,000 ر.س", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" },
  { t:"فيلا مودرن - مكة الشوقية", city:"مكة", area:"350م²", price:"1,250,000 ر.س", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" },
  { t:"شقة للتمليك - جدة الروضة", city:"جدة", area:"140م²", price:"620,000 ر.س", img:"https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600" },
  { t:"فيلا بمسبح - جدة أبحر", city:"جدة", area:"500م²", price:"1,950,000 ر.س", img:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600" },
]

const HARAJ = [
  { t:"سييرا 2026 حرق 169 ألف - نضمن أرخص سعر", pr:"169,000 ر.س", city:"الرياض" },
  { t:"اكسنت 2026 سمارت حرق يا بلاش", pr:"59,900 ر.س", city:"الرياض" },
  { t:"النترا 2026 فل كامل", pr:"78,500 ر.س", city:"الرياض" },
  { t:"فيلا بمسبح طيبة الرحيلي", pr:"1,750,000 ر.س", city:"جدة" },
  { t:"مرسيدس C200 2026", pr:"105,999 ر.س", city:"الرياض" },
  { t:"تظليل 3M -45%", pr:"1,722 ر.س", city:"جدة" },
]

export default function Page(){
  const [cat,setCat]=useState("الكل")
  const [city,setCity]=useState("الكل")
  const [showHaraj,setShowHaraj]=useState(false)
  const [showAI,setShowAI]=useState(false)
  const [budget,setBudget]=useState("")
  const [cart,setCart]=useState(0)
  const [toast,setToast]=useState("")
  const [saved,setSaved]=useState(1240)

  useEffect(()=>{ const i=setInterval(()=>setSaved(s=>s+ Math.floor(Math.random()*3)), 8000); return ()=>clearInterval(i)},[])

  const filtered = cat==="الكل"? OFFERS : OFFERS.filter(o=>o.store===cat || o.cat===cat)
  const harajFiltered = city==="الكل"? HARAJ : HARAJ.filter(h=>h.city===city)
  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2000)}

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white selection:bg-violet-500/30">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}`}</style>

    {/* Header */}
    <header className="sticky top-0 z-30 bg-[#070A18]/90 backdrop-blur-xl border-b border-[#161D36] h-[60px] flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <div className="font-black text-[17px]">حكيم <span className="text-violet-400">.</span></div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold">فال مرخص</span>
        <span className="hidden md:flex h-7 px-3 rounded-full bg-violet-600/15 border border-violet-500/20 text-violet-300 text-[11px] font-bold items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.5 5.8 21l2.4-7.3L2 9.2h7.6z"/></svg> تصميم ملكي بنفسجي
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={()=>setShowHaraj(true)} className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-amber-300 to-amber-600 flex flex-col items-center justify-center relative shadow-lg">
          <span className="absolute -top-1 -right-1 bg-black text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-400">{harajFiltered.length}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>
          <span className="text-[7px] font-black text-black">الحراج</span>
        </button>
        <button className="w-10 h-10 rounded-xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center relative">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B9AC3" strokeWidth="1.8"><path d="M6 6h15l-1.5 9h-13z"/><path d="M6 6L5 2H1"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
          {cart>0&&<span className="absolute -top-1 -left-1 bg-violet-600 text-white text-[9px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center">{cart}</span>}
        </button>
      </div>
    </header>

    {/* Hero - عروضكم */}
    <div className="m-3 rounded-[24px] bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#0f172a] border border-[#2a235a] p-5 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-40 h-40 bg-violet-500/20 blur-[60px] rounded-full"/>
      <h1 className="text-[20px] font-black leading-7">متجر حكيم - عروضكم<br/><span className="text-amber-200">أقوى عروض اليوم في السعودية في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 rounded-xl p-2.5"><span className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 16.5 5.8 21l2.4-7.3L2 9.2h7.6z"/></svg></span>أيقونات ذكاء اصطناعي</div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl p-2.5"><span className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">⏰</span>يجلب العروض كل ساعة</div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl p-2.5"><span className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">🎟️</span>كوبونات جاهزة بنقرة</div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl p-2.5"><span className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">🚚</span>شحن مجاني جدة والرياض</div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="text-[12px] bg-black/30 border border-white/10 rounded-full px-3 py-1.5">خفيف وسريع - 4.8KB فقط</div>
        <div className="text-[12px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 rounded-full px-3 py-1.5 font-bold">وفرت حتى الآن: {saved.toLocaleString()} ر.س</div>
      </div>
    </div>

    {/* Stores */}
    <div className="px-3 flex gap-2 overflow-auto pb-1 scrollbar-hide">
      {["الكل","نون","أمازون","جرير","إكسترا","كارفور"].map(s=>(
        <button key={s} onClick={()=>setCat(s)} className={`h-9 px-4 rounded-full text-[12px] font-bold whitespace-nowrap border transition ${cat===s?"bg-violet-600 border-violet-600 text-white":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{s}</button>
      ))}
    </div>

    {/* Offers Grid */}
    <div className="grid grid-cols-2 gap-2.5 p-3">
      {filtered.map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded-[18px] overflow-hidden flex flex-col">
          <div className="relative h-[132px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute top-2 left-2 bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded-full">-{o.disc}%</span><span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full border border-white/10">{o.store}</span></div>
          <div className="p-2.5 flex flex-col flex-1">
            <div className="text-[12px] font-bold leading-5 h-[40px] overflow-hidden">{o.title}</div>
            <div className="text-[10px] text-emerald-300 mt-1">{o.ship}</div>
            <div className="flex items-baseline gap-2 mt-1.5"><b className="text-[14px]">{o.price} ر.س</b><s className="text-[10px] text-slate-500 line-through">{o.old}</s></div>
            <div className="mt-2 flex gap-1.5"><div className="flex-1 h-8 bg-[#0A1024] border border-dashed border-[#2A3655] rounded-xl flex items-center justify-center text-[11px] font-mono text-violet-300">{o.coupon}</div><button onClick={()=>{navigator.clipboard.writeText(o.coupon); show("نسخنا الكوبون "+o.coupon)}} className="w-14 h-8 bg-white text-violet-900 rounded-xl text-[11px] font-black">نسخ</button></div>
            <button onClick={()=>{setCart(c=>c+1); show("أضيف للسلة") }} className="mt-2 w-full h-9 bg-violet-600 hover:bg-violet-500 rounded-xl text-[12px] font-bold">احصل على العرض</button>
          </div>
        </div>
      ))}
    </div>

    {/* Real Estate */}
    <div className="mt-2 px-3 flex justify-between items-center"><h3 className="font-extrabold text-[14px]">مكتبي العقاري - 4 عقارات - شقق وفلل جدة ومكة</h3><span className="text-[11px] text-slate-400">مرخص فال</span></div>
    <div className="grid grid-cols-2 gap-2.5 p-3">
      {PROPERTIES.map((p,i)=>(
        <div key={i} className="bg-[#12182F] border border-[#1B2547] rounded-[18px] overflow-hidden"><div className="h-28 relative"><img src={p.img} className="w-full h-full object-cover"/><span className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[9px] px-2 py-1 rounded-full border border-white/10">{p.city}</span></div><div className="p-2.5"><div className="text-[12px] font-bold leading-5 h-9 overflow-hidden">{p.t}</div><div className="text-[10px] text-slate-400 mt-1">{p.area}</div><div className="text-[13px] font-black text-amber-300 mt-1">{p.price}</div></div></div>
      ))}
    </div>

    {/* Assistant وفر */}
    <div className="m-3 rounded-[20px] bg-[#12182F] border border-[#1B2547] p-4">
      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div><b className="text-[14px]">المساعد وفر</b><span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">AI</span></div>
      <p className="text-[12px] text-slate-400 mt-2 leading-6">قل ميزانيتك ويختار لك أفضل عرض - يقارن بين نون وامازون وجرير تلقائياً</p>
      <div className="flex gap-2 mt-3"><input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="مثال: 500 ر.س لعطر" className="flex-1 h-11 bg-[#0A1024] border border-[#1B2547] rounded-full px-4 text-[13px] outline-none"/><button onClick={()=>setShowAI(true)} className="h-11 px-5 rounded-full bg-violet-600 text-white font-bold text-[12px]">اسأل</button></div>
    </div>

    {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-full text-[12px] z-50">{toast}</div>}

    {showHaraj && <div onClick={()=>setShowHaraj(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"/>}
    <div className={`fixed bottom-0 left-0 right-0 z-50 bg-[#12182F] border-t border-[#1B2547] rounded-t-[22px] max-h-[82vh] flex flex-col transition-transform duration-300 ${showHaraj?"translate-y-0":"translate-y-full"}`}>
      <div className="w-9 h-1 bg-[#2A3655] rounded-full mx-auto mt-3"/>
      <div className="p-4 flex justify-between items-center border-b border-[#1A2340]"><div><div className="font-extrabold">أفضل عروض الحراج</div><div className="text-[11px] text-slate-400">حرق أسعار - مباشر من haraj.com.sa</div></div><button onClick={()=>setShowHaraj(false)} className="w-8 h-8 rounded-xl bg-[#0A1024] border border-[#1B2547]">✕</button></div>
      <div className="flex gap-1.5 p-3 overflow-auto">{["الكل","الرياض","جدة"].map(c=> <button key={c} onClick={()=>setCity(c)} className={`h-8 px-3 rounded-full text-[11px] font-bold border whitespace-nowrap ${city===c?"bg-amber-400 border-amber-400 text-black":"bg-[#0A1024] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
      <div className="overflow-auto p-2.5 flex flex-col gap-2 pb-6">{harajFiltered.map((h,i)=><div key={i} onClick={()=>window.open("https://haraj.com.sa/tags/حرق_اسعار","_blank")} className="flex gap-3 p-3 bg-[#0A1024] border border-[#1B2547] rounded-2xl cursor-pointer"><div className="w-11 h-11 rounded-xl bg-[#151B31] flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B9AC3" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg></div><div className="flex-1"><div className="text-[12px] font-bold leading-5">{h.t}</div><div className="text-[13px] font-black text-amber-300 mt-1">{h.pr}</div><div className="text-[10px] text-slate-400 mt-1">📍 {h.city}</div></div><div className="text-[10px] text-violet-400 font-bold self-center">افتح</div></div>)}</div>
    </div>

    {showAI && <div className="fixed inset-0 z-[60] bg-[#070A18] p-3 flex flex-col"><div className="flex justify-between items-center h-12 border-b border-[#1B2547]"><b>المساعد وفر - يقارن لك</b><button onClick={()=>setShowAI(false)} className="w-8 h-8 rounded-full bg-[#12182F] border">✕</button></div><div className="flex-1 overflow-auto py-4 space-y-3"><div className="bg-[#12182F] border border-[#1B2547] p-3 rounded-2xl rounded-br-sm text-[13px] max-w-[85%]">هلا! قل ميزانيتك، مثال: 300 ر.س لعطر، وأنا أقارن بين نون وامازون وجرير وأجيب لك أرخص واحد مع كوبون.</div>{budget && <div className="bg-violet-600 text-white p-3 rounded-2xl rounded-bl-sm text-[13px] max-w-[85%] mr-auto">ميزانيتي {budget}</div>}{budget && <div className="bg-[#12182F] border border-[#1B2547] p-3 rounded-2xl text-[13px]">أرخص خيار: <b>نون - 149 ر.س</b> بعد كوبون ALHKMY75، أمازون 179 ر.س، جرير 210 ر.س. وفّرت لك {(210-149)} ر.س!</div>}</div><div className="flex gap-2 pt-2 border-t border-[#1B2547]"><input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="اكتب ميزانيتك..." className="flex-1 h-11 bg-[#12182F] border border-[#1B2547] rounded-full px-4 text-[13px] outline-none"/><button onClick={()=>show("تم الحفظ")} className="h-11 px-5 rounded-full bg-violet-600 font-bold">إرسال</button></div></div>}
  </div>
  )
    }
