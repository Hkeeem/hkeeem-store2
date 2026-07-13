"use client"
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
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
{ id:4, title:'جوال ايفون 15 - 128GB', store:'جرير', logo:'📱', category:'إلكترونيات', price:3299, old_price:3899, discount:15, image:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600', views:4120, rating:4.9, endAt:new Date(Date.now()+2836001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.56,lng:39.17,address:'ردسي مول',district:'الشاطئ'} },
{ id:5, title:'عطر مسك العود الفاخر', store:'متجر حكيم', logo:'💛', category:'عطور', price:249, old_price:399, discount:37, image:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600', views:2100, rating:4.7, endAt:new Date(Date.now()+3836001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.39,lng:39.86,address:'العزيزية، مكة',district:'العزيزية'} },
{ id:6, title:'قلاية هوائية 5.5 لتر', store:'إكسترا', logo:'🔌', category:'إلكترونيات', price:299, old_price:549, discount:45, image:'https://images.unsplash.com/photo-1585515656512-3c6a2a9a0b1a?w=600', views:3300, rating:4.5, endAt:new Date(Date.now()+1836001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:24.71,lng:46.67,address:'العليا، الرياض',district:'العليا'} },
]
function haversine(a:LatLng,b:LatLng){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180; const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)) }
const formatPrice=(n:number)=>`${n.toLocaleString('ar-SA')} ر.س`
const formatDistance=(k:number)=>k<1?`${Math.round(k*1000)} م`:`${k.toFixed(1)} كم`
function useCountdown(end:string){ const [txt,setTxt]=useState(''); useEffect(()=>{ const tick=()=>{ const d=new Date(end).getTime()-Date.now(); if(d<=0){setTxt('انتهى');return} const h=Math.floor(d/3600000); const m=Math.floor((d%3600000)/60000); if(h>=24) setTxt(`ينتهي بعد ${Math.floor(h/24)} يوم`); else if(h>0) setTxt(`ينتهي بعد ${h} ساعة و ${m} دقيقة`); else setTxt(`ينتهي بعد ${m} دقيقة`) }; tick(); const id=setInterval(tick,60000); return()=>clearInterval(id)},[end]); return txt }
export default function Page(){
const [userLoc,setUserLoc]=useState<LatLng|null>(null)
const [locLoading,setLocLoading]=useState(false)
const [query,setQuery]=useState('')
const [favs,setFavs]=useState<number[]>([])
const [showFavsOnly,setShowFavsOnly]=useState(false)
const [toast,setToast]=useState('')
  const [imagePreview,setImagePreview]=useState<string|null>(null)
const [imageActive,setImageActive]=useState(false)
const [isListening,setIsListening]=useState(false)
const [assistantOpen,setAssistantOpen]=useState(false)
const [assistantInput,setAssistantInput]=useState('')
const [assistantMsgs,setAssistantMsgs]=useState<{role:'user'|'bot',text:string}[]>([{role:'bot',text:'هلا! أنا مساعدك الذكي 🤖'}])
const fileRef=useRef<HTMLInputElement>(null)
const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),3000)}
useEffect(()=>{ try{ const f=localStorage.getItem('hkeeem_favs'); if(f) setFavs(JSON.parse(f)) }catch{} },[])
const refPoint = useMemo(()=> userLoc? userLoc : null,[userLoc])
const offersWithDistance = useMemo(()=>{ if(!refPoint) return OFFERS.map(o=>({...o,distance:null as number|null})); return OFFERS.map(o=>({...o,distance:haversine(refPoint,o.location)})).sort((a,b)=>(a.distance??999)-(b.distance??999)) },[refPoint])
const filtered = useMemo(()=>{ let arr=[...offersWithDistance] as any[]; if(imageActive) arr=arr.filter(o=>o.category==='عطور'); if(query.trim()){ const q=query.toLowerCase(); arr=arr.filter(o=> (o.title+o.store+o.category).toLowerCase().includes(q)) } if(showFavsOnly) arr=arr.filter(o=>favs.includes(o.id)); return arr },[offersWithDistance,query,showFavsOnly,favs,imageActive])
const fetchLocation = useCallback(()=>{ setLocLoading(true); navigator.geolocation.getCurrentPosition(p=>{ const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); setLocLoading(false); showToast('تم تحديد موقعك ✅') },()=>setLocLoading(false)) },[])
const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>)=>{ const f=e.target.files?.[0]; if(!f) return; const url=URL.createObjectURL(f); setImagePreview(url); setImageActive(true); setTimeout(()=>{ setQuery('عطر'); showToast('🔍 وجدنا شبيه') },800) }
const startVoice = ()=>{ const SR=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition; if(!SR){showToast('لا يدعم');return} const r=new SR(); r.lang='ar-SA'; setIsListening(true); r.start(); r.onresult=(ev:any)=>{ setQuery(ev.results[0][0].transcript); setIsListening(false)}; r.onend=()=>setIsListening(false) }
  const askAssistant = ()=>{ if(!assistantInput.trim()) return; const q=assistantInput; setAssistantMsgs(m=>[...m,{role:'user',text:q}]); setAssistantInput(''); setTimeout(()=>{ let a='أرخص عطر 199 ر.س 🔥'; if(q.includes('قريب')) a='فعل الموقع 📍'; setAssistantMsgs(m=>[...m,{role:'bot',text:a}])},300) }
