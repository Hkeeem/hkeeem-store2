"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type LatLng = { lat:number; lng:number }
type Offer = {
  id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; priceDropToday?:boolean; recommended?:boolean; isOwn?:boolean
  location: LatLng & { address:string } // موقع المتجر
}

const OFFICE_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4"
const BEIGE_BG = "bg-[#FDF6E8]"
const GOLD = "#B68A2E"
const GOLD_DARK = "#7A5A16"
const GOLD_LIGHT = "#D4AF37"

// مواقع حقيقية حول جدة - غيرها لمواقع متاجرك الفعلية
const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, recommended:true, isOwn:true, location:{lat:21.543333, lng:39.172778, address:'حي الروضة، جدة'} },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:3210, recommended:true, isOwn:true, location:{lat:21.543333, lng:39.172778, address:'حي الروضة، جدة'} },
  { id:3, title:'سلة التوفير - بنده', store:'بنده', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, priceDropToday:true, location:{lat:21.579610, lng:39.132143, address:'بنده - شارع فلسطين، جدة'} },
  { id:4, title:'آيباد برو M2 12.9', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', views:10230, priceDropToday:true, location:{lat:21.552262, lng:39.158011, address:'مكتبة جرير - تحلية، جدة'} },
  { id:5, title:'زيت زيتون بكر', store:'عروضكم', category:'عروضكم', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', views:6730, priceDropToday:true, location:{lat:21.485811, lng:39.192505, address:'أسواق التميمي، جدة'} },
]

// حساب المسافة Haversine
function haversine(a:LatLng, b:LatLng){
  const R=6371
  const dLat=(b.lat-a.lat)*Math.PI/180
  const dLng=(b.lng-a.lng)*Math.PI/180
  const s1=Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s1))
}
const formatDistance = (km:number)=> km<1? `${Math.round(km*1000)} م` : `${km.toFixed(1)} كم`

