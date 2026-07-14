"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

// --- نفس المنطق اللي صححناه لك سابقا ---
type LatLng = { lat:number; lng:number }
type City = { name:string; lat:number; lng:number; label:string }
type Offer = {
  id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; rating:number; reviews:number; usage:number; lat:number; lng:number; district:string; coupon?:string; isDrop?:boolean
}

const CITIES: City[] = [
  { name:'جدة', label:'حي الروضة، جدة', lat:21.543333, lng:39.172778 },
  { name:'مكة', label:'العزيزية، مكة', lat:21.389082, lng:39.857912 },
  { name:'الرياض', label:'العليا، الرياض', lat:24.713552, lng:46.675297 },
]

const OFFERS: Offer[] = [
  { id:1, title:'iPhone 15 Pro 256GB تيتانيوم أزرق', store:'جرير', category:'جوالات', price:4199, old_price:4619, discount:9, image:'https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=600', rating:4.8, reviews:2100, usage:1243, lat:21.5439, lng:39.1731, district:'الروضة', coupon:'HKEEM50', isDrop:true },
  { id:2, title:'غسالة LG 7 كيلو أقل من 1500', store:'إكسترا', category:'أجهزة ذكية', price:1449, old_price:1799, discount:19, image:'https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=600', rating:4.6, reviews:890, usage:890, lat:21.5522, lng:39.1580, district:'التحلية', coupon:'EXTRA30', isDrop:true },
  { id:3, title:'ساعة Apple Watch Series 9', store:'نون', category:'إلكترونيات', price:1599, old_price:1899, discount:15, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', rating:4.9, reviews:3200, usage:2100, lat:21.5796, lng:39.1321, district:'الحمراء', isDrop:false },
  { id:4, title:'سماعة Sony WH-1000XM5', store:'أمازون', category:'إلكترونيات', price:1199, old_price:1499, discount:20, image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', rating:4.7, reviews:1560, usage:1560, lat:21.4858, lng:39.1925, district:'السامر', isDrop:true },
]

function haversine(a:LatLng, b:LatLng){
  const R=6371; const dLat=(b.lat-a.lat)*Math.PI/180; const dLng=(b.lng-a.lng)*Math.PI/180;
  const s=Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(s))
}
const formatDistance = (km:number)=> km<1? `${Math.round(km*1000)} م` : `${km.toFixed(1)} كم`
const formatPrice = (n:number)=> `${n.toLocaleString('ar-SA')} ر.س`

export default function Page(){
  const [userLoc,setUserLoc]=useState<LatLng|null>(null)
  const [cityManual,setCityManual]=useState<City|null>(null)
  const [radiusKm,setRadiusKm]=useState(5)
  const [nearbyOnly,setNearbyOnly]=useState(false)
  const [search,setSearch]=useState('')
  const [assistantOpen,setAssistantOpen]=useState(false)
  const [showMap,setShowMap]=useState(false)

  useEffect(()=>{ try{ const s=localStorage.getItem('hkeeem_user_location'); if(s) setUserLoc(JSON.parse(s)) }catch{} },[])

  const requestLocation = useCallback(()=>{
    if(!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(pos=>{
      const loc={lat:pos.coords.latitude, lng:pos.coords.longitude}
      setUserLoc(loc); setCityManual(null); localStorage.setItem('hkeeem_user_location', JSON.stringify(loc))
    })
  },[])

  const offersWithDistance = useMemo(()=>{
    if(!userLoc) return OFFERS.map(o=>({...o, distance:null as number|null}))
    return OFFERS.map(o=>({...o, distance: haversine(userLoc, {lat:o.lat, lng:o.lng})})).sort((a,b)=>(a.distance! - b.distance!))
  },[userLoc])

  const filtered = useMemo(()=>{
    let f = offersWithDistance
    if(search) f = f.filter(o=> o.title.includes(search) || o.store.includes(search))
    if(nearbyOnly && userLoc) f = f.filter(o=> o.distance!==null && o.distance! <= radiusKm)
    return f
  },[offersWithDistance, nearbyOnly, radiusKm, userLoc, search])

  const currentLabel = cityManual? `📍 ${cityManual.label}` : userLoc? `📍 ${offersWithDistance[0]?.district||'موقعك'}، جدة` : null

  return (
    <div className="min-h-screen text-white relative overflow-hidden" dir="rtl" style={{background:'linear-gradient(180deg,#533A7A 0%,#3B1F6E 18%,#25124A 32%,#160B2E 50%,#0B0618 70%,#000 100%)', fontFamily:'Tajawal, sans-serif'}}>
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[32px] opacity-60" style={{background:'radial-gradient(ellipse at center, rgba(139,92,246,0.45), transparent 70%)'}} />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-500 grid place-items-center font-black">ح</div>
            <div><div className="font-black">حكيم AI</div><div className="text-[10px] text-violet-300">{currentLabel || 'المتجر الذكي'}</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={requestLocation} className="px-4 h-9 rounded-full bg-white/10 border border-white/10 text-xs font-bold">تحديد موقعي</button>
            <button className="w-9 h-9 rounded-full bg-white/10 grid place-items-center">👤</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-28 relative z-10">
        {/* شريط البحث الذكي - طلبك */}
        <div className="mt-5">
          <div className="flex items-center gap-2 p-2.5 rounded-[18px] bg-[rgba(36,28,58,0.78)] backdrop-blur-[18px] border border-white/10 shadow-xl">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-violet-500 to-indigo-600 grid place-items-center text-lg">🤖</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="اسأل حكيم: أبغى غسالة أقل من 1500، وين أرخص آيفون؟" className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/35" />
            <button className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">🎤</button>
            <button className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">📷</button>
          </div>
          <div className="mt-2.5 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button onClick={()=>setSearch('غسالة')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-violet-500/25 border border-violet-400/30 text-[11px]">أرخص غسالة أقل من 1500</button>
            <button onClick={()=>setSearch('ايفون')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px]">وين أرخص آيفون؟</button>
            <button onClick={()=>setSearch('سلة')} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px]">سلة مقاضي 300 ر.س</button>
          </div>
        </div>

        {/* فلاتر المسافة - نفس إصلاحك السابق Chips ذهبية */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/60">المسافة:</span>
          <div className="flex gap-2">
            {[1,3,5,10].map(km=>(
              <button key={km} onClick={()=>{setRadiusKm(km); setNearbyOnly(true)}} className={`px-4 h-8 rounded-full text-xs font-bold border transition-all ${nearbyOnly && radiusKm===km?'bg-amber-400 text-black border-amber-400':'bg-white/10 border-white/10 text-white/70'}`}>داخل {km} كم</button>
            ))}
          </div>
          <label className={`px-3 h-8 rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${nearbyOnly?'bg-white text-black':'bg-white/10 border-white/10'}`}>
            <input type="checkbox" checked={nearbyOnly} onChange={e=>setNearbyOnly(e.target.checked)} /> قريبة فقط
          </label>
          {userLoc && <span className="text-xs text-white/40">• {filtered.length} عرض</span>}
        </div>

        <div className="mt-8 mb-4 flex justify-between items-end">
          <h2 className="font-black text-[18px]">{nearbyOnly? `العروض داخل ${radiusKm} كم` : 'عروضكم الذكية - مخصصة لك'}</h2>
          <span className="text-xs text-white/40">{filtered.length} عرض</span>
        </div>

        {/* بطاقات كبيرة - تنفيذ ملاحظاتك */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(o=>(
            <article key={o.id} className="rounded-[20px] overflow-hidden bg-[rgba(42,35,66,0.78)] backdrop-blur-[16px] border border-white/10 hover:border-violet-400/30 transition-all hover:-translate-y-1">
              <div className="relative h-[156px] m-2 rounded-[14px] overflow-hidden bg-[#15102A]">
                <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/65 backdrop-blur text-[10px] font-bold">{o.store}</span>
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[11px] font-black">وفر {(o.old_price - o.price).toLocaleString()} ر.س</span>
                <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-[10px] font-bold">-{o.discount}%</span>
                {o.distance!==null && <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-[10px]">📍 {formatDistance(o.distance)}</span>}
                {o.distance!==null && o.distance<3 && <span className="absolute top-10 right-2 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">🔥 قريب منك</span>}
              </div>
              <div className="px-3 pb-3">
                <h3 className="font-bold text-[13px] leading-5 line-clamp-2 min-h-[40px]">{o.title}</h3>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="font-black text-[15px] text-amber-300">{formatPrice(o.price)}</span>
                  <span className="text-[11px] text-white/35 line-through">{formatPrice(o.old_price)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px]"><span className="text-amber-400">★ {o.rating}</span><span className="text-white/40">({o.reviews})</span></div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">استخدم {o.usage} مرة</div>
                </div>
                <div className="mt-2 text-[10px] text-white/45">💰 مقارنة: أمازون {(o.price+150).toLocaleString()} • نون {(o.price+200).toLocaleString()}</div>
                <div className="mt-3 flex gap-1.5">
                  <button className="flex-1 h-9 rounded-full bg-white text-black text-xs font-black">شراء مع كوبون {o.coupon||'تلقائي'}</button>
                  <button className="w-9 h-9 rounded-full bg-white/10 border border-white/10 grid place-items-center">🗺️</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* أزرار عائمة - نفس مكانها السابق */}
      <button onClick={()=>setAssistantOpen(true)} className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-2xl bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-white/20 grid place-items-center text-xl">🤖</button>
      <button onClick={()=>setShowMap(true)} className="fixed bottom-24 left-4 z-30 h-11 px-5 rounded-full bg-white text-black font-black text-xs shadow-xl">🗺️ خريطة كل العروض</button>

      {/* مساعد حكيم */}
      {assistantOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-end" onClick={()=>setAssistantOpen(false)}>
          <div className="w-full max-w-md h-[78vh] bg-[#0F0A1E] rounded-t-[24px] border-t border-white/10 flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex justify-between"><div className="font-black">🤖 حكيم - مساعدك الذكي</div><button onClick={()=>setAssistantOpen(false)}>✕</button></div>
            <div className="flex-1 p-4 text-sm text-white/70">جرب: "أبغى غسالة أقل من 1500"، "وين أرخص آيفون اليوم؟"، "كون لي سلة مقاضي 300"</div>
            <div className="p-3 border-t border-white/10"><input placeholder="اسأل حكيم..." className="w-full h-11 px-4 rounded-full bg-white/10 border border-white/10 outline-none text-sm" /></div>
          </div>
        </div>
      )}
    </div>
  )
}
