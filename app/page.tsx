"use client"
import { useEffect, useMemo, useState, useCallback } from 'react'

type LatLng = { lat:number; lng:number }
type City = { name:string; label:string; lat:number; lng:number }
type Offer = { id:number; title:string; store:string; logo:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; rating:number; endAt:string; createdAt:string; location: LatLng & { address:string; district:string } }

const GOLD="#B68A2E"; const GOLD_DARK="#7A5A16"; const GOLD_LIGHT="#D4AF37"
const CITIES: City[] = [{ name:'جدة', label:'حي الروضة، جدة', lat:21.5433, lng:39.1727 },{ name:'مكة', label:'العزيزية، مكة', lat:21.389, lng:39.857 },{ name:'الرياض', label:'العليا، الرياض', lat:24.713, lng:46.675 },]
const OFFERS: Offer[] = [
{ id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', logo:'💛', category:'عطور', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, rating:4.8, endAt:new Date(Date.now()+4836001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.5439,lng:39.1731,address:'حي الروضة، جدة',district:'الروضة'} },
{ id:2, title:'مكيف سبيلت 18000 وحدة', store:'إكسترا', logo:'🔌', category:'إلكترونيات', price:1899, old_price:2899, discount:34, image:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', views:3210, rating:4.6, endAt:new Date(Date.now()+536001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.5522,lng:39.158,address:'التحلية، جدة',district:'الأندلس'} },
{ id:3, title:'سلة التوفير - بنده', store:'بنده', logo:'🛒', category:'سوبرماركت', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, rating:4.4, endAt:new Date(Date.now()+2036001000).toISOString(), createdAt:new Date(Date.now()-86400000).toISOString(), location:{lat:21.5796,lng:39.1321,address:'فلسطين، جدة',district:'الحمراء'} },
]

function haversine(a:LatLng,b:LatLng){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180; const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)) }
const formatPrice=(n:number)=>`${n.toLocaleString('ar-SA')} ر.س`
const formatDistance=(k:number)=>k<1?`${Math.round(k*1000)} م`:`${k.toFixed(1)} كم`
function useCountdown(end:string){ const [txt,setTxt]=useState(''); useEffect(()=>{ const tick=()=>{ const d=new Date(end).getTime()-Date.now(); if(d<=0){setTxt('انتهى');return} const h=Math.floor(d/3600000); const m=Math.floor((d%3600000)/60000); if(h>=24) setTxt(`ينتهي بعد ${Math.floor(h/24)} يوم`); else if(h>0) setTxt(`ينتهي بعد ${h} ساعة و ${m} دقيقة`); else setTxt(`ينتهي بعد ${m} دقيقة`) }; tick(); const id=setInterval(tick,60000); return()=>clearInterval(id)},[end]); return txt }

