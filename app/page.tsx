"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

type LatLng = { lat:number; lng:number }
type City = { name:string; label:string; lat:number; lng:number }
type Offer = { id:number; title:string; store:string; price:number; old_price:number; discount:number; image:string; isOwn?:boolean; location: LatLng & { address:string; district:string } }
type OfferWithDistance = Offer & { distance:number|null }
type Tab = 'home'|'stores'|'haraj'|'office'|'hkeem'

const GOLD="#B68A2E"; const GOLD_DARK="#7A5A16"; const GOLD_LIGHT="#D4AF37"; const BEIGE_BG="bg-[#FDF6E8]"

const CITIES: City[] = [
  { name:'جدة', label:'حي الروضة، جدة', lat:21.543333, lng:39.172778 },
  { name:'مكة', label:'العزيزية، مكة', lat:21.389082, lng:39.857912 },
  { name:'الرياض', label:'العليا، الرياض', lat:24.713552, lng:46.675297 },
  { name:'الدمام', label:'الشاطئ، الدمام', lat:26.42068, lng:50.088795 },
]

const STORES = [
  { id:'hkeem', name:'متجر حكيم', count:12, color:'#B68A2E', icon:'💛' },
  { id:'panda', name:'بنده', count:8, color:'#E30613', icon:'🛒' },
  { id:'jarir', name:'جرير', count:15, color:'#0033A0', icon:'📚' },
  { id:'extra', name:'إكسترا', count:9, color:'#FF6600', icon:'🔌' },
]

