"use client"
import { useEffect, useMemo, useState } from 'react'

type City = 'الرياض'|'جدة'|'مكة'|'الدمام'|'الخبر'|'القصيم'|'أبها'
type Offer = { id:number; title:string; store:string; price:number; old_price:number; discount:number; coupon:string; image:string; city:City; shipping:string }

const OFFERS: Offer[] = [
  { id:1, title:'عطور فاخرة - خصم حتى 75% + كوبون إضافي', store:'نون', price:149, old_price:599, discount:75, coupon:'ALHKMY75', image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', city:'الرياض', shipping:'شحن مجاني جدة والرياض' },
  { id:2, title:'صفقة اليوم - سماعة Anker عزل كامل', store:'أمازون', price:199, old_price:399, discount:50, coupon:'AMZ50', image:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', city:'الرياض', shipping:'توصيل اليوم' },
  { id:3, title:'ساعة RICEGGO بيبسي - إطار أحمر أزرق', store:'متجر حكيم', price:200, old_price:450, discount:56, coupon:'HKM56', image:'/watch-pepsi.jpg', city:'جدة', shipping:'شحن مجاني' },
  { id:4, title:'آيفون 15 - خصم جرير', store:'جرير', price:3299, old_price:4299, discount:23, coupon:'JARIR23', image:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', city:'الرياض', shipping:'توصيل مجاني' },
  { id:5, title:'قدر ضغط كهربائي', store:'إكسترا', price:249, old_price:499, discount:50, coupon:'EXTRA50', image:'https://images.unsplash.com/photo-1584269600519-112d071a9f1e?w=600', city:'الدمام', shipping:'توصيل اليوم' },
  { id:6, title:'مكيف صحراوي متنقل', store:'نون', price:399, old_price:799, discount:50, coupon:'COOL50', image:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', city:'جدة', shipping:'شحن مجاني' },
]

const STORES = ['الكل','نون','أمازون','جرير','إكسترا','كارفور','بنده']

export default function Page(){
  const [selectedStore,setSelectedStore]=useState('الكل')
  const [clientCity,setClientCity]=useState<City|null>(null)
  const [locationAsked,setLocationAsked]=useState(false)
  const [copied,setCopied]=useState<string|null>(null)
  const [cartCount,setCartCount]=useState(6)

  // كشف مدينة العميل إذا وافق على مشاركة الموقع
  const requestLocation = ()=>{
    setLocationAsked(true)
    if(!navigator.geolocation){ setClientCity('الرياض'); return }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const {latitude, longitude} = pos.coords
        // تقريب سريع لأكبر مدن السعودية
        let city:City = 'الرياض'
        if(latitude>21.0 && latitude<22.0 && longitude>38.5 && longitude<40.0) city='جدة'
        else if(latitude>26.0 && longitude>49.5) city='الدمام'
        else if(latitude<18.5) city='أبها'
        else if(latitude>24.5 && latitude<25.0 && longitude<47.0) city='الرياض'
        else city='الرياض'
        setClientCity(city)
        localStorage.setItem('client_city', city)
      },
      ()=>{ setClientCity('الرياض') },
      {enableHighAccuracy:false, timeout:5000}
    )
  }

  useEffect(()=>{ const saved=localStorage.getItem('client_city') as City|null; if(saved) {setClientCity(saved); setLocationAsked(true)} },[])

  const filtered = useMemo(()=>{
    let f=OFFERS
    if(selectedStore!=='الكل') f=f.filter(o=>o.store===selectedStore)
    if(clientCity) f=[...f.filter(o=>o.city===clientCity), ...f.filter(o=>o.city!==clientCity)] // مدينة العميل أولاً
    return f
  },[selectedStore,clientCity])

  const copyCoupon = (code:string)=>{ navigator.clipboard.writeText(code); setCopied(code); setTimeout(()=>setCopied(null),1500) }

  return (
    <div dir="rtl" className="min-h-screen bg-[#070A14] text-white pb-[90px]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap'); *{font-family:'Tajawal',system-ui} .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      {/* Top Status - نفس الصورة */}
      <div className="h-8 bg-[#6D28D9] flex items-center justify-center text-[11px] font-bold md:hidden">تم تحديث 5 متاجر • الآن</div>

      {/* Header مثل الصورة تماماً */}
      <header className="sticky top-0 z-30 bg-[#0A0D1A]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-3 h-[64px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button className="h-11 w-11 rounded-2xl bg-[#141A2E] border border-white/5 grid place-items-center text-white/70">🛒</button>
            <button className="relative h-11 px-4 rounded-2xl bg-gradient-to-b from-[#FFB800] to-[#FF8A00] text-black font-black text-[12px] flex flex-col items-center justify-center leading-none shadow-[0_4px_12px_rgba(255,184,0,0.3)]">
              <span className="text-[18px]">🚙</span><span className="text-[10px] mt-0.5">الحراج</span>
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white border-2 border-[#FFB800] rounded-full grid place-items-center text-[11px]">{cartCount}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-8 px-3 rounded-full bg-[#1A1F2E] border border-[#FFC94D]/20 text-[#FFC94D] text-[11px] font-bold grid place-items-center">فال مرخص</span>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-pulse" /><span className="font-black text-[16px]">حكيم</span></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 pt-3 space-y-4">
        {/* Hero Banner - نفس الصورة بالضبط */}
        <section className="relative rounded-[28px] overflow-hidden p-[1px] bg-gradient-to-b from-[#8B5CF6]/30 to-transparent">
          <div className="rounded-[27px] bg-gradient-to-br from-[#1E1042] via-[#2A1A6B] to-[#1B1246] p-5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.35),transparent_60%)]" />
            <div className="relative">
              <h1 className="font-black text-[22px] leading-[30px] text-center">متجر حكيم - عروضكم<br/><span className="bg-gradient-to-r from-[#FFE082] to-[#FFD54F] bg-clip-text text-transparent">أقوى عروض اليوم في السعودية في</span><br/>مكان واحد!</h1>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {[
                  {t:'أيقونات ذكاء', s:'اصطناعي', icon:'⭐', bg:'from-[#8B5CF6] to-[#7C3AED]'},
                  {t:'يجلب العروض كل', s:'ساعة', icon:'⏰', bg:'from-[#10B981] to-[#059669]'},
                  {t:'كوبونات جاهزة بنقرة', s:'', icon:'🎟️', bg:'from-[#0EA5E9] to-[#0284C7]'},
                  {t:'شحن مجاني جدة', s:'والرياض', icon:'🚚', bg:'from-[#F59E0B] to-[#D97706]'},
                ].map((f,i)=><div key={i} className="h-[64px] rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur flex items-center gap-2.5 px-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.bg} grid place-items-center text-white text-[16px] shrink-0`}>{f.icon}</div>
                  <div className="text-[12px] font-bold leading-[16px]"><div>{f.t}</div>{f.s&&<div className="opacity-80">{f.s}</div>}</div>
                </div>)}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="h-[48px] rounded-full bg-black/40 border border-white/10 grid place-items-center text-center px-3"><span className="text-[12px] font-bold">خفيف وسريع - 4.8KB فقط</span></div>
                <div className="h-[48px] rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#06B6D4]/20 border border-[#10B981]/30 grid place-items-center text-center px-3"><span className="text-[13px] font-black bg-gradient-to-r from-[#6EE7B7] to-[#67E8F9] bg-clip-text text-transparent">وفرت حتى الآن: 1,240 ر.س</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* شريط المدينة - يظهر فقط إذا وافق على الموقع */}
        {!locationAsked ? (
          <button onClick={requestLocation} className="w-full h-12 rounded-2xl bg-[#141A2E] border border-dashed border-[#8B5CF6]/40 text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#1A2040] transition">
            📍 شارك موقعك لعرض عروض <span className="text-[#8B5CF6]">مدينتك أولاً</span> <span className="text-[10px] bg-[#8B5CF6] text-white px-2 h-5 rounded-full grid place-items-center">جديد</span>
          </button>
        ) : clientCity ? (
          <div className="h-11 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#06B6D4]/20 border border-[#8B5CF6]/30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-[13px]"><span className="w-7 h-7 rounded-full bg-[#8B5CF6] text-white grid place-items-center">📍</span><span className="font-bold">عروض {clientCity}</span><span className="text-[11px] text-white/60">• تظهر أولاً لأنك شاركت موقعك</span></div>
            <button onClick={()=>{setClientCity(null); setLocationAsked(false); localStorage.removeItem('client_city')}} className="text-[11px] text-white/50 underline">إيقاف</button>
          </div>
        ) : null}

        {/* فلتر المتاجر - مثل الصورة */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
          {STORES.map(s=>{
            const active=selectedStore===s
            return <button key={s} onClick={()=>setSelectedStore(s)} className={`whitespace-nowrap h-10 px-5 rounded-full border text-[13px] font-bold transition ${active?'bg-[#7C3AED] text-white border-[#7C3AED] shadow-[0_4px_12px_rgba(124,58,237,0.4)]':'bg-[#141A2E] border-white/5 text-white/60 hover:bg-[#1A2040] hover:text-white/90'}`}>{s}</button>
          })}
          <button className="whitespace-nowrap h-10 px-4 rounded-full bg-[#141A2E] border border-white/5 text-white/40 text-[12px]">كازا ...</button>
        </div>

        {/* شبكة العروض - نفس تصميم الصورة */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(o=>{
            const isClientCity = clientCity && o.city===clientCity
            return (
              <div key={o.id} className={`rounded-[22px] overflow-hidden border bg-[#101427] flex flex-col ${isClientCity?'border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]':'border-white/5'}`}>
                <div className="relative h-[148px] bg-white overflow-hidden">
                  <img src={o.image} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600'}} />
                  <span className="absolute top-2.5 left-2.5 bg-[#00C896] text-white text-[12px] font-black px-3 h-7 rounded-full grid place-items-center shadow">-{o.discount}%-</span>
                  <span className={`absolute bottom-2.5 right-2.5 h-7 px-3 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold grid place-items-center ${isClientCity?'!bg-[#7C3AED]' :''}`}>{isClientCity?`📍 ${o.city} • قريب منك`:`${o.store==='نون'?'نون':'أمازون'}`}</span>
                  {isClientCity&&<span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#BEF264] rounded-full shadow-[0_0_6px_#BEF264] animate-pulse" />}
                </div>
                <div className="p-3 flex-1 flex flex-col bg-[#101427]">
                  <h3 className="font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</h3>
                  <div className="mt-1.5 text-[11px] text-[#6EE7B7] font-bold">{o.shipping}</div>
                  <div className="mt-2 flex items-baseline gap-2"><span className="font-black text-[16px]">{o.price} ر.س</span><span className="text-[11px] line-through text-white/30">{o.old_price}</span></div>

                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 h-9 rounded-full bg-[#0A0E1A] border border-dashed border-white/15 flex items-center justify-center text-[12px] font-mono font-bold tracking-widest text-white/70">{o.coupon}</div>
                    <button onClick={()=>copyCoupon(o.coupon)} className={`h-9 px-4 rounded-full font-black text-[12px] transition ${copied===o.coupon?'bg-[#10B981] text-white':'bg-white text-[#4C1D95] hover:bg-zinc-100'}`}>{copied===o.coupon?'تم ✓':'نسخ'}</button>
                  </div>
                  <button className="mt-2 w-full h-10 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-[13px] shadow-[0_6px_16px_rgba(124,58,237,0.3)] transition">احصل على العرض</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <nav className="fixed bottom-0 inset-x-0 h-[72px] bg-[#070A14]/90 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-2 z-30">
        <button className="flex flex-col items-center gap-1 text-[#8B5CF6]"><span className="text-[18px]">🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>🗺️</span><span className="text-[10px]">الخريطة</span></button>
        <button className="flex flex-col items-center -mt-4"><span className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white grid place-items-center text-xl shadow-lg">🤖</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>🔔</span><span className="text-[10px]">تنبيهاتي</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>⚙️</span><span className="text-[10px]">مكتبي</span></button>
      </nav>
    </div>
  )
}