export default function Page(){
  const [userLoc,setUserLoc]=useState<LatLng|null>(null)
  const [locLoading,setLocLoading]=useState(false)
  const [locError,setLocError]=useState('')
  const [showMapFor,setShowMapFor]=useState<Offer|null>(null)
  const [nearbyOnly,setNearbyOnly]=useState(false)
  const [dark,setDark]=useState(false)

  // طلب الموقع
  const requestLocation = useCallback(()=>{
    setLocLoading(true); setLocError('')
    if(!navigator.geolocation){ setLocError('المتصفح لا يدعم تحديد الموقع'); setLocLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      pos=>{ setUserLoc({lat:pos.coords.latitude, lng:pos.coords.longitude}); setLocLoading(false) },
      err=>{ setLocError(err.code===1?'يجب السماح بالوصول للموقع من الإعدادات':'تعذر تحديد الموقع'); setLocLoading(false) },
      { enableHighAccuracy:true, timeout:10000 }
    )
  },[])

  // العروض مع المسافة مرتبة
  const offersWithDistance = useMemo(()=>{
    if(!userLoc) return OFFERS.map(o=>({...o, distance: null as number|null}))
    return OFFERS.map(o=>({...o, distance: haversine(userLoc, o.location)})).sort((a,b)=>(a.distance! - b.distance!))
  },[userLoc])

  const nearbyOffers = useMemo(()=> offersWithDistance.filter(o=>o.distance!==null && o.distance! < 8),[offersWithDistance])
  const displayOffers = nearbyOnly && userLoc? nearbyOffers : offersWithDistance

  const openGoogleMaps = (loc:LatLng, label:string)=>{
    // يفتح تطبيق قوقل ماب مباشرة على الجوال
    const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&destination_place_id=${encodeURIComponent(label)}`
    window.open(url,'_blank')
  }

  return (
    <div className={`min-h-screen pb-28 ${dark?'bg-zinc-950 text-zinc-100':`${BEIGE_BG} text-[#1F1B16]`}`} dir="rtl">
      {/* شريط الموقع العلوي */}
      <div className={`sticky top-0 z-30 backdrop-blur-xl border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FFFCF6]/90 border-[#EADFC9]'}`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/hkeeem-icon.png" alt="Hkeeem" className="w-8 h-8" />
            <span className="font-black">عروضكم</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1" style={{borderColor:GOLD, color:dark?GOLD_LIGHT:GOLD_DARK, background: dark?'#2A2418':'#FFF8E6'}}>
              📍 {userLoc? `${formatDistance(offersWithDistance[0]?.distance||0)}` : 'حدد موقعك'}
            </span>
          </div>
          <button onClick={requestLocation} className="px-4 h-9 rounded-full text-xs font-black text-white shadow" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>
            {locLoading?'جاري التحديد...': userLoc? 'تحديث الموقع' : 'تحديد موقعي'}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        {/* بطاقة طلب الموقع */}
        {!userLoc &&!locLoading && (
          <div className={`mt-4 rounded- border p-4 flex gap-3 items-center ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9] shadow-sm'}`}>
            <div className="w-12 h-12 rounded-full grid place-items-center text-xl" style={{background:'#FFF3CC'}}>📍</div>
            <div className="flex-1">
              <div className="font-black text-sm">شوف العروض القريبة منك</div>
              <div className={`text-xs mt-0.5 font-medium ${dark?'text-zinc-400':'text-zinc-600'}`}>نحدد موقعك ونرتب لك أقرب متاجر حكيم وبنده وجرير</div>
            </div>
            <button onClick={requestLocation} className="px-5 h-10 rounded-full bg-[#1F1B16] text-white text-xs font-black">تفعيل</button>
          </div>
        )}
        {locError && <p className="text-red-500 text-xs mt-3 font-medium">⚠️ {locError}</p>}
        {userLoc && (
          <div className="mt-4 flex gap-2 items-center">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} className="accent-[#B68A2E]" />
              العروض القريبة فقط (أقل من 8 كم)
            </label>
            <span className={`text-xs ${dark?'text-zinc-400':'text-zinc-500'}`}>• {displayOffers.length} عرض قريب</span>
          </div>
        )}

        {/* قسم العروض القريبة */}
        {userLoc && nearbyOffers.length>0 &&!nearbyOnly && (
          <section className="mt-6">
            <h2 className="font-black text-">📍 الأقرب لك الآن</h2>
            <div className="flex gap-3 overflow-x-auto mt-3 pb-2">
              {nearbyOffers.slice(0,5).map(o=>(
                <div key={o.id} className={`min-w-[200px] w-[200px] rounded- border overflow-hidden shrink-0 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9] shadow-sm'}`}>
                  <div className="relative"><img src={o.image} className="h-28 w-full object-cover"/>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text- font-black text-white text-xs" style={{background:GOLD_DARK}}>{o.distance && formatDistance(o.distance)}</span>
                  </div>
                  <div className="p-2.5">
                    <div className="font-bold text- line-clamp-1">{o.title}</div>
                    <div className="text- text-zinc-500 mt-0.5">{o.location.address}</div>
                    <button onClick={()=>setShowMapFor(o)} className="w-full mt-2 h-8 rounded-full text-xs font-bold border" style={{borderColor:GOLD, color:GOLD_DARK}}>عرض على الخريطة 🗺️</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* شبكة كل العروض مع مسافة وزر وصول */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayOffers.map(o=>(
            <article key={o.id} className={`rounded- border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9] shadow-sm'}`}>
              <div className="relative">
                <img src={o.image} alt={o.title} className="h-36 w-full object-cover"/>
                {o.distance!==null && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#1F1B16] text-white text- font-bold text-xs">📍 {formatDistance(o.distance!)}</span>}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[#1F1B16] text- font-bold text-xs border border-[#EADFC9]">{o.store}</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text- line-clamp-1">{o.title}</h3>
                <p className={`text- mt-1 font-medium ${dark?'text-zinc-400':'text-zinc-600'}`}>{o.location.address}</p>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={()=>openGoogleMaps(o.location, o.store)} className="flex-1 h-8 rounded-full text-xs font-black text-white" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`}}>الوصول 🚗</button>
                  <button onClick={()=>setShowMapFor(o)} className="w-8 h-8 rounded-full border grid place-items-center" style={{borderColor:'#EADFC9'}}>🗺️</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* مودال الخريطة */}
      {showMapFor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-3" onClick={()=>setShowMapFor(null)}>
          <div className={`w-full max-w-lg rounded- overflow-hidden border shadow-2xl ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-[#EADFC9]'}`} onClick={e=>e.stopPropagation()}>
            <div className="p-4 flex justify-between items-center border-b border-[#EADFC9]/50">
              <div><div className="font-black text-sm">{showMapFor.store}</div><div className={`text-xs ${dark?'text-zinc-400':'text-zinc-600'}`}>{showMapFor.location.address} {showMapFor.distance && `• على بعد ${formatDistance(showMapFor.distance!)}`}</div></div>
              <button onClick={()=>setShowMapFor(null)} className="w-8 h-8 rounded-full border grid place-items-center">✕</button>
            </div>
            {/* خريطة قوقل بدون API Key */}
            <div className="h-[360px] bg-[#E9DDC9]">
              <iframe title="map" width="100%" height="100%" style={{border:0}} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${showMapFor.location.lat},${showMapFor.location.lng}&z=15&output=embed`}>
              </iframe>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              <button onClick={()=>openGoogleMaps(showMapFor.location, showMapFor.store)} className="h-11 rounded-full text-white font-black text-sm" style={{background:`linear-gradient(135deg, ${GOLD_DARK}, ${GOLD_LIGHT})`}}>فتح في قوقل ماب 🚀</button>
              <button onClick={()=>{ if(userLoc) window.open(`https://www.google.com/maps/dir/${userLoc.lat},${userLoc.lng}/${showMapFor.location.lat},${showMapFor.location.lng}`,'_blank') }} className="h-11 rounded-full border font-bold text-sm bg-white text-[#1F1B16] border-[#EADFC9]">الاتجاهات من موقعي</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
