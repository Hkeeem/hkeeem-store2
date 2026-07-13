"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type LatLng = { lat:number; lng:number }
type Offer = { id:number; title:string; store:string; logo:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; rating:number; reviews:number; endAt:string; createdAt:string; priceHistory:number[]; location: LatLng & { address:string; district:string } }

const GOLD="#B68A2E"; const GOLD_DARK="#7A5A16"; const GOLD_LIGHT="#D4AF37"
const CITIES = [{name:'جدة', lat:21.5433, lng:39.1727, label:'حي الروضة، جدة'}, {name:'مكة', lat:21.389, lng:39.857, label:'العزيزية، مكة'}, {name:'الرياض', lat:24.713, lng:46.675, label:'العليا، الرياض'}]

const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', logo:'💛', category:'عطور', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, rating:4.8, reviews:124, endAt:new Date(Date.now()+3*24*3600*1000).toISOString(), createdAt:new Date().toISOString(), priceHistory:[349,299,249,199], location:{lat:21.5439,lng:39.1731,address:'حي الروضة، جدة',district:'الروضة'} },
  { id:2, title:'مكيف سبيلت 18000 وحدة - الأرخص في جدة', store:'إكسترا', logo:'🔌', category:'إلكترونيات', price:1899, old_price:2899, discount:34, image:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600', views:3210, rating:4.6, reviews:89, endAt:new Date(Date.now()+1*24*3600*1000).toISOString(), createdAt:new Date(Date.now()-2*3600*1000).toISOString(), priceHistory:[2899,2499,2199,1899], location:{lat:21.5522,lng:39.158,address:'شارع التحلية، جدة',district:'الأندلس'} },
  { id:3, title:'أفضل عروض العطور القريبة - خصم 40%', store:'بنده', logo:'🛒', category:'عطور', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, rating:4.3, reviews:210, endAt:new Date(Date.now()+5*3600*1000).toISOString(), createdAt:new Date(Date.now()-24*3600*1000).toISOString(), priceHistory:[149,129,99,89], location:{lat:21.5796,lng:39.1321,address:'شارع فلسطين، جدة',district:'الحمراء'} },
]

function haversine(a:LatLng,b:LatLng){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180; const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)) }
const formatDistance=(k:number)=>k<1?`${Math.round(k*1000)} م`:`${k.toFixed(1)} كم`
const formatPrice=(n:number)=>`${n.toLocaleString('ar-SA')} ر.س`
const saving=(o:number,n:number)=> o-n

function useCountdown(end:string){
  const [t,setT]=useState(''); useEffect(()=>{ const i=setInterval(()=>{ const d=new Date(end).getTime()-Date.now(); if(d<=0){setT('انتهى'); clearInterval(i); return} const h=Math.floor(d/3600000); const m=Math.floor((d%3600000)/60000); setT(h>24?`${Math.floor(h/24)} يوم`:`${h}س ${m}د`)},1000); return()=>clearInterval(i)},[end]); return t
}

