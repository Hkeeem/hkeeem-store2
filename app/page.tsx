"use client"
import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase/client'
const CATS = [
  { n: "الكل", i: "✨" },
  { n: "سوبرماركت", i: "🛒" },
  { n: "مطاعم", i: "🍽️" },
  { n: "إلكترونيات", i: "📱" },
  { n: "أزياء", i: "👗" },
  { n: "سفر", i: "✈️" },
]
const CITIES = ["الكل", "الرياض", "جدة", "أبها", "الدمام"]

const FALLBACK = [
  { id: 1, title: "بيتزا كبيرة + مشروب", price: 42, old_price: 85, discount: 51, store: "جاهز", category: "مطاعم", city: "الرياض", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600" },
  { id: 2, title: "أرز أبو كاس 10 كجم", price: 45, old_price: 87, discount: 48, store: "العثيم", category: "سوبرماركت", city: "الرياض", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600" },
  { id: 3, title: "آيباد برو M2 12.9", price: 2199, old_price: 3999, discount: 45, store: "جرير", category: "إلكترونيات", city: "جدة", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
  { id: 4, title: "سلة التوفير الكبرى", price: 89, old_price: 199, discount: 55, store: "بنده", category: "سوبرماركت", city: "جدة", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" },
]

export default function Page() {
  const [city, setCity] = useState("الكل")
  const [cat, setCat] = useState("الكل")
  const [offers, setOffers] = useState<any[]>(FALLBACK)
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState("")
  const [locGranted, setLocGranted] = useState(false)

  useEffect(() => {
    fetch(`/api/offers?city=${encodeURIComponent(city)}`).then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setOffers(d) })
  }, [city])

  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2200) }
  const askLocation = ()=>{
    if(!navigator.geolocation){ show("المتصفح لا يدعم"); return }
    navigator.geolocation.getCurrentPosition(()=>{ setLocGranted(true); show("تم تفعيل الموقع ✅") },()=>show("لم يتم السماح"))
  }
  const filtered = cat==="الكل"? offers : offers.filter((o:any)=>o.category===cat)

  return (
    <div dir="rtl" className="min-h-screen bg-[#fefcf5] text-zinc-900">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700;800&display=swap'); *{font-family:'Tajawal',sans-serif}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      {/* هيدر بدون حكيم، دخول بجانب الموقع */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#f0e6d3]">
        <div className="max-w-7xl mx-auto px-4 h-[64px] flex justify-between items-center">
          <div className="font-black text-[22px]">عروض<span className="text-[#FF6B00]">كم</span></div>
          <div className="flex items-center gap-2">
            <button onClick={askLocation} className={`h-9 px-3.5 rounded-full text-[12px] font-bold border ${locGranted?"bg-green-50 border-green-200 text-green-700":"bg-white border-zinc-200"}`}>{locGranted?`📍 ${city}`:"📍 السماح بالموقع"}</button>
            <button onClick={()=>show("تسجيل الدخول قريبا")} className="h-9 px-5 rounded-full bg-black text-white text-[12px] font-bold">دخول</button>
            <div className="h-9 min-w-[44px] px-3 rounded-full bg-zinc-100 border flex items-center justify-center text-[12px] font-bold">🛒 {cart}</div>
          </div>
        </div>
      </header>

      {/* هيرو بدون حكيم وبدون فال والحراج */}
      <div className="max-w-7xl mx-auto px-3 mt-4">
        <div className="rounded-[24px] bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#f4a261] p-6 text-white">
          <h1 className="text-[26px] font-extrabold leading-[1.25]">كل عروض المملكة<br/><span className="text-[#fef3c7]">في مكان واحد.</span></h1>
          <p className="text-[13px] opacity-90 mt-2 max-w-[90%] leading-6">نقارن لك الأسعار من بنده والعثيم وجرير وغيرهم.</p>
          <div className="grid grid-cols-4 gap-2 mt-6">
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">+14</div><div className="text-[10px] opacity-80">متجر</div></div>
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">60%</div><div className="text-[10px] opacity-80">توفير</div></div>
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">24/7</div><div className="text-[10px] opacity-80">تحديث</div></div>
            <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">AI</div><div className="text-[10px] opacity-80">ذكاء</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} className={`h-8 px-4 rounded-full text-[12px] border whitespace-nowrap ${city===c?"bg-black text-white border-black":"bg-white border-zinc-200"}`}>{c}</button>)}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-5 flex gap-3.5 overflow-x-auto no-scrollbar">
        {CATS.map(c=>{const active=cat===c.n; return <button key={c.n} onClick={()=>setCat(c.n)} className="flex flex-col items-center min-w-[64px]"><div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-[22px] border ${active?"bg-[#FF6B00] text-white border-[#FF6B00]":"bg-white border-[#f0e6d3]"}`}>{c.i}</div><span className="text-[11px] mt-1.5">{c.n}</span></button>})}
      </div>

      <div id="offers" className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pb-28">
        {filtered.map((o:any)=><div key={o.id} className="bg-white rounded-2xl border border-[#f0e6d3] overflow-hidden"><img src={o.image} className="h-[118px] w-full object-cover"/><div className="p-3"><div className="text-[11px] text-zinc-500">{o.store}</div><div className="font-bold text-[12.5px] h-[40px] overflow-hidden">{o.title}</div><div className="flex items-center gap-2 mt-2"><span className="font-black text-emerald-700">{o.price} ر.س</span><span className="text-[11px] line-through text-zinc-400">{o.old_price} ر.س</span></div><button onClick={()=>{setCart(c=>c+1); show("أضيف للسلة")}} className="w-full mt-2 h-8 rounded-full bg-black text-white text-[11px] font-bold">أضف</button></div></div>)}
      </div>
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-5 py-3 rounded-full text-[12px] z-[99]">{toast}</div>}
    </div>
  )
}
