"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type LatLng = { lat:number; lng:number }
type City = { name:string; lat:number; lng:number }
type Offer = {
  id:number; title:string; store:string; price:number; old_price:number; discount:number; image:string; views:number; priceDropToday?:boolean; recommended?:boolean; isOwn?:boolean
  location: LatLng & { address:string }
}
type OfferWithDistance = Offer & { distance:number|null }

const GOLD = "#B68A2E"
const GOLD_DARK = "#7A5A16"
const GOLD_LIGHT = "#D4AF37"
const BEIGE_BG = "bg-[#FDF6E8]"
const INK = "#1F1B16"

const CITIES: City[] = [
  { name:'جدة', lat:21.543333, lng:39.172778 },
  { name:'مكة', lat:21.389082, lng:39.857912 },
  { name:'الرياض', lat:24.713552, lng:46.675297 },
  { name:'الدمام', lat:26.420680, lng:50.088795 },
]

const MOCK_OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, recommended:true, isOwn:true, location:{lat:21.543333, lng:39.172778, address:'حي الروضة، جدة'} },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:3210, isOwn:true, location:{lat:21.543333, lng:39.172778, address:'حي الروضة، جدة'} },
  { id:3, title:'سلة التوفير - بنده', store:'بنده', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, priceDropToday:true, location:{lat:21.579610, lng:39.132143, address:'بنده - فلسطين، جدة'} },
  { id:4, title:'آيباد برو M2 12.9', store:'جرير', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', views:10230, priceDropToday:true, recommended:true, location:{lat:21.552262, lng:39.158011, address:'جرير - التحلية'} },
]

function haversine(a:LatLng, b:LatLng){
  const R=6371
  const dLat=(b.lat-a.lat)*Math.PI/180
  const dLng=(b.lng-a.lng)*Math.PI/180
  const s=Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s))
}
const formatDistance = (km:number)=> km<1? `${Math.round(km*1000)} م` : `${km.toFixed(1)} كم`
const formatPrice = (n:number)=> `${n.toLocaleString('ar-SA')} ر.س`

