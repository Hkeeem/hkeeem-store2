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
  { id:7, title:'سماعة سوني WH-1000XM5', store:'إكسترا', category:'إلكترونيات', price:899, old_price:1299, discount:31, image:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600', views:7650, recommended:true },
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
  const toastRef = useRef<number|null>(null)

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

  const showToast = useCallback((m:string)=>{ setToast(m); if(toastRef.current) window.clearTimeout(toastRef.current); toastRef.current=window.setTimeout(()=>setToast(''),2400)},[])
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

  const favOffers = useMemo(()=>OFFERS.filter(o=>favs.includes(o.id)),[favs])
  const toggleFav = (id:number)=>{ setFavs(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]); showToast(favs.includes(id)?'تمت الإزالة من المفضلة':'أضيف للمفضلة ⭐') }
  const add = (o:Offer)=>{ setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); showToast('أضيف للسلة ✓') }

  const handleAssistantSend = ()=>{
    if(!assistantQ.trim()) return
    const q = assistantQ
    setAssistantMsgs(m=>[...m,{role:'user',text:q}])
    setAssistantQ('')
    setTimeout(()=>{
      const found = OFFERS.filter(o=>o.title.includes(q)||q.includes('ايفون')&&o.category==='إلكترونيات')
      const reply = found.length?`لقيت لك ${found.length} عروض مناسبة لـ "${q}" 🔥 شف قسم التوصيات`:`أبشر، أبحث لك عن "${q}" حاليا، جرب تكتب "آيباد" أو "عطر حكيم"`
      setAssistantMsgs(m=>[...m,{role:'bot',text:reply}])
      if(found.length){ setCat('الكل'); setSearchQ(q); setTab('home'); window.scrollTo({top:600,behavior:'smooth'}) }
    },600)
  }
  const startVoice = ()=>{
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if(!SR){ showToast('المتصفح لا يدعم الصوت'); return }
    // @ts-ignore
    const rec = new SR(); rec.lang='ar-SA'; rec.interimResults=false
    rec.onresult=(e:any)=>setAssistantQ(e.results[0][0].transcript)
    rec.start(); showToast('🎤 اسمعك الآن...')
  }
  const shareText = (o:SharePayload)=>`🔥 ${o.title} - ${o.price?formatPrice(o.price):`خصم ${o.discount}%`}\nمن ${o.store} عبر عروضكم 💜\n${BASE_URL}?offer=${o.id}\n🏡 مكتب محسن الحكمي: ${OFFICE_LINK}`

  if(!mounted) return <div className="min-h-screen bg-[#FFFBFF]" />

  return (
    <div className={`min-h-screen pb-24 transition-colors ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'} ${font==='sm'?'text-[14px]':font==='lg'?'text-[18px]':'text-[15px]'}`} dir="rtl">
      <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span></h1>
          <div className="flex gap-2">
            <button onClick={()=>setDark(v=>!v)} className={`w-10 h-10 rounded-full border grid place-items-center ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>{dark?'☀️':'🌙'}</button>
            <button onClick={()=>setShowCart(true)} className="px-4 h-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-sm font-bold">السلة {count}</button>
          </div>
        </div>
      </header>

      {tab==='home'&&<>
        <section className="max-w-7xl mx-auto px-3 mt-4">
          <div className="relative h-[420px] rounded-[28px] overflow-hidden bg-zinc-900">
            {HERO.map((s,i)=><div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active?'opacity-100':'opacity-0 pointer-events-none'}`}>
              <img src={s.img} alt={s.t} className="absolute inset-0 w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                <span className="w-fit px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-bold mb-3">{s.store} • خصم {s.d}%</span>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight max-w-[18ch]">{s.t}</h2>
                {s.p>0&&<p className="text-white/90 mt-2 font-bold">{formatPrice(s.p)} <span className="line-through opacity-60 text-sm mr-2">{formatPrice(s.old)}</span></p>}
                <div className="flex gap-2 mt-5">
                  <button onClick={()=>{const o=OFFERS.find(x=>x.store===s.store)||OFFERS[0]; add(o)}} className="px-7 h-12 rounded-full bg-white text-zinc-900 font-black text-sm shadow-xl">تسوق الآن</button>
                  <button onClick={()=>setShare(toShare(s))} className="px-6 h-12 rounded-full bg-white/15 backdrop-blur border border-white/30 text-white font-bold">شاهد العرض ↗</button>
                </div>
              </div>
            </div>)}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">{HERO.map((_,i)=><span key={i} className={`h-1.5 rounded-full transition-all ${i===active?'w-6 bg-white':'w-1.5 bg-white/50'}`} />)}</div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 mt-4">
          <div className={`rounded-[20px] border p-2 flex gap-2 shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}>
            <div className="flex-1 relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40">🤖</span>
              <input value={assistantQ} onChange={e=>setAssistantQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAssistantSend()} placeholder="ابحث عن أي منتج... مثل: آيفون 17 أو شاشة سامسونج" className={`w-full h-12 pr-10 pl-3 rounded-full bg-transparent outline-none text-sm ${dark?'placeholder:text-zinc-500':'placeholder:text-zinc-400'}`} />
            </div>
            <button onClick={startVoice} className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center">🎤</button>
            <button onClick={handleAssistantSend} className="w-12 h-12 rounded-full bg-[#6D28D9] text-white grid place-items-center font-black">↑</button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 mt-4 flex gap-2 overflow-x-auto py-1">
          {CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-10 rounded-full text-[13px] border font-bold ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9]':dark?'bg-zinc-900 border-zinc-800 text-zinc-300':'bg-white border-violet-100'}`}>{c.i} {c.n}</button>)}
        </section>

        <Section title="🔥 أكثر العروض مشاهدة" dark={dark} data={mostViewed} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} />
        <Section title="📉 نزل سعره اليوم" dark={dark} data={priceDrops} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} badge="اليوم" />
        <Section title="⭐ توصيات حكيم لك" dark={dark} data={recommended} onAdd={add} onFav={toggleFav} favs={favs} onShare={o=>setShare(toShare(o))} />

        <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-2 gap-3 pb-6">
          {filtered.map(o=><Card key={o.id} o={o} dark={dark} isFav={favs.includes(o.id)} onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} />)}
        </section>
      </>}

      {tab==='search'&&<div className="max-w-7xl mx-auto px-4 pt-6"><div className={`flex gap-2 rounded-full border p-2 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="ابحث عن عطر، جوال، أثاث..." className="flex-1 h-11 px-4 bg-transparent outline-none"/><button className="px-6 h-11 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">بحث</button></div><div className="grid grid-cols-2 gap-3 mt-6">{filtered.map(o=><Card key={o.id} o={o} dark={dark} isFav={favs.includes(o.id)} onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} />)}</div></div>}

      {tab==='assistant'&&<div className="max-w-2xl mx-auto px-4 pt-6"><div className="space-y-3">{assistantMsgs.map((m,i)=><div key={i} className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm leading-6 ${m.role==='user'?'mr-auto bg-[#6D28D9] text-white':'bg-zinc-100 dark:bg-zinc-800'}`}>{m.text}</div>)}</div><div className="fixed bottom-[88px] left-0 right-0 px-4"><div className={`max-w-2xl mx-auto flex gap-2 p-2 rounded-full border shadow-xl ${dark?'bg-zinc-900 border-zinc-700':'bg-white'}`}><input value={assistantQ} onChange={e=>setAssistantQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAssistantSend()} placeholder="اسأل مساعد حكيم..." className="flex-1 bg-transparent outline-none px-3"/><button onClick={startVoice} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800">🎤</button><button onClick={handleAssistantSend} className="px-5 h-10 rounded-full bg-[#6D28D9] text-white font-bold">إرسال</button></div></div></div>}

      {tab==='favorites'&&<div className="max-w-7xl mx-auto px-4 pt-6"><h2 className="font-black text-lg">❤️ مفضلتك</h2>{favOffers.length===0?<p className="opacity-60 mt-10 text-center">ما أضفت شي للمفضلة لسه</p>:<div className="grid grid-cols-2 gap-3 mt-4">{favOffers.map(o=><Card key={o.id} o={o} dark={dark} isFav onAdd={()=>add(o)} onFav={()=>toggleFav(o.id)} onShare={()=>setShare(toShare(o))} />)}</div>}</div>}

      {tab==='account'&&<div className="max-w-md mx-auto px-4 pt-8 text-center"><div className={`rounded-[24px] border p-6 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}>{user?<><div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-white text-2xl mx-auto">{user.name[0]}</div><h3 className="font-black mt-3">{user.name}</h3><p className="text-xs opacity-60">{user.email}</p><div className="grid grid-cols-3 gap-2 mt-5"><div className="rounded-2xl bg-violet-600 text-white p-3"><div className="font-black text-xl">{user.points}</div><div className="text-[11px]">نقطة</div></div><div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-3"><div className="font-black">{count}</div><div className="text-[11px]">السلة</div></div><div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-3"><div className="font-black">{favs.length}</div><div className="text-[11px]">المفضلة</div></div></div><button onClick={()=>{setUser(null);localStorage.removeItem('aroood_user');showToast('تم تسجيل الخروج')}} className="w-full mt-5 h-11 rounded-full border">تسجيل خروج</button></>:<><h3 className="font-black">مرحبا بك في عروضكم 💜</h3><p className="text-sm opacity-70 mt-2">سجل دخولك لتحفظ مفضلتك ونقاطك</p><input value={loginForm.name} onChange={e=>setLoginForm({...loginForm,name:e.target.value})} placeholder="الاسم" className={`w-full mt-4 h-11 px-4 rounded-full border ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`} /><input value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} placeholder="الإيميل" className={`w-full mt-2 h-11 px-4 rounded-full border ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`} /><button onClick={()=>{const n=loginForm.name||'زائر'; setUser({name:n,email:loginForm.email||'guest@aroood.com',points:120}); showToast(`أهلا ${n} 💜`)}} className="w-full mt-4 h-11 rounded-full bg-[#6D28D9] text-white font-black">دخول</button></>}</div><a href={OFFICE_LINK} target="_blank" className="mt-4 inline-flex w-full h-12 rounded-full bg-gradient-to-r from-[#1A1033] to-[#6D28D9] text-white font-bold items-center justify-center">🏡 مكتب محسن الحكمي العقاري ↗</a></div>}

      <nav className={`fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl ${dark?'bg-zinc-900/95 border-zinc-800':'bg-white/95 border-violet-100'}`}>
        <div className="max-w-lg mx-auto h-[72px] grid grid-cols-5">
          {[
            {k:'home',l:'الرئيسية',i:'🏠'},
            {k:'search',l:'البحث',i:'🔍'},
            {k:'assistant',l:'مساعد حكيم',i:'🤖'},
            {k:'favorites',l:'المفضلة',i:'❤️'},
            {k:'account',l:'الحساب',i:'👤'},
          ].map(t=><button key={t.k} onClick={()=>setTab(t.k as Tab)} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors ${tab===t.k?'text-[#6D28D9]':'opacity-60'}`}><span className={`text-[18px] w-8 h-8 grid place-items-center rounded-full ${tab===t.k?'bg-violet-100 dark:bg-violet-900/40':''}`}>{t.i}</span>{t.l}</button>)}
        </div>
      </nav>

      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-end md:place-items-center p-0 md:p-4" onClick={()=>setShowCart(false)}><div className={`w-full md:max-w-[420px] h-[90vh] md:h-auto md:rounded-[28px] p-5 flex flex-col ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h2 className="font-black">السلة ({count})</h2><button onClick={()=>setShowCart(false)}>✕</button></div><div className="flex-1 overflow-auto mt-4 space-y-3">{cart.length===0?<p className="text-center opacity-60 mt-10">السلة فاضية</p>:cart.map(i=><div key={i.id} className="flex gap-3 border-b pb-3"><img src={i.image} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{i.title}</div><div className="text-xs opacity-60">{formatPrice(i.price)} × {i.qty}</div></div><button onClick={()=>setCart(p=>p.filter(x=>x.id!==i.id))} className="text-xs text-red-500">حذف</button></div>)}</div><div className="border-t pt-4 flex justify-between font-black"><span>الإجمالي</span><span>{formatPrice(total)}</span></div><button onClick={()=>{showToast('تم تأكيد الطلب ✓'); setCart([]); setShowCart(false)}} className="w-full mt-3 h-12 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black">إتمام الشراء</button></div></div>}

      {share&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShare(null)}><div className={`w-full max-w-[360px] rounded-[24px] p-5 ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><h3 className="font-black">مشاركة 💜</h3><p className="text-sm mt-1">{share.title}</p><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(shareText(share))}`)} className="h-11 rounded-full bg-[#25D366] text-white font-bold">واتساب</button><button onClick={async()=>{await navigator.clipboard.writeText(shareText(share)); showToast('تم النسخ ✓')}} className="h-11 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">نسخ</button></div></div></div>}
      {toast&&<div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-[70] shadow-xl">{toast}</div>}
    </div>
  )
}

