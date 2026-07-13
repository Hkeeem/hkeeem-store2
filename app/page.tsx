"use client"
import { useEffect, useMemo, useRef, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views?:number; isOwn?:boolean; isNew?:boolean; mauve?:boolean }
type CartItem = Offer & { qty:number }

const OFFERS: Offer[] = [
  { id:9, title:'ساعة RICEGGO بيبسي - إطار أحمر أزرق', store:'متجر حكيم', category:'متجر حكيم', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', views:3420, isOwn:true, isNew:true, mauve:true },
  { id:7, title:'ساعة حكيم الفاخرة - خصم 250 ر.س', store:'متجر حكيم', category:'متجر حكيم', price:349, old_price:599, discount:42, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:2100, isOwn:true, mauve:true },
  { id:8, title:'نظارة حكيم الفاخرة - خصم 250', store:'متجر حكيم', category:'متجر حكيم', price:299, old_price:549, discount:45, image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', views:1850, isOwn:true, mauve:true },
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:2980, isOwn:true, mauve:true },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:1240, isOwn:true, mauve:true },
  { id:3, title:'سلة التوفير الكبرى - بنده', store:'بنده', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:4120 },
  { id:4, title:'كنب 3 قطع مستعمل نظيف', store:'حراج', category:'عروض حراج', price:1200, old_price:2699, discount:55, image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', views:890, mauve:true },
  { id:5, title:'آيباد برو M2 12.9', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', views:3560, mauve:true },
]

const CATS = [
  { n:'الكل', i:'✨' }, { n:'متجر حكيم', i:'💜' }, { n:'عروضكم', i:'🛒' },
  { n:'المساعد الاقتصادي', i:'🤖' }, { n:'إلكترونيات', i:'📱' }, { n:'عروض حراج', i:'🏷️' },
]

function OfferCard({ o, onGo, onToggleFav, isFav }: { o:Offer, onGo:(o:Offer)=>void, onToggleFav:(id:number)=>void, isFav:boolean }){
  return (
    <div className="relative bg-white dark:bg-zinc-900 rounded-[20px] border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-[132px] bg-zinc-50 dark:bg-zinc-800 overflow-hidden">
        <img src={o.image} alt={o.title} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600'}} />
        <span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[11px] font-black px-2 h-6 rounded-full grid place-items-center">-{o.discount}%</span>
        {o.isNew && <span className="absolute top-2 right-2 bg-amber-400 text-black text-[10px] font-black px-2 h-5 rounded-full grid place-items-center">جديد</span>}
        <button onClick={()=>onToggleFav(o.id)} className={`absolute bottom-2 right-2 w-7 h-7 rounded-full grid place-items-center backdrop-blur bg-white/90 dark:bg-black/50 border text-[12px] ${isFav?'text-red-500':''}`}>{isFav?'❤️':'🤍'}</button>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="text-[11px] font-bold text-[#6D28D9] flex items-center gap-1"><span>🏬</span> {o.store}</div>
        <div className="mt-1 font-bold text-[12.5px] leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</div>
        <div className="mt-2 flex items-end gap-1.5">
          <span className="font-black text-[15px] text-zinc-900 dark:text-white">{o.price} ر.س</span>
          <span className="text-[11px] text-zinc-400 line-through mb-[2px]">{o.old_price} ر.س</span>
        </div>
        <button onClick={()=>onGo(o)} className="mt-3 w-full h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-[12.5px] font-black">اذهب للعرض →</button>
      </div>
    </div>
  )
}

export default function Page(){
  const [cat,setCat]=useState('متجر حكيم')
  const [cart,setCart]=useState<CartItem[]>([])
  const [liked,setLiked]=useState<number[]>([])
  const [toast,setToast]=useState('')
  const [showCart,setShowCart]=useState(false)
  const [bottomTab,setBottomTab]=useState<'home'|'search'|'assistant'|'fav'|'account'>('home')
  const [search,setSearch]=useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // AI states
  const [aiInput,setAiInput]=useState('')
  const [aiMessages,setAiMessages]=useState<{role:'user'|'assistant',text:string}[]>([{role:'assistant',text:'أهلا! أنا مساعد حكيم 💜 اسألني: أبغى ساعة ب 200 أو عروض رخيصة'}])
  const [aiResults,setAiResults]=useState<Offer[]>([])

  const show = (m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}

  const add = (o:Offer)=>{setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); show('أضيف للسلة ✓')}
  const toggleFav = (id:number)=>{setLiked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); show(liked.includes(id)?'حذف من المفضلة':'أضيف للمفضلة ❤️')}

  const runAI = (q:string)=>{
    if(!q.trim()) return;
    const l=q.toLowerCase(); let res:Offer[]=[];
    if(l.includes('ساعة')) res=OFFERS.filter(o=>o.title.includes('ساعة'))
    else if(l.includes('نظارة')) res=OFFERS.filter(o=>o.title.includes('نظارة'))
    else if(l.includes('200')||l.includes('رخيص')) res=OFFERS.filter(o=>o.price<=250)
    else if(l.includes('خصم')) res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,4)
    else res=OFFERS.filter(o=>o.store==='متجر حكيم').slice(0,3)
    setAiMessages(p=>[...p,{role:'user',text:q},{role:'assistant',text:`لقيت ${res.length} عروض لك 👇`}])
    setAiResults(res); setAiInput('')
  }

  const filtered = useMemo(()=>{ if(cat==='الكل') return OFFERS; if(cat==='المفضلة') return OFFERS.filter(o=>liked.includes(o.id)); return OFFERS.filter(o=>o.category===cat || o.store===cat)},[cat,liked])
  const searched = useMemo(()=>{ if(!search) return filtered; return filtered.filter(o=>o.title.includes(search)||o.store.includes(search)) },[filtered,search])

  const mostViewed = useMemo(()=>[...OFFERS].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4),[])
  const priceDropped = useMemo(()=>OFFERS.filter(o=>o.discount>=42).sort((a,b)=>b.discount-a.discount).slice(0,4),[])
  const hakimPicks = useMemo(()=>OFFERS.filter(o=>o.store==='متجر حكيم').slice(0,4),[])

  const goOffer = (o:Offer)=>{ add(o); setShowCart(true) }

  const handleBottom = (tab: typeof bottomTab)=>{
    setBottomTab(tab)
    if(tab==='home'){ setCat('متجر حكيم'); window.scrollTo({top:0,behavior:'smooth'}) }
    if(tab==='search'){ setCat('الكل'); setTimeout(()=>searchRef.current?.focus(),100) }
    if(tab==='assistant'){ setCat('المساعد الاقتصادي') }
    if(tab==='fav'){ setCat('المفضلة') }
    if(tab==='account'){ show('قريبا لوحة الحساب الكاملة') }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBFF] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-[88px]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-violet-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between">
          <h1 className="font-black text-[18px]">عروض<span className="text-[#6D28D9]">كم</span> <span className="text-[10px] bg-[#6D28D9] text-white px-2 py-0.5 rounded-full">حكيم مفعل</span></h1>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث..." className="h-9 w-[200px] pr-8 pl-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm outline-none" />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
            </div>
            <button onClick={()=>setShowCart(true)} className="relative h-9 px-4 rounded-full bg-[#6D28D9] text-white text-sm font-bold">🛒 {cart.reduce((s,i)=>s+i.qty,0)>0&&<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full grid place-items-center text-[11px]">{cart.reduce((s,i)=>s+i.qty,0)}</span>}</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-4">
        {/* Search Mobile */}
        <div className="md:hidden relative mb-3">
          <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن عرض..." className="w-full h-11 pr-10 pl-4 rounded-full bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-sm outline-none" />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        {/* Cats */}
        <div className="flex gap-2 overflow-auto scrollbar-none pb-2">
          {CATS.map(c=>(
            <button key={c.n} onClick={()=>{setCat(c.n); setBottomTab(c.n==='المساعد الاقتصادي'?'assistant':'home')}} className={`whitespace-nowrap h-9 px-4 rounded-full border text-[13px] font-bold flex items-center gap-1.5 ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}>
              <span>{c.i}</span> {c.n}
            </button>
          ))}
        </div>

        {/* AI Section */}
        {cat==='المساعد الاقتصادي' ? (
          <div className="mt-5 bg-white dark:bg-zinc-900 rounded-[24px] border border-violet-100 dark:border-zinc-800 p-4">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-white">🤖</div><div><div className="font-black">مساعد حكيم الذكي</div><div className="text-[11px] opacity-60">يجيب لك أفضل صفقة في ثوانٍ</div></div><span className="mr-auto bg-green-500 text-white text-[10px] px-2 py-1 rounded-full">متصل</span></div>
            <div className="mt-3 flex gap-2 overflow-auto">{['⌚ ساعة ب 200','🕶️ نظارة','💜 عروض حكيم','🔥 أكبر خصم'].map(q=><button key={q} onClick={()=>runAI(q)} className="whitespace-nowrap h-8 px-3 rounded-full bg-violet-50 dark:bg-zinc-800 border text-[12px] font-bold">{q}</button>)}</div>
            <div className="mt-3 h-[300px] overflow-auto bg-[#FBF8FF] dark:bg-zinc-950 rounded-2xl p-3 space-y-2">
              {aiMessages.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] ${m.role==='user'?'bg-[#6D28D9] text-white rounded-br-sm':'bg-white dark:bg-zinc-800 border rounded-bl-sm'}`}>{m.text}</div></div>)}
              {aiResults.length>0&&<div className="grid grid-cols-2 gap-2 pt-2">{aiResults.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}</div>}
            </div>
            <div className="mt-3 flex gap-2"><input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAI(aiInput)} placeholder="اكتب طلبك..." className="flex-1 h-11 px-4 rounded-full border bg-zinc-50 dark:bg-zinc-800 outline-none text-sm" /><button onClick={()=>runAI(aiInput)} className="h-11 w-11 rounded-full bg-[#6D28D9] text-white">↗</button></div>
          </div>
        ) : cat==='المفضلة' ? (
          searched.length===0 ? <p className="text-center py-16 opacity-60">لا يوجد مفضلة بعد ❤️</p> : <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">{searched.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}</div>
        ) : (
          <>
            {/* 3 Sections - Home */}
            {(cat==='متجر حكيم' || cat==='الكل') && !search && (
              <div className="mt-6 space-y-7">
                {/* 🔥 أكثر العروض مشاهدة */}
                <section>
                  <div className="flex items-center justify-between mb-3"><h2 className="font-black text-[16px]">🔥 أكثر العروض مشاهدة</h2><button onClick={()=>setCat('الكل')} className="text-[12px] text-[#6D28D9] font-bold">عرض الكل →</button></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{mostViewed.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}</div>
                </section>
                {/* 📉 نزل سعره اليوم */}
                <section>
                  <div className="flex items-center justify-between mb-3"><h2 className="font-black text-[16px]">📉 نزل سعره اليوم</h2><span className="text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">توفير حتى 56%</span></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{priceDropped.map(o=><div key={o.id} className="relative"><span className="absolute top-2 left-12 z-10 bg-green-500 text-white text-[9px] font-black px-1.5 h-5 rounded-full grid place-items-center">نزل سعره</span><OfferCard o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} /></div>)}</div>
                </section>
                {/* ⭐ توصيات حكيم */}
                <section>
                  <div className="flex items-center justify-between mb-3"><h2 className="font-black text-[16px]">⭐ توصيات حكيم لك</h2><span className="text-[11px] bg-violet-100 text-[#6D28D9] px-2 py-1 rounded-full font-bold">مختارة بعناية</span></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{hakimPicks.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}</div>
                </section>
              </div>
            )}

            {/* Grid Normal */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {(search?searched: cat==='الكل'||cat==='متجر حكيم' ? [] : searched).map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}
              {/* If home we already showed sections, show all below as إضافي */}
              {(cat==='الكل' && !search) && searched.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} onToggleFav={toggleFav} isFav={liked.includes(o.id)} />)}
            </div>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center px-2 z-30">
        <button onClick={()=>handleBottom('home')} className={`flex flex-col items-center gap-1 ${bottomTab==='home'?'text-[#6D28D9]':'text-zinc-400'}`}><span className="text-[20px]">🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button onClick={()=>handleBottom('search')} className={`flex flex-col items-center gap-1 ${bottomTab==='search'?'text-[#6D28D9]':'text-zinc-400'}`}><span className="text-[20px]">🔍</span><span className="text-[10px] font-bold">البحث</span></button>
        <button onClick={()=>handleBottom('assistant')} className="flex flex-col items-center -mt-5"><span className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center text-[24px] shadow-[0_8px_20px_rgba(109,40,217,0.4)] border-4 border-white dark:border-zinc-900">🤖</span><span className={`text-[10px] font-black mt-1 ${bottomTab==='assistant'?'text-[#6D28D9]':'text-zinc-500'}`}>مساعد حكيم</span></button>
        <button onClick={()=>handleBottom('fav')} className={`flex flex-col items-center gap-1 relative ${bottomTab==='fav'?'text-[#6D28D9]':'text-zinc-400'}`}><span className="text-[20px]">❤️</span>{liked.length>0&&<span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full grid place-items-center">{liked.length}</span>}<span className="text-[10px] font-bold">المفضلة</span></button>
        <button onClick={()=>handleBottom('account')} className={`flex flex-col items-center gap-1 ${bottomTab==='account'?'text-[#6D28D9]':'text-zinc-400'}`}><span className="text-[20px]">👤</span><span className="text-[10px] font-bold">الحساب</span></button>
      </nav>

      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-end md:place-items-center p-0 md:p-4" onClick={()=>setShowCart(false)}><div className="w-full md:max-w-[400px] h-[90vh] md:h-auto bg-white dark:bg-zinc-900 rounded-t-[24px] md:rounded-[24px] p-5 flex flex-col" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h3 className="font-black">السلة ({cart.reduce((s,i)=>s+i.qty,0)})</h3><button onClick={()=>setShowCart(false)}>✕</button></div><div className="flex-1 overflow-auto mt-4 space-y-3">{cart.length===0?<p className="text-center opacity-50 mt-10">السلة فاضية</p>:cart.map(i=><div key={i.id} className="flex gap-3 border-b pb-2"><img src={i.image} className="w-14 h-14 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{i.title}</div><div className="text-xs">{i.price} ر.س × {i.qty}</div></div></div>)}</div><button onClick={()=>{setToast('تم الطلب ✓'); setCart([]); setShowCart(false)}} className="w-full h-12 rounded-full bg-[#6D28D9] text-white font-black mt-4">إتمام الشراء</button></div></div>}
      {toast&&<div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm z-50">{toast}</div>}
    </div>
  )
}