const HARAJ = [
  { id:101, title:'ايفون 14 برو مستعمل نظيف', price:2800, image:'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600', district:'الصفا، جدة', time:'منذ ساعتين', seller:'ابو احمد' },
  { id:102, title:'طقم عطور فاخر - استخدام بسيط', price:450, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', district:'الروضة، جدة', time:'منذ 5 ساعات', seller:'متجر حكيم' },
]

const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', isOwn:true, location:{lat:21.5439, lng:39.1731, address:'حي الروضة، جدة', district:'الروضة'} },
  { id:2, title:'محفظة جلد + ساعة', store:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', isOwn:true, location:{lat:21.5451, lng:39.1702, address:'حي الروضة، جدة', district:'الروضة'} },
  { id:3, title:'سلة التوفير - بنده', store:'بنده', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', location:{lat:21.57961, lng:39.13214, address:'شارع فلسطين، جدة', district:'الحمراء'} },
  { id:4, title:'آيباد برو M2', store:'جرير', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', location:{lat:21.55226, lng:39.15801, address:'شارع التحلية، جدة', district:'الأندلس'} },
  { id:5, title:'زيت زيتون بكر', store:'التميمي', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', location:{lat:21.48581, lng:39.1925, address:'حي السامر، جدة', district:'السامر'} },
]

function haversine(a:LatLng,b:LatLng){ const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180; const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return 2*R*Math.asin(Math.sqrt(s)) }
const formatDistance=(k:number)=>k<1?`${Math.round(k*1000)} م`:`${k.toFixed(1)} كم`
const formatPrice=(n:number)=>`${n.toLocaleString('ar-SA')} ر.س`

export default function Page(){
  const [tab,setTab]=useState<Tab>('home')
  const [userLoc,setUserLoc]=useState<LatLng|null>(null); const [cityManual,setCityManual]=useState<City|null>(null)
  const [locLoading,setLocLoading]=useState(false); const [locError,setLocError]=useState(''); const [radiusKm,setRadiusKm]=useState(5); const [nearbyOnly,setNearbyOnly]=useState(false)
  const [showMapFor,setShowMapFor]=useState<any>(null); const [showAllMap,setShowAllMap]=useState(false)
  const [authOpen,setAuthOpen]=useState(false); const [authMode,setAuthMode]=useState<'phone'|'email'>('phone'); const [authStep,setAuthStep]=useState<'id'|'otp'|'login'>('id')
  const [phone,setPhone]=useState(''); const [otp,setOtp]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [user,setUser]=useState<any>(null); const [toast,setToast]=useState('')
  const [assistantOpen,setAssistantOpen]=useState(false); const [assistantInput,setAssistantInput]=useState(''); const [assistantMsgs,setAssistantMsgs]=useState<any[]>([{role:'bot', text:'أهلاً أنا حكيم 🤖 أقدر أبحث لك في العروض والمتاجر وحراج ومكتبك، قل: وين أقرب جرير أو عطور أقل من 200'}])
  const [favs,setFavs]=useState<number[]>([1]); const [cart,setCart]=useState<number[]>([])
  // بحث ومسح
  const [searchQ,setSearchQ]=useState(''); const [scanning,setScanning]=useState(false); const qrRef=useRef<Html5Qrcode|null>(null)
  // صفحات قانونية
  const [legal,setLegal]=useState<null|'privacy'|'terms'|'contact'|'about'|'share'>(null)
  const [cName,setCName]=useState(''); const [cPhone,setCPhone]=useState(''); const [cMsg,setCMsg]=useState('')

  const showToast=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),3000)}

  useEffect(()=>{ try{ const u=localStorage.getItem('hkeeem_user'); if(u) setUser(JSON.parse(u)); const s=localStorage.getItem('hkeeem_user_location'); if(s) setUserLoc(JSON.parse(s)); const c=localStorage.getItem('hkeeem_city'); if(c) setCityManual(JSON.parse(c)) }catch{} },[])

  const refPoint = useMemo(()=>{ if(userLoc) return userLoc; if(cityManual) return {lat:cityManual.lat, lng:cityManual.lng}; return null },[userLoc,cityManual])
  const sortedOffers:OfferWithDistance[] = useMemo(()=>{ if(!refPoint) return OFFERS.map(o=>({...o,distance:null})); return OFFERS.map(o=>({...o,distance:haversine(refPoint,o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)) },[refPoint])
  const filteredOffers = useMemo(()=>{ let list=sortedOffers; if(searchQ.trim()){ const q=searchQ.trim(); list=list.filter(o=>o.title.includes(q)||o.store.includes(q)) } if(nearbyOnly&&refPoint) return list.filter(o=>o.distance!==null&&o.distance<=radiusKm); return list },[sortedOffers,nearbyOnly,radiusKm,refPoint,searchQ])
  const currentLabel = useMemo(()=>{ if(cityManual) return `📍 ${cityManual.label}`; if(!refPoint) return null; return `📍 ${sortedOffers[0]?.location.district||'موقعك الحالي'}` },[cityManual,refPoint,sortedOffers])

  const getLocation = useCallback(()=>{ setLocLoading(true); if(!navigator.geolocation){setLocError('المتصفح لا يدعم'); setLocLoading(false); return} navigator.geolocation.getCurrentPosition(p=>{const l={lat:p.coords.latitude,lng:p.coords.longitude}; setUserLoc(l); setCityManual(null); localStorage.setItem('hkeeem_user_location',JSON.stringify(l)); setLocLoading(false); showToast('تم تحديد موقعك')},()=>{setLocError('تعذر الحصول'); setLocLoading(false)},{enableHighAccuracy:false,timeout:8000,maximumAge:300000}) },[])
  const openMaps=(loc:LatLng)=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,'_blank')

  // Scanner
  const stopScan=async()=>{ try{await qrRef.current?.stop(); await qrRef.current?.clear()}catch{} setScanning(false) }
  const startScan=async()=>{ setScanning(true); setTimeout(async()=>{ try{ const r=new Html5Qrcode('reader'); qrRef.current=r; await r.start({facingMode:'environment'},{fps:10,qrbox:{width:250,height:250}},(d)=>{ setSearchQ(d); stopScan(); showToast(`تم مسح: ${d}`)},()=>{}) }catch{ setScanning(false); showToast('تعذر فتح الكاميرا') } },200) }

  const handleSendOtp=()=>{ if(!/^(05\d{8})$/.test(phone)){showToast('رقم الجوال 05XXXXXXXX'); return} setAuthStep('otp'); showToast('كودك: 123456') }
  const handleVerify=()=>{ if(otp!=='123456'){showToast('الكود خطأ'); return} const u={name:name||'عميل حكيم',phone}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false) }
  const handleAssistant=()=>{ if(!assistantInput.trim()) return; const q=assistantInput; setAssistantInput(''); setAssistantMsgs(m=>[...m,{role:'user',text:q}]); const l=q.toLowerCase(); let res:any=sortedOffers.slice(0,3); if(l.includes('عطور')||l.includes('عطر')) res=OFFERS.filter(o=>o.title.includes('عطر')); if(l.includes('جرير')) res=OFFERS.filter(o=>o.store.includes('جرير')); setTimeout(()=>setAssistantMsgs(m=>[...m,{role:'bot',text:`لقيت لك ${res.length} نتائج لـ "${q}"`,results:res}]),400) }

  const shareApp=async()=>{ const url=typeof window!=='undefined'?window.location.href:'https://hkeeem-store2.vercel.app'; const text='عروضكم - أقرب العروض حولك 🔥'; if((navigator as any).share){ try{ await (navigator as any).share({title:'عروضكم',text,url}); return }catch{} } try{ await navigator.clipboard.writeText(url); showToast('تم نسخ الرابط 📋') }catch{ window.open(`https://wa.me/?text=${encodeURIComponent(text+' '+url)}`,'_blank') } }
  const shareWhats=()=>{ const url=window.location.href; window.open(`https://wa.me/?text=${encodeURIComponent('شوف عروض حكيم 🔥 '+url)}`,'_blank') }
  const shareX=()=>{ const url=window.location.href; window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('عروضكم - أقرب العروض حولك')}&url=${encodeURIComponent(url)}`,'_blank') }

  return (
    <div className={`min-h-screen pb-28 ${BEIGE_BG} text-[#1F1B16]`} dir="rtl">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#FFFCF6]/90 border-b border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img src="/hkeeem-icon.png" alt="حكيم" className="w-9 h-9 rounded-xl border border-[#EADFC9] bg-white object-contain p-1" onError={(e)=>{(e.target as any).style.display='none'}}/>
            <div className="w-9 h-9 rounded-xl border border-[#EADFC9] bg-white grid place-items-center font-black md:hidden" style={{color:GOLD}}>ح</div>
            <span className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></span>
            {currentLabel&&<span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold border bg-[#FFF8E6] text-[#7A5A16] border-[#EADFC9]">{currentLabel}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setLegal('share')} className="w-9 h-9 rounded-full border bg-white border-[#EADFC9] grid place-items-center">↗️</button>
            <button onClick={()=>setAuthOpen(true)} className="px-4 h-10 rounded-full border bg-white border-[#EADFC9] text-xs font-black">{user?`👋 ${user.name}`:'👤 دخول'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {tab==='home'&&<>
          <div className="mt-4 flex gap-2"><button onClick={()=>{getLocation(); setNearbyOnly(true); setRadiusKm(3)}} className="flex-1 h-12 rounded-2xl bg-[#1F1B16] text-white text-sm font-black">📍 العروض حولي الآن</button><button onClick={()=>setShowAllMap(true)} className="px-4 h-12 rounded-2xl bg-white border border-[#EADFC9] text-sm font-bold">🗺️ الخريطة</button></div>
          {/* بحث + مسح */}
          <div className="mt-3 flex gap-2"><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="ابحث عن عرض أو متجر أو باركود..." className="flex-1 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] bg-white text-sm outline-none focus:border-[#B68A2E]"/><button onClick={scanning?stopScan:startScan} className="px-5 h-12 rounded-2xl text-white text-sm font-black" style={{background:scanning?'#111':GOLD_DARK}}>{scanning?'إيقاف':'مسح'}</button></div>
          {scanning&&<div className="mt-3 rounded-2xl overflow-hidden border-2 border-[#EADFC9] bg-black"><div id="reader" className="w-full"/></div>}
          <div className="mt-4 flex flex-wrap items-center gap-2">{CITIES.map(c=><button key={c.name} onClick={()=>{setCityManual(c); setUserLoc({lat:c.lat,lng:c.lng}); localStorage.setItem('hkeeem_city',JSON.stringify(c))}} className={`px-4 h-9 rounded-full text-xs font-bold border ${cityManual?.name===c.name?'text-white border-[#B68A2E]':'bg-white border-[#EADFC9]'}`} style={cityManual?.name===c.name?{background:GOLD}:undefined}>{c.name}</button>)}<div className="flex gap-1.5">{[1,3,5,10].map(k=><button key={k} onClick={()=>{setRadiusKm(k); setNearbyOnly(true)}} className={`px-3 h-9 rounded-full text-xs font-bold border ${nearbyOnly&&radiusKm===k?'bg-[#1F1B16] text-white':'bg-white border-[#EADFC9]'}`}>داخل {k} كم</button>)}</div></div>
          <div className="mt-8 mb-5 flex justify-between items-center"><h2 className="font-black text-base">كل العروض مرتبة حسب القرب ({filteredOffers.length})</h2>{locLoading&&<span className="text-xs text-zinc-500">جاري التحديد...</span>}</div>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">{filteredOffers.map(o=><article key={o.id} className="rounded-2xl border bg-white border-[#EADFC9] overflow-hidden flex flex-col"><div className="relative"><img src={o.image} className="h-36 w-full object-cover" alt={o.title}/><span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>-{o.discount}%</span>{o.distance!==null&&<span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-black/80 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}{o.distance!==null&&o.distance<3&&<span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-[#FFF3CC] text-[#7A5A16] text-xs font-black">🔥 قريب</span>}</div><div className="p-3 flex flex-col flex-1"><div className="text-xs text-zinc-500">🏬 {o.store} • {o.location.district}</div><h3 className="font-bold text-sm mt-1 min-h-10 line-clamp-2">{o.title}</h3><div className="flex gap-1.5 mt-auto pt-3"><button onClick={()=>openMaps(o.location)} className="flex-1 h-9 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>الوصول 🚗</button><button onClick={()=>setShowMapFor(o)} className="w-9 h-9 rounded-full border bg-[#FFF8E6] border-[#EADFC9]">🗺️</button></div></div></article>)}</section>
        </>}

        {tab==='stores'&&<section className="mt-6"><h2 className="font-black text-base mb-4">المتاجر</h2><div className="grid grid-cols-2 gap-3">{STORES.map(s=><div key={s.id} className="p-4 rounded-2xl bg-white border border-[#EADFC9] flex items-center gap-3"><div className="w-12 h-12 rounded-xl grid place-items-center text-xl" style={{background:`${s.color}15`}}>{s.icon}</div><div className="flex-1"><div className="font-bold text-sm">{s.name}</div><div className="text-xs text-zinc-500">{s.count} عروض</div></div><button onClick={()=>{setTab('home'); setNearbyOnly(false)}} className="px-3 h-8 rounded-full bg-[#1F1B16] text-white text-xs font-bold">عرض</button></div>)}</div></section>}

        {tab==='haraj'&&<section className="mt-6"><div className="flex justify-between items-end mb-4"><h2 className="font-black text-base">حراج - مستعمل وجديد</h2><button onClick={()=>showToast('قريبا')} className="px-4 h-9 rounded-full text-xs font-bold text-white" style={{background:GOLD}}>+ أضف إعلان</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{HARAJ.map(h=><div key={h.id} className="rounded-2xl bg-white border border-[#EADFC9] overflow-hidden flex"><img src={h.image} className="w-28 h-28 object-cover" alt=""/><div className="p-3 flex-1"><div className="font-bold text-sm line-clamp-1">{h.title}</div><div className="text-sm font-black mt-1" style={{color:GOLD_DARK}}>{formatPrice(h.price)}</div><div className="text-xs text-zinc-500 mt-1">{h.district} • {h.time}</div><div className="flex gap-2 mt-2"><button onClick={()=>showToast('تم فتح المحادثة')} className="flex-1 h-8 rounded-full bg-[#1F1B16] text-white text-xs font-bold">تواصل</button></div></div></div>)}</div></section>}

        {tab==='office'&&<section className="mt-6 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#1F1B16] to-[#3A2F18] p-5 text-white"><div className="font-black text-base">{user? `أهلاً ${user.name}`:'مكتبي'}</div><div className="text-xs opacity-80 mt-1">نقاطك: 1,240 • وفرت: 860 ر.س هذا الشهر</div><div className="grid grid-cols-3 gap-2 mt-4"><div className="rounded-xl bg-white/10 p-3 text-center"><div className="font-black text-lg">{favs.length}</div><div className="text-xs opacity-80">المفضلة</div></div><div className="rounded-xl bg-white/10 p-3 text-center"><div className="font-black text-lg">{cart.length}</div><div className="text-xs opacity-80">السلة</div></div><div className="rounded-xl bg-white/10 p-3 text-center"><div className="font-black text-lg">3</div><div className="text-xs opacity-80">تنبيهات</div></div></div></div>
          <div><h3 className="font-bold text-sm mb-2">❤️ المفضلة</h3><div className="grid grid-cols-2 gap-3">{OFFERS.filter(o=>favs.includes(o.id)).map(o=><div key={o.id} className="rounded-2xl bg-white border border-[#EADFC9] p-2 flex gap-2"><img src={o.image} className="w-16 h-16 rounded-xl object-cover" alt=""/><div className="flex-1"><div className="text-xs font-bold line-clamp-2">{o.title}</div><div className="text-xs font-black mt-1" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</div></div></div>)}</div></div>
          {/* روابط قانونية */}
          <div className="rounded-2xl bg-white border border-[#EADFC9] p-2">
            <button onClick={()=>setLegal('privacy')} className="w-full flex justify-between items-center p-3 text-sm font-bold">🔒 سياسة الخصوصية <span>‹</span></button>
            <button onClick={()=>setLegal('terms')} className="w-full flex justify-between items-center p-3 text-sm font-bold border-t border-[#F3EAD6]">📄 الشروط والأحكام <span>‹</span></button>
            <button onClick={()=>setLegal('contact')} className="w-full flex justify-between items-center p-3 text-sm font-bold border-t border-[#F3EAD6]">💬 تواصل معنا <span>‹</span></button>
            <button onClick={()=>setLegal('share')} className="w-full flex justify-between items-center p-3 text-sm font-bold border-t border-[#F3EAD6]">🔗 مشاركة التطبيق <span>‹</span></button>
          </div>
          <div className="text-[11px] text-zinc-400 text-center pt-2">الإصدار 1.0.0 • صنع بكل حب في جدة 💛</div>
        </section>}

        {tab==='hkeem'&&<section className="mt-6"><div className="rounded-3xl p-6 text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}><div className="flex items-center gap-3"><img src="/hkeeem-icon.png" className="w-12 h-12 rounded-xl bg-white p-1 object-contain" alt="" onError={(e)=>{(e.target as any).style.display='none'}}/><div><div className="font-black text-lg">متجر حكيم الأصلي</div><div className="text-xs opacity-90">منتجات أصلية • شحن مجاني داخل جدة</div></div></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">{OFFERS.filter(o=>o.isOwn).map(o=><div key={o.id} className="rounded-2xl bg-white border-2 border-[#E9C86A] overflow-hidden"><img src={o.image} className="h-36 w-full object-cover" alt=""/><div className="p-3"><div className="font-bold text-sm">{o.title}</div><div className="flex items-baseline gap-1 mt-1"><span className="font-black text-sm" style={{color:GOLD_DARK}}>{formatPrice(o.price)}</span><span className="text-xs line-through text-zinc-400">{formatPrice(o.old_price)}</span></div><button onClick={()=>{setCart(c=>[...c,o.id]); showToast('أضيف للسلة 💛')}} className="w-full mt-2 h-9 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>+ أضف للسلة</button></div></div>)}</div></section>}

        {/* Footer */}
        <footer className="mt-12 mb-6 rounded-2xl bg-white border border-[#EADFC9] p-5 text-center">
          <div className="flex justify-center gap-3 mb-3">
            <button onClick={shareWhats} className="w-9 h-9 rounded-full bg-[#25D366] text-white grid place-items-center">W</button>
            <button onClick={shareX} className="w-9 h-9 rounded-full bg-black text-white grid place-items-center">X</button>
            <button onClick={shareApp} className="w-9 h-9 rounded-full bg-[#EADFC9] grid place-items-center">🔗</button>
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold text-zinc-600"><button onClick={()=>setLegal('privacy')}>الخصوصية</button><button onClick={()=>setLegal('terms')}>الشروط</button><button onClick={()=>setLegal('contact')}>تواصل</button></div>
          <div className="text-[11px] text-zinc-400 mt-2">© 2026 عروضكم - جميع الحقوق محفوظة لمتجر حكيم</div>
        </footer>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-[#EADFC9] h-20">
        <div className="max-w-7xl mx-auto grid grid-cols-5 h-full">
          {[
            {k:'home', l:'الرئيسية', i:'🏠'},
            {k:'stores', l:'المتاجر', i:'🏬'},
            {k:'haraj', l:'حراج', i:'🔨'},
            {k:'office', l:'مكتبي', i:'📁'},
            {k:'hkeem', l:'متجر حكيم', i:'💛'},
          ].map(t=><button key={t.k} onClick={()=>setTab(t.k as Tab)} className={`flex flex-col items-center justify-center gap-1 text-xs font-bold ${tab===t.k?'text-[#7A5A16]':'text-zinc-500'}`}><span className={`w-8 h-8 rounded-full grid place-items-center ${tab===t.k?'bg-[#FFF3CC] border border-[#E9C86A]':''}`}>{t.i}</span>{t.l}</button>)}
        </div>
      </nav>

      <button onClick={()=>setShowAllMap(true)} className="fixed bottom-24 left-4 z-30 h-12 px-5 rounded-full shadow-xl border-2 border-white flex items-center gap-2 text-sm font-black text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🗺️ الخريطة</button>
      <button onClick={()=>setAssistantOpen(true)} className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-xl border-2 border-white grid place-items-center text-xl" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>🤖</button>
      {toast&&<div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#1F1B16] text-white px-5 py-2.5 rounded-full text-xs font-bold z-50 shadow-xl">{toast}</div>}

      {/* Legal Modals */}
      {legal==='privacy'&&<div className="fixed inset-0 z-[60] bg-black/60 p-4 grid place-items-center" onClick={()=>setLegal(null)}><div className="w-full max-w-lg max-h-[85vh] overflow-auto rounded-3xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="font-black text-lg">🔒 سياسة الخصوصية</h2><button onClick={()=>setLegal(null)} className="w-8 h-8 rounded-full border">✕</button></div><div className="text-sm leading-7 text-zinc-700 space-y-3"><p>نحن في <b>عروضكم - متجر حكيم</b> نحترم خصوصيتك.</p><p><b>1. البيانات التي نجمعها:</b> الموقع الجغرافي (بإذنك فقط) لتظهر لك أقرب العروض، ورقم الجوال للتحقق فقط.</p><p><b>2. كيف نستخدمها:</b> لترتيب العروض حسب القرب، ولإرسال تنبيهات أسعار اخترتها.</p><p><b>3. المشاركة:</b> لا نبيع بياناتك لأي طرف ثالث. الموقع لا يُشارك إلا مع خرائط جوجل عند ضغطك "الوصول".</p><p><b>4. التخزين:</b> بياناتك محفوظة محلياً في جهازك ويمكنك حذفها بمسح بيانات التطبيق.</p><p><b>5. حقوقك:</b> يمكنك طلب حذف حسابك عبر تواصل معنا.</p><p className="text-xs text-zinc-400 mt-4">آخر تحديث: 14 يوليو 2026</p></div></div></div>}

      {legal==='terms'&&<div className="fixed inset-0 z-[60] bg-black/60 p-4 grid place-items-center" onClick={()=>setLegal(null)}><div className="w-full max-w-lg max-h-[85vh] overflow-auto rounded-3xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="font-black text-lg">📄 الشروط والأحكام</h2><button onClick={()=>setLegal(null)} className="w-8 h-8 rounded-full border">✕</button></div><div className="text-sm leading-7 text-zinc-700 space-y-3"><p><b>1. الاستخدام:</b> التطبيق لعرض العروض القريبة منك، الأسعار قد تتغير من المتجر.</p><p><b>2. حراج:</b> البيع بين المستخدمين مسؤوليتهم، يرجى التحقق قبل الدفع.</p><p><b>3. متجر حكيم:</b> منتجات أصلية 100%، الدفع عند الاستلام داخل جدة، الشحن مجاني فوق 199 ر.س.</p><p><b>4. المسافات:</b> محسوبة تقريبياً عبر GPS وقد تختلف.</p><p><b>5. التعديلات:</b> يحق لنا تعديل الشروط مع إشعار داخل التطبيق.</p><p className="text-xs text-zinc-400 mt-4">بالمتابعة أنت توافق على هذه الشروط.</p></div></div></div>}

      {legal==='contact'&&<div className="fixed inset-0 z-[60] bg-black/60 p-4 grid place-items-center" onClick={()=>setLegal(null)}><div className="w-full max-w-lg rounded-3xl bg-white p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="font-black text-lg">💬 تواصل معنا</h2><button onClick={()=>setLegal(null)} className="w-8 h-8 rounded-full border">✕</button></div><div className="space-y-3"><a href="https://wa.me/966500000000" target="_blank" className="flex items-center gap-3 p-3 rounded-2xl bg-[#E8FFF0] border border-[#C9EAD8]"><span className="w-10 h-10 rounded-full bg-[#25D366] text-white grid place-items-center">W</span><div><div className="font-bold text-sm">واتساب متجر حكيم</div><div className="text-xs text-zinc-500">رد سريع خلال دقائق • 966500000000</div></div></a><a href="tel:920000000" className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF8E6] border border-[#EADFC9]"><span className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">📞</span><div><div className="font-bold text-sm">اتصال هاتفي</div><div className="text-xs text-zinc-500">920000000 - يومياً 9ص - 11م</div></div></a><input value={cName} onChange={e=>setCName(e.target.value)} placeholder="اسمك" className="w-full h-11 px-4 rounded-2xl border border-[#EADFC9] text-sm"/><input value={cPhone} onChange={e=>setCPhone(e.target.value)} placeholder="جوالك 05XXXXXXXX" className="w-full h-11 px-4 rounded-2xl border border-[#EADFC9] text-sm"/><textarea value={cMsg} onChange={e=>setCMsg(e.target.value)} placeholder="رسالتك..." rows={3} className="w-full p-3 rounded-2xl border border-[#EADFC9] text-sm"></textarea><button onClick={()=>{ if(!cMsg.trim()){showToast('اكتب رسالتك'); return} showToast('تم إرسال رسالتك ✅ سنرد قريبا'); setLegal(null); setCName(''); setCPhone(''); setCMsg('') }} className="w-full h-11 rounded-full text-white font-black text-sm" style={{background:GOLD_DARK}}>إرسال الرسالة</button></div></div></div>}

      {legal==='share'&&<div className="fixed inset-0 z-[60] bg-black/60 p-4 grid place-items-center" onClick={()=>setLegal(null)}><div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center" onClick={e=>e.stopPropagation()}><h2 className="font-black text-lg">🔗 شارك عروضكم</h2><p className="text-xs text-zinc-500 mt-1">شارك أقرب العروض مع أصحابك</p><div className="grid grid-cols-4 gap-3 mt-6"><button onClick={shareWhats} className="flex flex-col items-center gap-1"><span className="w-12 h-12 rounded-full bg-[#25D366] text-white grid place-items-center text-xl">W</span><span className="text-[11px] font-bold">واتساب</span></button><button onClick={shareX} className="flex flex-col items-center gap-1"><span className="w-12 h-12 rounded-full bg-black text-white grid place-items-center">X</span><span className="text-[11px] font-bold">اكس</span></button><button onClick={()=>window.open('https://t.me/share/url?url='+encodeURIComponent(window.location.href),'_blank')} className="flex flex-col items-center gap-1"><span className="w-12 h-12 rounded-full bg-[#229ED9] text-white grid place-items-center">T</span><span className="text-[11px] font-bold">تيليجرام</span></button><button onClick={shareApp} className="flex flex-col items-center gap-1"><span className="w-12 h-12 rounded-full bg-[#EADFC9] grid place-items-center">🔗</span><span className="text-[11px] font-bold">نسخ</span></button></div><button onClick={()=>setLegal(null)} className="w-full mt-6 h-11 rounded-full border border-[#EADFC9] bg-[#FFFCF6] text-sm font-bold">إغلاق</button></div></div>}

      {authOpen&&<div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={()=>setAuthOpen(false)}><div className="w-full max-w-[360px] rounded-3xl bg-[#FFFCF6] border border-[#EADFC9] p-6" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h2 className="font-black">تسجيل الدخول</h2><button onClick={()=>setAuthOpen(false)} className="w-8 h-8 rounded-full border">✕</button></div><div className="grid grid-cols-2 gap-1 mt-4 p-1 rounded-full bg-[#FDF6E8] border border-[#EADFC9]"><button onClick={()=>{setAuthMode('phone'); setAuthStep('id')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='phone'?'bg-black text-white':'text-zinc-500'}`}>📱 جوال</button><button onClick={()=>{setAuthMode('email'); setAuthStep('login')}} className={`h-10 rounded-full text-sm font-bold ${authMode==='email'?'bg-black text-white':'text-zinc-500'}`}>✉️ إيميل</button></div>{authMode==='phone'?(authStep==='id'?<><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05XXXXXXXX" className="w-full mt-4 h-12 px-4 rounded-2xl border-2 border-[#EADFC9] text-sm"/><input value={name} onChange={e=>setName(e.target.value)} placeholder="اسمك (اختياري)" className="w-full mt-2 h-12 px-4 rounded-2xl border border-[#EADFC9] text-sm"/><button onClick={handleSendOtp} className="w-full mt-3 h-12 rounded-full text-white font-black text-sm" style={{background:GOLD_DARK}}>إرسال الكود</button></>:<><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" className="w-full mt-4 h-14 text-center text-xl tracking-[0.3em] font-black rounded-2xl border-2 border-[#EADFC9]"/><button onClick={handleVerify} className="w-full mt-3 h-12 rounded-full bg-black text-white font-black text-sm">دخول</button></>):<><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="الإيميل" className="w-full mt-4 h-12 px-4 rounded-2xl border text-sm"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="كلمة المرور" className="w-full mt-2 h-12 px-4 rounded-2xl border text-sm"/><button onClick={()=>{const u={name:email.split('@')[0]}; setUser(u); localStorage.setItem('hkeeem_user',JSON.stringify(u)); setAuthOpen(false)}} className="w-full mt-3 h-12 rounded-full text-white font-black text-sm" style={{background:GOLD_DARK}}>دخول</button></>}<button onClick={()=>{setUser({name:'زائر',isGuest:true}); setAuthOpen(false)}} className="w-full mt-3 h-11 rounded-full border border-[#EADFC9] bg-white text-sm font-bold">دخول كزائر</button></div></div>}

      {assistantOpen&&<div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={()=>setAssistantOpen(false)}><div className="w-full max-w-md h-3/4 bg-[#FFFCF6] rounded-t-3xl border-t border-[#EADFC9] flex flex-col" onClick={e=>e.stopPropagation()}><div className="p-4 border-b border-[#EADFC9] flex justify-between"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full grid place-items-center text-white" style={{background:GOLD_DARK}}>🤖</div><div><div className="font-black text-sm">حكيم – مساعدك الذكي</div><div className="text-xs text-green-600">● يبحث في العروض</div></div></div><button onClick={()=>setAssistantOpen(false)} className="w-8 h-8 rounded-full border">✕</button></div><div className="flex-1 overflow-auto p-4 space-y-3">{assistantMsgs.map((m,i)=><div key={i} className={`${m.role==='user'?'mr-auto bg-black text-white':'bg-white border border-[#EADFC9]'} max-w-[85%] rounded-2xl px-4 py-3 text-sm`}>{m.text}{m.results&&<div className="mt-2 grid gap-2">{m.results.map((o:any)=><div key={o.id} className="flex gap-2 p-2 rounded-xl bg-[#FDF6E8] border border-[#EADFC9]"><img src={o.image} className="w-12 h-12 rounded-xl object-cover" alt=""/><div className="flex-1 text-xs"><div className="font-bold">{o.title}</div><div style={{color:GOLD_DARK}} className="font-black">{formatPrice(o.price)}</div></div></div>)}</div>}</div>)}</div><div className="p-3 border-t border-[#EADFC9] bg-white flex gap-2"><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAssistant()} placeholder="اسأل حكيم..." className="flex-1 h-11 px-4 rounded-full border-2 border-[#EADFC9] bg-[#FDF6E8] text-sm outline-none"/><button onClick={handleAssistant} className="w-11 h-11 rounded-full text-white" style={{background:GOLD_DARK}}>↑</button></div></div></div>}

      {showMapFor&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-3" onClick={()=>setShowMapFor(null)}><div className="w-full max-w-lg rounded-2xl bg-white border border-[#EADFC9] overflow-hidden" onClick={e=>e.stopPropagation()}><div className="p-4 flex justify-between border-b"><div><div className="font-black text-sm">{showMapFor.store}</div><div className="text-xs text-zinc-500">{showMapFor.location.address} {showMapFor.distance!==null&&`• ${formatDistance(showMapFor.distance)}`}</div></div><button onClick={()=>setShowMapFor(null)} className="w-8 h-8 rounded-full border">✕</button></div><iframe width="100%" height="360" style={{border:0}} src={`https://maps.google.com/maps?q=${showMapFor.location.lat},${showMapFor.location.lng}&z=16&output=embed`}/><div className="p-3"><button onClick={()=>openMaps(showMapFor.location)} className="w-full h-11 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>فتح في قوقل ماب 🚀</button></div></div></div>}
      {showAllMap&&<div className="fixed inset-0 z-50 bg-[#FDF6E8]"><div className="h-14 px-4 flex justify-between items-center border-b bg-[#FFFCF6] border-[#EADFC9]"><h3 className="font-black text-sm">🗺️ خريطة كل العروض</h3><button onClick={()=>setShowAllMap(false)} className="px-4 h-9 rounded-full bg-[#1F1B16] text-white text-sm font-bold">إغلاق</button></div><iframe width="100%" height="calc(100vh - 56px)" style={{border:0}} src={`https://www.openstreetmap.org/export/embed.html?bbox=39.0%2C21.3%2C39.4%2C21.7&layer=mapnik&marker=${CITIES[0].lat}%2C${CITIES[0].lng}`}/></div>}
    </div>
  )
}
