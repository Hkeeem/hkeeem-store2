"use client"
import { useEffect, useState } from "react"

const CATS=["الكل","سوبرماركت","مطاعم","إلكترونيات","صيدلية","الحراج"]
const CITIES=["الكل","الرياض","جدة","أبها"]

export default function Page(){
 const [city,setCity]=useState("الكل")
 const [cat,setCat]=useState("الكل")
 const [offers,setOffers]=useState<any[]>([])
 const [cart,setCart]=useState(0)
 const [toast,setToast]=useState("")
 const [locGranted,setLocGranted]=useState(false)

 useEffect(()=>{
  fetch(`/api/offers?city=${city}`).then(r=>r.json()).then(d=>{
   if(Array.isArray(d)&&d.length>0) setOffers(d)
   else setOffers([
    {id:1,title:"بيتزا كبيرة + مشروب",price:42,old_price:85,discount:51,store:"جاهز",category:"مطاعم",city:"الرياض",image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"},
    {id:2,title:"أرز أبو كاس 10 كجم",price:45,old_price:87,discount:48,store:"العثيم",category:"سوبرماركت",city:"الرياض",image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"},
   ])
  })
 },[city])

 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(""),2000)}
 const askLocation=()=>{
  if(!navigator.geolocation){show("المتصفح لا يدعم الموقع"); return}
  navigator.geolocation.getCurrentPosition(()=>{setLocGranted(true); show("تم السماح بالموقع ✅")},()=>show("رفضت الموقع"))
 }

 const filtered=cat==="الكل"?offers:offers.filter((o:any)=>o.category===cat || o.cat===cat)

 return (
 <div dir="rtl" className="min-h-screen bg-[#fefcf5] text-zinc-900">
  {/* HEADER - بدون حكيم، دخول بجانب الموقع */}
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
   <div className="max-w-7xl mx-auto px-4 h-[64px] flex justify-between items-center">
    <div className="font-black text-[20px]">عروض<span className="text-[#FF6B00]">كم</span></div>
    <div className="flex gap-2 items-center">
     <button onClick={askLocation} className={`h-9 px-3 rounded-full text-xs font-bold border ${locGranted?"bg-green-50 border-green-200 text-green-700":"bg-white border-zinc-200"}`}>{locGranted?"📍 "+city:"📍 السماح بالموقع"}</button>
     <button onClick={()=>show("تسجيل الدخول قريبا")} className="h-9 px-4 rounded-full bg-black text-white text-xs font-bold">دخول</button>
     <div className="h-9 px-3 rounded-full bg-zinc-100 flex items-center text-xs font-bold">🛒 {cart}</div>
    </div>
   </div>
  </header>

  {/* HERO بدون كلمة حكيم */}
  <div className="max-w-7xl mx-auto px-3 mt-4">
   <div className="rounded-[28px] bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#f4a261] p-6 text-white relative overflow-hidden">
    <h1 className="text-[22px] font-extrabold leading-[1.3]">كل عروض المملكة<br/><span className="text-[#fef3c7]">في مكان واحد.</span></h1>
    <p className="text-[12px] opacity-90 mt-2 max-w-[85%] leading-6">نقارن لك الأسعار ونحدثها كل يوم عشان توفر أكثر.</p>
    <div className="grid grid-cols-4 gap-2 mt-5">
     <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">+14</div><div className="text-[10px] opacity-80">متجر</div></div>
     <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">60%</div><div className="text-[10px] opacity-80">توفير</div></div>
     <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">24/7</div><div className="text-[10px] opacity-80">تحديث</div></div>
     <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-3 text-center"><div className="font-black">AI</div><div className="text-[10px] opacity-80">ذكاء</div></div>
    </div>
   </div>
  </div>

  {/* CITIES */}
  <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-2 overflow-x-auto">
   {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} className={`h-8 px-3 rounded-full text-xs border whitespace-nowrap ${city===c?"bg-black text-white border-black":"bg-white border-zinc-200"}`}>{c}</button>)}
  </div>

  {/* CATS */}
  <div className="max-w-7xl mx-auto px-4 mt-4 flex gap-3 overflow-x-auto">
   {CATS.map(c=><button key={c} onClick={()=>{if(c==="الحراج") window.open("https://haraj.com.sa/tags/حرق_اسعار","_blank"); else setCat(c)}} className="flex flex-col items-center min-w-[64px]">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl border ${cat===c?"bg-[#FF6B00] text-white border-[#FF6B00]":"bg-white border-zinc-200"}`}>{c==="سوبرماركت"?"🛒":c==="مطاعم"?"🍽️":c==="إلكترونيات"?"💻":c==="صيدلية"?"💊":c==="الحراج"?"🚗":"✨"}</div>
    <span className="text-[11px] mt-1">{c}</span>
   </button>)}
  </div>

  {/* OFFERS */}
  <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 pb-24">
   {filtered.map((o:any)=><div key={o.id} className="bg-white rounded-2xl border overflow-hidden">
    <img src={o.image} className="h-28 w-full object-cover"/>
    <div className="p-3">
     <div className="text-[11px] text-zinc-500">{o.store}</div>
     <div className="font-bold text-[13px] leading-5 h-[40px] overflow-hidden">{o.title}</div>
     <div className="flex justify-between items-center mt-2"><span className="font-black text-emerald-700">{o.price} ر.س</span><span className="text-[11px] line-through text-zinc-400">{o.old_price||o.old}</span></div>
     <button onClick={()=>{setCart(c=>c+1); show("أضيف للسلة")}} className="w-full mt-2 h-8 rounded-full bg-black text-white text-xs font-bold">أضف</button>
    </div>
   </div>)}
  </div>

  {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full text-xs z-50">{toast}</div>}
 </div>
 )
}
