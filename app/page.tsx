"use client"
import { useEffect, useMemo, useState } from 'react'

type City = 'الرياض'|'جدة'|'مكة'|'المدينة'|'الدمام'|'الخبر'|'القصيم'|'أبها'|'تبوك'|'جازان'
type Offer = { id:number; title:string; base:string; store:string; city:City; price:number; old_price:number; discount:number; image:string }

const OFFERS: Offer[] = [
  { id:1, title:'زيت زيتون بكر 1 لتر', base:'زيت زيتون', store:'بنده', city:'الرياض', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600' },
  { id:2, title:'حليب أطفال نان 400 جم', base:'حليب أطفال', store:'النهدي', city:'الرياض', price:29, old_price:49, discount:41, image:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600' },
  { id:3, title:'ساعة RICEGGO بيبسي', base:'ساعة', store:'متجر حكيم', city:'الرياض', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg' },
  { id:4, title:'رز أبو كاس 10 كجم', base:'سوبرماركت', store:'بنده', city:'الرياض', price:59, old_price:89, discount:34, image:'https://images.unsplash.com/photo-1586201375761-386a0e9b7b49?w=600' },
  { id:5, title:'آيفون 15', base:'إلكترونيات', store:'جرير', city:'الرياض', price:3299, old_price:4299, discount:23, image:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600' },
  { id:6, title:'AirPods برو', base:'إلكترونيات', store:'إكسترا', city:'جدة', price:799, old_price:1199, discount:33, image:'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600' },
  { id:7, title:'قدر ضغط كهربائي', base:'أجهزة', store:'السيف', city:'جدة', price:249, old_price:499, discount:50, image:'https://images.unsplash.com/photo-1584269600519-112d071a9f1e?w=600' },
  { id:8, title:'مكنسة روبوت ذكية', base:'أجهزة', store:'نون', city:'الخبر', price:599, old_price:1299, discount:54, image:'https://images.unsplash.com/photo-1589894906478-4c6c06e8c3a0?w=600' },
]

const GRADIENTS = {
  purple: 'from-[#D8A0FF] via-[#C084FC] to-[#A78BFA]',
  lime: 'from-[#BEF264] via-[#EAB308]/80 to-[#86EFAC]',
  cyanPink: 'from-[#7DD3FC] via-[#C4B5FD] to-[#F0ABFC]',
  mintPeach: 'from-[#6EE7B7] via-[#A7F3D0] to-[#FED7AA]',
  key: 'from-[#BAE6FD] via-[#DDD6FE] to-[#FBCFE8]',
}

export default function Page(){
  const [city,setCity]=useState<City>('الرياض')
  const [cat,setCat]=useState('الكل')
  const [search,setSearch]=useState('')
  const [lang,setLang]=useState<'ar'|'en'>('ar')
  const [showCities,setShowCities]=useState(false)

  const filtered = useMemo(()=>{ let f=OFFERS.filter(o=>o.city===city); if(cat!=='الكل') f=f.filter(o=>o.base===cat); if(search) f=f.filter(o=>o.title.includes(search)); return f },[city,cat,search])

  return (
    <div dir={lang==='ar'?'rtl':'ltr'} className="min-h-screen bg-[#050507] text-white pb-[90px] selection:bg-[#D8A0FF]/30">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap'); *{font-family:'Tajawal',system-ui}`}</style>

      {/* Top Holographic Bar - مثل الصورة */}
      <div className="h-[36px] w-full bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D8A0FF] via-[#BEF264] via-[#7DD3FC] to-[#FBCFE8] opacity-90" />
        <div className="absolute inset-0 bg-black/10" />
        <span className="relative text-black font-black text-[12px] tracking-wide flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-black text-white grid place-items-center text-[10px]">🤖</span>
          وفر مع حكيم • ألوان هولوجرافيك جديدة
          <span className="hidden md:inline opacity-60">• مستوحى من صورتك</span>
        </span>
      </div>

      <header className="sticky top-0 z-20 bg-[#050507]/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-[64px] flex items-center gap-3">
          <button className="h-10 w-10 rounded-full bg-white/[0.08] border border-white/10 grid place-items-center hover:bg-white/[0.12] transition">⚙️</button>
          <div className="flex-1 max-w-[560px] mx-auto relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#D8A0FF] via-[#7DD3FC] to-[#BEF264] rounded-full opacity-50 group-focus-within:opacity-100 blur-[1px] transition" />
            <div className="relative flex items-center">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="البحث الهولوجرافي..." className="w-full h-11 pr-11 pl-4 rounded-full bg-[#111113] border border-white/10 text-white placeholder:text-white/40 outline-none text-[13px]" />
              <span className="absolute right-3 w-7 h-7 rounded-full bg-gradient-to-br from-[#D8A0FF] to-[#7DD3FC] grid place-items-center text-black font-bold text-[12px]">⌕</span>
            </div>
          </div>
          <button onClick={()=>setLang(lang==='ar'?'en':'ar')} className="h-10 px-4 rounded-full bg-white text-black font-black text-[12px] hover:bg-zinc-100 transition"> {lang==='ar'?'EN':'عربي'} </button>
        </div>
      </header>

      {/* حالة المتاجر - هولوجرافيك */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="relative rounded-full p-[1px] bg-gradient-to-r from-[#D8A0FF]/50 via-[#7DD3FC]/50 to-[#BEF264]/50">
          <div className="h-10 rounded-full bg-[#111113] flex items-center justify-between px-4 text-[12px]">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#BEF264] shadow-[0_0_8px_#BEF264] animate-pulse" /><span className="font-bold text-white/90">يتم تحديث العروض من المتاجر المتصلة</span><span className="hidden md:inline text-white/40">• 5 متاجر نشطة</span></div>
            <span className="text-white/40 text-[11px]">الآن • هولوجرافيك</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 space-y-5">
        {/* مدينة العميل - كرت هولوجرافيك كبير */}
        <section className="relative rounded-[28px] p-[1.5px] bg-gradient-to-br from-[#D8A0FF] via-[#7DD3FC] via-[#BEF264] to-[#FBCFE8]">
          <div className="rounded-[26px] bg-[#0A0A0F] p-5 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#D8A0FF]/30 to-transparent blur-[40px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-[#7DD3FC]/20 to-[#BEF264]/20 blur-[40px] rounded-full" />
            <div className="relative flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold">📍 مدينتك • {city}<span className="w-1 h-1 bg-[#BEF264] rounded-full animate-pulse" /></div>
                <h2 className="mt-3 font-black text-[20px] leading-7">عروض <span className="bg-gradient-to-r from-[#D8A0FF] to-[#7DD3FC] bg-clip-text text-transparent">{city}</span> المخصصة لك</h2>
                <p className="mt-1 text-[12px] text-white/50 max-w-[28ch]">باقي المدن مخفية - نعرض فقط ما يهمك بألوان هولوجرافيك من صورتك</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#BAE6FD] via-[#DDD6FE] to-[#FBCFE8] grid place-items-center text-black text-2xl shadow-[0_8px_24px_rgba(186,230,253,0.3)] relative">
                <span>🔑</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-[8px] -z-10" />
              </div>
            </div>

            <button onClick={()=>setShowCities(!showCities)} className="mt-4 w-full h-11 rounded-full bg-white text-black font-black text-[13px] hover:bg-zinc-100 transition flex items-center justify-center gap-2">
              {showCities?'▲ إخفاء المدن':'▼ تغيير المدينة'} <span className="text-[10px] opacity-60">({city})</span>
            </button>

            {showCities && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(['الرياض','جدة','مكة','المدينة','الدمام','الخبر','القصيم','أبها','تبوك','جازان'] as City[]).map(c=>{
                  const active=c===city
                  return <button key={c} onClick={()=>{setCity(c); setShowCities(false)}} className={`h-11 rounded-xl border font-bold text-[12px] transition ${active?'bg-white text-black border-white':'bg-white/[0.06] border-white/10 text-white/70 hover:bg-white/[0.1] hover:border-white/20'}`}>{c}</button>
                })}
              </div>
            )}
          </div>
        </section>

        {/* فلاتر بألوان الصورة */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            {n:'الكل', g:'from-white to-zinc-100 text-black'},
            {n:'زيت زيتون', g:`bg-gradient-to-r ${GRADIENTS.lime} text-black`},
            {n:'حليب أطفال', g:`bg-gradient-to-r ${GRADIENTS.cyanPink} text-black`},
            {n:'ساعة', g:`bg-gradient-to-r ${GRADIENTS.purple} text-black`},
            {n:'إلكترونيات', g:`bg-gradient-to-r ${GRADIENTS.key} text-black`},
            {n:'سوبرماركت', g:`bg-gradient-to-r ${GRADIENTS.mintPeach} text-black`},
          ].map(f=>{
            const active=cat===f.n
            return <button key={f.n} onClick={()=>setCat(f.n)} className={`whitespace-nowrap h-9 px-4 rounded-full border text-[12px] font-black transition-all ${active?`${f.g} border-white/20 shadow-[0_4px_12px_rgba(216,160,255,0.2)] scale-[1.02]`:'bg-white/[0.06] border-white/10 text-white/60 hover:bg-white/[0.1] hover:text-white/90'}`}>{f.n}</button>
          })}
        </div>

        {/* شبكة العروض - كروت هولوجرافيك */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((o,i)=>{
            const gradients = [GRADIENTS.purple, GRADIENTS.cyanPink, GRADIENTS.lime, GRADIENTS.mintPeach, GRADIENTS.key]
            const g = gradients[i%gradients.length]
            return (
              <div key={o.id} className="group relative rounded-[20px] p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-[#D8A0FF]/40 hover:via-[#7DD3FC]/20 hover:to-[#BEF264]/20 transition-all duration-500">
                <div className="rounded-[19px] bg-[#111113] overflow-hidden flex flex-col h-full">
                  <div className="relative h-[128px] overflow-hidden bg-[#0A0A0F]">
                    <img src={o.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className={`absolute top-2 left-2 h-6 px-2.5 rounded-full bg-gradient-to-r ${g} text-black text-[11px] font-black grid place-items-center shadow`}>-{o.discount}%</div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] px-2 h-5 rounded-full grid place-items-center">📍 {o.city}</div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className={`text-[10px] font-black bg-gradient-to-r ${g} bg-clip-text text-transparent`}>{o.store} • {o.base}</div>
                    <div className="font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px] mt-1 text-white">{o.title}</div>
                    <div className="mt-2 flex items-baseline gap-1.5"><span className="font-black text-[15px] text-white">{o.price} ر.س</span><span className="text-[11px] line-through text-white/30">{o.old_price}</span></div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="h-8 rounded-full bg-white/[0.08] border border-white/10 text-white text-[11px] font-bold hover:bg-white/[0.12]">⚖️ قارن</button>
                      <button className={`h-8 rounded-full bg-gradient-to-r ${g} text-black text-[11px] font-black shadow`}>اذهب للعرض</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <nav className="fixed bottom-0 inset-x-0 h-[72px] bg-black/80 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center z-30">
        <button className="flex flex-col items-center gap-1 text-white"><div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#D8A0FF] to-[#7DD3FC] grid place-items-center text-black text-[12px]">⌂</div><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>🔔</span><span className="text-[10px]">تنبيهاتي</span></button>
        <button className="flex flex-col items-center -mt-5"><span className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D8A0FF] via-[#C4B5FD] to-[#7DD3FC] text-black grid place-items-center text-xl shadow-[0_8px_24px_rgba(216,160,255,0.4)] border-2 border-black">🤖</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>🗺️</span><span className="text-[10px]">الخريطة</span></button>
        <button className="flex flex-col items-center gap-1 text-white/40"><span>⚙️</span><span className="text-[10px]">مكتبي</span></button>
      </nav>
    </div>
  )
}
