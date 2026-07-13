"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Hero = { id:string; store:string; d:number; t:string; p:number; old:number; code:string; img:string; g:string }
type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; priceDropToday?:boolean; recommended?:boolean; mauve?:boolean; isOwn?:boolean }
type CartItem = Offer & { qty:number }
type SharePayload = { id:string|number; title:string; store:string; price:number; old_price:number; discount:number; image:string }
type Tab = 'home'|'search'|'assistant'|'favorites'|'account'
type FontSize = 'sm'|'base'|'lg'

const OFFICE_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4"
const BASE_URL = "https://e2.vercel.app"

const HERO: Hero[] = [
  { id:'HKEEM20', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد فاخرة', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200', g:'from-violet-900/90 via-fuchsia-800/80 to-transparent' },
  { id:'AROOD60', store:'عروضكم', d:60, t:'كل عروض المملكة في مكان واحد', p:0, old:0, code:'AROOD60', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', g:'from-emerald-900/90 via-green-800/70 to-transparent' },
  { id:'HARAJ55', store:'عروض حراج', d:55, t:'مستعمل نظيف - شبه جديد ومضمون', p:1200, old:2699, code:'HARAJ55', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200', g:'from-zinc-900/90 via-violet-900/70 to-transparent' },
]

const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, recommended:true, mauve:true, isOwn:true },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:3210, recommended:true, mauve:true, isOwn:true },
  { id:3, title:'سلة التوفير الكبرى - بنده', store:'عروضكم', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, priceDropToday:true },
  { id:4, title:'كنب 3 قطع مستعمل نظيف', store:'عروض حراج', category:'عروض حراج', price:1200, old_price:2699, discount:55, image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', views:4120, priceDropToday:true, mauve:true },
  { id:5, title:'آيباد برو M2 12.9', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', views:10230, priceDropToday:true, recommended:true, mauve:true },
  { id:6, title:'زيت زيتون بكر 1 لتر', store:'عروضكم', category:'عروضكم', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', views:6730, priceDropToday:true },
]

const CATS = [
  { n:'الكل', i:'✨' }, { n:'متجر حكيم', i:'💜' }, { n:'عروضكم', i:'🛒' },
  { n:'إلكترونيات', i:'📱' }, { n:'عروض حراج', i:'🏷️' },
] as const

function toShare(o: Offer | Hero): SharePayload {
  if ('title' in o) return { id:o.id, title:o.title, store:o.store, price:o.price, old_price:o.old_price, discount:o.discount, image:o.image }
  return { id:o.code, title:o.t, store:o.store, price:o.p, old_price:o.old, discount:o.d, image:o.img }
}
const formatPrice = (n:number) => `${n.toLocaleString('ar-SA')} ر.س`

export default function Page(){
  const [mounted,setMounted]=useState(false)
  const [active,setActive]=useState(0)
  const [cat,setCat]=useState('الكل')
  const [tab,setTab]=useState<Tab>('home')
  const [cart,setCart]=useState<CartItem[]>([])
  const [favs,setFavs]=useState<number[]>([])
  const [toast,setToast]=useState('')
  const [share,setShare]=useState<SharePayload|null>(null)
  const [dark,setDark]=useState(false)
  const [font,setFont]=useState<FontSize>('base')
  const [showCart,setShowCart]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [user,setUser]=useState<{name:string,email:string,points:number}|null>(null)
  const [loginForm,setLoginForm]=useState({name:'',email:''})
  const [searchQ,setSearchQ]=useState('')
  const [assistantQ,setAssistantQ]=useState('')
  const [assistantMsgs,setAssistantMsgs]=useState<{role:'user'|'bot',text:string}[]>([{role:'bot',text:'أهلا بك في مساعد حكيم الذكي 💜 اسألني عن أي منتج'}])
  const toastRef = useRef<ReturnType<typeof setTimeout>|null>(null)

  useEffect(()=>setMounted(true),[])
  useEffect(()=>{
    if(!mounted) return
    try{
      const c=localStorage.getItem('aroood_cart'); if(c) setCart(JSON.parse(c))
      const f=localStorage.getItem('aroood_favs'); if(f) setFavs(JSON.parse(f))
      const d=localStorage.getItem('aroood_dark'); if(d) setDark(d==='1')
      const u=localStorage.getItem('aroood_user'); if(u) setUser(JSON.parse(u))
    }catch{}
  },[mounted])
  useEffect(()=>{
    if(!mounted) return
    localStorage.setItem('aroood_cart',JSON.stringify(cart))
    localStorage.setItem('aroood_favs',JSON.stringify(favs))
    localStorage.setItem('aroood_dark',dark?'1':'0')
    if(user) localStorage.setItem('aroood_user',JSON.stringify(user))
  },[cart,favs,dark,user,mounted])

  useEffect(()=>{ const t=setInterval(()=>setActive(x=>(x+1)%HERO.length),4000); return()=>clearInterval(t)},[])

  const showToast = useCallback((m:string)=>{ setToast(m); if(toastRef.current) clearTimeout(toastRef.current); toastRef.current=setTimeout(()=>setToast(''),2400)},[])
  const count = useMemo(()=>cart.reduce((s,i)=>s+i.qty,0),[cart])
  const total = useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart])

  const mostViewed = useMemo(()=>[...OFFERS].sort((a,b)=>b.views-a.views).slice(0,5),[])
  const priceDrops = useMemo(()=>OFFERS.filter(o=>o.priceDropToday),[])
  const recommended = useMemo(()=>OFFERS.filter(o=>o.recommended),[])
  const filtered = useMemo(()=>{
    let list = cat==='الكل'?OFFERS:OFFERS.filter(x=>x.category===cat)
    if(searchQ) list = list.filter(o=>o.title.includes(searchQ)||o.store.includes(searchQ))
    return list
  },[cat,searchQ])

  const toggleFav = (id:number)=>{ setFavs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); showToast(favs.includes(id)?'تمت الإزالة من المفضلة':'أضيف للمفضلة ⭐') }
  const add = (o:Offer)=>{ setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); showToast('أضيف للسلة ✓') }

  const handleAssistantSend = ()=>{
    if(!assistantQ.trim()) return
    const q = assistantQ
    setAssistantMsgs(m=>[...m,{role:'user',text:q}])
    setAssistantQ('')
    setTimeout(()=>{
      const found = OFFERS.filter(o=>o.title.includes(q))
      const reply = found.length?`لقيت لك ${found.length} عروض مناسبة لـ "${q}" 🔥`:`أبشر، أبحث لك عن "${q}" جرب "آيباد" أو "عطر حكيم"`
      setAssistantMsgs(m=>[...m,{role:'bot',text:reply}])
      if(found.length){ setSearchQ(q); setTab('home'); window.scrollTo({top:600,behavior:'smooth'}) }
    },500)
  }
  const shareText = (o:SharePayload)=>`🔥 ${o.title} - ${o.price?formatPrice(o.price):`خصم ${o.discount}%`}\nمن ${o.store} عبر عروضكم 💜\n${BASE_URL}?offer=${o.id}\n🏡 مكتب محسن الحكمي: ${OFFICE_LINK}`

  if(!mounted) return <div className="min-h-screen bg-white" />

  // ألوان واضحة للنهاري
  const bg = dark? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
  const card = dark? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
  const muted = dark? 'text-zinc-400' : 'text-zinc-600'
  const subtle = dark? 'text-zinc-500' : 'text-zinc-500'
  const inputBg = dark? 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-500 shadow-sm'
  const chipActive = 'bg-[#6D28D9] text-white border-[#6D28D9]'
  const chipInactive = dark? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-white border-zinc-300 text-zinc-700'

  return (
    <div className={`min-h-screen pb-28 antialiased transition-colors ${bg} ${font==='sm'?'text-[14px]':font==='lg'?'text-[17px]':'text-[15px]'}`} dir="rtl">
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="font-black text-xl tracking-tight">عروض<span className="text-[#6D28D9]">كم</span></h1>
          <div className="flex gap-2">
            <button onClick={()=>setDark(v=>!v)} className={`w-10 h-10 rounded-full border grid place-items-center font-bold ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-zinc-300 text-zinc-700'}`}>{dark?'☀️':'🌙'}</button>
            <button onClick={()=>setShowCart(true)} className="px-4 h-10 rounded-full bg-[#6D28D9] text-white text-sm font-black shadow">السلة {count}</button>
          </div>
        </div>
      </header>

      {tab==='home'&&<>
        <section className="max-w-7xl mx-auto px-3 mt-4">
          <div className="relative h-[420px] rounded-[28px] overflow-hidden bg-zinc-900 shadow-lg">
            {HERO.map((s,i)=><div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active?'opacity-100':'opacity-0 pointer-events-none'}`}>
              <img src={s.img} alt={s.t} className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-7">
                <span className="w-fit px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-black mb-3 shadow">{s.store} • خصم {s.d}%</span>
                <h2 className="text-3xl font-black text-white leading-tight">{s.t}</h2>
                {s.p>0&&<p className="text-white font-bold mt-2">{formatPrice(s.p)} <span className="line-through text-white/70 text-sm mr-2">{formatPrice(s.old)}</span></p>}
                <div className="flex gap-2 mt-5">
                  <button onClick={()=>{const o=OFFERS.find(x=>x.store===s.store)||OFFERS[0]; add(o)}} className="px-7 h-12 rounded-full bg-white text-zinc-900 font-black text-sm shadow-xl">تسوق الآن</button>
                  <button onClick={()=>setShare(toShare(s))} className="px-6 h-12 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white font-bold">شاهد العرض ↗</button>
                </div>
              </div>
            </div>)}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">{HERO.map((_,i)=><span key={i} className={`h-1.5 rounded-full transition-all ${i===active?'w-6 bg-white':'w-1.5 bg-white/60'}`} />)}</div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 mt-5">
          <div className={`rounded-full border p-2 flex gap-2 ${inputBg}`}>
            <div className="flex-1 relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">🤖</span>
              <input value={assistantQ} onChange={e=>setAssistantQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAssistantSend()} placeholder="ابحث عن أي منتج... مثل: آيفون 17 أو شاشة سامسونج" className="w-full h-11 pr-10 pl-3 rounded-full bg-transparent outline-none text-sm font-medium" />
            </div>
            <button onClick={handleAssistantSend} className="w-11 h-11 rounded-full bg-[#6D28D9] text-white grid place-items-center font-black shrink-0">↑</button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 mt-4 flex gap-2 overflow-x-auto py-1 scrollbar-none">
          {CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-10 rounded-full text-[13px] border font-bold transition-colors ${cat===c.n?chipActive:chipInactive}`}>{c.i} {c.n}</button>)}
        </section>

        <Section title="🔥 أكثر العروض مشاهدة" dark={dark} data={mostViewed} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} cardClass={card} muted={muted} />
        <Section title="📉 نزل سعره اليوم" dark={dark} data={priceDrops} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} badge="اليوم" cardClass={card} muted={muted} />
        <Section title="⭐ توصيات حكيم لك" dark={dark} data={recommended} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} cardClass={card} muted={muted} />

        <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-2 gap-3 pb-6">
          {filtered.map(o=><Card key={o.id} o={o} dark={dark} isFav={favs.includes(o.id)} onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} cardClass={card} muted={muted} />)}
        </section>
      </>}

      {tab==='search'&&<div className="max-w-7xl mx-auto px-4 pt-6"><div className={`flex gap-2 rounded-full border p-2 ${inputBg}`}><input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="ابحث عن عطر، جوال، أثاث..." className="flex-1 h-11 px-4 bg-transparent outline-none font-medium"/><button className="px-6 h-11 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold">بحث</button></div><div className="grid grid-cols-2 gap-3 mt-6">{filtered.map(o=><Card key={o.id} o={o} dark={dark} isFav={favs.includes(o.id)} onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} cardClass={card} muted={muted} />)}</div></div>}

      {tab==='assistant'&&<div className="max-w-2xl mx-auto px-4 pt-6"><div className="space-y-3">{assistantMsgs.map((m,i)=><div key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 font-medium ${m.role==='user'?'mr-auto bg-[#6D28D9] text-white':'border '+card+' '+(dark?'':'text-zinc-800')}`}>{m.text}</div>)}</div></div>}

      {tab==='favorites'&&<div className="max-w-7xl mx-auto px-4 pt-6"><h2 className="font-black text-lg">❤️ مفضلتك</h2>{OFFERS.filter(o=>favs.includes(o.id)).length===0?<p className={`${muted} mt-10 text-center font-medium`}>ما أضفت شي للمفضلة لسه</p>:<div className="grid grid-cols-2 gap-3 mt-4">{OFFERS.filter(o=>favs.includes(o.id)).map(o=><Card key={o.id} o={o} dark={dark} isFav onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} cardClass={card} muted={muted} />)}</div>}</div>}

      {tab==='account'&&<div className="max-w-md mx-auto px-4 pt-8 text-center"><div className={`rounded-[24px] border p-6 ${card}`}><h3 className="font-black text-zinc-900 dark:text-zinc-100">مرحبا بك في عروضكم 💜</h3><p className={`text-sm mt-2 font-medium ${muted}`}>سجل دخولك لتحفظ مفضلتك ونقاطك</p><input value={loginForm.name} onChange={e=>setLoginForm({...loginForm,name:e.target.value})} placeholder="الاسم" className={`w-full mt-4 h-11 px-4 rounded-full border outline-none ${inputBg}`} /><input value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} placeholder="الإيميل" className={`w-full mt-2 h-11 px-4 rounded-full border outline-none ${inputBg}`} /><button onClick={()=>{const n=loginForm.name||'زائر'; setUser({name:n,email:loginForm.email||'guest@aroood.com',points:120}); showToast(`أهلا ${n} 💜`)}} className="w-full mt-4 h-11 rounded-full bg-[#6D28D9] text-white font-black">دخول</button></div></div>}

      <nav className={`fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl ${dark?'bg-zinc-900/95 border-zinc-800':'bg-white border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'}`}>
        <div className="max-w-lg mx-auto h-[72px] grid grid-cols-5">
          {[
            {k:'home',l:'الرئيسية',i:'🏠'},
            {k:'search',l:'البحث',i:'🔍'},
            {k:'assistant',l:'مساعد حكيم',i:'🤖'},
            {k:'favorites',l:'المفضلة',i:'❤️'},
            {k:'account',l:'الحساب',i:'👤'},
          ].map(t=><button key={t.k} onClick={()=>setTab(t.k as Tab)} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${tab===t.k? 'text-[#6D28D9]' : dark? 'text-zinc-400' : 'text-zinc-500'}`}><span className={`text-[18px] w-8 h-8 grid place-items-center rounded-full ${tab===t.k? dark?'bg-violet-900/40':'bg-violet-100':''}`}>{t.i}</span>{t.l}</button>)}
        </div>
      </nav>

      {toast&&<div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-[70] shadow-xl font-bold">{toast}</div>}
    </div>
  )
}

