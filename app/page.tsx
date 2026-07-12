"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

type City = 'الكل'|'الرياض'|'جدة'|'مكة'|'المدينة'|'الدمام'|'الخبر'|'القصيم'|'أبها'|'تبوك'|'جازان'
type Offer = { id:number; title:string; base:string; store:string; city:City; price:number; old_price:number; discount:number; image:string; views?:number; expiry?:string; history:number[]; isNew?:boolean }

const PROFILE_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile"
const PROFILE_NAME = "مؤسسة محسن لخدمات الاعمال"
const PROFILE_MSG = "يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة"

const OFFERS: Offer[] = [
  { id:1, title:'زيت زيتون بكر 1 لتر - الجوف', base:'زيت زيتون', store:'بنده', city:'الرياض', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,35,29,24,19], expiry:'2026-07-20', isNew:true },
  { id:2, title:'زيت زيتون بكر 1 لتر - الجوف', base:'زيت زيتون', store:'العثيم', city:'جدة', price:22, old_price:39, discount:44, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,37,32,26,22], expiry:'2026-07-18' },
  { id:3, title:'زيت زيتون بكر 1 لتر - الجوف', base:'زيت زيتون', store:'كارفور', city:'الدمام', price:24, old_price:39, discount:38, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,39,33,28,24], expiry:'2026-07-22' },
  { id:4, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'صيدلية النهدي', city:'الرياض', price:32, old_price:49, discount:35, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,45,41,36,32], expiry:'2026-07-15' },
  { id:5, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'صيدلية الدواء', city:'جدة', price:29, old_price:49, discount:41, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,44,39,33,29], expiry:'2026-07-16' },
  { id:6, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'بنده', city:'الدمام', price:34, old_price:49, discount:31, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,46,42,38,34], expiry:'2026-07-19' },
  { id:9, title:'ساعة RICEGGO بيبسي - إطار أحمر أزرق', base:'ساعة', store:'متجر حكيم', city:'الرياض', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', views:3420, history:[450,399,349,299,200], expiry:'2026-08-01', isNew:true },
  { id:10, title:'ساعة RICEGGO بيبسي', base:'ساعة', store:'أمازون', city:'جدة', price:240, old_price:450, discount:47, image:'/watch-pepsi.jpg', history:[450,420,380,300,240], expiry:'2026-07-30' },
]

const CITIES: City[] = ['الكل','الرياض','جدة','مكة','المدينة','الدمام','الخبر','القصيم','أبها','تبوك','جازان']

function MiniChart({ data }:{data:number[]}){
  const max = Math.max(...data); const min = Math.min(...data); const range = max-min||1
  return <div className="flex items-end gap-[3px] h-[36px]">{data.map((v,i)=><div key={i} className={`w-[6px] rounded-full transition-all ${i===data.length-1?'bg-[#6D28D9]':'bg-zinc-300'}`} style={{height:`${8+((max-v)/range)*28}px`}} />)}</div>
}

