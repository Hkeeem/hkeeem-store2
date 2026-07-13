"use client"
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

type LatLng = { lat:number; lng:number }
type City = { name:string; label:string; lat:number; lng:number }
type Offer = { id:number; title:string; store:string; price:number; old_price:number; discount:number; image:string; location: LatLng & { address:string; district:string } }
type OfferWithDistance = Offer & { distance:number|null }

const GOLD = "#B68A2E"
const GOLD_DARK = "#7A5A16"
const GOLD_LIGHT = "#D4AF37"
const BEIGE_BG = "bg-[#FDF6E8]"

const CITIES: City[] = [
{ name:'جدة', label:'حي الروضة، جدة', lat:21.543333, lng:39.172778 },
{ name:'مكة', label:'العزيزية، مكة', lat:21.389082, lng:39.857912 },
{ name:'الرياض', label:'العليا، الرياض', lat:24.713552, lng:46.675297 },
{ name:'الدمام', label:'الشاطئ، الدمام', lat:26.42068, lng:50.088795 },
]

const OFFERS: Offer[] = [
{ id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', location:{lat:21.5439, lng:39.1731, address:'حي الروضة، جدة', district:'الروضة'} },
{ id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', location:{lat:21.5451, lng:39.1702, address:'حي الروضة، جدة', district:'الروضة'} },
{ id:3, title:'سلة التوفير - بنده', store:'بنده', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', location:{lat:21.57961, lng:39.13214, address:'شارع فلسطين، جدة', district:'الحمراء'} },
{ id:4, title:'آيباد برو M2 12.9', store:'جرير', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', location:{lat:21.55226, lng:39.15801, address:'شارع التحلية، جدة', district:'الأندلس'} },
{ id:5, title:'زيت زيتون بكر', store:'التميمي', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', location:{lat:21.48581, lng:39.19250, address:'حي السامر، جدة', district:'السامر'} },
]

function haversine(a:LatLng, b:LatLng){
const R=6371
const dLat=(b.lat-a.lat)Math.PI/180
const dLng=(b.lng-a.lng)Math.PI/180
const s=Math.sin(dLat/2)**2 + Math.cos(a.latMath.PI/180)Math.cos(b.latMath.PI/180)Math.sin(dLng/2)**2
return 2RMath.asin(Math.sqrt(s))
}
const formatDistance = (km:number)=> km<1? ${Math.round(km*1000)} م : ${km.toFixed(1)} كم
const formatPrice = (n:number)=> ${n.toLocaleString('ar-SA')} ر.س

export default function Page(){
// موقع
const [userLoc,setUserLoc]=useState<LatLng|null>(null)
const [cityManual,setCityManual]=useState<City|null>(null)
const [locLoading,setLocLoading]=useState(false)
const [locError,setLocError]=useState('')
const [radiusKm,setRadiusKm]=useState(5)
const [nearbyOnly,setNearbyOnly]=useState(false)
const [showMapFor,setShowMapFor]=useState<OfferWithDistance|null>(null)
const [showAllMap,setShowAllMap]=useState(false)
const [toast,setToast]=useState('')
// دخول
const [authOpen,setAuthOpen]=useState(false)
const [authMode,setAuthMode]=useState<'phone'|'email'>('phone')
const [authStep,setAuthStep]=useState<'id'|'otp'|'login'|'signup'|'forgot'>('id')
const [phone,setPhone]=useState(''); const [otp,setOtp]=useState('')
const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('')
const [authError,setAuthError]=useState(''); const [user,setUser]=useState<any>(null)
// مساعد
const [assistantOpen,setAssistantOpen]=useState(false)
const [assistantInput,setAssistantInput]=useState('')
const [assistantMsgs,setAssistantMsgs]=useState<any[]>([{role:'bot', text:'أهلاً أنا حكيم 🤖 مساعدك الذكي، قل: أرخص آيفون، عطور أقل من 200، وين أقرب جرير، أو ارفع صورة'}])
const [isListening,setIsListening]=useState(false)

const showToast = useCallback((m:string)=>{setToast(m); setTimeout(()=>setToast(''),2500)},[])

useEffect(()=>{
try{
const u=localStorage.getItem('hkeeem_user'); if(u) setUser(JSON.parse(u))
const s=localStorage.getItem('hkeeem_user_location'); if(s) setUserLoc(JSON.parse(s))
const c=localStorage.getItem('hkeeem_city'); if(c) setCityManual(JSON.parse(c))
}catch{}
},[])

// 1. نقطة المرجع الموحدة - فكرتك
const نقطة_المرجع = useMemo<LatLng|null>(()=>{
if(userLoc) return userLoc
if(cityManual) return {lat:cityManual.lat, lng:cityManual.lng}
return null
},[userLoc, cityManual])

const العروض_المرتبة: OfferWithDistance[] = useMemo(()=>{
if(!نقطة_المرجع) return OFFERS.map(o=>({...o, distance:null}))
return OFFERS.map(o=>({...o, distance:haversine(نقطة_المرجع, o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity))
},[نقطة_المرجع])

const العروض_المفلترة = useMemo(()=>{
if(!nearbyOnly ||!نقطة_المرجع) return العروض_المرتبة
return العروض_المرتبة.filter(o=>o.distance!==null && o.distance <= radiusKm)
},[العروض_المرتبة, nearbyOnly, radiusKm, نقطة_المرجع])

const currentLabel = useMemo(()=>{
if(cityManual) return 📍 ${cityManual.label}
if(!نقطة_المرجع) return null
return 📍 ${العروض_المرتبة[0]?.location.district || 'موقعك الحالي'}، جدة
},[cityManual, نقطة_المرجع, العروض_المرتبة])

const جلب_الموقع = useCallback(()=>{
setLocLoading(true); setLocError('')
if(!navigator.geolocation){ setLocError('المتصفح لا يدعم تحديد الموقع'); setLocLoading(false); return }
navigator.geolocation.getCurrentPosition(pos=>{
const loc={lat:pos.coords.latitude, lng:pos.coords.longitude}
setUserLoc(loc); setCityManual(null)
localStorage.setItem('hkeeem_user_location', JSON.stringify(loc)); localStorage.removeItem('hkeeem_city')
setLocLoading(false); showToast('تم تحديد موقعك ✅')
},err=>{ setLocError(err.code===1?'يجب السماح بالوصول للموقع':'تعذر الحصول على الموقع'); setLocLoading(false) },
{enableHighAccuracy:false, timeout:8000, maximumAge:300000})
},[showToast])

const openMaps = (loc:LatLng)=> window.open(https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng},'_blank')

// Auth handlers
const handleSendOtp = ()=>{ if(!/^(05\d{8})$/.test(phone)){ setAuthError('رقم الجوال يجب أن يكون 05XXXXXXXX'); return } setAuthError(''); setAuthStep('otp'); showToast('كود التحقق: 123456') }
const handleVerifyOtp = ()=>{ if(otp!=='123456'){ setAuthError('الكود خطأ، جرب 123456'); return } const u={name:name||'عميل حكيم', phone}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false); showToast(أهلاً ${u.name} 💛) }
const handleEmailLogin = ()=>{ if(!email.includes('@')||password.length<4){ setAuthError('تأكد من البيانات'); return } const u={name:email.split('@')[0], email}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false) }
const handleGuest = ()=>{ const u={name:'زائر', isGuest:true}; setUser(u); setAuthOpen(false) }

// Assistant handlers
const parseQuery = (q:string)=>{
const l=q.toLowerCase()
if(l.includes('ارخص')&& (l.includes('ايفون')||l.includes('ايباد'))) return العروض_المرتبة.filter(o=>o.title.includes('آيباد')).sort((a,b)=>a.price-b.price).slice(0,3)
if(l.includes('عطور')&& l.match(/\d+/)){ const m=l.match(/(\d+)/); const max=m?parseInt(m[1]):200; return OFFERS.filter(o=>o.title.includes('عطر')&&o.price<max) }
if(l.includes('قريب')||l.includes('حولي')) return العروض_المرتبة.filter(o=>o.distance!==null&&o.distance<3).slice(0,4)
if(l.includes('جرير')) return OFFERS.filter(o=>o.store.includes('جرير'))
if(l.includes('قارن')) return {type:'compare'}; if(l.includes('نبهني')) return {type:'watch'}
return null
}
const handleAssistantSend = ()=>{
if(!assistantInput.trim()) return
const q=assistantInput; setAssistantInput(''); setAssistantMsgs(m=>[...m,{role:'user', text:q}])
const res:any=parseQuery(q)
setTimeout(()=>{
if(Array.isArray(res)&&res.length) setAssistantMsgs(m=>[...m,{role:'bot', text:لقيت لك ${res.length} عروض تناسب "${q}" 🔥, results:res}])
else if(res?.type==='compare') setAssistantMsgs(m=>[...m,{role:'bot', text:'مقارنة: بنده أرخص في السلة اليومية بـ 12%، جرير أفضل في الإلكترونيات. تحب أعرض لك الأقرب؟'}])
else if(res?.type==='watch'){ setAssistantMsgs(m=>[...m,{role:'bot', text:'تم ✅ بذكرك أول ما ينزل السعر 🔔'}]); if(typeof Notification!=='undefined'&&Notification.permission==='granted') new Notification('تنبيه حكيم',{body:'تم تفعيل التنبيه'}) }
else setAssistantMsgs(m=>[...m,{role:'bot', text:فهمت "${q}"، جرب: "أفضل عرض قريب مني" أو "عطور أقل من 200" أو "وين أقرب جرير"}])
},400)
}
const handleVoice = ()=>{
// @ts-ignore
const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ showToast('المتصفح لا يدعم الصوت'); return }
// @ts-ignore
const rec=new SR(); rec.lang='ar-SA'; rec.onstart=()=>setIsListening(true); rec.onend=()=>setIsListening(false); rec.onresult=(e:any)=>setAssistantInput(e.results[0][0].transcript); rec.start()
}

return (
<div className={min-h-screen pb-28 ${BEIGE_BG} text-[#1F1B16] antialiased} dir="rtl">
<header className="sticky top-0 z-30 backdrop-blur-xl bg-[#FFFCF6]/90 border-b border-[#EADFC9]">
<div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
<div className="flex items-center gap-2.5"><img src="/hkeeem-icon.png" alt="" className="w-9 h-9 rounded-xl border border-[#EADFC9] bg-white object-contain"/><span className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></span>{currentLabel&&<span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-[#FFF8E6] text-[#7A5A16] border-[#EADFC9]">{currentLabel}</span>}</div>
<button onClick={()=>setAuthOpen(true)} className="px-4 h-10 rounded-full border bg-white border-[#EADFC9] text-xs font-black">{user? 👋 ${user.name} : '👤 تسجيل الدخول'}</button>
</div>
{currentLabel&&<div className="md:hidden px-4 pb-2 text-xs text-zinc-600 font-medium">{currentLabel}</div>}
</header>

<main className="max-w-7xl mx-auto px-4">  
    <div className="mt-4 grid grid-cols-1"><button onClick={()=>{جلب_الموقع(); setNearbyOnly(true); setRadiusKm(3)}} className="w-full h-12 rounded-2xl bg-[#1F1B16] text-white text-sm font-black shadow">📍 العروض حولي الآن</button></div>  

    <div className="mt-4 flex flex-wrap items-center gap-2">  
      <button onClick={جلب_الموقع} className="px-4 h-10 rounded-full bg-white border border-[#EADFC9] text-xs font-bold shadow-sm">{locLoading?'جاري...':'استخدم موقعي'}</button>  
      {CITIES.map(c=><button key={c.name} onClick={()=>{setCityManual(c); setUserLoc({lat:c.lat,lng:c.lng}); localStorage.setItem('hkeeem_city',JSON.stringify(c))}} className={`px-4 h-9 rounded-full text-xs font-bold border ${cityManual?.name===c.name?'text-white border-[#B68A2E]':'bg-white border-[#EADFC9] text-zinc-600'}`} style={cityManual?.name===c.name?{background:GOLD}:undefined}>{c.name}</button>)}  
      <div className="h-6 w-px bg-[#EADFC9] hidden md:block"/>  
      {[1,3,5,10].map(k=><button key={k} onClick={()=>{setRadiusKm(k); setNearbyOnly(true)}} className={`px-3 h-9 rounded-full text-xs font-bold border ${nearbyOnly&&radiusKm===k?'bg-[#1F1B16] text-white border-[#1F1B16]':'bg-white border-[#EADFC9] text-zinc-600'}`}>داخل {k} كم</button>)}  
      <label className={`px-3 h-9 rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${nearbyOnly?'bg-[#1F1B16] text-white border-[#1F1B16]':'bg-white border-[#EADFC9] text-zinc-600'}`}><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="w-3.5 h-3.5 accent-[#B68A2E]"/>قريبة فقط</label>  
    </div>  

    {locError&&<p className="text-xs text-red-500 mt-3">⚠️ {locError}</p>}  

    <div className="mt-8 mb-5 flex justify-between items-end"><h2 className="font-black text-base">{nearbyOnly? `العروض داخل ${radiusKm} كم` : 'كل العروض مرتبة حسب القرب'}</h2><span className="text-xs text-zinc-500">{العروض_المفلترة.length} عرض</span></div>  

    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">  
      {العروض_المفلترة.map(o=>(  
        <article key={o.id} className="rounded-2xl border bg-white border-[#EADFC9] shadow-sm flex flex-col overflow-hidden">  
          <div className="relative"><img src={o.image} alt={o.title} className="h-36 w-full object-cover"/><span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>-{o.discount}%</span>{o.distance!==null&&<span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-black/80 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}{o.distance!==null&&o.distance<3&&<span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-[#FFF3CC] border border-[#E9C86A] text-[#7A5A16] text-xs font-black">🔥 قريب منك</span>}</div>  
          <div className="p-3 flex flex-col flex-1"><div className="text-xs text-zinc-500 font-medium">🏬 {o.store} • {o.location.district}</div><h3 className="font-bold text-sm leading-5 line-clamp-2 mt-1 min-h-10">{o.title}</h3><div className="flex items-baseline gap-1.5 mt-2"><span className="font-black text-sm" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-xs text-zinc-400 line-through">{formatPrice(o.old_price)}</span></div><div className="flex gap-1.5 mt-3 mt-auto"><button onClick={()=>openMaps(o.location)} className="flex-1 h-9 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>الوصول 🚗</button><button onClick={()=>setShowMapFor(o)} className="w-9 h-9 rounded-full border bg-[#FFF8E6] border-[#EADFC9] grid place-items-center">🗺️</button></div></div>  
        </article>  
      ))}  
    </section>  
  </main>  

  <button onClick={()=>setShowAllMap(true)} className="fixed bottom-24 left-4 z-30 h-12 px-5 rounded-full shadow-xl border-2 border-white flex items-center gap-2 text-sm font-black text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🗺️ خريطة كل العروض</button>  
  <button onClick={()=>setAssistantOpen(true)} className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-xl border-2 border-white grid place-items-center text-xl" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🤖</button>  

  {toast&&<div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#1F1B16] text-white px-5 py-2.5 rounded-full text-xs font-bold z-50 shadow-xl border border-[#B68A2E]/30">{toast}</div>}  

  {authOpen&&(  
  <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setAuthOpen(false)}>  
    <div className="w-full max-w-[400px] rounded-3xl bg-[#FFFCF6] border border-[#EADFC9] shadow-2xl p-6" onClick={e=>e.stopPropagation()}>  
      <div className="flex justify-between items-center"><div className="flex items-center gap-2"><img src="/hkeeem-icon.png" className="w-8 h-8" alt=""/><h2 className="font-black text-base">تسجيل الدخول</h2></div><button onClick={()=>setAuthOpen(false)} className="w-8 h-8 rounded-full border border-[#EADFC9] grid place-items-center">✕</button></div>  
      <div className="mt-5 grid grid-cols-2 gap-1 p-1 rounded-full bg-[#FDF6E8] border border-[#EADFC9]"><button onClick={()=>{setAuthMode('phone'); setAuthStep('id')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='phone'?'bg-[#1F1B16] text-white':'text-zinc-500'}`}>📱 جوال</button><button onClick={()=>{setAuthMode('email'); setAuthStep('login')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='email'?'bg-[#1F1B16] text-white':'text-zinc-500'}`}>✉️ إيميل</button></div>  
      {authMode==='phone'? (authStep==='id'?<><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,''))} placeholder="05XXXXXXXX" className="w-full mt-5 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] outline-none text-sm focus:border-[#B68A2E]"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="اسمك (اختياري)" className="w-full mt-3 h-11 px-4 rounded-2xl border border-[#EADFC9] text-sm"/><button onClick={handleSendOtp} className="w-full mt-4 h-12 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>إرسال رمز التحقق</button></>:<><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="123456" className="w-full mt-5 h-14 text-center text-xl font-black tracking-[0.35em] rounded-2xl border-2 border-[#EADFC9] outline-none focus:border-[#B68A2E]"/>{authError&&<p className="text-xs text-red-500 mt-2 text-center">{authError}</p>}<button onClick={handleVerifyOtp} className="w-full mt-4 h-12 rounded-full bg-[#1F1B16] text-white font-black text-sm">دخول</button></>):(authStep==='login'?<><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="البريد الإلكتروني" className="w-full mt-5 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="كلمة المرور" className="w-full mt-3 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/>{authError&&<p className="text-xs text-red-500 mt-2">{authError}</p>}<button onClick={handleEmailLogin} className="w-full mt-4 h-12 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>تسجيل الدخول</button><button onClick={()=>setAuthStep('forgot')} className="w-full mt-2 text-xs text-[#B68A2E] font-bold">نسيت كلمة المرور؟</button></>:authStep==='forgot'?<><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="بريدك" className="w-full mt-5 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><button onClick={()=>{showToast('تم إرسال رابط الاستعادة'); setAuthStep('login')}} className="w-full mt-4 h-12 rounded-full bg-[#1F1B16] text-white font-black text-sm">إرسال الرابط</button></>:<><input value={name} onChange={e=>setName(e.target.value)} placeholder="الاسم" className="w-full mt-5 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="الإيميل" className="w-full mt-3 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="كلمة المرور" className="w-full mt-3 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><button onClick={handleEmailLogin} className="w-full mt-4 h-12 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>إنشاء حساب</button></>)}  
      <div className="mt-6 pt-4 border-t border-[#EADFC9] flex flex-col gap-2"><button onClick={()=>setAuthStep(authMode==='phone'?'id':'signup')} className="text-xs font-bold text-zinc-600">إنشاء حساب جديد</button><button onClick={handleGuest} className="h-11 rounded-full border border-[#EADFC9] bg-white text-sm font-bold">أو الدخول كزائر 👁️</button></div>  
    </div>  
  </div>)}  

  {assistantOpen&&(  
  <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm grid place-items-end" onClick={()=>setAssistantOpen(false)}>  
    <div className="w-full max-w-md h-[85vh] bg-[#FFFCF6] rounded-t-3xl border-t border-[#EADFC9] shadow-2xl flex flex-col" onClick={e=>e.stopPropagation()}>  
      <div className="p-4 border-b border-[#EADFC9] flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full grid place-items-center text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🤖</div><div><div className="font-black text-sm">حكيم – مساعد عروضكم الذكي</div><div className="text-xs text-green-600">● متصل • يتذكر مفضلتك • يعرف موقعك</div></div></div><button onClick={()=>setAssistantOpen(false)} className="w-8 h-8 rounded-full border border-[#EADFC9]">✕</button></div>  
      <div className="flex-1 overflow-auto p-4 space-y-3">{assistantMsgs.map((m,i)=><div key={i} className={`${m.role==='user'?'mr-auto bg-[#1F1B16] text-white':'bg-white border border-[#EADFC9]'} max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6`}>{m.text}{m.results&&<div className="mt-3 grid gap-2">{m.results.map((o:any)=><div key={o.id} className="flex gap-2 p-2 rounded-xl border border-[#EADFC9] bg-[#FDF6E8]"><img src={o.image} className="w-12 h-12 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-xs">{o.title}</div><div className="text-xs" style={{color:GOLD_DARK}}>{formatPrice(o.price)} • {o.distance!==null? formatDistance(o.distance): o.location.district}</div></div><button onClick={()=>openMaps(o.location)} className="text-xs px-2 h-7 rounded-full bg-[#1F1B16] text-white">خريطة</button></div>)}</div>}</div>)}</div>  
      <div className="p-3 border-t border-[#EADFC9] bg-white rounded-t-2xl">  
        <div className="flex gap-2 items-center"><label className="w-10 h-10 rounded-full bg-[#FDF6E8] border border-[#EADFC9] grid place-items-center cursor-pointer">📷<input type="file" accept="image/*" hidden onChange={(e)=>{setAssistantMsgs(m=>[...m,{role:'user', text:'📷 [صورة]'}]); setTimeout(()=>setAssistantMsgs(m=>[...m,{role:'bot', text:'تعرفت على المنتج: عطر فاخر! لقيت بدائل أرخص:', results:OFFERS.filter(o=>o.title.includes('عطر')).slice(0,2)}]),600)}}/></label><button onClick={handleVoice} className={`w-10 h-10 rounded-full border grid place-items-center ${isListening?'bg-red-500 text-white animate-pulse':'bg-[#FDF6E8] border-[#EADFC9]'}`}>🎤</button><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAssistantSend()} placeholder="اسأل حكيم..." className="flex-1 h-11 px-4 rounded-full border-2 border-[#EADFC9] bg-[#FDF6E8] outline-none text-sm focus:border-[#B68A2E]"/><button onClick={handleAssistantSend} className="w-11 h-11 rounded-full text-white grid place-items-center" style={{background:GOLD_DARK}}>↑</button></div>  
        <div className="flex gap-1.5 mt-2 overflow-x-auto"><button onClick={()=>setAssistantInput('أرخص آيفون')} className="whitespace-nowrap px-3 h-7 rounded-full bg-[#FFF8E6] border border-[#EADFC9] text-xs">أرخص آيفون</button><button onClick={()=>setAssistantInput('عطور أقل من 200')} className="whitespace-nowrap px-3 h-7 rounded-full bg-[#FFF8E6] border border-[#EADFC9] text-xs">عطور أقل من 200</button><button onClick={()=>setAssistantInput('وين أقرب جرير')} className="whitespace-nowrap px-3 h-7 rounded-full bg-[#FFF8E6] border border-[#EADFC9] text-xs">أقرب جرير</button></div>  
      </div>  
    </div>  
  </div>)}  

  {showMapFor&&(<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3" onClick={()=>setShowMapFor(null)}><div className="w-full max-w-lg rounded-2xl overflow-hidden bg-white border border-[#EADFC9] shadow-2xl" onClick={e=>e.stopPropagation()}><div className="p-4 flex justify-between border-b"><div><div className="font-black text-sm">{showMapFor.store}</div><div className="text-xs text-zinc-500">{showMapFor.location.address} {showMapFor.distance!==null&&`• ${formatDistance(showMapFor.distance)}`}</div></div><button onClick={()=>setShowMapFor(null)} className="w-8 h-8 rounded-full border">✕</button></div><iframe title="map" width="100%" height="360" style={{border:0}} src={`https://maps.google.com/maps?q=${showMapFor.location.lat},${showMapFor.location.lng}&z=16&output=embed`}/><div className="p-3 grid grid-cols-2 gap-2"><button onClick={()=>openMaps(showMapFor.location)} className="h-11 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>فتح في قوقل ماب 🚀</button><button onClick={()=>setShowMapFor(null)} className="h-11 rounded-full border bg-white border-[#EADFC9] font-bold text-sm">إغلاق</button></div></div></div>)}  
  {showAllMap&&(<div className="fixed inset-0 z-50 bg-[#FDF6E8]"><div className="h-14 px-4 flex justify-between items-center border-b bg-[#FFFCF6] border-[#EADFC9]"><h3 className="font-black text-sm">🗺️ خريطة كل العروض</h3><button onClick={()=>setShowAllMap(false)} className="px-4 h-9 rounded-full bg-[#1F1B16] text-white text-sm font-bold">إغلاق</button></div><iframe title="all" width="100%" height="calc(100vh - 56px)" style={{border:0}} src={`https://www.openstreetmap.org/export/embed.html?bbox=39.0%2C21.3%2C39.4%2C21.7&layer=mapnik&marker=${CITIES[0].lat}%2C${CITIES[0].lng}`}/></div>)}  
</div>

)
                             }