export default function Page(){
  const [offers,setOffers]=useState<Offer[]>(MOCK_OFFERS)
  const [userLoc,setUserLoc]=useState<LatLng|null>(null)
  const [cityManual,setCityManual]=useState<City|null>(null)
  const [locLoading,setLocLoading]=useState(false)
  const [locError,setLocError]=useState('')
  const [radiusKm,setRadiusKm]=useState(5)
  const [nearbyOnly,setNearbyOnly]=useState(false)
  const [showMapFor,setShowMapFor]=useState<OfferWithDistance|null>(null)
  const [showAllMap,setShowAllMap]=useState(false)
  const [dark,setDark]=useState(false)

  // 5. استرجاع الموقع المحفوظ
  useEffect(()=>{
    try{
      const saved = localStorage.getItem('hkeeem_user_location')
      if(saved){ setUserLoc(JSON.parse(saved)) }
      const savedCity = localStorage.getItem('hkeeem_city')
      if(savedCity){ setCityManual(JSON.parse(savedCity)) }
    }catch{}
    // 8. ربط API - بدّلها لاحقا بـ Supabase
    // fetch('/api/offers').then(r=>r.json()).then(d=>setOffers(d)).catch(()=>{})
  },[])

  // 4. تحسين تحديد الموقع للبطارية
  const requestLocation = useCallback(()=>{
    setLocLoading(true); setLocError('')
    if(!navigator.geolocation){ setLocError('المتصفح لا يدعم تحديد الموقع'); setLocLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      pos=>{
        const loc = {lat:pos.coords.latitude, lng:pos.coords.longitude}
        setUserLoc(loc)
        setCityManual(null)
        localStorage.setItem('hkeeem_user_location', JSON.stringify(loc))
        localStorage.removeItem('hkeeem_city')
        setLocLoading(false)
      },
      err=>{
        setLocError(err.code===1?'تم رفض الإذن، اختر مدينتك يدوياً':'تعذر تحديد الموقع')
        setLocLoading(false)
      },
      { enableHighAccuracy:false, timeout:8000, maximumAge:300000 }
    )
  },[])

  const selectCity = (city:City)=>{
    setUserLoc({lat:city.lat, lng:city.lng})
    setCityManual(city)
    localStorage.setItem('hkeeem_city', JSON.stringify(city))
    localStorage.setItem('hkeeem_user_location', JSON.stringify({lat:city.lat, lng:city.lng}))
    setLocError('')
  }

  // 9. حساب المسافة مرة واحدة فقط
  const offersWithDistance: OfferWithDistance[] = useMemo(()=>{
    if(!userLoc) return offers.map(o=>({...o, distance:null}))
    return offers.map(o=>({...o, distance: haversine(userLoc, o.location)})).sort((a,b)=>(a.distance! - b.distance!))
  },[offers, userLoc])

  const filteredOffers = useMemo(()=>{
    if(!nearbyOnly || !userLoc) return offersWithDistance
    return offersWithDistance.filter(o=>o.distance!==null && o.distance! <= radiusKm)
  },[offersWithDistance, nearbyOnly, radiusKm, userLoc])

  // 2. رابط قوقل الصحيح
  const openGoogleMapsDir = (loc:LatLng)=>{
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`
    window.open(url,'_blank')
  }

  return (
    <div className={`min-h-screen pb-28 antialiased ${dark? 'bg-zinc-950 text-zinc-100' : `${BEIGE_BG} text-[#1F1B16]`}`} dir="rtl">
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FFFCF6]/90 border-[#EADFC9]'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img src="/hkeeem-icon.png" alt="Hkeeem" className="w-9 h-9 object-contain rounded-xl border border-[#EADFC9] bg-white shadow-sm" />
            <h1 className="font-black text-lg">عروض<span style={{color:GOLD}}>كم</span></h1>
            {userLoc && <span className="px-2.5 py-1 rounded-full text-xs font-bold border" style={{borderColor:GOLD, color:GOLD_DARK, background:'#FFF8E6'}}>{cityManual? cityManual.name : `📍 ${formatDistance(filteredOffers[0]?.distance||0)}`}</span>}
          </div>
          <button onClick={requestLocation} className="px-4 h-10 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>
            {locLoading?'جاري...': userLoc?'تحديث موقعي':'تحديد موقعي'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {/* زر العروض حولي الآن + فلاتر المسافة */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <button onClick={()=>{ requestLocation(); setNearbyOnly(true); setRadiusKm(3)}} className="px-5 h-11 rounded-full bg-[#1F1B16] text-white text-sm font-black shadow">📍 العروض حولي الآن</button>
          <div className="flex gap-1.5 overflow-x-auto">
            {[1,3,5,10].map(km=>(
              <button key={km} onClick={()=>{setRadiusKm(km); setNearbyOnly(true)}} className={`px-4 h-9 rounded-full text-xs font-bold border transition-colors ${nearbyOnly && radiusKm===km?'text-white border-[#B68A2E]':'bg-white border-[#EADFC9] text-zinc-600'}`} style={nearbyOnly && radiusKm===km?{background:GOLD}:undefined}>داخل {km} كم</button>
            ))}
          </div>
          <button onClick={()=>setShowAllMap(true)} className="px-4 h-9 rounded-full bg-white border border-[#EADFC9] text-xs font-bold shadow-sm">🗺️ خريطة كل العروض</button>
        </div>

        {/* 6. اختيار يدوي عند رفض الموقع */}
        {locError && !userLoc && (
          <div className={`mt-4 rounded-2xl border p-4 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9]'}`}>
            <div className="font-bold text-sm">⚠️ {locError}</div>
            <div className="text-xs text-zinc-500 mt-1">اختر مدينتك لعرض العروض القريبة:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              {CITIES.map(c=>(
                <button key={c.name} onClick={()=>selectCity(c)} className="h-11 rounded-xl border bg-white border-[#EADFC9] text-sm font-bold hover:bg-[#FFF8E6]">{c.name}</button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <h2 className="font-black text-base">{nearbyOnly? `العروض داخل ${radiusKm} كم` : 'كل العروض مرتبة حسب القرب'}</h2>
          {userLoc && <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="accent-[#B68A2E]" /> قريبة فقط</label>}
        </div>

        <section className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredOffers.map(o=>(
            <article key={o.id} className={`rounded-2xl border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9] shadow-sm'}`}>
              <div className="relative">
                <img src={o.image} alt={o.title} className="h-36 w-full object-cover"/>
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>-{o.discount}%</span>
                {o.distance!==null && <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-black/80 text-white text-xs font-bold">📍 {formatDistance(o.distance)}</span>}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm leading-5 line-clamp-2">{o.title}</h3>
                <p className="text-xs mt-1 text-zinc-500 font-medium">{o.location.address}</p>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={()=>openGoogleMapsDir(o.location)} className="flex-1 h-9 rounded-full text-xs font-black text-white" style={{background:GOLD_DARK}}>الوصول 🚗</button>
                  <button onClick={()=>setShowMapFor(o)} className="w-9 h-9 rounded-full border bg-white border-[#EADFC9] grid place-items-center">🗺️</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* مودال خريطة واحدة */}
      {showMapFor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3" onClick={()=>setShowMapFor(null)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden bg-white border border-[#EADFC9] shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-4 flex justify-between border-b border-[#EADFC9]"><div><div className="font-black text-sm">{showMapFor.store}</div><div className="text-xs text-zinc-500">{showMapFor.location.address} • {showMapFor.distance!==null && formatDistance(showMapFor.distance)}</div></div><button onClick={()=>setShowMapFor(null)} className="w-8 h-8 rounded-full border">✕</button></div>
            <iframe title="map" width="100%" height="360" style={{border:0}} loading="lazy" src={`https://maps.google.com/maps?q=${showMapFor.location.lat},${showMapFor.location.lng}&z=15&output=embed`} />
            <div className="p-3 grid grid-cols-2 gap-2">
              <button onClick={()=>openGoogleMapsDir(showMapFor.location)} className="h-11 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>فتح في قوقل ماب</button>
              <button onClick={()=>setShowMapFor(null)} className="h-11 rounded-full border bg-white border-[#EADFC9] font-bold text-sm">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* 10. خريطة تفاعلية لكل العروض كـ Markers */}
      {showAllMap && (
        <div className="fixed inset-0 z-50 bg-white" dir="ltr">
          <div className="h-14 px-4 flex justify-between items-center border-b bg-[#FFFCF6]"><h3 className="font-black">🗺️ خريطة العروض</h3><button onClick={()=>setShowAllMap(false)} className="px-4 h-9 rounded-full bg-black text-white text-sm">إغلاق</button></div>
          <div id="all-offers-map" className="w-full h-[calc(100vh-56px)]">
            {/* هنا تركب Leaflet: L.map('all-offers-map').setView([userLoc.lat, userLoc.lng], 13) ثم L.marker لكل عرض */}
            <div className="grid place-items-center h-full text-zinc-500 text-sm p-6 text-center">
              ركّب مكتبة Leaflet لعرض كل العروض كـ Markers<br/>`npm i leaflet` ثم استخدم الكود في التعليق داخل الملف
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