function Section({title,data,dark,onAdd,onFav,favs,onShare,badge,cardClass,muted}:{title:string;data:Offer[];dark:boolean;onAdd:(o:Offer)=>void;onFav:(id:number)=>void;favs:number[];onShare:(o:Offer)=>void;badge?:string;cardClass:string;muted:string}){
  if(!data.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 mt-8">
      <div className="flex justify-between items-center mb-3"><h2 className="font-black text-[16px] text-zinc-900 dark:text-zinc-100">{title}</h2><button className={`text-xs font-bold ${muted}`}>عرض الكل ›</button></div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {data.map(o=><div key={o.id} className={`min-w-[172px] w-[172px] rounded-[18px] border overflow-hidden shrink-0 ${cardClass}`}>
          <div className="relative"><img src={o.image} alt={o.title} loading="lazy" className="h-[118px] w-full object-cover"/><span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-black bg-[#6D28D9] text-white shadow">-{o.discount}%</span>{badge&&<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">{badge}</span>}<button onClick={()=>onFav(o.id)} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white shadow grid place-items-center text-sm border border-zinc-200">{favs.includes(o.id)?'❤️':'🤍'}</button></div>
          <div className="p-2.5"><div className="font-bold text-[13px] line-clamp-1 text-zinc-900 dark:text-zinc-100">{o.title}</div><div className={`text-[11px] mt-1 font-medium ${muted}`}>{o.store}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-[13px] text-[#5B21B6] dark:text-violet-400">{formatPrice(o.price)}</span><div className="flex gap-1"><button onClick={()=>onShare(o)} className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">↗</button><button onClick={()=>onAdd(o)} className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold">+</button></div></div></div>
        </div>)}
      </div>
    </section>
  )
}

function Card({o,dark,isFav,onAdd,onFav,onShare,cardClass,muted}:{o:Offer;dark:boolean;isFav:boolean;onAdd:()=>void;onFav:()=>void;onShare:()=>void;cardClass:string;muted:string}){
  return (
    <article className={`rounded-[18px] border overflow-hidden ${cardClass}`}>
      <div className="relative"><img src={o.image} alt={o.title} loading="lazy" className="h-36 w-full object-cover"/><span className="absolute top-2 right-2 px-2 py-1 rounded-full text-[11px] font-black bg-[#6D28D9] text-white shadow">-{o.discount}%</span><button onClick={onFav} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white shadow border border-zinc-200 grid place-items-center">{isFav?'❤️':'🤍'}</button></div>
      <div className="p-3"><h3 className="font-bold text-[13px] line-clamp-1 text-zinc-900 dark:text-zinc-100">{o.title}</h3><div className={`text-[11px] mt-1 font-medium ${muted}`}>{o.store} • 👁️ {o.views.toLocaleString('ar-SA')}</div><div className="flex justify-between items-center mt-2.5"><span className="font-black text-[#5B21B6] dark:text-violet-400 text-[13px]">{formatPrice(o.price)}</span><div className="flex gap-1"><button onClick={onShare} className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 grid place-items-center text-zinc-700 dark:text-zinc-300">↗</button><button onClick={onAdd} className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold">+</button></div></div></div>
    </article>
  )
                    }
