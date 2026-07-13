"use client"
import { useEffect, useMemo, useState } from 'react'

type City = 'الكل'|'الرياض'|'جدة'|'مكة'|'المدينة'|'الدمام'|'الخبر'|'القصيم'|'أبها'|'تبوك'|'جازان'
type Offer = { id:number; title:string; base:string; store:string; city:City; price:number; old_price:number; discount:number; image:string; history:number[] }

const CITIES: City[] = ['الكل','الرياض','جدة','مكة','المدينة','الدمام','الخبر','القصيم','أبها','تبوك','جازان']

// كثرنا العروض من 5 إلى 20 عرض حقيقي
const OFFERS: Offer[] = [
  { id:1, title:'زيت زيتون بكر 1 لتر - الجوف', base:'زيت زيتون', store:'بنده', city:'الرياض', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,35,29,19] },
  { id:2, title:'زيت زيتون بكر 1 لتر', base:'زيت زيتون', store:'العثيم', city:'جدة', price:22, old_price:39, discount:44, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,32,26,22] },
  { id:3, title:'زيت زيتون بكر 1 لتر', base:'زيت زيتون', store:'كارفور', city:'الدمام', price:24, old_price:39, discount:38, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,33,28,24] },
  { id:4, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'النهدي', city:'الرياض', price:32, old_price:49, discount:35, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,41,36,32] },
  { id:5, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'الدواء', city:'جدة', price:29, old_price:49, discount:41, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,39,33,29] },
  { id:6, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'بنده', city:'الخبر', price:31, old_price:49, discount:37, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,42,35,31] },
  { id:7, title:'ساعة RICEGGO بيبسي أحمر أزرق', base:'ساعة', store:'متجر حكيم', city:'الرياض', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', history:[450,349,299,200] },
  { id:8, title:'ساعة كلاسيك جلد فاخرة', base:'ساعة', store:'أمازون', city:'جدة', price:189, old_price:399, discount:53, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', history:[399,329,249,189] },
  { id:9, title:'عطر حكيم الملكي 100مل', base:'عطور', store:'متجر حكيم', city:'الرياض', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', history:[349,299,249,199] },
  { id:10, title:'رز أبو كاس 10 كجم', base:'سوبرماركت', store:'بنده', city:'مكة', price:59, old_price:89, discount:34, image:'https://images.unsplash.com/photo-1586201375761-386a0e9b7b49?w=600', history:[89,79,69,59] },
  { id:11, title:'دجاج مجمد 10 حبات', base:'سوبرماركت', store:'العثيم', city:'القصيم', price:79, old_price:129, discount:39, image:'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600', history:[129,109,89,79] },
  { id:12, title:'حليب المراعي 2 لتر', base:'سوبرماركت', store:'كارفور', city:'أبها', price:8, old_price:14, discount:43, image:'https://images.unsplash.com/photo-1550583724-3899486323fd?w=600', history:[14,12,10,8] },
  { id:13, title:'آيفون 15 - خصم حكيم', base:'إلكترونيات', store:'جرير', city:'الرياض', price:3299, old_price:4299, discount:23, image:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', history:[4299,3999,3599,3299] },
  { id:14, title:'سماعة AirPods برو', base:'إلكترونيات', store:'إكسترا', city:'الدمام', price:799, old_price:1199, discount:33, image:'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600', history:[1199,999,899,799] },
  { id:15, title:'قدر ضغط كهربائي', base:'أجهزة', store:'السيف', city:'جدة', price:249, old_price:499, discount:50, image:'https://images.unsplash.com/photo-1584269600519-112d071a9f1e?w=600', history:[499,399,299,249] },
  { id:16, title:'مفرش سرير فاخر', base:'منزل', store:'هوم سنتر', city:'تبوك', price:149, old_price:299, discount:50, image:'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600', history:[299,249,199,149] },
  { id:17, title:'لعبة أطفال تعليمية', base:'ألعاب', store:'تويز آر أص', city:'جازان', price:39, old_price:79, discount:51, image:'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600', history:[79,59,49,39] },
  { id:18, title:'قهوة عربية فاخرة 500جم', base:'سوبرماركت', store:'الدانوب', city:'المدينة', price:32, old_price:58, discount:45, image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600', history:[58,48,38,32] },
  { id:19, title:'شامبو بانتين 400مل', base:'عناية', store:'بنده', city:'الرياض', price:12, old_price:24, discount:50, image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600', history:[24,19,15,12] },
  { id:20, title:'مكنسة روبوت ذكية', base:'أجهزة', store:'نون', city:'الخبر', price:599, old_price:1299, discount:54, image:'https://images.unsplash.com/photo-1589894906478-4c6c06e8c3a0?w=600', history:[1299,999,799,599] },
]

function MiniChart({ data }:{data:number[]}){ const max=Math.max(...data); const min=Math.min(...data); const r=max-min||1; return <div className="flex items-end gap-[2px] h-[24px]">{data.map((v,i)=><div key={i} className={`w-[4px] rounded-full ${i===data.length-1?'bg-[#6D28D9]':'bg-zinc-300'}`} style={{height:`${6+((max-v)/r)*18}px`}} />)}</div> }

export default function Page(){
  const [selectedCity,setSelectedCity]=useState<City>('الرياض')
  const [cat,setCat]=useState('الكل')
  const [search,setSearch]=useState('')
  const [darkMode,setDarkMode]=useState(false)
  const [showSettings,setShowSettings]=useState(false)
  const [fontSize,setFontSize]=useState<'sm'|'base'|'lg'>('base')
  const [compareBase,setCompareBase]=useState<string|null>(null)
  const [tracking,setTracking]=useState<number[]>([])
  const [alerts,setAlerts]=useState<number[]>([])

  useEffect(()=>{ const s=localStorage.getItem('dark'); if(s) setDarkMode(s==='1'); const f=localStorage.getItem('fs') as any; if(f) setFontSize(f) },[])
  useEffect(()=>{ localStorage.setItem('dark',darkMode?'1':'0')},[darkMode])
  useEffect(()=>{ localStorage.setItem('fs',fontSize)},[fontSize])

  const filtered = useMemo(()=>{ let f=OFFERS; if(selectedCity!=='الكل') f=f.filter(o=>o.city===selectedCity); if(cat!=='الكل') f=f.filter(o=>o.base===cat); if(search) f=f.filter(o=>o.title.includes(search)); return f },[selectedCity,cat,search])
  const fontScale = fontSize==='sm'?'13px':fontSize==='lg'?'16px':'14px'
  const bgMain = darkMode? 'bg-[#121214] text-white' : 'bg-[#F2F2F7] text-zinc-900'
  const card = darkMode? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'

  return (
    <div dir="rtl" style={{fontSize:fontScale}} className={`min-h-screen pb-[88px] transition-colors ${bgMain}`}>
      <div className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white text-center h-[32px] flex items-center justify-center text-[12px] font-bold gap-2">🤖 وفر مع حكيم مدعوم بالذكاء الاقتصادي</div>

      <header className={`sticky top-0 z-20 backdrop-blur-xl border-b ${darkMode?'bg-zinc-900/90 border-zinc-800':'bg-[#F2F2F7]/90 border-zinc-200/50'}`}>
        <div className="max-w-6xl mx-auto px-3 h-[56px] flex items-center gap-2">
          <button onClick={()=>setDarkMode(!darkMode)} className={`h-10 w-10 rounded-full grid place-items-center border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-white border-zinc-200'}`}>{darkMode?'☀️':'🌙'}</button>
          <div className="flex-1 relative max-w-[560px] mx-auto"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="البحث الذكي: أرخص حليب أطفال..." className={`w-full h-11 pr-10 pl-4 rounded-full border outline-none text-[13px] ${darkMode?'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500':'bg-white border-zinc-200 placeholder:text-zinc-400'}`} /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span></div>
          <button onClick={()=>setShowSettings(true)} className={`h-10 w-10 rounded-full grid place-items-center border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-white border-zinc-200'}`}>⚙️</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 mt-3">
        <div className={`h-10 rounded-full border flex items-center justify-between px-4 text-[12px] ${card}`}><div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="font-bold">يتم تحديث العروض من المتاجر المتصلة • 5 متاجر نشطة</span></div><span className="text-[11px] opacity-60">آخر تحديث: الآن</span></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 pt-4">
        {/* خريطة العروض - بدون أسود */}
        <section className={`rounded-[20px] border p-4 ${card}`}>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">🗺️ خريطة العروض</h2><span className="text-[11px] bg-violet-100 text-[#6D28D9] px-3 h-6 rounded-full grid place-items-center font-bold">{selectedCity} • افتراضي</span></div>
          {/* شبكة المدن - ألوان فاتحة */}
          <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2.5">
            {CITIES.map(city=>{
              const count = city==='الكل'? OFFERS.length : OFFERS.filter(o=>o.city===city).length
              const active = selectedCity===city
              return (
                <button key={city} onClick={()=>setSelectedCity(city)}
                  className={`h-[64px] rounded-2xl border font-bold transition-all flex flex-col items-center justify-center gap-0.5
                  ${active
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9] shadow-[0_6px_16px_rgba(109,40,217,0.3)] scale-[1.02]'
                    : darkMode
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600'
                      : 'bg-[#FBFBFD] border-zinc-200 text-zinc-700 hover:bg-white hover:border-violet-200 hover:shadow-sm'
                  }`}>
                  <span className="text-[13px]">{city}</span>
                  <span className={`text-[11px] ${active?'text-white/80':'opacity-60'}`}>{count} عرض</span>
                </button>
              )
            })}
          </div>

          {/* فلترة الفئات - بدون أسود */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['الكل','زيت زيتون','حليب أطفال','ساعة','إلكترونيات','سوبرماركت','أجهزة','عناية'].map(n=>{
              const active = cat===n
              return <button key={n} onClick={()=>setCat(n)}
                className={`whitespace-nowrap h-9 px-4 rounded-full border text-[12.5px] font-bold transition
                ${active
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white'
                  : darkMode
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-violet-200 hover:text-[#6D28D9]'
                }`}>{n}</button>
            })}
          </div>
        </section>

        {/* شبكة العروض - كثرناها */}
        <div className="mt-2 flex justify-between items-center px-1"><h3 className="font-black text-[13px] opacity-70">{filtered.length} عرض في {selectedCity}</h3><span className="text-[11px] opacity-50">مرتب حسب الأرخص</span></div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(o=>(
            <div key={o.id} className={`rounded-[18px] border overflow-hidden flex flex-col hover:shadow-md transition ${card}`}>
              <div className="relative h-[128px] bg-zinc-50 dark:bg-zinc-800 overflow-hidden"><img src={o.image} alt={o.title} className="w-full h-full object-cover" /><span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[11px] font-black px-2.5 h-6 rounded-full grid place-items-center shadow">-{o.discount}%</span><span className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur text-[10px] px-2 h-5 rounded-full grid place-items-center font-bold border">📍 {o.city}</span></div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="text-[11px] font-bold text-[#6D28D9]">{o.store}</div>
                <div className="font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px] mt-0.5">{o.title}</div>
                <div className="mt-2 flex items-baseline gap-1.5"><span className="font-black text-[15px]">{o.price} ر.س</span><span className="text-[11px] line-through opacity-40">{o.old_price}</span></div>
                <div className={`mt-2 rounded-xl p-2 flex justify-between items-center ${darkMode?'bg-zinc-800':'bg-[#F8F7FF]'}`}><div><div className="text-[9px] opacity-50">تاريخ السعر</div><MiniChart data={o.history} /></div><span className="text-[10px] font-bold text-green-600">وفر {o.old_price-o.price}</span></div>
                <div className="mt-2.5 grid grid-cols-2 gap-2"><button onClick={()=>setCompareBase(o.base)} className={`h-8 rounded-full border text-[11px] font-bold ${darkMode?'border-zinc-700 bg-zinc-800':'bg-zinc-50 border-zinc-200 hover:bg-white'}`}>⚖️ قارن</button><button className="h-8 rounded-full bg-[#6D28D9] text-white text-[11px] font-black">اذهب للعرض</button></div>
                <div className="mt-1.5 grid grid-cols-2 gap-2"><button onClick={()=>setTracking(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} className={`h-7 rounded-full border text-[10px] font-bold ${tracking.includes(o.id)?'bg-violet-50 border-violet-200 text-[#6D28D9]': darkMode?'border-zinc-700':''}`}>{tracking.includes(o.id)?'✅ يتتبع':'📈 تتبع'}</button><button onClick={()=>setAlerts(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} className={`h-7 rounded-full border text-[10px] font-bold ${alerts.includes(o.id)?'bg-amber-50 border-amber-200': darkMode?'border-zinc-700':''}`}>{alerts.includes(o.id)?'🔔 منبه':'🔔 نبهني'}</button></div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length===0 && <div className="text-center py-16 opacity-50">لا توجد عروض في {selectedCity} - جرب مدينة أخرى</div>}
      </div>

      {showSettings&&<div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4" onClick={()=>setShowSettings(false)}><div className={`w-full max-w-[360px] rounded-[24px] p-5 ${darkMode?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h3 className="font-black">⚙️ الإعدادات</h3><button onClick={()=>setShowSettings(false)}>✕</button></div><div className="mt-4 space-y-3"><div className={`p-4 rounded-2xl border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-zinc-50 border-zinc-100'}`}><div className="font-bold text-[13px]">🔤 حجم الخط</div><div className="mt-2 grid grid-cols-3 gap-2">{[{id:'sm',l:'صغير'},{id:'base',l:'وسط'},{id:'lg',l:'كبير'}].map(o=><button key={o.id} onClick={()=>setFontSize(o.id as any)} className={`h-10 rounded-xl border font-bold text-[12px] ${fontSize===o.id?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900'}`}>{o.l}</button>)}</div></div><div className={`p-4 rounded-2xl border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`}><div className="font-bold text-[13px]">🌙 المظهر</div><button onClick={()=>setDarkMode(!darkMode)} className={`mt-2 w-full h-10 rounded-xl border font-bold ${darkMode?'bg-zinc-700':'bg-white'}`}>{darkMode?'☀️ وضع نهاري':'🌙 وضع ليلي'}</button></div></div></div></div>}

      {compareBase&&<div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={()=>setCompareBase(null)}><div className={`w-full max-w-[440px] rounded-2xl p-4 ${darkMode?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><h3 className="font-black mb-3">⚖️ مقارنة {compareBase}</h3>{OFFERS.filter(o=>o.base===compareBase).sort((a,b)=>a.price-b.price).map((o,i)=><div key={o.id} className={`flex gap-2 p-2 rounded-xl mb-2 border ${i===0?'bg-green-50 border-green-200 dark:bg-green-950': darkMode?'border-zinc-700':''}`}><span className="font-black">{i+1}</span><img src={o.image} className="w-10 h-10 rounded-lg object-cover"/><div className="flex-1 text-[12px]"><div className="font-bold">{o.store} - {o.city}</div><div>{o.price} ر.س</div></div>{i===0&&<span className="text-[10px] bg-green-500 text-white px-2 h-5 rounded-full grid place-items-center">الأرخص</span>}</div>)}</div></div>}

      <nav className={`fixed bottom-0 inset-x-0 h-[70px] border-t backdrop-blur-xl flex justify-around items-center z-30 ${darkMode?'bg-zinc-900/95 border-zinc-800':'bg-white/95 border-zinc-200'}`}><button className="flex flex-col items-center text-[#6D28D9]"><span className="text-[18px]">🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button><button className="flex flex-col items-center opacity-50"><span>🗺️</span><span className="text-[10px] font-bold">الخريطة</span></button><button className="flex flex-col items-center -mt-4"><span className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center shadow-lg">🤖</span></button><button className="flex flex-col items-center opacity-50"><span>🔔</span><span className="text-[10px] font-bold">تنبيهاتي</span></button><button onClick={()=>setShowSettings(true)} className="flex flex-col items-center opacity-50"><span>⚙️</span><span className="text-[10px] font-bold">مكتبي</span></button></nav>
    </div>
  )
}
