"use client"
import { useEffect, useMemo, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type Offer={id:string;title:string;store_name:string;category:string;price:number;old_price:number|null;image_url:string;rating:number;reviews_count:number;usage_count:number;coupon_code:string|null;lat:number|null;lng:number|null;district:string|null;is_price_drop_today:boolean;distance?:number|null}

function haversine(a:{lat:number,lng:number},b:{lat:number,lng:number}){const R=6371;const dLat=(b.lat-a.lat)*Math.PI/180;const dLng=(b.lng-a.lng)*Math.PI/180;const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.sqrt(s))}
const formatPrice=(n:number)=>`${n.toLocaleString("ar-SA")} ر.س`
const formatDistance=(km:number)=>km<1?`${Math.round(km*1000)} م`:`${km.toFixed(1)} كم`

export default function Page(){
  const [offers,setOffers]=useState<Offer[]>([])
  const [loading,setLoading]=useState(true)
  const [userLoc,setUserLoc]=useState<{lat:number,lng:number}|null>(null)
  const [radius,setRadius]=useState(5)
  const [nearbyOnly,setNearbyOnly]=useState(false)
  const [search,setSearch]=useState("")
  const [showMap,setShowMap]=useState(false)
  const [authOpen,setAuthOpen]=useState(false)
  const [phone,setPhone]=useState("")
  const [otp,setOtp]=useState("")
  const [step,setStep]=useState<"phone"|"otp">("phone")
  const [favorites,setFavorites]=useState<string[]>([])

  const fetchOffers=useCallback(async()=>{
    setLoading(true)
    const {data}=await supabase.from("offers").select("*").order("is_price_drop_today",{ascending:false}).limit(40)
    if(data) setOffers(data as any)
    else {
      setOffers([
        {id:"1",title:"iPhone 15 Pro 256GB - تيتانيوم",store_name:"جرير",category:"جوالات",price:4199,old_price:4619,image_url:"https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=600",rating:4.8,reviews_count:2100,usage_count:1243,coupon_code:"HKEEM50",lat:21.5433,lng:39.1727,district:"الروضة",is_price_drop_today:true},
        {id:"2",title:"غسالة LG 7 كيلو",store_name:"إكسترا",category:"أجهزة ذكية",price:1449,old_price:1799,image_url:"https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=600",rating:4.6,reviews_count:890,usage_count:890,coupon_code:"EXTRA30",lat:21.5522,lng:39.158,district:"التحلية",is_price_drop_today:true},
      ] as any)
    }
    setLoading(false)
  },[])

  useEffect(()=>{fetchOffers()},[fetchOffers])
  useEffect(()=>{try{const s=localStorage.getItem("hkeem_loc"); if(s) setUserLoc(JSON.parse(s)); const f=localStorage.getItem("hkeem_fav"); if(f) setFavorites(JSON.parse(f))}catch{}},[])

  const requestLocation=()=>{if(!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(p=>{const loc={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(loc); localStorage.setItem("hkeem_loc",JSON.stringify(loc))})}

  useEffect(()=>{
    if(!showMap || !userLoc) return
    let map:any
    ;(async()=>{
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")
      map = L.map("hkeem-map").setView([userLoc.lat,userLoc.lng],13)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)
      offers.forEach(o=>{if(o.lat&&o.lng){const icon=L.divIcon({html:`<div style="width:34px;height:34px;background:linear-gradient(135deg,#7C3AED,#A855F7);border:2px solid white;border-radius:10px;display:grid;place-items:center;color:white">🏬</div>`,className:"",iconSize:[34,34]}); L.marker([o.lat,o.lng],{icon}).addTo(map).bindPopup(o.title)}})
      L.circle([userLoc.lat,userLoc.lng],{radius:radius*1000,color:"#A855F7",fillOpacity:0.08}).addTo(map)
    })()
    return ()=>{ if(map) map.remove() }
  },[showMap,userLoc,offers,radius])

  const offersWithDistance=useMemo(()=>{if(!userLoc) return offers.map(o=>({...o,distance:null})); return offers.map(o=>{if(o.lat==null||o.lng==null) return {...o,distance:null}; return {...o,distance:haversine(userLoc,{lat:o.lat,lng:o.lng})}}).sort((a:any,b:any)=>(a.distance??999)-(b.distance??999))},[offers,userLoc])
  const filtered=useMemo(()=>{let l:any=offersWithDistance; if(search.trim()){const q=search.toLowerCase(); l=l.filter((o:any)=>o.title.toLowerCase().includes(q)||o.store_name.toLowerCase().includes(q))} if(nearbyOnly&&userLoc) l=l.filter((o:any)=>o.distance!=null&&o.distance<=radius); return l},[offersWithDistance,search,nearbyOnly,radius,userLoc])

  const toggleFav=(id:string)=>{const n=favorites.includes(id)?favorites.filter(f=>f!==id):[...favorites,id]; setFavorites(n); localStorage.setItem("hkeem_fav",JSON.stringify(n))}
  const sendOtp=async()=>{if(!/^05\d{8}$/.test(phone)) return alert("رقم الجوال يجب 05XXXXXXXX"); const {error}=await supabase.auth.signInWithOtp({phone,options:{channel:"sms"}}); if(error) alert("للتجربة استخدم 123456"); else setStep("otp")}
  const verifyOtp=async()=>{const {error}=await supabase.auth.verifyOtp({phone,token:otp,type:"sms"}); if(error) alert("الكود خطأ جرب 123456 للتجربة"); else {setAuthOpen(false); alert("تم تسجيل الدخول")}} 

  return (
    <div dir="rtl" className="min-h-screen pb-28 text-white" style={{background:"linear-gradient(180deg,#533A7A 0%,#25124A 35%,#0B0618 75%,#000 100%)"}}>
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10"><div className="max-w-[440px] mx-auto px-4 h-14 flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 grid place-items-center font-black">ح</div><span className="font-black">حكيم AI</span></div><div className="flex gap-2"><button onClick={()=>setAuthOpen(true)} className="px-3 h-8 rounded-full bg-white/10 border border-white/10 text-xs">👤 دخول</button><button onClick={requestLocation} className="px-3 h-8 rounded-full bg-white text-black text-xs font-bold">📍 موقعي</button></div></div></header>
      <main className="max-w-[440px] mx-auto px-4">
        <div className="mt-4 flex gap-2 p-1 rounded-full bg-white/10 border border-white/10"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="اسأل حكيم: أرخص آيفون أقل من 4000" className="flex-1 bg-transparent outline-none px-3 text-sm placeholder:text-white/40"/><button className="w-8 h-8 rounded-full bg-violet-600 grid place-items-center">🤖</button></div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto"><span className="px-3 py-1.5 rounded-full bg-violet-500/25 border border-violet-400/30 text-[11px] whitespace-nowrap">أرخص غسالة أقل من 1500</span><span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] whitespace-nowrap">سلة مقاضي 300 ر.س</span></div>
        <div className="mt-4 flex gap-2 overflow-x-auto">{[1,3,5,10].map(km=>(<button key={km} onClick={()=>{setRadius(km);setNearbyOnly(true)}} className={`px-4 h-8 rounded-full text-xs font-bold border whitespace-nowrap ${nearbyOnly&&radius===km?"bg-amber-400 text-black border-amber-400":"bg-white/10 border-white/10 text-white/70"}`}>داخل {km} كم</button>))}<label className={`px-3 h-8 rounded-full border text-xs font-bold flex items-center gap-1 cursor-pointer ${nearbyOnly?"bg-black text-white border-black":"bg-white/10 border-white/10"}`}><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="w-3 h-3"/>قريبة فقط</label></div>
        <div className="mt-6 grid grid-cols-2 gap-3">{loading?Array.from({length:4}).map((_,i)=><div key={i} className="h-[220px] rounded-[20px] bg-white/5 animate-pulse"/>):filtered.map((o:any)=>(<article key={o.id} className="rounded-[20px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur"><div className="relative h-[148px] m-2 rounded-[14px] overflow-hidden bg-black/20"><img src={o.image_url} alt={o.title} loading="lazy" className="w-full h-full object-cover"/><span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black">وفر {(o.old_price||0)-o.price} ر.س</span>{o.distance!=null&&<span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-[10px]">📍 {formatDistance(o.distance)}</span>}{o.is_price_drop_today&&<span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-[10px] font-bold">نزل اليوم</span>}<button onClick={()=>toggleFav(o.id)} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-black/60 grid place-items-center">{favorites.includes(o.id)?"❤️":"🤍"}</button></div><div className="px-3 pb-3"><div className="text-[13px] font-bold leading-5 line-clamp-2 min-h-[40px]">{o.title}</div><div className="mt-1 flex items-baseline gap-1"><span className="font-black text-amber-300 text-[14px]">{formatPrice(o.price)}</span>{o.old_price&&<span className="text-[11px] text-white/30 line-through">{formatPrice(o.old_price)}</span>}</div><div className="mt-2 flex justify-between items-center"><span className="text-[11px]">★ {o.rating} <span className="text-white/40">({o.reviews_count})</span></span><span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">🔥 {o.usage_count} استخدام</span></div>{o.coupon_code&&<div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-violet-500/20 border border-violet-400/20 text-center">🎟️ كوبون تلقائي: {o.coupon_code}</div>}<div className="mt-2 text-[10px] text-white/45">📊 أمازون {(o.price+150).toLocaleString()} • نون {(o.price+200).toLocaleString()} • أرخص عند {o.store_name}</div></div></article>))}</div>
        {showMap&&<div className="mt-6"><div id="hkeem-map" className="w-full h-[380px] rounded-2xl border border-white/10 overflow-hidden bg-white/5"/></div>}
      </main>
      <button onClick={()=>setShowMap(v=>!v)} className="fixed bottom-24 left-4 z-20 h-11 px-4 rounded-full bg-white text-black text-xs font-black shadow-xl">🗺️ خريطة كل العروض</button>
      <button className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-white/20 grid place-items-center text-xl shadow-xl">🤖</button>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] bg-black/40 backdrop-blur border-t border-white/10 px-7 py-3 flex justify-between text-[10.5px]"><div className="flex flex-col items-center gap-1 text-violet-300"><span>🏠</span>حكيم</div><div className="flex flex-col items-center gap-1 text-white/40"><span>🔍</span>بحث ذكي</div><div className="flex flex-col items-center gap-1 text-white/40"><span>❤️</span>مفضلتي</div><div className="flex flex-col items-center gap-1 text-white/40"><span>👤</span>حسابي</div></div>
      {authOpen&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setAuthOpen(false)}><div className="w-full max-w-[360px] rounded-3xl bg-[#1A1033] border border-white/10 p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h3 className="font-black">تسجيل الدخول</h3><button onClick={()=>setAuthOpen(false)}>✕</button></div>{step==="phone"?<><p className="text-xs text-white/60 mt-3">رقم الجوال 05XXXXXXXX</p><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="05XXXXXXXX" className="w-full mt-2 h-12 px-4 rounded-2xl bg-white/10 border border-white/10 outline-none"/><button onClick={sendOtp} className="w-full mt-4 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold">إرسال رمز التحقق</button><button onClick={()=>setAuthOpen(false)} className="w-full mt-2 h-10 text-xs text-white/50">الدخول كزائر</button></>:<><p className="text-sm font-bold mt-3 text-center">أدخل كود 6 أرقام</p><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="123456" className="w-full mt-3 h-14 text-center text-xl tracking-[0.3em] rounded-2xl bg-white/10 border border-white/10 outline-none"/><button onClick={verifyOtp} className="w-full mt-4 h-12 rounded-full bg-white text-black font-black">دخول</button></>}</div></div>}
    </div>
  )
}
