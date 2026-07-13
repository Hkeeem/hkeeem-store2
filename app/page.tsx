"use client"
import { useEffect, useMemo, useState, useCallback } from 'react'

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
{ id:3, title:'سلة التوفير - بنده', store:'بنده', logo:'🛒', category:'سوبرماركت', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, rating:4.4, endAt:new Date(Date.now()+2036001000).toISOString(), createdAt:new Date(Date.now()-86400000).toISOString(), location:{lat:21.5796,lng:39.1321,address:'فلسطين، جدة',district:'الحمراء'} },
]

function haversine(a:LatLng,b:LatLng){ const R=6371; const dLat=(b.lat-a.lat)Math.PI/180; const dLng=(b.lng-a.lng)Math.PI/180; const s=Math.sin(dLat/2)**2+Math.cos(a.latMath.PI/180)Math.cos(b.latMath.PI/180)Math.sin(dLng/2)**2; return 2RMath.asin(Math.sqrt(s)) }
const formatPrice=(n:number)=>${n.toLocaleString('ar-SA')} ر.س
const formatDistance=(k:number)=>k<1?${Math.round(k*1000)} م:${k.toFixed(1)} كم

function useCountdown(end:string){
const [txt,setTxt]=useState(''); useEffect(()=>{ const tick=()=>{ const d=new Date(end).getTime()-Date.now(); if(d<=0){setTxt('انتهى'); return} const h=Math.floor(d/3600000); const m=Math.floor((d%3600000)/60000); if(h>=24) setTxt(ينتهي بعد ${Math.floor(h/24)} يوم); else if(h>0) setTxt(ينتهي بعد ${h} ساعة و ${m} دقيقة); else setTxt(ينتهي بعد ${m} دقيقة) }; tick(); const id=setInterval(tick,60000); return()=>clearInterval(id)},[end]); return txt
}

export default function Page(){
const [userLoc,setUserLoc]=useState<LatLng|null>(null); const [cityManual,setCityManual]=useState<City|null>(null); const [locLoading,setLocLoading]=useState(false)
const [query,setQuery]=useState(''); const [priceMax,setPriceMax]=useState(3000); const [discountMin,setDiscountMin]=useState(0); const [selectedStore,setSelectedStore]=useState('الكل'); const [selectedCat,setSelectedCat]=useState('الكل'); const [radiusKm,setRadiusKm]=useState(10); const [nearbyOnly,setNearbyOnly]=useState(false)
const [favs,setFavs]=useState<number[]>(()=>{ try{ return JSON.parse(localStorage.getItem('hkeeem_favs')||'[]')}catch{return []}}); const [showFavsOnly,setShowFavsOnly]=useState(false)
const [user,setUser]=useState<any>(null); const [authOpen,setAuthOpen]=useState(false); const [authMode,setAuthMode]=useState<'phone'|'email'>('phone'); const [authStep,setAuthStep]=useState<'phone'|'otp'|'email'>('phone'); const [phone,setPhone]=useState(''); const [otp,setOtp]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [toast,setToast]=useState(''); const [notifOn,setNotifOn]=useState(false)

const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2600)}

useEffect(()=>{ try{ const u=localStorage.getItem('hkeeem_user'); if(u) setUser(JSON.parse(u)); const l=localStorage.getItem('hkeeem_user_location'); if(l) setUserLoc(JSON.parse(l)); const c=localStorage.getItem('hkeeem_city'); if(c) setCityManual(JSON.parse(c)); const n=localStorage.getItem('hkeeem_notif'); if(n) setNotifOn(n==='1') }catch{} },[])
useEffect(()=>{ localStorage.setItem('hkeeem_favs', JSON.stringify(favs)) },[favs])

