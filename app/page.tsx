"use client"
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'

type LatLng = { lat:number; lng:number }
type City = { name:string; label:string; lat:number; lng:number }
type Offer = { id:number; title:string; store:string; logo:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; rating:number; endAt:string; createdAt:string; location: LatLng & { address:string; district:string } }

const GOLD="#B68A2E"; const GOLD_DARK="#7A5A16"; const GOLD_LIGHT="#D4AF37"
const CITIES: City[] = [
{ name:'جدة', label:'حي الروضة، جدة', lat:21.5433, lng:39.1727 },
{ name:'مكة', label:'العزيزية، مكة', lat:21.389, lng:39.857 },
{ name:'الرياض', label:'العليا، الرياض', lat:24.713, lng:46.675 },
]

const OFFERS: Offer[] = [
{ id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', logo:'💛', category:'عطور', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, rating:4.8, endAt:new Date(Date.now()+4836001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.5439,lng:39.1731,address:'حي الروضة، جدة',district:'الروضة'} },
{ id:2, title:'مكيف سبيلت 18000 وحدة', store:'إكسترا', logo:'🔌', category:'إلكترونيات', price:1899, old_price:2899, discount:34, image:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', views:3210, rating:4.6, endAt:new Date(Date.now()+536001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.5522,lng:39.158,address:'التحلية، جدة',district:'الأندلس'} },
{ id:3, title:'سلة التوفير - بنده', store:'بنده', logo:'🛒', category:'سوبرماركت', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, rating:4.4, endAt:new Date(Date.now()+2036001000).toISOString(), createdAt:new Date().toISOString(), location:{lat:21.5796,lng:39.1321,address:'فلسطين، جدة',district:'الحمراء'} },
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
const [cityManual,setCityManual]=useState<City|null>(null)
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
const [assistantMsgs,setAssistantMsgs]=useState<{role:'user'|'bot',text:string}[]>([{role:'bot',text:'هلا! أنا مساعدك الذكي 🤖\nاسألني: وش أرخص عطر؟ أو وش أقرب عرض؟ أو ارفع صورة'}])
const fileRef=useRef<HTMLInputElement>(null)
const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),3000)}

useEffect(()=>{ try{ const f=localStorage.getItem('hkeeem_favs'); if(f) setFavs(JSON.parse(f)); const l=localStorage.getItem('hkeeem_user_location'); if(l) setUserLoc(JSON.parse(l)) }catch{} },[])
useEffect(()=>{ try{ localStorage.setItem('hkeeem_favs',JSON.stringify(favs)) }catch{} },)

const refPoint = useMemo(()=> userLoc? userLoc : cityManual? {lat:cityManual.lat, lng:cityManual.lng} : null,[userLoc,cityManual])
const offersWithDistance = useMemo(()=>{ if(!refPoint) return OFFERS.map(o=>({...o,distance:null as number|null})); return OFFERS.map(o=>({...o,distance:haversine(refPoint,o.location)})).sort((a,b)=>(a.distance??999)-(b.distance??999)) },[refPoint])

// بحث ذكي يفهم الأخطاء
const smartMatch = (text:string, q:string)=>{
  const t=text.toLowerCase(); const qq=q.toLowerCase().trim()
  if(!qq) return true
  // تطبيع عربي
  const norm=(s:string)=>s.replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/أ|إ|آ/g,'ا')
  if(norm(t).includes(norm(qq))) return true
  // بحث بالكلمات
  const words=qq.split(' ')
  return words.every(w=> norm(t).includes(norm(w)))
}

const filtered = useMemo(()=>{
  let arr=[...offersWithDistance] as any[]
  if(imageActive){ arr=arr.filter(o=>o.category==='عطور' || o.category==='إلكترونيات') } // محاكاة تحليل الصورة
  if(query.trim()){ arr=arr.filter(o=> smartMatch(o.title+' '+o.store+' '+o.category, query)) }
  if(showFavsOnly) arr=arr.filter(o=>favs.includes(o.id))
  return arr
},[offersWithDistance,query,showFavsOnly,favs,imageActive])

const fetchLocation = useCallback(()=>{ setLocLoading(true); navigator.geolocation.getCurrentPosition(p=>{ const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); localStorage.setItem('hkeeem_user_location',JSON.stringify(l)); setLocLoading(false); showToast('تم تحديد موقعك ✅') },()=>setLocLoading(false),{enableHighAccuracy:false,timeout:8000}) },[])

const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files?.[0]; if(!file) return
  const url=URL.createObjectURL(file); setImagePreview(url); setImageActive(true)
  showToast('📷 جاري تحليل الصورة بالذكاء الاصطناعي...')
  setTimeout(()=>{ setQuery('عطر'); showToast('🔍 وجدنا منتجات مشابهة لصورتك (عطور)') },1500)
}

