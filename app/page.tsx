"use client"
import { useEffect, useState, useMemo, useRef } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views?:number; isNew?:boolean }

const PROFILE_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile"
const PROFILE_NAME = "مؤسسة محسن لخدمات الاعمال"
const PROFILE_MSG = "يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة"

const OFFERS: Offer[] = [
  { id:9, title:'ساعة RICEGGO بيبسي - إطار أحمر أزرق', store:'متجر حكيم', category:'متجر حكيم', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', views:3420, isNew:true },
  { id:7, title:'ساعة حكيم الفاخرة', store:'متجر حكيم', category:'متجر حكيم', price:349, old_price:599, discount:42, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:2100 },
  { id:8, title:'نظارة حكيم الفاخرة', store:'متجر حكيم', category:'متجر حكيم', price:299, old_price:549, discount:45, image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', views:1850 },
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:2980 },
]

function OfferCard({ o, onGo }: { o:Offer, onGo:(o:Offer)=>void }){
  return (<div className="bg-white rounded-[20px] border border-zinc-100 overflow-hidden flex flex-col shadow-sm"><div className="relative h-[132px] bg-zinc-50 overflow-hidden"><img src={o.image} alt={o.title} className="w-full h-full object-cover" /><span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[11px] font-black px-2 h-6 rounded-full grid place-items-center">-{o.discount}%</span></div><div className="p-3 flex-1 flex flex-col"><div className="text-[11px] font-bold text-[#6D28D9]">🏬 {o.store}</div><div className="mt-1 font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</div><div className="mt-2 flex items-end gap-1.5"><span className="font-black text-[15px]">{o.price} ر.س</span><span className="text-[11px] text-zinc-400 line-through">{o.old_price} ر.س</span></div><button onClick={()=>onGo(o)} className="mt-3 w-full h-9 rounded-full bg-[#6D28D9] text-white text-[13px] font-black">اذهب للعرض →</button></div></div>)
}

export default function Page(){
  const [showSplash,setShowSplash]=useState(true)
  const [cat,setCat]=useState('متجر حكيم')
  const [cart,setCart]=useState<any[]>([])
  const [toast,setToast]=useState('')
  const [showCart,setShowCart]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [search,setSearch]=useState('')
  const [aiInput,setAiInput]=useState('')
  const [aiMessages,setAiMessages]=useState([{role:'assistant',text:'أهلا! أنا حكيم 🤖 مساعدك الاقتصادي'}] as any)
  const [aiResults,setAiResults]=useState<Offer[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{ const seen = localStorage.getItem('splash_seen_v1'); if(seen){ setShowSplash(false) } else { const t=setTimeout(()=>{ setShowSplash(false); localStorage.setItem('splash_seen_v1','1') }, 4000); return()=>clearTimeout(t) } },[])

  const add = (o:Offer)=>{setCart((p:any)=>{const f=p.find((x:any)=>x.id===o.id); if(f) return p.map((x:any)=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); setToast('أضيف للسلة ✓'); setTimeout(()=>setToast(''),2000)}
  const goOffer = (o:Offer)=>{ add(o); setShowCart(true) }
  const runAI = (q:string)=>{ if(!q.trim()) return; let res=OFFERS.filter(x=>x.store==='متجر حكيم').slice(0,3); if(q.includes('ساعة')) res=OFFERS.filter(o=>o.title.includes('ساعة')); setAiMessages((p:any)=>[...p,{role:'user',text:q},{role:'assistant',text:`لقيت ${res.length} عروض موفرة لك 👇`} ]); setAiResults(res); setAiInput('') }

  const mostViewed = useMemo(()=>[...OFFERS].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4),[])
  const priceDropped = useMemo(()=>OFFERS.filter(o=>o.discount>=42).slice(0,4),[])
  const hakimPicks = useMemo(()=>OFFERS.filter(o=>o.store==='متجر حكيم').slice(0,4),[])
  const filtered = useMemo(()=>{ let f=OFFERS; if(cat!=='الكل'&&cat!=='المساعد الاقتصادي') f=f.filter(o=>o.category===cat||o.store===cat); if(search) f=f.filter(o=>o.title.includes(search)); return f },[cat,search])

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBFF] text-zinc-900 pb-[88px]">
      {/* شاشة البداية - Splash */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-[#FBF8FF] to-[#F3E8FF] animate-in">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#6D28D9]/10 blur-[90px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-fuchsia-400/10 blur-[90px] rounded-full" />
          
          <div className="relative w-full max-w-[360px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(109,40,217,0.15)] border border-violet-100 p-7 text-center overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#6D28D9] to-fuchsia-500" />
            
            <div className="w-20 h-20 mx-auto rounded-[22px] bg-gradient-to-br from-[#6D28D9] to-fuchsia-600 grid place-items-center text-white text-3xl shadow-lg shadow-violet-200">💜</div>
            <div className="mt-4 font-black text-[18px]">عروض<span className="text-[#6D28D9]">كم</span> - متجر حكيم</div>
            <div className="mt-1 text-[11px] text-zinc-400 font-bold tracking-widest">HKEEM STORE • AI POWERED</div>

            <div className="mt-6 relative rounded-2xl overflow-hidden h-[160px] bg-zinc-50 border">
              <img src="/watch-pepsi.jpg" alt="حكيم" className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600'}} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 right-2 left-2 text-white text-right"><div className="text-[11px] bg-white/20 backdrop-blur px-2 h-5 rounded-full inline-grid place-items-center border border-white/20">⭐ تقييم ChatGPT</div></div>
            </div>

            <div className="mt-6 text-right bg-[#FBF8FF] border border-violet-100 rounded-2xl p-4 relative">
              <div className="absolute -top-2 right-6 w-4 h-4 bg-[#FBF8FF] border-l border-t border-violet-100 rotate-45" />
              <p className="text-[14px] leading-[24px] font-bold text-zinc-800">“أن هذا التطبيق لديه فرصة ليكون من أفضل تطبيقات العروض في السعودية، ويمكن أن ينافس التطبيقات الحالية بقوة.”</p>
              <div className="mt-3 flex items-center gap-2 justify-end">
                <div className="text-left"><div className="text-[11px] font-black text-zinc-900">شات جي بي تي</div><div className="text-[10px] text-zinc-400">ChatGPT • تقييم ذكي</div></div>
                <div className="w-8 h-8 rounded-full bg-[#10a37f] text-white grid place-items-center text-[12px] font-black">AI</div>
              </div>
            </div>

            <button onClick={()=>{setShowSplash(false); localStorage.setItem('splash_seen_v1','1')}} className="mt-6 w-full h-12 rounded-full bg-[#6D28D9] text-white font-black text-[14px] shadow-[0_10px_24px_rgba(109,40,217,0.3)] hover:bg-[#5b21b6] active:scale-[0.98] transition">ابدأ التوفير مع حكيم →</button>
            <div className="mt-3 text-[11px] text-zinc-400">مدعوم بالذكاء الاقتصادي • {PROFILE_NAME}</div>
          </div>

          <div className="mt-6 flex gap-1.5">{[0,1,2].map(i=><div key={i} className={`h-1.5 rounded-full transition-all ${i===0?'w-6 bg-[#6D28D9]':'w-1.5 bg-zinc-300'}`} />)}</div>
        </div>
      )}

      {/* الهيدر العلوي */}
      <div className="w-full bg-gradient-to-r from-[#6D28D9] via-[#7c3aed] to-[#a855f7] text-white text-center h-8 flex items-center justify-center gap-2 text-[12px] font-bold"><span>🤖</span> وفر مع حكيم مدعوم بالذكاء الاقتصادي</div>
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-zinc-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-[64px] flex items-center gap-3">
          <button onClick={()=>setShowLogin(true)} className="shrink-0 h-10 px-5 rounded-full bg-zinc-900 text-white text-[13px] font-black">دخول</button>
          <div className="flex-1 max-w-[560px] mx-auto relative"><input ref={searchRef} value={search} onChange={e=>{setSearch(e.target.value); if(e.target.value) setCat('الكل')}} placeholder="البحث الذكي عن العروض..." className="w-full h-11 pr-11 pl-4 rounded-full bg-[#F6F3FF] border border-violet-100 focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100 outline-none text-[13px]" /><span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#6D28D9] text-white grid place-items-center text-[13px]">⌕</span></div>
          <button onClick={()=>setCat('المساعد الاقتصادي')} className="shrink-0 flex items-center gap-2 h-10 pl-2 pr-3 rounded-full border border-violet-200 bg-gradient-to-l from-violet-50 to-white"><span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6D28D9] to-fuchsia-500 text-white grid place-items-center text-[16px]">🤖</span><div className="text-right leading-none hidden md:block"><div className="font-black text-[13px]">حكيم</div><div className="text-[10px] text-[#6D28D9] font-bold">مساعد ذكي</div></div></button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-auto pb-2">{['متجر حكيم','الكل','عروضكم','إلكترونيات'].map(n=><button key={n} onClick={()=>setCat(n)} className={`whitespace-nowrap h-9 px-4 rounded-full border text-[13px] font-bold ${cat===n?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white border-zinc-200'}`}>{n}</button>)}</div>

        {cat==='المساعد الاقتصادي'?(
          <div className="mt-4 bg-white rounded-[24px] border border-violet-100 p-4"><div className="font-black">🤖 حكيم - مساعدك الاقتصادي</div><div className="mt-3 h-[300px] overflow-auto bg-[#FBF8FF] rounded-2xl p-3 space-y-3">{aiMessages.map((m:any,i:number)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] ${m.role==='user'?'bg-[#6D28D9] text-white':'bg-white border'}`}>{m.text}</div></div>)}{aiResults.length>0&&<div className="grid grid-cols-2 gap-2">{aiResults.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div>}</div><div className="mt-3 flex gap-2"><input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAI(aiInput)} placeholder="اسأل حكيم..." className="flex-1 h-12 px-4 rounded-full border-2 border-violet-100 outline-none"/><button onClick={()=>runAI(aiInput)} className="h-12 w-12 rounded-full bg-[#6D28D9] text-white">↗</button></div></div>
        ):(
          <div className="mt-6 space-y-7">
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black">🔥 أكثر العروض مشاهدة</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{mostViewed.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black">📉 نزل سعره اليوم</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{priceDropped.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black">⭐ توصيات حكيم لك</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{hakimPicks.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>
            <section className="rounded-[24px] bg-zinc-900 text-white p-6"><div className="inline-flex bg-white/10 px-3 h-7 rounded-full text-[11px] font-bold">🏢 {PROFILE_NAME}</div><h3 className="mt-3 font-black text-[16px] leading-7">{PROFILE_MSG}</h3><a href={PROFILE_LINK} target="_blank" className="mt-4 inline-grid h-11 px-6 rounded-full bg-white text-zinc-900 font-black text-[13px] place-items-center">رابط مكتبي العقاري ↗</a></section>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur border-t flex justify-around items-center z-30"><button onClick={()=>setCat('متجر حكيم')} className="flex flex-col items-center text-[#6D28D9]"><span>🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button><button onClick={()=>setCat('المساعد الاقتصادي')} className="flex flex-col items-center -mt-5"><span className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center text-xl shadow-lg border-4 border-white">🤖</span><span className="text-[10px] font-black text-[#6D28D9]">مساعد حكيم</span></button><button onClick={()=>setShowCart(true)} className="flex flex-col items-center text-zinc-400"><span>🛒</span><span className="text-[10px] font-bold">السلة</span></button></nav>
      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-end" onClick={()=>setShowCart(false)}><div className="w-full max-w-[400px] h-[80vh] bg-white rounded-t-[24px] p-5 flex flex-col" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h3 className="font-black">السلة</h3><button onClick={()=>setShowCart(false)}>✕</button></div><div className="flex-1 overflow-auto mt-4">{cart.length===0?<p className="text-center opacity-50 mt-10">فارغة</p>:cart.map((i:any)=><div key={i.id} className="flex gap-3 border-b pb-2 mb-2"><img src={i.image} className="w-12 h-12 rounded-xl object-cover"/><div><div className="font-bold text-sm">{i.title}</div><div className="text-xs">{i.price} ر.س</div></div></div>)}</div></div></div>}
      {toast&&<div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm z-50">{toast}</div>}
    </div>
  )
}
