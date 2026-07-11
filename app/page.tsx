"use client"
import { useState, useEffect } from "react"

const CITIES=["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك"]
const STORES=["الكل","نون","أمازون","جرير","إكسترا"]
const CITY_COORDS:any={"الرياض":[24.71,46.67],"جدة":[21.54,39.17],"مكة":[21.38,39.85],"المدينة":[24.46,39.61],"الدمام":[26.42,50.08],"أبها":[18.21,42.5]}

const FALLBACK=[
 {id:1,store:"نون",city:"الرياض",title:"عطور فاخرة خصم حتى 75%",price:149,image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600"},
 {id:2,store:"جرير",city:"الكل",title:"آيباد وسماعات عروض قوية",price:2199,image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"},
]

function nearest(lat:number,lng:number){
 let best="الرياض",d=Infinity
 for(const k in CITY_COORDS){const c=CITY_COORDS[k];const cur=Math.hypot(lat-c[0],lng-c[1]);if(cur<d){d=cur;best=k}}
 return best
}

export default function Page(){
 const [city,setCity]=useState("الكل")
 const [store,setStore]=useState("الكل")
 const [loc,setLoc]=useState<"idle"|"loading"|"granted"|"denied">("idle")
 const [myCity,setMyCity]=useState<string|null>(null)
 const [offers,setOffers]=useState<any[]>(FALLBACK)
 const [login,setLogin]=useState(false)
 const [toast,setToast]=useState("")

 useEffect(()=>{
  const s=localStorage.getItem("hakeem_city")
  if(s){setMyCity(s);setLoc("granted")}
 },[])

 useEffect(()=>{
  fetch(`/api/offers?city=${encodeURIComponent(city)}`).then(r=>r.ok?r.json():null).then(d=>{if(d&&Array.isArray(d)&&d.length>0)setOffers(d)}).catch(()=>{})
 },[city])

 const ask=()=>{
  if(!navigator.geolocation)return
  setLoc("loading")
  navigator.geolocation.getCurrentPosition(p=>{
   const n=nearest(p.coords.latitude,p.coords.longitude)
   setMyCity(n);setLoc("granted");localStorage.setItem("hakeem_city",n);setToast("تم حفظ "+n)
  },()=>setLoc("denied"),{enableHighAccuracy:true,timeout:9000})
 }

 const filtered=offers.filter((o:any)=>(store==="الكل"||o.store===store)&&(city==="الكل"||o.city===city||o.city==="الكل"))

 return(
 <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

  <div className="mx-3 pt-4 flex gap-2.5">
   <button onClick={()=>setLogin(true)} className="h-14 w-20 rounded-2xl bg-[#151B31] border border-[#1E2744] font-black text-sm">دخول</button>
   {loc==="idle"&&<button onClick={ask} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] flex items-center justify-between px-3.5"><div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">📍</span><div className="text-right"><div className="font-black text-sm">السماح بمعرفة موقعك</div><div className="text-xs text-violet-200">عشان نجيب العروض القريبة</div></div></div><span className="w-7 h-7 rounded-full bg-white text-violet-700 flex items-center justify-center">‹</span></button>}
   {loc==="loading"&&<div className="flex-1 h-14 rounded-2xl bg-[#12182F] border border-[#1B2547] flex items-center justify-center text-sm">جاري التحديد...</div>}
   {loc==="granted"&&myCity&&<div className="flex-1 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between px-4"><span className="text-sm font-bold text-emerald-300">موقعك: {myCity} ✓</span><button onClick={()=>{localStorage.removeItem("hakeem_city");setMyCity(null);setCity("الكل");setLoc("idle")}} className="text-xs underline text-slate-400">تغيير</button></div>}
   {loc==="denied"&&<div className="flex-1 h-14 rounded-2xl bg-red-500/10 border flex items-center justify-between px-4"><span className="text-sm text-red-300">تم الرفض</span><button onClick={ask} className="h-8 px-3 rounded-full bg-white text-black text-xs font-bold">حاول</button></div>}
  </div>

  <div className="px-3 py-3 grid grid-cols-4 gap-2">
   <div className="h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-center">الذكاء<br/>الاقتصادي</div>
   <div className="h-20 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-black font-black flex items-center justify-center">الحراج</div>
   <div className="h-20 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xs font-bold">عروضكم</div>
   <div className="h-20 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">متجر<br/>حكيم</div>
  </div>

  <div className="mx-3 rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#3b1f8a] to-[#1e1040] border border-[#2a1f5a] p-5 text-center"><h1 className="font-black">عروضكم<br/><span className="text-amber-200 text-sm">أقوى عروض اليوم في مكان واحد!</span></h1></div>

  <div className="px-3 mt-4 flex gap-2 overflow-auto no-scrollbar">{CITIES.map(c=><button key={c} onClick={()=>{setCity(c);if(c!=="الكل"){localStorage.setItem("hakeem_city",c);setMyCity(c);setLoc("granted")}}} className={`h-8 px-3.5 rounded-full text-xs font-bold border whitespace-nowrap ${city===c?"bg-white text-black":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div>
  <div className="px-3 mt-2 flex gap-2 overflow-auto no-scrollbar">{STORES.map(s=><button key={s} onClick={()=>setStore(s)} className={`h-8 px-4 rounded-full text-xs font-bold border ${store===s?"bg-violet-600 border-violet-600":"bg-[#151B31] border-[#1E2744] text-slate-400"}`}>{s}</button>)}</div>

  <div className="grid grid-cols-2 gap-2.5 p-3 pb-24">{filtered.map((o:any)=