const startVoice = ()=>{
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
  if(!SpeechRecognition){ showToast('المتصفح لا يدعم البحث الصوتي'); return }
  const rec=new SpeechRecognition(); rec.lang='ar-SA'; rec.interimResults=false
  setIsListening(true); rec.start()
  rec.onresult=(ev:any)=>{ const text=ev.results[0][0].transcript; setQuery(text); setIsListening(false); showToast(`🎤 سمعت: ${text}`) }
  rec.onerror=()=>{ setIsListening(false); showToast('حاول مرة أخرى') }
  rec.onend=()=>setIsListening(false)
}

const askAssistant = ()=>{
  if(!assistantInput.trim()) return
  const q=assistantInput; setAssistantMsgs(m=>[...m,{role:'user',text:q}]); setAssistantInput('')
  setTimeout(()=>{
    let ans=''; const l=q.toLowerCase()
    if(l.includes('ارخص') && l.includes('عطر')){ const c=[...OFFERS].filter(o=>o.category==='عطور').sort((a,b)=>a.price-b.price)[0]; ans=`أرخص عطر هو ${c.title} بـ ${c.price} ر.س من ${c.store} - خصم ${c.discount}% 🔥` }
    else if(l.includes('ارخص')){ const c=[...OFFERS].sort((a,b)=>a.price-b.price)[0]; ans=`أرخص عرض حاليا: ${c.title} بـ ${c.price} ر.س` }
    else if(l.includes('قريب')){ const c=offersWithDistance[0] as any; ans=c? `أقرب عرض لك: ${c.title} على بعد ${c.distance? formatDistance(c.distance):'قريب'} في ${c.store}` : 'فعل الموقع أولا 📍' }
    else if(l.includes('عطر')){ ans=`عندي ${OFFERS.filter(o=>o.category==='عطور').length} عطور، أرخصها 199 ر.س. تبغى أفلترها لك؟` ; setQuery('عطر') }
    else if(l.includes('مكيف')||l.includes('جوال')){ setQuery(l.includes('مكيف')?'مكيف':'جوال'); ans=`فلترت لك النتائج لـ "${l.includes('مكيف')?'مكيف':'جوال'}" ✅` }
    else { ans=`فهمت "${q}" - عندي ${OFFERS.length} عروض. جرب تكتب: "وش أرخص عطر" أو "وش أقرب عرض" أو "مكيف"` }
    setAssistantMsgs(m=>[...m,{role:'bot',text:ans}])
  },600)
}

return (
<div className="min-h-screen pb-24 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl">
<header className="sticky top-0 z-30 bg-[#FFFCF6]/95 backdrop-blur-xl border-b border-[#EADFC9]">
<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
<div className="flex items-center gap-2"><img src="/Hkeeem_logo_en-2.png" alt="Hkeeem" className="w-11 h-11 rounded-xl border bg-white p-1 shadow-sm"/><span className="font-black text-[17px]">عروض<span style={{color:GOLD}}>كم</span></span></div>
<div className="flex items-center gap-1.5"><button onClick={fetchLocation} className="px-3.5 h-10 rounded-full text-white text-[12px] font-black shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>{locLoading?'...':'📍 موقعي'}</button></div>
</div>
</header>

<main className="max-w-6xl mx-auto px-4">
{/* بحث ذكي + صورة + صوت */}
<div className="mt-4 relative">
  <div className="flex gap-2">
    <div className="flex-1 relative">
      <input value={query} onChange={e=>{setQuery(e.target.value); setImageActive(false); setImagePreview(null)}} placeholder="ابحث ذكيا: أرخص عطر، مكيف قريب..." className="w-full h-13 pr-11 pl-24 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm font-medium focus:border-[#B68A2E] shadow-sm h-12"/>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
        <button onClick={()=>fileRef.current?.click()} className="w-9 h-9 rounded-full bg-[#FFF8E6] border border-[#EADFC9] grid place-items-center">📷</button>
        <button onClick={startVoice} className={`w-9 h-9 rounded-full border grid place-items-center ${isListening?'bg-red-500 text-white animate-pulse':'bg-white border-[#EADFC9]'}`}>{isListening?'●':'🎤'}</button>
      </div>
    </div>
  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload}/>
  {imagePreview && (
    <div className="mt-3 p-3 rounded-2xl bg-white border border-[#EADFC9] flex items-center gap-3">
      <img src={imagePreview} className="w-16 h-16 rounded-xl object-cover border"/>
      <div className="flex-1"><div className="text-sm font-black">🔍 البحث بالصورة نشط</div><div className="text-xs text-zinc-500">نعرض لك منتجات مشابهة لصورتك</div></div>
      <button onClick={()=>{setImagePreview(null); setImageActive(false); setQuery('')}} className="px-3 h-8 rounded-full bg-zinc-100 text-xs font-bold">إلغاء</button>
    </div>
  )}