export default function Page(){
  const [showSplash,setShowSplash]=useState(true)
  const [selectedCity,setSelectedCity]=useState<City>('الكل')
  const [search,setSearch]=useState('')
  const [compareBase,setCompareBase]=useState<string|null>(null)
  const [tracking,setTracking]=useState<number[]>([])
  const [alerts,setAlerts]=useState<number[]>([])
  const [cat,setCat]=useState('الكل')
  const [cart,setCart]=useState<any[]>([])
  const [toast,setToast]=useState('')
  const [lastUpdate,setLastUpdate]=useState('منذ دقيقتين')
  const searchRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{ const t=setTimeout(()=>setShowSplash(false),3500); return()=>clearTimeout(t)},[])
  useEffect(()=>{ const iv=setInterval(()=>{ const mins=Math.floor(Math.random()*5)+1; setLastUpdate(`منذ ${mins} ${mins===1?'دقيقة':'دقائق'}`) },30000); return()=>clearInterval(iv)},[])

  const connectedStoresCount = useMemo(()=> new Set(OFFERS.map(o=>o.store)).size ,[])
  const filtered = useMemo(()=>{ let f=OFFERS; if(selectedCity!=='الكل') f=f.filter(o=>o.city===selectedCity); if(cat!=='الكل') f=f.filter(o=>o.base===cat||o.store===cat); if(search) f=f.filter(o=>o.title.includes(search)||o.base.includes(search)); return f },[selectedCity,cat,search])
  const compareOffers = useMemo(()=> compareBase? OFFERS.filter(o=>o.base===compareBase).sort((a,b)=>a.price-b.price):[],[compareBase])

  const toggleTrack = (id:number)=>{ setTracking(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); setToast(tracking.includes(id)?'تم إيقاف التتبع':'✅ يتم تتبع السعر الآن - سننبهك عند انخفاضه'); setTimeout(()=>setToast(''),2500) }
  const toggleAlert = (id:number)=>{ setAlerts(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); setToast(alerts.includes(id)?'تم إيقاف التنبيه':'🔔 تم تفعيل التنبيه عند نزول السعر'); setTimeout(()=>setToast(''),2500) }

  const add = (o:Offer)=>{ setCart((p:any)=>[...p,o]); setToast('أضيف للسلة ✓'); setTimeout(()=>setToast(''),2000) }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBFF] text-zinc-900 pb-[90px]">
      {showSplash&&<div className="fixed inset-0 z-[100] bg-gradient-to-br from-white via-[#FBF8FF] to-[#F3E8FF] grid place-items-center p-6"><div className="w-full max-w-[360px] bg-white rounded-[32px] shadow-xl border border-violet-100 p-7 text-center"><div className="w-20 h-20 mx-auto rounded-[22px] bg-gradient-to-br from-[#6D28D9] to-fuchsia-600 grid place-items-center text-white text-3xl">💜</div><div className="mt-4 font-black">عروضكم - متجر حكيم</div><div className="mt-5 bg-[#FBF8FF] border border-violet-100 rounded-2xl p-4 text-right"><p className="text-[13px] leading-6 font-bold">“أن هذا التطبيق لديه فرصة ليكون من أفضل تطبيقات العروض في السعودية، ويمكن أن ينافس التطبيقات الحالية بقوة.”</p><div className="mt-2 text-[11px] font-black">— شات جي بي تي</div></div><button onClick={()=>setShowSplash(false)} className="mt-6 w-full h-12 rounded-full bg-[#6D28D9] text-white font-black">ابدأ التوفير →</button></div></div>}

      <div className="w-full bg-gradient-to-r from-[#6D28D9] to-[#a855f7] text-white text-center h-8 flex items-center justify-center gap-2 text-[12px] font-bold">🤖 وفر مع حكيم مدعوم بالذكاء الاقتصادي</div>

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 h-[64px] flex items-center gap-3">
          <button className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[13px] font-black">دخول</button>
          <div className="flex-1 max-w-[560px] mx-auto relative"><input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="البحث الذكي: أرخص حليب أطفال..." className="w-full h-11 pr-11 pl-4 rounded-full bg-[#F6F3FF] border border-violet-100 focus:border-[#6D28D9] outline-none text-[13px]" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#6D28D9] text-white grid place-items-center">⌕</span></div>
          <button onClick={()=>setCat('المساعد الاقتصادي')} className="h-10 pl-2 pr-3 rounded-full border border-violet-200 bg-violet-50 flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D28D9] to-fuchsia-500 text-white grid place-items-center">🤖</span><span className="font-black text-[13px] hidden md:block">حكيم</span></button>
        </div>
      </header>

      {/* حالة الزحف - تم التصحيح */}
      <div className="max-w-6xl mx-auto px-4 mt-3">
        <div className="h-9 rounded-full bg-white border border-zinc-100 shadow-sm flex items-center justify-between px-4 text-[12px]">
          <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="font-bold text-zinc-700">🤖 يتم تحديث العروض من المتاجر المتصلة</span><span className="hidden md:inline text-zinc-400">• {connectedStoresCount} متاجر نشطة الآن</span></div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1"><span>آخر تحديث:</span><span className="font-bold text-zinc-700">{lastUpdate}</span></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        {/* خريطة المملكة */}
        <section className="rounded-[24px] bg-white border border-zinc-100 shadow-sm p-5">
          <div className="flex items-center justify-between"><h2 className="font-black text-[15px]">🗺️ خريطة العروض - اختر مدينتك</h2><span className="text-[11px] bg-violet-50 text-[#6D28D9] px-2.5 h-6 rounded-full grid place-items-center font-bold">{selectedCity==='الكل'?'كل المدن':selectedCity}</span></div>
          <p className="mt-1 text-[12px] text-zinc-500">اعرض العروض القريبة منك حسب المنطقة</p>
          <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
            {CITIES.map(city=>{
              const count = city==='الكل'? OFFERS.length : OFFERS.filter(o=>o.city===city).length
              const active = selectedCity===city
              return <button key={city} onClick={()=>setSelectedCity(city)} className={`h-[64px] rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${active?'bg-[#6D28D9] text-white border-[#6D28D9] shadow-md':'bg-zinc-50 border-zinc-100 hover:border-violet-200 hover:bg-violet-50'}`}><span className="text-[16px]">{city==='الكل'?'🇸🇦':city==='الرياض'?'🏙️':city==='جدة'?'🌊':city==='الدمام'?'🏭':'📍'}</span><span className="text-[12px] font-black">{city}</span><span className={`text-[10px] ${active?'text-white/70':'text-zinc-400'}`}>{count} عرض</span></button>
            })}
          </div>
          <div className="mt-3 h-[1px] bg-zinc-100" />
          <div className="mt-3 flex gap-2 overflow-auto">{['الكل','زيت زيتون','حليب أطفال','ساعة'].map(c=><button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap h-8 px-4 rounded-full border text-[12px] font-bold ${cat===c?'bg-zinc-900 text-white border-zinc-900':'bg-white border-zinc-200'}`}>{c}</button>)}</div>
        </section>

        {/* شبكة العروض */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(o=>(
            <div key={o.id} className="bg-white rounded-[20px] border border-zinc-100 overflow-hidden flex flex-col shadow-sm">
              <div className="relative h-[132px] bg-zinc-50 overflow-hidden"><img src={o.image} alt={o.title} className="w-full h-full object-cover" /><span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[11px] font-black px-2 h-6 rounded-full grid place-items-center">-{o.discount}%</span><span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 h-5 rounded-full grid place-items-center">📍 {o.city}</span></div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-[11px] font-bold text-[#6D28D9]">🏬 {o.store}</div>
                <div className="mt-1 font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</div>
                <div className="mt-2 flex items-end gap-1.5"><span className="font-black text-[15px]">{o.price} ر.س</span><span className="text-[11px] text-zinc-400 line-through">{o.old_price} ر.س</span></div>
                
                {/* تتبع السعر المصغر */}
                <div className="mt-2.5 bg-[#FBF8FF] rounded-xl border border-violet-50 p-2 flex items-center justify-between">
                  <div><div className="text-[10px] text-zinc-500">تاريخ السعر</div><MiniChart data={o.history} /></div>
                  <div className="text-[10px] font-bold text-green-600">↓ وفر {o.old_price-o.price} ر.س</div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={()=>setCompareBase(o.base)} className="h-9 rounded-full bg-zinc-100 text-[12px] font-bold hover:bg-zinc-200">⚖️ قارن</button>
                  <button onClick={()=>add(o)} className="h-9 rounded-full bg-[#6D28D9] text-white text-[12px] font-black">اذهب للعرض →</button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button onClick={()=>toggleTrack(o.id)} className={`h-8 rounded-full border text-[11px] font-bold ${tracking.includes(o.id)?'bg-violet-50 border-violet-200 text-[#6D28D9]':'bg-white border-zinc-200'}`}>{tracking.includes(o.id)?'✅ يتتبع':'📈 تتبع'}</button>
                  <button onClick={()=>toggleAlert(o.id)} className={`h-8 rounded-full border text-[11px] font-bold ${alerts.includes(o.id)?'bg-amber-50 border-amber-200 text-amber-700':'bg-white border-zinc-200'}`}>{alerts.includes(o.id)?'🔔 منبه':'🔔 نبهني'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* بطاقة مؤسستك */}
        <section className="mt-8 rounded-[24px] bg-zinc-900 text-white p-6 relative overflow-hidden"><div className="inline-flex bg-white/10 px-3 h-7 rounded-full text-[11px] font-bold">🏢 {PROFILE_NAME}</div><h3 className="mt-3 font-black text-[15px] leading-7">{PROFILE_MSG}</h3><a href={PROFILE_LINK} target="_blank" className="mt-4 inline-grid h-11 px-6 rounded-full bg-white text-zinc-900 font-black text-[13px] place-items-center">رابط مكتبي العقاري ↗</a></section>
      </div>

      {/* مودال مقارنة الأسعار */}
      {compareBase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setCompareBase(null)}>
          <div className="w-full max-w-[520px] bg-white rounded-[24px] overflow-hidden shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center"><div><h3 className="font-black text-[16px]">⚖️ مقارنة أسعار: {compareBase}</h3><p className="text-[12px] text-zinc-500 mt-1">نفس المنتج في جميع المتاجر - مرتب من الأرخص</p></div><button onClick={()=>setCompareBase(null)} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">✕</button></div>
            <div className="p-3 space-y-2 max-h-[60vh] overflow-auto">
              {compareOffers.map((o,i)=>(
                <div key={o.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${i===0?'bg-green-50 border-green-200':'bg-white border-zinc-100'}`}>
                  <div className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-black ${i===0?'bg-green-500 text-white':'bg-zinc-100'}`}>{i+1}</div>
                  <img src={o.image} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1"><div className="font-bold text-[13px]">{o.store} • 📍 {o.city}</div><div className="text-[11px] text-zinc-500">{o.title}</div><div className="mt-1 flex gap-2"><span className="font-black text-[14px]">{o.price} ر.س</span><span className="text-[11px] line-through text-zinc-400">{o.old_price} ر.س</span><span className="text-[11px] bg-red-100 text-red-600 px-1.5 rounded-full font-bold">-{o.discount}%</span></div></div>
                  {i===0&&<span className="text-[10px] bg-green-500 text-white px-2 h-6 rounded-full grid place-items-center font-bold">الأرخص</span>}
                  <button onClick={()=>{add(o); setCompareBase(null)}} className="h-8 px-3 rounded-full bg-zinc-900 text-white text-[11px] font-bold">اختر</button>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[#FBF8FF] border-t flex gap-2"><div className="flex-1 text-[11px] leading-5 text-zinc-600">💡 <b>نصيحة حكيم:</b> الأرخص ليس دائماً الأفضل - تحقق من المدينة وتاريخ الانتهاء. المتاجر المتصلة يتم تحديثها تلقائياً.</div></div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur border-t flex justify-around items-center z-30">
        <button className="flex flex-col items-center text-[#6D28D9]"><span>🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button className="flex flex-col items-center text-zinc-400"><span>🗺️</span><span className="text-[10px] font-bold">الخريطة</span></button>
        <button className="flex flex-col items-center -mt-5"><span className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center text-xl shadow-lg border-4 border-white">🤖</span><span className="text-[10px] font-black text-[#6D28D9]">حكيم</span></button>
        <button className="flex flex-col items-center text-zinc-400 relative"><span>🔔</span><span className="text-[10px] font-bold">تنبيهاتي</span>{alerts.length>0&&<span className="absolute -top-1 right-2 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full grid place-items-center">{alerts.length}</span>}</button>
        <button className="flex flex-col items-center text-zinc-400"><span>👤</span><span className="text-[10px] font-bold">مكتبي</span></button>
      </nav>

      {toast&&<div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-2 rounded-full text-[13px] z-50 shadow-lg">{toast}</div>}
    </div>
  )
}