return (<div className="min-h-screen pb-24 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl"><header className="sticky top-0 z-30 bg-white/90 border-b"><div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"><div className="flex items-center gap-2"><span className="font-black">عروضكم V2 🤖📷🎤</span></div><button onClick={fetchLocation} className="px-3 h-9 rounded-full bg-black text-white text-xs">{locLoading?'...':'📍 موقعي'}</button></div></header><main className="max-w-6xl mx-auto px-4"><div className="mt-4 relative"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث 🎤 📷" className="w-full h-12 pr-4 pl-24 rounded-2xl border-2 bg-white"/><div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1"><button onClick={()=>fileRef.current?.click()} className="w-9 h-9 rounded-full bg-zinc-100">📷</button><button onClick={startVoice} className={`w-9 h-9 rounded-full ${isListening?'bg-red-500':'bg-white'} border`}>🎤</button></div></div><input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload}/>{imagePreview && <div className="mt-3 flex gap-2 p-2 bg-white border rounded-xl"><img src={imagePreview} className="w-16 h-16 rounded object-cover"/><button onClick={()=>{setImagePreview(null);setImageActive(false)}} className="text-xs">إلغاء</button></div>}<section className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">{filtered.map((o:any)=>{const cd=useCountdown(o.endAt); return (<div key={o.id} className="bg-white border rounded-2xl overflow-hidden"><img src={o.image} className="h-40 w-full object-cover"/><div className="p-3"><h3 className="font-bold text-sm">{o.title}</h3><div className="text-xs">{formatPrice(o.price)} <s className="text-zinc-400">{formatPrice(o.old_price)}</s></div><div className="text- text-red-600">{cd}</div><button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`)} className="mt-2 w-full h-9 rounded-full bg-black text-white text-xs">الوصول 🚗</button></div></div>)})}</section></main><button onClick={()=>setAssistantOpen(v=>!v)} className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-black text-white text-xl">{assistantOpen?'✕':'🤖'}</button>{assistantOpen&&<div className="fixed bottom-20 left-4 right-4 md:w-80 bg-white border rounded-2xl shadow-xl p-3"><div className="h-40 overflow-y-auto space-y-2">{assistantMsgs.map((m,i)=><div key={i} className={`p-2 rounded-xl text-xs ${m.role==='user'?'bg-black text-white':'bg-zinc-100'}`}>{m.text}</div>)}</div><div className="flex gap-1 mt-2"><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAssistant()} className="flex-1 h-9 border rounded-full px-3 text-xs"/><button onClick={askAssistant} className="w-9 h-9 rounded-full bg-black text-white">➤</button></div></div>}{toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs">{toast}</div>}</div>)}
  }const askAssistant = ()=>{
if(!assistantInput.trim()) return;
const q=assistantInput;
setAssistantMsgs(m=>[...m,{role:'user',text:q}]);
setAssistantInput('');
setTimeout(()=>{
let a='أرخص عطر 199 ر.س 🔥';
if(q.includes('قريب')) a='فعل الموقع 📍 أقرب عرض';
setAssistantMsgs(m=>[...m,{role:'bot',text:a}])
},300)
}
return (
<div className="min-h-screen pb-24 bg-[#FDF6E8]" dir="rtl">
<header className="sticky top-0 z-30 bg-white/90 border-b">
<div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
<span className="font-black">عروضكم V2 🤖📷🎤</span>
<button onClick={fetchLocation} className="px-3 h-9 rounded-full bg-black text-white text-xs">
{locLoading?'...':'📍 موقعي'}
</button>
</div>
</header>
<main className="max-w-6xl mx-auto px-4">
<div className="mt-4 relative">
<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث 🎤 📷" className="w-full h-12 rounded-2xl border-2 px-4"/>
<div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
<button onClick={()=>fileRef.current?.click()} className="w-9 h-9 rounded-full bg-zinc-100 border">📷</button>
<button onClick={startVoice} className={`w-9 h-9 rounded-full border ${isListening?'bg-red-500 text-white':'bg-white'}`}>🎤</button>
</div>
</div>
<input ref={fileRef} type="file" hidden accept="image/*" onChange={handleImageUpload}/>
{imagePreview && <div className="mt-3 p-2 bg-white border rounded-xl flex gap-2"><img src={imagePreview} className="w-16 h-16 rounded"/><button onClick={()=>{setImagePreview(null);setImageActive(false)}}>إلغاء</button></div>}
<section className="mt-4 grid grid-cols-1 gap-3">
{filtered.map((o:any)=>{const cd=useCountdown(o.endAt); return (
<div key={o.id} className="bg-white border rounded-2xl overflow-hidden">
<img src={o.image} className="h-40 w-full object-cover"/>
<div className="p-3">
<h3 className="font-bold text-sm">{o.title}</h3>
<div className="text-xs">{formatPrice(o.price)}</div>
<div className="text-[11px] text-red-600">{cd}</div>
<button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`)} className="mt-2 w-full h-9 rounded-full bg-black text-white text-xs">الوصول 🚗</button>
</div>
</div>
)})}
</section>
</main>
<button onClick={()=>setAssistantOpen(v=>!v)} className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-black text-white">{assistantOpen?'✕':'🤖'}</button>
{assistantOpen&&<div className="fixed bottom-20 left-4 right-4 bg-white border rounded-2xl p-3 shadow-xl"><div className="h-32 overflow-y-auto">{assistantMsgs.map((m,i)=><div key={i} className={`p-2 my-1 rounded text-xs ${m.role==='user'?'bg-black text-white':'bg-zinc-100'}`}>{m.text}</div>)}</div><div className="flex gap-1 mt-2"><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAssistant()} className="flex-1 h-9 border rounded-full px-3 text-xs"/><button onClick={askAssistant} className="w-9 h-9 rounded-full bg-black text-white">➤</button></div></div>}
{toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs">{toast}</div>}
</div>
)
}