const نقطة_المرجع = useMemo(()=> userLoc? userLoc : cityManual? {lat:cityManual.lat, lng:cityManual.lng} : null,[userLoc,cityManual])
const العروض_مع_مسافة = useMemo(()=>{ if(!نقطة_المرجع) return OFFERS.map(o=>({...o,distance:null as number|null})); return OFFERS.map(o=>({...o,distance:haversine(نقطة_المرجع,o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)) },[نقطة_المرجع])

const المفلترة = useMemo(()=>{
let arr=[...العروض_مع_مسافة]
if(query.trim()){ const q=query.toLowerCase(); arr=arr.filter(o=>o.title.toLowerCase().includes(q)||o.store.toLowerCase().includes(q)||o.category.toLowerCase().includes(q)) }
if(showFavsOnly) arr=arr.filter(o=>favs.includes(o.id))
if(nearbyOnly&&نقطة_المرجع) arr=arr.filter(o=>o.distance!==null&&o.distance<=radiusKm)
if(priceMax<3000) arr=arr.filter(o=>o.price<=priceMax)
if(discountMin>0) arr=arr.filter(o=>o.discount>=discountMin)
if(selectedStore!=='الكل') arr=arr.filter(o=>o.store===selectedStore)
if(selectedCat!=='الكل') arr=arr.filter(o=>o.category===selectedCat)
return arr
},[العروض_مع_مسافة,query,showFavsOnly,nearbyOnly,radiusKm,نقطة_المرجع,priceMax,discountMin,selectedStore,selectedCat,favs])

const جلب_الموقع = useCallback(()=>{ setLocLoading(true); navigator.geolocation.getCurrentPosition(p=>{const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); localStorage.setItem('hkeeem_user_location',JSON.stringify(l)); setLocLoading(false); showToast('تم تحديد موقعك ✅'); if(notifOn&&Notification.permission==='granted') new Notification('عروض قريبة منك 📍',{body:وجدنا ${العروض_مع_مسافة.filter(o=>o.distance!==null&&o.distance<3).length} عروض على بعد أقل من 3 كم})},()=>setLocLoading(false),{enableHighAccuracy:false,timeout:8000,maximumAge:300000}) },[notifOn,العروض_مع_مسافة])

const toggleFav=(id:number)=>{ setFavs(f=>{ const has=f.includes(id); const next=has? f.filter(x=>x!==id) : [...f,id]; if(!has&&notifOn&&Notification.permission==='granted') new Notification('تمت إضافتك للمفضلة ❤️',{body:'سننبهك عند انخفاض السعر'}); return next }) }

const requestNotif = async ()=>{
if(typeof Notification==='undefined'){showToast('المتصفح لا يدعم الإشعارات'); return}
const perm=await Notification.requestPermission()
if(perm==='granted'){ setNotifOn(true); localStorage.setItem('hkeeem_notif','1'); new Notification('تم تفعيل إشعارات عروضكم 🔔',{body:'• عرض جديد في منطقتك • انخفاض سعر المفضلة • عروض اليوم'}); showToast('تم تفعيل الإشعارات') }
}

// محاكاة إشعارات: عرض جديد + انخفاض سعر
useEffect(()=>{ if(!notifOn||!نقطة_المرجع) return; const t=setTimeout(()=>{ if(Notification.permission==='granted'){ new Notification('عرض جديد في منطقتك 📍',{body:${العروض_مع_مسافة[0]?.title} الآن قريب منك}) } },15000); return()=>clearTimeout(t)},[notifOn,نقطة_المرجع,العروض_مع_مسافة])

return (
<div className="min-h-screen pb-24 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl">
<header className="sticky top-0 z-30 bg-[#FFFCF6]/90 backdrop-blur-xl border-b border-[#EADFC9]">
<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
<div className="flex items-center gap-2"><img src="/hkeeem-icon.png" alt="" className="w-9 h-9 rounded-xl border border-[#EADFC9] bg-white object-contain"/><span className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></span>{cityManual&&<span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#FFF8E6] border border-[#EADFC9] text-[#7A5A16]">📍 {cityManual.label}</span>}</div>
<div className="flex items-center gap-2"><button onClick={()=>setAuthOpen(true)} className="px-4 h-10 rounded-full bg-white border border-[#EADFC9] text-xs font-black">{user? (user.isGuest? '👤 زائر → ترقية' : 👋 ${user.name}) : '👤 دخول'}</button><button onClick={jلب_الموقع} className="px-4 h-10 rounded-full text-white text-xs font-black shadow" style={{background:linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})}}>{locLoading?'جاري...':'📍 موقعي'}</button></div>
</div>
</header>

<main className="max-w-6xl mx-auto px-4">  
    {/* بحث قوي */}  
    <div className="mt-4 relative"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث: أرخص مكيف، عطور، بنده، جرير..." className="w-full h-12 pr-11 pl-4 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm font-medium focus:border-[#B68A2E] placeholder:text-zinc-400"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>{query&&<button onClick={()=>setQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-100 text-xs">✕</button>}</div>  

    {/* فلاتر */}  
    <div className="mt-3 p-4 rounded-2xl bg-white border border-[#EADFC9] shadow-sm">  
      <div className="flex flex-wrap gap-2 items-center">  
        <span className="text-xs font-bold">المتجر:</span>{['الكل','متجر حكيم','بنده','جرير','إكسترا'].map(s=><button key={s} onClick={()=>setSelectedStore(s)} className={`px-3 h-8 rounded-full text-xs font-bold border ${selectedStore===s?'bg-[#1F1B16] text-white border-[#1F1B16]':'bg-white border-[#EADFC9] text-zinc-600'}`}>{s}</button>)}  
        <span className="w-px h-5 bg-[#EADFC9] mx-1 hidden md:block"/><span className="text-xs font-bold">الفئة:</span>{['الكل','عطور','إلكترونيات','سوبرماركت'].map(c=><button key={c} onClick={()=>setSelectedCat(c)} className={`px-3 h-8 rounded-full text-xs font-bold border ${selectedCat===c?'bg-[#FFF3CC] border-[#E9C86A] text-[#7A5A16]':'bg-white border-[#EADFC9]'}`}>{c}</button>)}  
      </div>  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">  
        <div><div className="flex justify-between text-xs font-bold mb-1"><span>المسافة ≤ {radiusKm} كم</span><label className="flex items-center gap-1"><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#B68A2E]"/>قريبة فقط</label></div><input type="range" min={1} max={20} value={radiusKm} onChange={e=>setRadiusKm(parseInt(e.target.value))} className="w-full accent-[#B68A2E]"/></div>  
        <div><div className="flex justify-between text-xs font-bold mb-1"><span>السعر ≤ {priceMax} ر.س</span><span className="text-zinc-400">{priceMax===3000?'الكل':''}</span></div><input type="range" min={50} max={3000} step={50} value={priceMax} onChange={e=>setPriceMax(parseInt(e.target.value))} className="w-full accent-[#B68A2E]"/></div>  
        <div><div className="flex justify-between text-xs font-bold mb-1"><span>الخصم ≥ {discountMin}%</span></div><input type="range" min={0} max={60} step={5} value={discountMin} onChange={e=>setDiscountMin(parseInt(e.target.value))} className="w-full accent-[#B68A2E]"/></div>  
      </div>  
      <div className="flex flex-wrap gap-2 mt-3">  
        {CITIES.map(c=><button key={c.name} onClick={()=>{setCityManual(c); setUserLoc({lat:c.lat,lng:c.lng})}} className={`px-3 h-8 rounded-full text-xs font-bold border ${cityManual?.name===c.name?'text-white':'bg-white border-[#EADFC9]'}`} style={cityManual?.name===c.name?{background:GOLD,borderColor:GOLD}:undefined}>📍 {c.name}</button>)}  
        <button onClick={()=>setShowFavsOnly(v=>!v)} className={`mr-auto px-3 h-8 rounded-full text-xs font-bold border ${showFavsOnly?'bg-[#FFF3CC] border-[#E9C86A] text-[#7A5A16]':'bg-white border-[#EADFC9]'}`}>❤️ المفضلة {favs.length>0&&`(${favs.length})`}</button>  
        <button onClick={()=>{setQuery(''); setPriceMax(3000); setDiscountMin(0); setSelectedStore('الكل'); setSelectedCat('الكل'); setNearbyOnly(false); setRadiusKm(10); setCityManual(null); setUserLoc(null)}} className="px-3 h-8 rounded-full bg-zinc-100 text-xs font-bold">مسح الفلاتر</button>  
      </div>  
    </div>  

    {/* إشعارات */}  
    <div className="mt-4 flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-gradient-to-r from-[#FFF8E6] to-white border border-[#EADFC9]">  
      <span className="text-sm">🔔</span><span className="text-xs font-bold">الإشعارات:</span>  
      <button onClick={requestNotif} className={`px-3 h-8 rounded-full text-xs font-bold border ${notifOn?'bg-green-600 text-white border-green-600':'bg-white border-[#EADFC9]'}`}>{notifOn?'مفعلة ✅':'تفعيل Push'}</button>  
      <span className="text-xs text-zinc-500 hidden md:inline">• عرض جديد في منطقتك • انخفاض سعر المفضلة • عروض اليوم</span>  
      <button onClick={()=>{ if(Notification.permission==='granted') new Notification('عروض اليوم 🔥',{body:'3 عروض جديدة قريبة منك تنتهي اليوم'}) }} className="mr-auto px-3 h-8 rounded-full bg-[#1F1B16] text-white text-xs font-bold">جرب إشعار اليوم</button>  
    </div>  

    <div className="mt-6 flex justify-between items-center"><h2 className="font-black text-base leading-6">النتائج ({المفلترة.length})</h2><span className="text-xs text-zinc-500">{نقطة_المرجع?`مرتبة حسب الأقرب من ${cityManual?.name||'موقعك'}`:'حدد موقعك للترتيب حسب القرب'}</span></div>  

    <section className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">  
      {المفلترة.map(o=>{  
        const countdown=useCountdown(o.endAt); const isFav=favs.includes(o.id); const saved=o.old_price-o.price  
        return (  
          <article key={o.id} className="rounded-2xl bg-white border border-[#EADFC9] overflow-hidden shadow-sm flex flex-col">  
            <div className="relative"><img src={o.image} alt={o.title} className="h-48 w-full object-cover"/><span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>-{o.discount}%</span><button onClick={()=>toggleFav(o.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur border border-[#EADFC9] grid place-items-center text-base shadow-sm">{isFav?'❤️':'🤍'}</button>{o.distance!==null&&<span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-white text-xs font-bold backdrop-blur">📍 {formatDistance(o.distance)}</span>}</div>  
            <div className="p-4 flex flex-col flex-1">  
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-[#FFF8E6] border border-[#EADFC9] grid place-items-center text-sm">{o.logo}</div><div className="flex-1 min-w-0"><div className="font-black text-sm leading-5 truncate">{o.store}</div><div className="text-xs text-zinc-500 font-medium truncate">{o.location.district} • {o.location.address}</div></div><div className="text-xs font-bold text-amber-500">★ {o.rating}</div></div>  
              <h3 className="font-bold text-base leading-6 mt-3 line-clamp-2 min-h-12">{o.title}</h3>  
              <div className="mt-3"><div className="flex items-baseline gap-2 flex-wrap"><span className="font-black text-lg leading-7" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-sm line-through text-zinc-400">{formatPrice(o.old_price)}</span><span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-black">وفر {formatPrice(saved)}</span></div><div className="mt-2 flex items-center gap-2 text-xs font-bold"><span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600">⏳ {countdown}</span><span className="text-zinc-400 font-medium">• {o.views.toLocaleString()} مشاهدة</span></div></div>  
              <div className="flex gap-2 mt-4 mt-auto"><button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`,'_blank')} className="flex-1 h-11 rounded-full text-sm font-black text-white shadow-sm" style={{background:GOLD_DARK}}>الوصول 🚗</button><button onClick={()=>showToast('تمت إضافة للمقارنة')} className="w-11 h-11 rounded-full border bg-[#FFF8E6] border-[#EADFC9] grid place-items-center text-sm">⚖️</button></div>  
            </div>  
          </article>  
        )  
      })}  
    </section>  

    {المفلترة.length===0&&<div className="mt-10 text-center py-12 rounded-2xl bg-white border border-dashed border-[#EADFC9]"><div className="text-2xl">🔍</div><div className="font-bold mt-2">لا توجد نتائج</div><div className="text-sm text-zinc-500 mt-1">جرب توسيع الفلاتر أو مسح البحث</div></div>}  
  </main>  

  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1F1B16] text-white px-5 py-2.5 rounded-full text-xs font-bold z-50 shadow-xl border border-white/10">{toast}</div>}  

  {authOpen&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setAuthOpen(false)}><div className="w-full max-w-sm rounded-3xl bg-[#FFFCF6] border border-[#EADFC9] p-6 shadow-2xl" onClick={e=>e.stopPropagation()}>  
    <div className="flex justify-between items-center"><h2 className="font-black text-base">تسجيل الدخول</h2><button onClick={()=>setAuthOpen(false)} className="w-8 h-8 rounded-full border border-[#EADFC9] grid place-items-center">✕</button></div>  
    <p className="text-xs text-zinc-500 mt-1">ادخل كضيف أولاً ثم حول حسابك مع الاحتفاظ بالمفضلة</p>  
    <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-full bg-[#FDF6E8] border border-[#EADFC9]"><button onClick={()=>{setAuthMode('phone'); setAuthStep('phone')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='phone'?'bg-[#1F1B16] text-white shadow':'text-zinc-500'}`}>📱 جوال + OTP</button><button onClick={()=>{setAuthMode('email'); setAuthStep('email')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='email'?'bg-[#1F1B16] text-white shadow':'text-zinc-500'}`}>✉️ بريد (اختياري)</button></div>  
    {authMode==='phone'?(authStep==='phone'?<><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} inputMode="numeric" placeholder="05XXXXXXXX" className="w-full mt-4 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm font-medium focus:border-[#B68A2E]"/><button onClick={()=>{ if(!/^(05\d{8})$/.test(phone)){showToast('رقم غير صحيح'); return} setAuthStep('otp'); showToast('كودك: 123456 للتجربة')}} className="w-full mt-3 h-12 rounded-full text-white font-black text-sm shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>إرسال رمز التحقق</button></>:<><div className="text-center mt-4"><div className="text-sm font-bold">أدخل رمز 6 أرقام</div><div className="text-xs text-zinc-500">أرسلنا إلى {phone}</div></div><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" placeholder="123456" className="w-full mt-3 h-14 text-center text-xl font-black tracking-[0.4em] rounded-2xl border-2 border-[#EADFC9] outline-none focus:border-[#B68A2E]"/><button onClick={()=>{ if(otp!=='123456'){showToast('الكود خطأ'); return} const u={name:`عميل ${phone.slice(-4)}`, phone, isGuest:false, favs}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false); showToast(`أهلاً ${u.name} 💛`) }} className="w-full mt-3 h-12 rounded-full bg-[#1F1B16] text-white font-black text-sm">تأكيد ودخول</button><button onClick={()=>setAuthStep('phone')} className="w-full mt-2 text-xs font-bold text-zinc-500">تغيير الرقم</button></>):<><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد الإلكتروني (اختياري)" className="w-full mt-4 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="كلمة المرور" className="w-full mt-2 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] bg-white outline-none text-sm"/><button onClick={()=>{ const u={name:email.split('@')[0]||'مستخدم', email, isGuest:false, favs}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false); showToast('تم إنشاء الحساب') }} className="w-full mt-3 h-12 rounded-full text-white font-black text-sm" style={{background:GOLD_DARK}}>إنشاء / دخول</button></>}  
    <div className="mt-5 pt-4 border-t border-[#EADFC9]"><button onClick={()=>{ const u={name:'زائر', isGuest:true, favs}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false); showToast('دخلت كزائر - يمكنك الترقية لاحقاً مع الاحتفاظ بالمفضلة') }} className="w-full h-11 rounded-full bg-white border border-[#EADFC9] text-sm font-bold">👁️ الدخول كضيف أولاً ثم تحويل للحساب</button>{user?.isGuest&&<div className="mt-2 text-xs text-center text-amber-700 bg-amber-50 border border-amber-200 rounded-full py-2 font-bold">أنت زائر الآن - سجل جوالك للاحتفاظ بالمفضلة والإشعارات</div>}</div>  
  </div></div>}  
</div>

)
  }
