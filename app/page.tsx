"use client"
import { useEffect, useMemo, useState } from 'react'

type Lang = 'ar'|'en'
type City = 'الكل'|'الرياض'|'جدة'|'مكة'|'المدينة'|'الدمام'|'الخبر'|'القصيم'|'أبها'|'تبوك'|'جازان'

type Offer = { id:number; title_ar:string; title_en:string; base:string; store:string; city:City; price:number; old_price:number; discount:number; image:string; history:number[] }

const OFFERS: Offer[] = [
  { id:1, title_ar:'زيت زيتون بكر 1 لتر', title_en:'Extra Virgin Olive Oil 1L', base:'زيت زيتون', store:'Panda', city:'الرياض', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,35,29,24,19] },
  { id:2, title_ar:'زيت زيتون بكر 1 لتر', title_en:'Extra Virgin Olive Oil 1L', base:'زيت زيتون', store:'Othaim', city:'جدة', price:22, old_price:39, discount:44, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', history:[39,37,32,26,22] },
  { id:4, title_ar:'حليب أطفال نان 400 جم', title_en:'NAN Baby Milk 400g', base:'حليب أطفال', store:'Nahdi', city:'الرياض', price:32, old_price:49, discount:35, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,45,41,36,32] },
  { id:5, title_ar:'حليب أطفال نان 400 جم', title_en:'NAN Baby Milk 400g', base:'حليب أطفال', store:'Dawaa', city:'جدة', price:29, old_price:49, discount:41, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', history:[49,44,39,33,29] },
  { id:9, title_ar:'ساعة RICEGGO بيبسي', title_en:'RICEGGO Pepsi Watch', base:'ساعة', store:'Hakeem Store', city:'الرياض', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', history:[450,399,349,299,200] },
]

const CITIES: City[] = ['الكل','الرياض','جدة','مكة','المدينة','الدمام','الخبر','القصيم','أبها','تبوك','جازان']

const T = {
  ar: {
    saveWithHakeem:'وفر مع حكيم مدعوم بالذكاء الاقتصادي',
    searchPH:'البحث الذكي: أرخص حليب أطفال...',
    login:'دخول', hakeem:'حكيم', assistant:'مساعد ذكي',
    updating:'يتم تحديث العروض من المتاجر المتصلة',
    activeStores:'متاجر نشطة', lastUpdate:'آخر تحديث: الآن',
    mapTitle:'🗺️ خريطة العروض', chooseCity:'اختر مدينتك الافتراضية',
    all:'الكل', compare:'⚖️ قارن', goOffer:'اذهب للعرض →',
    track:'📈 تتبع', tracking:'✅ يتتبع', alert:'🔔 نبهني', alertOn:'🔔 منبه',
    settings:'⚙️ لوحة التحكم', darkMode:'🌙 الوضع الليلي', darkDesc:'تفعيل الوضع الليلي المريح للعين',
    fontControl:'🔤 التحكم بالخط', small:'صغير', medium:'متوسط', large:'كبير',
    language:'🌐 اللغة', arabic:'العربية', english:'English',
    defaultCity:'📍 المدينة الافتراضية', cityDesc:'سيتم عرض عروض مدينتك أولاً',
    home:'الرئيسية', map:'الخريطة', alerts:'تنبيهاتي', profile:'مكتبي',
    priceHistory:'تاريخ السعر', save:'وفر',
  },
  en: {
    saveWithHakeem:'Save with Hakeem - AI Powered',
    searchPH:'Smart search: cheapest baby milk...',
    login:'Login', hakeem:'Hakeem', assistant:'AI Assistant',
    updating:'Updating offers from connected stores',
    activeStores:'active stores', lastUpdate:'Last update: now',
    mapTitle:'🗺️ Offers Map', chooseCity:'Choose your default city',
    all:'All', compare:'⚖️ Compare', goOffer:'Go to offer →',
    track:'📈 Track', tracking:'✅ Tracking', alert:'🔔 Alert', alertOn:'🔔 On',
    settings:'⚙️ Control Panel', darkMode:'🌙 Dark Mode', darkDesc:'Enable eye-friendly dark mode',
    fontControl:'🔤 Font Size', small:'Small', medium:'Medium', large:'Large',
    language:'🌐 Language', arabic:'العربية', english:'English',
    defaultCity:'📍 Default City', cityDesc:'Your city offers will show first',
    home:'Home', map:'Map', alerts:'Alerts', profile:'Office',
    priceHistory:'Price history', save:'Save',
  }
}

function MiniChart({ data }:{data:number[]}){ const max=Math.max(...data); const min=Math.min(...data); const range=max-min||1; return <div className="flex items-end gap-[3px] h-[28px]">{data.map((v,i)=><div key={i} className={`w-[4px] rounded-full ${i===data.length-1?'bg-[#6D28D9]':'bg-zinc-300'}`} style={{height:`${6+((max-v)/range)*22}px`}} />)}</div> }

export default function Page(){
  const [lang,setLang]=useState<Lang>('ar')
  const [darkMode,setDarkMode]=useState(false)
  const [fontSize,setFontSize]=useState<'sm'|'base'|'lg'>('base')
  const [defaultCity,setDefaultCity]=useState<City>('الرياض')
  const [selectedCity,setSelectedCity]=useState<City>('الكل')
  const [showSettings,setShowSettings]=useState(false)
  const [search,setSearch]=useState('')
  const [cat,setCat]=useState('الكل')
  const [tracking,setTracking]=useState<number[]>([])
  const [alerts,setAlerts]=useState<number[]>([])
  const [compareBase,setCompareBase]=useState<string|null>(null)

  const t = T[lang]

  useEffect(()=>{ const s=localStorage.getItem('app_settings'); if(s){ try{ const j=JSON.parse(s); if(j.lang) setLang(j.lang); if(j.darkMode!==undefined) setDarkMode(j.darkMode); if(j.fontSize) setFontSize(j.fontSize); if(j.defaultCity) {setDefaultCity(j.defaultCity); setSelectedCity(j.defaultCity)} }catch{} } },[])
  useEffect(()=>{ localStorage.setItem('app_settings', JSON.stringify({lang,darkMode,fontSize,defaultCity})) },[lang,darkMode,fontSize,defaultCity])

  const filtered = useMemo(()=>{ let f=OFFERS; const cityFilter = selectedCity==='الكل'? defaultCity!=='الكل'? defaultCity : 'الكل' : selectedCity; if(cityFilter!=='الكل') f=f.filter(o=>o.city===cityFilter); if(cat!=='الكل') f=f.filter(o=>o.base===cat); if(search) f=f.filter(o=>o.title_ar.includes(search)||o.title_en.toLowerCase().includes(search.toLowerCase())); return f },[selectedCity,cat,search,defaultCity])

  const fontScale = fontSize==='sm'?'13px':fontSize==='lg'?'16px':'14.5px'
  const dir = lang==='ar'?'rtl':'ltr'
  const bgMain = darkMode? 'bg-[#121214] text-zinc-100' : 'bg-[#F2F2F7] text-zinc-900'
  const cardBg = darkMode? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'

  return (
    <div dir={dir} style={{fontSize:fontScale}} className={`min-h-screen pb-[88px] transition-colors ${bgMain}`}>
      <div className="w-full bg-gradient-to-r from-[#6D28D9] to-[#a855f7] text-white text-center h-8 flex items-center justify-center text-[12px] font-bold">🤖 {t.saveWithHakeem}</div>

      <header className={`sticky top-0 z-20 backdrop-blur border-b ${darkMode?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-zinc-200'}`}>
        <div className="max-w-6xl mx-auto px-3 h-[60px] flex items-center gap-2">
          <button onClick={()=>setShowSettings(true)} className={`h-10 w-10 rounded-full grid place-items-center border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`}>⚙️</button>
          <div className="flex-1 max-w-[500px] mx-auto relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPH} className={`w-full h-10 px-4 rounded-full border outline-none text-[13px] ${darkMode?'bg-zinc-800 border-zinc-700 text-white':'bg-white border-violet-100'}`} /></div>
          <button onClick={()=>setDarkMode(!darkMode)} className="h-10 w-10 rounded-full border grid place-items-center">{darkMode?'☀️':'🌙'}</button>
          <button className="h-10 px-3 rounded-full bg-[#6D28D9] text-white text-[12px] font-black hidden md:block">{t.hakeem} 🤖</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 mt-3">
        <div className={`h-9 rounded-full border flex items-center justify-between px-4 text-[11px] ${cardBg}`}><div className="flex gap-2 items-center"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{t.updating} • {new Set(OFFERS.map(o=>o.store)).size} {t.activeStores}</div><div className="opacity-60">{t.lastUpdate}</div></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 pt-4">
        <section className={`rounded-[20px] border p-4 ${cardBg}`}>
          <div className="flex justify-between items-center"><h2 className="font-black text-[14px]">{t.mapTitle}</h2><span className="text-[11px] bg-violet-100 text-[#6D28D9] px-2 h-6 rounded-full grid place-items-center font-bold">{defaultCity} • {lang==='ar'?'افتراضي':'Default'}</span></div>
          <div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-2">{CITIES.map(c=>{const active=selectedCity===c; return <button key={c} onClick={()=>setSelectedCity(c)} className={`h-14 rounded-xl border text-[11px] font-bold ${active?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-zinc-50 dark:bg-zinc-800'}`}><div>{c}</div><div className="text-[10px] opacity-60">{OFFERS.filter(o=>o.city===c).length|| (c==='الكل'?OFFERS.length:0)} {lang==='ar'?'عرض':'offers'}</div></button>})}</div>
          <div className="mt-3 flex gap-2 overflow-auto">{[t.all,'زيت زيتون','حليب أطفال','ساعة'].map(n=><button key={n} onClick={()=>setCat(n===t.all?'الكل':n)} className={`h-8 px-4 rounded-full border text-[12px] font-bold whitespace-nowrap ${cat===(n===t.all?'الكل':n)?'bg-zinc-900 text-white dark:bg-white dark:text-black':'bg-white dark:bg-zinc-800'}`}>{n}</button>)}</div>
        </section>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map(o=>(
            <div key={o.id} className={`rounded-[16px] border overflow-hidden ${cardBg}`}>
              <div className="relative h-[110px]"><img src={o.image} className="w-full h-full object-cover" alt="" /><span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 h-5 rounded-full grid place-items-center font-black">-{o.discount}%</span><span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 h-5 rounded-full grid place-items-center">📍 {o.city}</span></div>
              <div className="p-3"><div className="text-[11px] text-[#6D28D9] font-bold">{o.store}</div><div className="font-bold text-[13px] leading-5 line-clamp-2 min-h-[40px]">{lang==='ar'?o.title_ar:o.title_en}</div><div className="mt-1 flex gap-1.5 items-end"><span className="font-black">{o.price} {lang==='ar'?'ر.س':'SAR'}</span><span className="text-[11px] line-through opacity-50">{o.old_price}</span></div>
                <div className={`mt-2 rounded-xl p-2 flex justify-between items-center ${darkMode?'bg-zinc-800':'bg-[#F8F7FF]'}`}><div><div className="text-[10px] opacity-60">{t.priceHistory}</div><MiniChart data={o.history} /></div><span className="text-[10px] font-bold text-green-600">{t.save} {o.old_price-o.price}</span></div>
                <div className="mt-2 grid grid-cols-2 gap-1.5"><button onClick={()=>setCompareBase(o.base)} className="h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold">{t.compare}</button><button className="h-8 rounded-full bg-[#6D28D9] text-white text-[11px] font-black">{t.goOffer}</button></div>
                <div className="mt-1 grid grid-cols-2 gap-1.5"><button onClick={()=>setTracking(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} className="h-7 rounded-full border text-[10px] font-bold">{tracking.includes(o.id)?t.tracking:t.track}</button><button onClick={()=>setAlerts(p=>p.includes(o.id)?p.filter(x=>x!==o.id):[...p,o.id])} className="h-7 rounded-full border text-[10px] font-bold">{alerts.includes(o.id)?t.alertOn:t.alert}</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSettings&&<div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={()=>setShowSettings(false)}><div className={`w-full max-w-[380px] rounded-[24px] p-5 max-h-[85vh] overflow-auto ${darkMode?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between items-center"><h3 className="font-black">{t.settings}</h3><button onClick={()=>setShowSettings(false)} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center">✕</button></div>

        <div className="mt-5 space-y-4">
          <div className={`rounded-2xl p-4 border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-[#F8F7FF] border-violet-100'}`}>
            <div className="font-bold text-[13px]">{t.language}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={()=>setLang('ar')} className={`h-11 rounded-xl border font-bold text-[13px] ${lang==='ar'?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'}`}>🇸🇦 {t.arabic}</button>
              <button onClick={()=>setLang('en')} className={`h-11 rounded-xl border font-bold text-[13px] ${lang==='en'?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'}`}>🇺🇸 {t.english}</button>
            </div>
          </div>

          <div className={`rounded-2xl p-4 border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-[#F8F7FF] border-violet-100'}`}>
            <div className="font-bold text-[13px] flex justify-between"><span>{t.defaultCity}</span><span className="text-[11px] bg-white dark:bg-zinc-900 px-2 h-5 rounded-full border grid place-items-center">{defaultCity}</span></div>
            <div className="text-[11px] opacity-60 mt-1">{t.cityDesc}</div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">{CITIES.filter(c=>c!=='الكل').map(c=><button key={c} onClick={()=>{setDefaultCity(c); setSelectedCity(c)}} className={`h-9 rounded-xl border text-[11px] font-bold ${defaultCity===c?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'}`}>{c}</button>)}</div>
          </div>

          <div className={`rounded-2xl p-4 border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-[#F8F7FF] border-violet-100'}`}>
            <div className="font-bold text-[13px]">{t.darkMode}</div><div className="text-[11px] opacity-60">{t.darkDesc}</div>
            <div className="mt-3 flex justify-between items-center"><span className="text-[12px]">{darkMode?'🌙 مفعل':'☀️ نهاري'}</span><button onClick={()=>setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full p-1 transition ${darkMode?'bg-[#6D28D9]':'bg-zinc-300'}`}><div className={`w-5 h-5 rounded-full bg-white shadow transition ${darkMode?'translate-x-5':''}`} /></button></div>
          </div>

          <div className={`rounded-2xl p-4 border ${darkMode?'bg-zinc-800 border-zinc-700':'bg-[#F8F7FF] border-violet-100'}`}>
            <div className="font-bold text-[13px]">{t.fontControl}</div>
            <div className="mt-3 grid grid-cols-3 gap-2">{[{id:'sm',l:T[lang].small,i:'A-'},{id:'base',l:T[lang].medium,i:'A'},{id:'lg',l:T[lang].large,i:'A+'}].map(o=><button key={o.id} onClick={()=>setFontSize(o.id as any)} className={`h-14 rounded-xl border flex flex-col items-center justify-center ${fontSize===o.id?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900'}`}><span className="font-black">{o.i}</span><span className="text-[11px]">{o.l}</span></button>)}</div>
          </div>
        </div>
      </div></div>}

      {compareBase&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setCompareBase(null)}><div className={`w-full max-w-[460px] rounded-2xl p-3 ${cardBg}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between p-2"><h3 className="font-black">⚖️ {compareBase}</h3><button onClick={()=>setCompareBase(null)}>✕</button></div>{OFFERS.filter(o=>o.base===compareBase).sort((a,b)=>a.price-b.price).map((o,i)=><div key={o.id} className={`flex gap-2 p-2 rounded-xl border mb-2 ${i===0?'bg-green-50 dark:bg-green-950 border-green-200':''}`}><span className="font-black">{i+1}</span><img src={o.image} className="w-10 h-10 rounded-lg object-cover"/><div className="flex-1 text-[12px]"><div className="font-bold">{o.store} - {o.city}</div><div>{o.price} SAR</div></div>{i===0&&<span className="text-[10px] bg-green-500 text-white px-2 h-5 rounded-full grid place-items-center">Cheapest</span>}</div>)}</div></div>}

      <nav className={`fixed bottom-0 inset-x-0 h-[70px] border-t backdrop-blur flex justify-around items-center ${darkMode?'bg-zinc-900/95 border-zinc-800':'bg-white/95'}`}><button className="flex flex-col items-center text-[#6D28D9]"><span>🏠</span><span className="text-[10px] font-bold">{t.home}</span></button><button className="flex flex-col items-center opacity-60"><span>🗺️</span><span className="text-[10px]">{t.map}</span></button><button className="flex flex-col items-center -mt-4"><span className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center shadow-lg">🤖</span></button><button className="flex flex-col items-center opacity-60"><span>🔔</span><span className="text-[10px]">{t.alerts}</span></button><button onClick={()=>setShowSettings(true)} className="flex flex-col items-center opacity-60"><span>⚙️</span><span className="text-[10px]">{t.profile}</span></button></nav>
    </div>
  )
}