</div>

<div className="mt-4 flex gap-2 overflow-x-auto pb-1">
  {['الكل','عطور','إلكترونيات','سوبرماركت'].map(c=><button key={c} onClick={()=>{setQuery(c==='الكل'?'':c); setImageActive(false)}} className={`whitespace-nowrap px-4 h-8 rounded-full text-xs font-black border ${query===c || (c==='الكل'&&!query&&!imageActive)?'bg-[#1F1B16] text-white border-[#1F1B16]':'bg-white border-[#EADFC9]'}`}>{c}</button>)}
  <button onClick={()=>setShowFavsOnly(v=>!v)} className={`mr-auto whitespace-nowrap px-4 h-8 rounded-full text-xs font-black border ${showFavsOnly?'bg-[#FFF3CC] border-[#E9C86A] text-[#7A5A16]':'bg-white'}`}>❤️ المفضلة</button>
</div>

<div className="mt-4 flex justify-between items-center"><h2 className="font-black text-[15px]">النتائج الذكية ({filtered.length}) {imageActive&&'📷'}</h2><span className="text-[11px] text-zinc-500">{isListening?'🎤 استمع... قل: أرخص عطر':''}</span></div>

<section className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{filtered.map((o:any)=>{
const countdown=useCountdown(o.endAt); const isFav=favs.includes(o.id)
return (
<article key={o.id} className="rounded-2xl bg-white border border-[#EADFC9] overflow-hidden shadow-sm flex flex-col">
<div className="relative"><img src={o.image} alt={o.title} className="h-48 w-full object-cover"/><span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>-{o.discount}%</span><button onClick={()=>{const n=favs.includes(o.id)?favs.filter(x=>x!==o.id):[...favs,o.id]; setFavs(n)}} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 border grid place-items-center">{isFav?'❤️':'🤍'}</button>{o.distance!==null&&<span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}</div>
<div className="p-4 flex flex-col flex-1"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#FFF8E6] border grid place-items-center text-sm">{o.logo}</div><div className="text-xs font-black">{o.store}</div></div><h3 className="font-bold text-[15px] leading-6 mt-2 line-clamp-2 min-h-12">{o.title}</h3><div className="mt-2 flex items-baseline gap-2"><span className="font-black" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-xs line-through text-zinc-400">{formatPrice(o.old_price)}</span></div><div className="mt-1 text-[11px]"><span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 font-bold">⏳ {countdown}</span></div><button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`,'_blank')} className="mt-3 h-11 rounded-full text-white text-sm font-black" style={{background:GOLD_DARK}}>الوصول 🚗</button></div>
</article>
)})}
</section>
{filtered.length===0&&<div className="mt-10 text-center py-10 bg-white rounded-2xl border border-dashed"><div className="text-2xl">🤖</div><div className="font-bold mt-2">ما لقيت نتائج لـ "{query}"</div><div className="text-xs text-zinc-500 mt-1">جرب كلمة ثانية أو ارفع صورة أو استخدم الصوت</div></div>}
</main>

{/* المساعد الذكي */}
<button onClick={()=>setAssistantOpen(v=>!v)} className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-black text-white text-2xl shadow-2xl grid place-items-center z-40 border-2 border-[#E9C86A]">{assistantOpen?'✕':'🤖'}</button>
{assistantOpen&&(
<div className="fixed bottom-24 left-4 right-4 md:left-5 md:right-auto md:w-96 rounded-[20px] bg-white border border-[#EADFC9] shadow-2xl z-40 overflow-hidden flex flex-col max-h-[70vh]">
  <div className="p-4 bg-gradient-to-l from-[#7A5A16] to-[#D4AF37] text-white"><div className="font-black">مساعد عروضكم الذكي 🤖</div><div className="text-[11px] opacity-90">يفهم: أرخص عطر، أقرب عرض، مكيف</div></div>
  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#FFFCF6]">
    {assistantMsgs.map((m,i)=><div key={i} className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-6 ${m.role==='user'?'bg-black text-white mr-auto rounded-br-sm':'bg-white border border-[#EADFC9] ml-auto rounded-bl-sm'}`}>{m.text}</div>)}
  </div>
  <div className="p-3 border-t bg-white flex gap-2"><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askAssistant()} placeholder="اسأل: وش أرخص عطر؟" className="flex-1 h-11 rounded-full border-2 border-[#EADFC9] px-4 text-sm outline-none focus:border-[#B68A2E]"/><button onClick={askAssistant} className="w-11 h-11 rounded-full bg-black text-white grid place-items-center">➤</button></div>
</div>
)}

{toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1F1B16] text-white px-5 py-2.5 rounded-full text-xs font-bold z-50 shadow-xl">{toast}</div>}
</div>
)
                                }
