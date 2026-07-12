"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type Hero = { id:string; store:string; d:number; t:string; p:number; old:number; code:string; img:string; g:string; mauve:boolean }
type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; mauve?:boolean; isOwn?:boolean; isNew?:boolean }
type CartItem = Offer & { qty:number }
type SharePayload = { id:string|number; title:string; store:string; price:number; old_price:number; discount:number; image:string }

const HERO: Hero[] = [
  { id:'HKEEM200', store:'متجر حكيم', d:56, t:'ساعة RICEGGO بيبسي - عرض 200 ر.س فقط!', p:200, old:450, code:'HKEEM200', img:'/watch-pepsi.jpg', g:'from-violet-700 via-fuchsia-600 to-indigo-700', mauve:true },
  { id:'HKEEM20', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-700 via-fuchsia-600 to-indigo-700', mauve:true },
  { id:'AROOD60', store:'عروضكم', d:60, t:'كل عروض المملكة في مكان واحد', p:0, old:0, code:'AROOD60', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', g:'from-emerald-700 to-green-700', mauve:false },
]

const CATS = [
  { n:'الكل', i:'✨' }, { n:'متجر حكيم', i:'💜', mauve:true }, { n:'عروضكم', i:'🛒' },
  { n:'أفضل المتاجر', i:'🏆', mauve:true }, { n:'إلكترونيات', i:'📱' },
  { n:'المساعد الاقتصادي', i:'🤖', mauve:true }, { n:'عروض حراج', i:'🏷️', mauve:true },
]

const OFFERS: Offer[] = [
  // المنتج الجديد المطلوب - 200 ر.س
  { id:9, title:'ساعة RICEGGO سبورت - بيبسي إطار أحمر أزرق', store:'متجر حكيم', category:'متجر حكيم', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', mauve:true, isOwn:true, isNew:true },
  { id:7, title:'ساعة حكيم الفاخرة - خصم 250 ر.س', store:'متجر حكيم', category:'متجر حكيم', price:349, old_price:599, discount:42, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', mauve:true, isOwn:true },
  { id:8, title:'نظارة حكيم الفاخرة - خصم 250', store:'متجر حكيم', category:'متجر حكيم', price:299, old_price:549, discount:45, image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', mauve:true, isOwn:true },
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', mauve:true, isOwn:true },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', mauve:true, isOwn:true },
  { id:3, title:'سلة التوفير الكبرى - بنده', store:'عروضكم', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' },
  { id:4, title:'كنب 3 قطع مستعمل نظيف', store:'عروض حراج', category:'عروض حراج', price:1200, old_price:2699, discount:55, image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', mauve:true },
  { id:5, title:'آيباد برو M2 12.9', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', mauve:true },
  { id:6, title:'زيت زيتون بكر 1 لتر', store:'عروضكم', category:'عروضكم', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600' },
]

const BEST = [
  { name:'متجر حكيم', icon:'💜', r:4.9, o:42 }, { name:'بنده', icon:'🛒', r:4.8, o:128 },
  { name:'جرير', icon:'📚', r:4.9, o:96 }, { name:'إكسترا', icon:'📱', r:4.7, o:84 },
]

function toShare(o: Offer | Hero): SharePayload {
  if ('title' in o) return { id:o.id, title:o.title, store:o.store, price:o.price, old_price:o.old_price, discount:o.discount, image:o.image }
  return { id:o.code, title:o.t, store:o.store, price:o.p, old_price:o.old, discount:o.d, image:o.img }
}

export default function Page(){
  // 1- متجر حكيم مفعل كأساسي
  const [active,setActive]=useState(0); const [cat,setCat]=useState('متجر حكيم')
  const [cart,setCart]=useState<CartItem[]>([]); const [toast,setToast]=useState('')
  const [share,setShare]=useState<SharePayload|null>(null); const [dark,setDark]=useState(false)
  const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [showFont,setShowFont]=useState(false)
  const [showCart,setShowCart]=useState(false); const [showLogin,setShowLogin]=useState(false)
  const [showDash,setShowDash]=useState(false); const [page,setPage]=useState<'privacy'|'terms'|'contact'|null>(null)
  const [user,setUser]=useState<{name:string,email:string,points:number}|null>(null)
  const [contact,setContact]=useState({name:'',msg:''})

  // 2- المساعد الذكي
  const [aiInput,setAiInput]=useState(''); 
  const [aiMessages,setAiMessages]=useState<{role:'user'|'assistant',text:string}[]>([
    {role:'assistant', text:'أهلا! أنا مساعد حكيم 💜 أقدر أساعدك تلاقي أفضل عرض. جرب تكتب: أبغى ساعة ب 200 أو نظارة رخيصة'}
  ]);
  const [aiResults,setAiResults]=useState<Offer[]>([])

  const runAI = (q:string)=>{
    if(!q.trim()) return;
    const lower = q.toLowerCase();
    let res: Offer[] = [];
    if(lower.includes('ساعة')) res = OFFERS.filter(o=>o.title.includes('ساعة'));
    else if(lower.includes('نظارة')) res = OFFERS.filter(o=>o.title.includes('نظارة'));
    else if(lower.includes('200')||lower.includes('رخيص')||lower.includes('رخيصه')) res = OFFERS.filter(o=>o.price<=250);
    else if(lower.includes('خصم')||lower.includes('أكبر خصم')) res = [...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,4);
    else if(lower.includes('حكيم')||lower.includes('عروض حكيم')) res = OFFERS.filter(o=>o.store==='متجر حكيم');
    else res = OFFERS.filter(o=>o.store==='متجر حكيم').slice(0,3);

    setAiMessages(p=>[...p,{role:'user',text:q},{role:'assistant',text:`لقيت لك ${res.length} عروض تناسب "${q}" 👇`}]);
    setAiResults(res);
    setAiInput('');
  }

  useEffect(()=>{const t=setInterval(()=>setActive(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
  useEffect(()=>{try{const c=localStorage.getItem('cart'); if(c) setCart(JSON.parse(c)); const d=localStorage.getItem('dark'); if(d) setDark(d==='1'); const f=localStorage.getItem('font') as any; if(f) setFont(f); const u=localStorage.getItem('user'); if(u) setUser(JSON.parse(u))}catch{}},[])
  useEffect(()=>{try{localStorage.setItem('cart',JSON.stringify(cart)); localStorage.setItem('dark',dark?'1':'0'); localStorage.setItem('font',font); if(user) localStorage.setItem('user',JSON.stringify(user))}catch{}},[cart,dark,font,user])

  const total = useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart])
  const count = useMemo(()=>cart.reduce((s,i)=>s+i.qty,0),[cart])
  const filtered = useMemo(()=>{ if(cat==='الكل') return OFFERS; if(cat==='أفضل المتاجر') return []; if(cat==='إلكترونيات') return OFFERS.filter(x=>x.category==='إلكترونيات'); if(cat==='المساعد الاقتصادي') return []; return OFFERS.filter(x=>x.category===cat || x.store===cat)},[cat])
  const show = useCallback((m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)},[])
  const add = (o:Offer)=>{setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); show('أضيف للسلة ✓')}
  const shareText = (o:SharePayload)=>`🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nhttps://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`

  return (
    <div className={`min-h-screen transition-colors ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'} ${font==='sm'?'text-[14px]':font==='lg'?'text-[18px]':'text-[16px]'}`} dir="rtl">
      <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span> <span className="text-[10px] bg-[#6D28D9] text-white px-2 py-0.5 rounded-full mr-1">حكيم مفعل ✓</span></h1>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowFont(!showFont)} className={`w-9 h-9 rounded-full grid place-items-center border ${dark?'border-zinc-700 bg-zinc-800':'border-violet-100 bg-white'}`}>A</button>
            <button onClick={()=>setDark(!dark)} className={`w-9 h-9 rounded-full grid place-items-center border ${dark?'border-zinc-700 bg-zinc-800':'border-violet-100 bg-white'}`}>{dark?'☀️':'🌙'}</button>
            <button onClick={()=>user?setShowDash(true):setShowLogin(true)} className="h-9 px-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold">{user?user.name:'دخول'}</button>
            <button onClick={()=>setShowCart(true)} className="relative h-9 px-4 rounded-full bg-[#6D28D9] text-white font-bold text-sm">🛒 {count>0&&<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] rounded-full grid place-items-center">{count}</span>}</button>
          </div>
        </div>
        {showFont&&<div className="absolute top-16 left-4 bg-white dark:bg-zinc-900 border rounded-2xl p-2 shadow-xl z-40 flex gap-1"><button onClick={()=>setFont('sm')} className={`px-3 h-8 rounded-full text-sm ${font==='sm'?'bg-[#6D28D9] text-white':''}`}>صغير</button><button onClick={()=>setFont('base')} className={`px-3 h-8 rounded-full text-sm ${font==='base'?'bg-[#6D28D9] text-white':''}`}>وسط</button><button onClick={()=>setFont('lg')} className={`px-3 h-8 rounded-full text-sm ${font==='lg'?'bg-[#6D28D9] text-white':''}`}>كبير</button></div>}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className={`relative overflow-hidden rounded-[28px] h-[220px] md:h-[300px] bg-gradient-to-br ${HERO[active].g} p-6 flex items-end`}>
          <img src={HERO[active].img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="relative z-10 text-white">
            <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur px-3 h-7 rounded-full text-xs font-bold border border-white/20">💜 {HERO[active].store} • خصم {HERO[active].d}%</div>
            <h2 className="mt-2 font-black text-xl md:text-3xl max-w-[18ch] leading-tight">{HERO[active].t}</h2>
            {HERO[active].p>0&&<div className="mt-2 flex items-center gap-2"><span className="font-black text-lg">{HERO[active].p} ر.س</span><span className="line-through opacity-60 text-sm">{HERO[active].old} ر.س</span><span className="bg-white text-black text-[11px] font-black px-2 h-6 rounded-full grid place-items-center">{HERO[active].code}</span></div>}
          </div>
          <div className="absolute top-4 left-4 flex gap-1.5">{HERO.map((_,i)=><div key={i} className={`h-1.5 rounded-full transition-all ${i===active?'w-6 bg-white':'w-1.5 bg-white/40'}`} />)}</div>
        </div>

        <div className="mt-4 flex gap-2 overflow-auto scrollbar-none pb-1">
          {CATS.map(c=>(
            <button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap h-10 px-4 rounded-full border text-sm font-bold flex items-center gap-1.5 transition-all ${cat===c.n?(c.mauve?'bg-[#6D28D9] text-white border-[#6D28D9] shadow-[0_8px_20px_rgba(109,40,217,0.35)]':'bg-zinc-900 text-white border-zinc-900'):dark?'bg-zinc-900 border-zinc-800 text-zinc-300':'bg-white border-zinc-200 text-zinc-700'} ${c.n==='متجر حكيم'&&cat!==c.n?'ring-2 ring-violet-300 ring-offset-1':''}`}>
              <span>{c.i}</span> {c.n} {c.n==='متجر حكيم'&&<span className="text-[10px]">●</span>}
            </button>
          ))}
        </div>

        {/* 2- المساعد الذكي */}
        {cat==='المساعد الاقتصادي'?(
          <div className={`mt-6 rounded-[28px] border p-4 md:p-6 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-white text-xl">🤖</div>
              <div><div className="font-black text-[16px]">مساعد حكيم الذكي</div><div className="text-[12px] opacity-60">يساعدك تلاقي أرخص عرض في ثواني</div></div>
              <span className="mr-auto text-[10px] bg-green-500 text-white px-2 py-1 rounded-full font-bold">متصل ✓</span>
            </div>

            <div className="mt-4 flex gap-2 overflow-auto scrollbar-none">
              {['⌚ ساعة ب 200','🕶️ نظارة','💜 عروض حكيم','🔥 أكبر خصم'].map(q=>(
                <button key={q} onClick={()=>runAI(q)} className="whitespace-nowrap h-8 px-3 rounded-full bg-violet-50 dark:bg-zinc-800 border border-violet-100 dark:border-zinc-700 text-[12px] font-bold text-violet-700 dark:text-zinc-300">{q}</button>
              ))}
            </div>

            <div className={`mt-4 h-[320px] overflow-auto rounded-2xl p-3 space-y-3 ${dark?'bg-zinc-950':'bg-[#FBF8FF]'}`}>
              {aiMessages.map((m,i)=>(
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-6 ${m.role==='user'?'bg-[#6D28D9] text-white rounded-br-sm':'bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-bl-sm shadow-sm'}`}>{m.text}</div>
                </div>
              ))}
              {aiResults.length>0&&<div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {aiResults.map(o=>(
                  <div key={o.id} className={`flex gap-3 p-3 rounded-2xl border ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}>
                    <img src={o.image} className="w-16 h-16 rounded-xl object-cover shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[13px] line-clamp-2 leading-5">{o.title}</div>
                      <div className="mt-1 flex items-center gap-2"><span className="font-black text-[#6D28D9] text-[13px]">{o.price} ر.س</span><span className="line-through opacity-40 text-[11px]">{o.old_price} ر.س</span></div>
                      <button onClick={()=>add(o)} className="mt-2 h-7 px-3 rounded-full bg-[#6D28D9] text-white text-[11px] font-bold">أضف للسلة</button>
                    </div>
                  </div>
                ))}
              </div>}
            </div>

            <div className="mt-3 flex gap-2">
              <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAI(aiInput)} placeholder="اكتب: أبغى ساعة ب 200 ..." className={`flex-1 h-12 px-4 rounded-full border outline-none text-sm ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50 border-violet-100'}`} />
              <button onClick={()=>runAI(aiInput)} className="h-12 w-12 rounded-full bg-[#6D28D9] text-white grid place-items-center font-black">↗</button>
            </div>
          </div>
        ): cat==='أفضل المتاجر'?(
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {BEST.map(b=>(
              <div key={b.name} className={`rounded-[22px] p-4 border text-center ${b.name==='متجر حكيم'?'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white border-violet-600 shadow-lg scale-[1.02]':'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}>
                <div className="text-2xl">{b.icon}</div><div className="mt-1 font-black text-sm">{b.name} {b.name==='متجر حكيم'&&'✓'}</div><div className={`mt-1 text-[11px] ${b.name==='متجر حكيم'?'text-white/80':'opacity-60'}`}>⭐ {b.r} • {b.o} عرض</div>
              </div>
            ))}
          </div>
        ):(
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(o=>(
              <div key={o.id} className={`group relative overflow-hidden rounded-[22px] border bg-white dark:bg-zinc-900 ${o.mauve?'border-violet-200 dark:border-violet-900/40':''} ${o.id===9?'ring-2 ring-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.25)]':''}`}>
                {o.isNew&&<span className="absolute top-2 right-2 z-10 bg-amber-400 text-black text-[10px] font-black px-2 h-5 rounded-full grid place-items-center">جديد</span>}
                {o.id===9&&<span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 h-5 rounded-full grid place-items-center animate-pulse">عرض 200 ر.س</span>}
                {o.discount>=40&&o.id!==9&&<span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-black px-2 h-5 rounded-full">-{o.discount}%</span>}
                <div className="relative h-[150px] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img src={o.image} alt={o.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <div className="font-bold text-[13px] leading-5 line-clamp-2 min-h-[40px]">{o.title}</div>
                  <div className="mt-1 text-[11px] opacity-60">{o.store}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div><span className="font-black text-[#6D28D9] text-[14px]">{o.price} ر.س</span><span className="mr-1 line-through opacity-40 text-[11px]">{o.old_price}</span></div>
                    <button onClick={()=>add(o)} className="w-8 h-8 rounded-full bg-[#6D28D9] text-white grid place-items-center">+</button>
                  </div>
                </div>
                <button onClick={()=>setShare(toShare(o))} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur text-white grid place-items-center text-[12px] opacity-0 group-hover:opacity-100 transition">↗</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-end md:place-items-center p-0 md:p-4" onClick={()=>setShowCart(false)}><div className={`w-full md:max-w-[420px] h-[92vh] md:h-auto md:rounded-[28px] p-5 flex flex-col ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center"><h2 className="font-black text-lg">🛒 السلة ({count})</h2><button onClick={()=>setShowCart(false)} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center">✕</button></div><div className="flex-1 overflow-auto mt-4 space-y-3">{cart.length===0?<p className="text-center opacity-60 mt-10">السلة فاضية</p>:cart.map(i=><div key={i.id} className="flex gap-3 border-b pb-3 border-zinc-100 dark:border-zinc-800"><img src={i.image} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{i.title}</div><div className="text-xs opacity-70">{i.price} ر.س</div><div className="flex items-center gap-2 mt-1"><button onClick={()=>setCart(p=>p.map(x=>x.id===i.id?{...x,qty:Math.max(1,x.qty-1)}:x))} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800">-</button><span className="text-sm w-6 text-center">{i.qty}</span><button onClick={()=>setCart(p=>p.map(x=>x.id===i.id?{...x,qty:x.qty+1}:x))} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800">+</button></div></div><button onClick={()=>setCart(p=>p.filter(x=>x.id!==i.id))} className="text-xs text-red-500">حذف</button></div>)}</div><div className="border-t pt-4 border-zinc-100 dark:border-zinc-800"><div className="flex justify-between font-black"><span>الإجمالي</span><span>{total} ر.س</span></div><button onClick={()=>{show('تم تأكيد الطلب ✓'); setCart([]); setShowCart(false)}} className="w-full mt-3 h-12 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black">إتمام الشراء</button></div></div></div>}

      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-[60]">{toast}</div>}
    </div>
  )
}