export default function Page(){
const [userLoc,setUserLoc]=useState<LatLng|null>(null)
const [cityManual,setCityManual]=useState<City|null>(null)
const [locLoading,setLocLoading]=useState(false)
const [query,setQuery]=useState('')
const [priceMax,setPriceMax]=useState(3000)
const [discountMin,setDiscountMin]=useState(0)
const [selectedStore,setSelectedStore]=useState('الكل')
const [selectedCat,setSelectedCat]=useState('الكل')
const [radiusKm,setRadiusKm]=useState(10)
const [nearbyOnly,setNearbyOnly]=useState(false)
const [favs,setFavs]=useState<number[]>([])
const [showFavsOnly,setShowFavsOnly]=useState(false)
const [user,setUser]=useState<any>(null)
const [toast,setToast]=useState('')
const [notifOn,setNotifOn]=useState(false)
const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2600)}
useEffect(()=>{ try{ const l=localStorage.getItem('hkeeem_user_location'); if(l) setUserLoc(JSON.parse(l)); const c=localStorage.getItem('hkeeem_city'); if(c) setCityManual(JSON.parse(c)); const f=localStorage.getItem('hkeeem_favs'); if(f) setFavs(JSON.parse(f)) }catch{} },[])
useEffect(()=>{ try{ localStorage.setItem('hkeeem_favs', JSON.stringify(favs)) }catch{} },[favs])
const refPoint = useMemo(()=> userLoc? userLoc : cityManual? {lat:cityManual.lat, lng:cityManual.lng} : null,[userLoc,cityManual])
const offersWithDistance = useMemo(()=>{ if(!refPoint) return OFFERS.map(o=>({...o,distance:null as number|null})); return OFFERS.map(o=>({...o,distance:haversine(refPoint,o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)) },[refPoint])
const filtered = useMemo(()=>{ let arr=[...offersWithDistance]; if(query.trim()){ const q=query.toLowerCase(); arr=arr.filter(o=>o.title.toLowerCase().includes(q)||o.store.toLowerCase().includes(q)) } if(showFavsOnly) arr=arr.filter(o=>favs.includes(o.id)); if(nearbyOnly&&refPoint) arr=arr.filter(o=>o.distance!==null&&o.distance<=radiusKm); if(priceMax<3000) arr=arr.filter(o=>o.price<=priceMax); if(discountMin>0) arr=arr.filter(o=>o.discount>=discountMin); if(selectedStore!=='الكل') arr=arr.filter(o=>o.store===selectedStore); if(selectedCat!=='الكل') arr=arr.filter(o=>o.category===selectedCat); return arr },[offersWithDistance,query,showFavsOnly,nearbyOnly,radiusKm,refPoint,priceMax,discountMin,selectedStore,selectedCat,favs])
const fetchLocation = useCallback(()=>{ setLocLoading(true); navigator.geolocation.getCurrentPosition(p=>{ const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); localStorage.setItem('hkeeem_user_location',JSON.stringify(l)); setLocLoading(false); showToast('تم تحديد موقعك ✅'); },()=>setLocLoading(false),{enableHighAccuracy:false,timeout:8000}) },[])
const toggleFav=(id:number)=>{ setFavs(f=> f.includes(id)? f.filter(x=>x!==id) : [...f,id]) }

return (
<div className="min-h-screen pb-24 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl">
<header className="sticky top-0 z-30 bg-[#FFFCF6]/90 backdrop-blur-xl border-b border-[#EADFC9]">
<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
<div className="flex items-center gap-3">
<img src="/Hkeeem_logo_en-2.png" alt="Hkeeem" className="w-11 h-11 rounded-xl bg-white object-contain border border-[#EADFC9] p-1 shadow-sm"/>
<span className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></span>
{cityManual&&<span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8E6] border border-[#EADFC9] text-[#7A5A16]">📍 {cityManual.name}</span>}
</div>
<div className="flex items-center gap-2"><button onClick={fetchLocation} className="px-4 h-10 rounded-full text-white text-xs font-black shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>{locLoading?'جاري...':'📍 موقعي'}</button></div>
</div>
</header>
<main className="max-w-6xl mx-auto px-4">
<div className="mt-4 relative"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث: أرخص مكيف، عطور، بنده، جرير..." className="w-full h-12 pr-11 pl-4 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm font-medium focus:border-[#B68A2E]"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span></div>
<div className="mt-6 flex justify-between items-center"><h2 className="font-black text-base">النتائج ({filtered.length})</h2></div>
<section className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{filtered.map(o=>{
const countdown=useCountdown(o.endAt); const isFav=favs.includes(o.id); const saved=o.old_price-o.price
return (
<article key={o.id} className="rounded-2xl bg-white border border-[#EADFC9] overflow-hidden shadow-sm flex flex-col">
<div className="relative"><img src={o.image} alt={o.title} className="h-48 w-full object-cover"/><span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>-{o.discount}%</span><button onClick={()=>toggleFav(o.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 border border-[#EADFC9] grid place-items-center">{isFav?'❤️':'🤍'}</button>{o.distance!==null&&<span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}</div>
<div className="p-4 flex flex-col flex-1"><h3 className="font-bold text-base line-clamp-2 min-h-12">{o.title}</h3><div className="mt-3 flex items-baseline gap-2"><span className="font-black text-lg" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-sm line-through text-zinc-400">{formatPrice(o.old_price)}</span></div><div className="mt-2 text-xs font-bold"><span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600">⏳ {countdown}</span></div><button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`,'_blank')} className="mt-4 h-11 rounded-full text-sm font-black text-white" style={{background:GOLD_DARK}}>الوصول 🚗</button></div>
</article>
)})}
</section>
</main>
{toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1F1B16] text-white px-5 py-2.5 rounded-full text-xs font-bold z-50">{toast}</div>}
</div>
)
}