export default function Page(){
  const [userLoc,setUserLoc]=useState<LatLng|null>(null); const [cityManual,setCityManual]=useState<any>(null); const [locLoading,setLocLoading]=useState(false)
  const [radiusKm,setRadiusKm]=useState(10); const [nearbyOnly,setNearbyOnly]=useState(false)
  const [priceMax,setPriceMax]=useState(3000); const [discountMin,setDiscountMin]=useState(0); const [selectedStore,setSelectedStore]=useState<string>('الكل'); const [selectedCat,setSelectedCat]=useState('الكل')
  const [sortBy,setSortBy]=useState<'nearest'|'discount'|'views'|'newest'>('nearest')
  const [favs,setFavs]=useState<number[]>([]); const [compare,setCompare]=useState<number[]>([]); const [showCompare,setShowCompare]=useState(false)
  const [authOpen,setAuthOpen]=useState(false); const [phone,setPhone]=useState(''); const [otp,setOtp]=useState(''); const [step,setStep]=useState<'id'|'otp'>('id'); const [user,setUser]=useState<any>(null)
  const [assistantOpen,setAssistantOpen]=useState(false); const [assistantInput,setAssistantInput]=useState(''); const [assistantMsgs,setAssistantMsgs]=useState<any[]>([{role:'bot',text:'أنا حكيم 🤖 اسأل: أرخص مكيف في جدة أو أفضل عروض العطور القريبة'}])
  const [showMapFor,setShowMapFor]=useState<any>(null); const [toast,setToast]=useState('')

  const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2500)}
  useEffect(()=>{ try{ const s=localStorage.getItem('hkeeem_user_location'); if(s) setUserLoc(JSON.parse(s)) }catch{}; if(typeof Notification!=='undefined'&&Notification.permission!=='granted') Notification.requestPermission() },[])

  const نقطة_المرجع = useMemo(()=>{ if(userLoc) return userLoc; if(cityManual) return {lat:cityManual.lat,lng:cityManual.lng}; return null },[userLoc,cityManual])
  const جلب_الموقع = useCallback(()=>{ setLocLoading(true); navigator.geolocation.getCurrentPosition(p=>{const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); localStorage.setItem('hkeeem_user_location',JSON.stringify(l)); setLocLoading(false)},()=>setLocLoading(false),{enableHighAccuracy:false,timeout:8000,maximumAge:300000}) },[])

  const العروض_المرتبة = useMemo(()=>{
    if(!نقطة_المرجع) return OFFERS.map(o=>({...o,distance:null as number|null}))
    return OFFERS.map(o=>({...o,distance:haversine(نقطة_المرجع,o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity))
  },[نقطة_المرجع])

  const المفلترة = useMemo(()=>{
    let arr=[...العروض_المرتبة]
    if(nearbyOnly&&نقطة_المرجع) arr=arr.filter(o=>o.distance!==null&&o.distance<=radiusKm)
    if(priceMax<3000) arr=arr.filter(o=>o.price<=priceMax)
    if(discountMin>0) arr=arr.filter(o=>o.discount>=discountMin)
    if(selectedStore!=='الكل') arr=arr.filter(o=>o.store===selectedStore)
    if(selectedCat!=='الكل') arr=arr.filter(o=>o.category===selectedCat)
    if(sortBy==='discount') arr.sort((a,b)=>b.discount-a.discount)
    else if(sortBy==='views') arr.sort((a,b)=>b.views-a.views)
    else if(sortBy==='newest') arr.sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt))
    return arr
  },[العروض_المرتبة,nearbyOnly,radiusKm,نقطة_المرجع,priceMax,discountMin,selectedStore,selectedCat,sortBy])

  const handleAssistant=()=>{ if(!assistantInput.trim()) return; const q=assistantInput; setAssistantInput(''); setAssistantMsgs(m=>[...m,{role:'user',text:q}]); const l=q.toLowerCase(); let res=المفلترة; if(l.includes('مكيف')) res=OFFERS.filter(o=>o.title.includes('مكيف')); if(l.includes('عطور')) res=OFFERS.filter(o=>o.category==='عطور'); if(l.includes('قريبة')&&نقطة_المرجع) res=العروض_المرتبة.filter(o=>o.distance!==null&&o.distance<3); setTimeout(()=>setAssistantMsgs(m=>[...m,{role:'bot',text:`لقيت ${res.length} نتائج لـ "${q}"`,results:res.slice(0,3)}]),400) }

  return (
    <div className="min-h-screen pb-28 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl">
      <header className="sticky top-0 z-30 bg-[#FFFCF6]/90 backdrop-blur-xl border-b border-[#EADFC9] h-16 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2"><img src="/hkeeem-icon.png" alt="" className="w-9 h-9 rounded-xl border border-[#EADFC9] bg-white"/><span className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></span><span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8E6] border border-[#EADFC9] text-[#7A5A16]">{نقطة_المرجع?`📍 ${cityManual?.label||'موقعك الحالي'}`:'حدد موقعك'}</span></div>
        <div className="flex gap-2"><button onClick={()=>setAuthOpen(true)} className="px-4 h-10 rounded-full border bg-white border-[#EADFC9] text-xs font-black">{user?'👋 '+user.name:'👤 دخول OTP'}</button><button onClick={جلب_الموقع} className="px-4 h-10 rounded-full text-white text-xs font-black shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>{locLoading?'جاري...':'📍 موقعي'}</button></div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* فلترة متقدمة */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-[#EADFC9] shadow-sm">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold">فلترة:</span>
            {['الكل','متجر حكيم','بنده','جرير','إكسترا'].map(s=><button key={s} onClick={()=>setSelectedStore(s)} className={`px-3 h-8 rounded-full text-xs font-bold border ${selectedStore===s?'bg-[#1F1B16] text-white border-[#1F1B16]':'bg-white border-[#EADFC9]'}`}>{s}</button>)}
            <span className="w-px h-6 bg-[#EADFC9] mx-1"/>
            {['الكل','عطور','إلكترونيات'].map(c=><button key={c} onClick={()=>setSelectedCat(c)} className={`px-3 h-8 rounded-full text-xs font-bold border ${selectedCat===c?'bg-[#FFF3CC] border-[#E9C86A] text-[#7A5A16]':'bg-white border-[#EADFC9]'}`}>{c}</button>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="flex items-center gap-2"><span className="text-xs font-bold whitespace-nowrap">السعر ≤ {priceMax}</span><input type="range" min={50} max={3000} step={50} value={priceMax} onChange={e=>setPriceMax(parseInt(e.target.value))} className="flex-1 accent-[#B68A2E]"/></div>
            <div className="flex items-center gap-2"><span className="text-xs font-bold">خصم ≥ {discountMin}%</span><input type="range" min={0} max={60} step={5} value={discountMin} onChange={e=>setDiscountMin(parseInt(e.target.value))} className="flex-1 accent-[#B68A2E]"/></div>
            <div className="flex items-center gap-2"><span className="text-xs font-bold">مسافة ≤ {radiusKm} كم</span><input type="range" min={1} max={20} value={radiusKm} onChange={e=>{setRadiusKm(parseInt(e.target.value)); setNearbyOnly(true)}} className="flex-1 accent-[#B68A2E]"/><label className="flex items-center gap-1 text-xs font-bold"><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#B68A2E]"/>قريبة فقط</label></div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto"><span className="text-xs font-bold py-2">ترتيب:</span>{[{k:'nearest',l:'الأقرب'},{k:'discount',l:'الأعلى خصما'},{k:'views',l:'الأكثر مشاهدة'},{k:'newest',l:'الأحدث'}].map(s=><button key={s.k} onClick={()=>setSortBy(s.k as any)} className={`whitespace-nowrap px-3 h-8 rounded-full text-xs font-bold border ${sortBy===s.k?'bg-[#1F1B16] text-white':'bg-white border-[#EADFC9]'}`}>{s.l}</button>)}</div>
        </div>

        {/* اقتراح ذكي حسب موقعك */}
        {نقطة_المرجع&&<div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-[#FFF8E6] to-[#FFF3CC] border border-[#E9C86A] text-sm font-bold">💡 اقتراح حكيم: أقرب عرض لك هو <span style={{color:GOLD_DARK}}>{العروض_المرتبة[0]?.title}</span> على بعد {العروض_المرتبة[0]?.distance!==null&&formatDistance(العروض_المرتبة[0].distance!)} • وفر {formatPrice(saving(العروض_المرتبة[0]?.old_price||0,العروض_المرتبة[0]?.price||0))}</div>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {المفلترة.map(o=>{
            const countdown=useCountdown(o.endAt)
            const isFav=favs.includes(o.id)
            return (
              <article key={o.id} className="rounded-2xl bg-white border border-[#EADFC9] overflow-hidden shadow-sm flex flex-col">
                <div className="relative"><img src={o.image} alt={o.title} className="h-40 w-full object-cover"/><span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>-{o.discount}%</span><button onClick={()=>{setFavs(f=>f.includes(o.id)?f.filter(x=>x!==o.id):[...f,o.id]); showToast(favs.includes(o.id)?'أزيل من المفضلة':'أضيف للمفضلة ❤️')}} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-[#EADFC9] grid place-items-center text-sm">{isFav?'❤️':'🤍'}</button>{o.distance!==null&&<span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/75 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}</div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold"><span className="w-6 h-6 rounded-full bg-[#FFF3CC] grid place-items-center border border-[#EADFC9]">{o.logo}</span><span className="truncate">{o.store}</span><span className="mr-auto text-amber-500">★ {o.rating} <span className="text-zinc-400 font-medium">({o.reviews})</span></span></div>
                  <h3 className="font-bold text-sm leading-5 mt-2 line-clamp-2 min-h-10">{o.title}</h3>
                  <div className="mt-2"><div className="flex items-baseline gap-2"><span className="font-black text-base" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-xs line-through text-zinc-400">{formatPrice(o.old_price)}</span><span className="text-xs font-black text-green-600">وفر {formatPrice(saving(o.old_price,o.price))}</span></div><div className="text-xs text-red-600 font-bold mt-1">⏳ ينتهي خلال {countdown}</div></div>
                  <div className="mt-2 flex items-center gap-1"><span className="text-xs text-zinc-500">{o.views.toLocaleString()} مشاهدة</span><span className="text-xs text-zinc-300">•</span><span className="text-xs text-zinc-500">{o.location.district}</span></div>
                  {/* تتبع تاريخ السعر */}
                  <div className="mt-2 flex items-end gap-0.5 h-6">{o.priceHistory.map((p,i)=><div key={i} className="w-1.5 rounded-full" style={{height:`${(p/o.old_price)*100}%`, background:i===o.priceHistory.length-1?GOLD_DARK:'#EADFC9'}} title={formatPrice(p)} />)}<span className="text-xs text-zinc-400 mr-2">تاريخ السعر ↓</span></div>
                  <div className="flex gap-1.5 mt-3 mt-auto"><button onClick={()=>{const u=`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`; window.open(u,'_blank')}} className="flex-1 h-9 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>الوصول 🚗</button><button onClick={()=>setShowMapFor(o)} className="w-9 h-9 rounded-full border bg-[#FFF8E6] border-[#EADFC9]">🗺️</button><button onClick={()=>{setCompare(c=>c.includes(o.id)?c:c.length<3?[...c,o.id]:c); if(compare.length>=1) setShowCompare(true); else showToast('اختر عرضين للمقارنة')}} className="w-9 h-9 rounded-full border border-[#EADFC9] text-xs">⚖️</button></div>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <button onClick={()=>setAssistantOpen(true)} className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-xl border-2 border-white grid place-items-center text-xl" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🤖</button>
      {toast&&<div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold z-50">{toast}</div>}

      {authOpen&&<div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={()=>setAuthOpen(false)}><div className="w-full max-w-sm rounded-3xl bg-white p-6" onClick={e=>e.stopPropagation()}><h2 className="font-black">تسجيل الدخول OTP</h2><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05XXXXXXXX" className="w-full mt-4 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/>{step==='id'?<button onClick={()=>{if(!/^(05\d{8})$/.test(phone)){showToast('رقم غير صحيح'); return} setStep('otp'); showToast('كودك: 123456')}} className="w-full mt-3 h-12 rounded-full text-white font-black" style={{background:GOLD_DARK}}>إرسال OTP</button>:<><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" className="w-full mt-3 h-12 px-4 rounded-2xl border-2 text-center text-xl tracking-widest"/><button onClick={()=>{if(otp==='123456'){setUser({name:'عميل حكيم'}); setAuthOpen(false); if(Notification.permission==='granted') new Notification('مرحبا بك في عروضكم 💛',{body:'سننبهك عند نزول عروض قريبة'})}else showToast('كود خطأ')}} className="w-full mt-3 h-12 rounded-full bg-black text-white font-black">تأكيد</button></>}<button onClick={()=>{setUser({name:'زائر'}); setAuthOpen(false)}} className="w-full mt-2 h-10 rounded-full border text-sm font-bold">دخول كزائر</button></div></div>}

      {assistantOpen&&<div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={()=>setAssistantOpen(false)}><div className="w-full max-w-md h-3/4 bg-[#FFFCF6] rounded-t-3xl border-t border-[#EADFC9] flex flex-col" onClick={e=>e.stopPropagation()}><div className="p-4 border-b flex justify-between"><div className="font-black text-sm">حكيم – مساعد ذكي 🤖 🎤</div><button onClick={()=>setAssistantOpen(false)} className="w-8 h-8 rounded-full border">✕</button></div><div className="flex-1 overflow-auto p-4 space-y-2">{assistantMsgs.map((m,i)=><div key={i} className={`${m.role==='user'?'mr-auto bg-black text-white':'bg-white border'} max-w-[85%] rounded-2xl px-4 py-2 text-sm`}>{m.text}{m.results&&<div className="mt-2 grid gap-2">{m.results.map((o:any)=><div key={o.id} className="p-2 rounded-xl bg-[#FDF6E8] border text-xs font-bold">{o.title} - {formatPrice(o.price)}</div>)}</div>}</div>)}</div><div className="p-3 border-t bg-white flex gap-2"><button onClick={()=>{ const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition; if(!SR) return; const r=new SR(); r.lang='ar-SA'; r.onresult=(e:any)=>setAssistantInput(e.results[0][0].transcript); r.start()}} className="w-10 h-10 rounded-full bg-[#FDF6E8] border border-[#EADFC9]">🎤</button><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(()=>{const q=assistantInput; setAssistantInput(''); setAssistantMsgs(m=>[...m,{role:'user',text:q}]); let res=OFFERS; if(q.includes('مكيف')) res=OFFERS.filter(o=>o.title.includes('مكيف')); if(q.includes('عطور')) res=OFFERS.filter(o=>o.category==='عطور'); setAssistantMsgs(m=>[...m,{role:'bot',text:`لقيت ${res.length} نتائج`,results:res}])})()} placeholder="أرخص مكيف في جدة" className="flex-1 h-11 px-4 rounded-full border-2 border-[#EADFC9] bg-[#FDF6E8] text-sm outline-none"/><button onClick={()=>{const q=assistantInput; setAssistantInput(''); setAssistantMsgs(m=>[...m,{role:'user',text:q}]); setAssistantMsgs(m=>[...m,{role:'bot',text:'نتائج ذكية',results:OFFERS.slice(0,2)}])}} className="w-11 h-11 rounded-full text-white" style={{background:GOLD_DARK}}>↑</button></div></div></div>}

      {showCompare&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-3" onClick={()=>setShowCompare(false)}><div className="w-full max-w-2xl rounded-2xl bg-white p-4" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center"><h3 className="font-black">⚖️ مقارنة الأسعار</h3><button onClick={()=>setShowCompare(false)} className="w-8 h-8 rounded-full border">✕</button></div><div className="grid grid-cols-3 gap-3 mt-4">{compare.map(id=>{const o=OFFERS.find(x=>x.id===id)!; return <div key={id} className="rounded-xl border p-3"><img src={o.image} className="h-24 w-full object-cover rounded-xl"/><div className="font-bold text-sm mt-2">{o.title}</div><div className="text-sm font-black" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</div><div className="text-xs line-through text-zinc-400">{formatPrice(o.old_price)}</div><div className="text-xs mt-1">★ {o.rating} • {o.views} مشاهدة</div></div>})}</div><button onClick={()=>{setCompare([]); setShowCompare(false)}} className="w-full mt-4 h-11 rounded-full bg-black text-white font-bold text-sm">إغلاق المقارنة</button></div></div>}

      {showMapFor&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-3" onClick={()=>setShowMapFor(null)}><div className="w-full max-w-lg rounded-2xl bg-white overflow-hidden" onClick={e=>e.stopPropagation()}><iframe width="100%" height="360" style={{border:0}} src={`https://maps.google.com/maps?q=${showMapFor.location.lat},${showMapFor.location.lng}&z=16&output=embed`}/><div className="p-3"><button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${showMapFor.location.lat},${showMapFor.location.lng}`,'_blank')} className="w-full h-11 rounded-full text-white font-black" style={{background:GOLD_DARK}}>فتح في قوقل ماب 🚀</button></div></div></div>}
    </div>
  )
                }