function Section({title,data,dark,onAdd,onFav,favs,onShare,badge}:{title:string;data:Offer[];dark:boolean;onAdd:(o:Offer)=>void;onFav:(id:number)=>void;favs:number[];onShare:(o:Offer)=>void;badge?:string}){
  if(!data.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 mt-7">
      <div className="flex justify-between items-center mb-3"><h2 className="font-black text-[16px]">{title}</h2><button className="text-xs opacity-60">عرض الكل ›</button></div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{scrollbarWidth:'none'}}>
        {data.map(o=><div key={o.id} className={`min-w-[170px] w-[170px] rounded-[18px] border overflow-hidden shrink-0 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}>
          <div className="relative"><img src={o.image} alt={o.title} loading="lazy" className="h-[120px] w-full object-cover"/><span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#6D28D9] text-white">-{o.discount}%</span>{badge&&<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{badge}</span>}<button onClick={()=>onFav(o.id)} className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/90 grid place-items-center text-sm">{favs.includes(o.id)?'❤️':'🤍'}</button></div>
          <div className="p-2.5"><div className="font-bold text-[12px] line-clamp-1">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-[13px] text-[#8B5CF6]">{formatPrice(o.price)}</span><div className="flex gap-1"><button onClick={()=>onShare(o)} className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-xs">↗</button><button onClick={()=>onAdd(o)} className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">+</button></div></div></div>
        </div>)}
      </div>
    </section>
  )
}

function Card({o,dark,isFav,onAdd,onFav,onShare}:{o:Offer;dark:boolean;isFav:boolean;onAdd:()=>void;onFav:()=>void;onShare:()=>void}){
  return (
    <article className={`rounded-[18px] border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}>
      <div className="relative"><img src={o.image} alt={o.title} loading="lazy" className="h-36 w-full object-cover"/><span className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-black bg-[#6D28D9] text-white">-{o.discount}%</span><button onClick={onFav} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 grid place-items-center">{isFav?'❤️':'🤍'}</button></div>
      <div className="p-2.5"><h3 className="font-bold text-[12px] line-clamp-1">{o.title}</h3><div className="text-[11px] opacity-60">{o.store} • 👁️ {o.views.toLocaleString('ar-SA')}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-[#8B5CF6] text-[13px]">{formatPrice(o.price)}</span><div className="flex gap-1"><button onClick={onShare} className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800">↗</button><button onClick={onAdd} className="w-7 h-7 rounded-full bg-zinc-900 text-white">+</button></div></div></div>
    </article>
  )
      }
