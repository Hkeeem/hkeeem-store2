"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; city:string; isOwn?:boolean }
type StoreRank = { name:string; rating:number; offers:number; strength:number; tag?:string }

const VIOLET = "#6D28D9"
const LIGHT = { bg:"#FFFBF0", card:"#FFFEFB", soft:"#FFF8EC", border:"#F5E6D3", text:"#18181b" }
const DARK = { bg:"#09090b", card:"#18181b", soft:"#27272a", border:"#3f3f46", text:"#fafafa" }

const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'}, {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'}, {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI: StoreRank[] = [
 {name:'متجر حكيم', rating:4.9, offers:24, strength:95, tag:'مفعل'},
 {name:'بنده', rating:4.8, offers:128, strength:88},
 {name:'العثيم', rating:4.7, offers:96, strength:82},
 {name:'جرير', rating:4.9, offers:112, strength:90},
 {name:'نون', rating:4.6, offers:210, strength:85},
 {name:'نعناع', rating:4.7, offers:54, strength:70},
]
const BEST_ELEC: StoreRank[] = [
 {name:'جرير', rating:4.9, offers:112, strength:96},
 {name:'اكسترا', rating:4.8, offers:98, strength:92},
 {name:'نون', rating:4.6, offers:180, strength:88},
 {name:'امازون', rating:4.7, offers:150, strength:85},
]

const HERO = [
 {id:'hakeem', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة فاخرة', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {id:'panda', store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-violet-600 to-purple-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,city:'جدة'},
 {id:3,title:'سلة التوفير',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',city:'جدة'},
]

export default function Page(){
 const [active,setActive]=useState(0)
 const [cat,setCat]=useState('متجر حكيم')
 const [cart,setCart]=useState(0)
 const [toast,setToast]=useState('')
 const [dark,setDark]=useState(false)
 const [openStores,setOpenStores]=useState<null|'saudi'|'elec'>(null)
 const [speaking,setSpeaking]=useState(false)
 const utterRef = useRef<SpeechSynthesisUtterance | null>(null)
 const T = dark? DARK : LIGHT

 // تحميل الثيم والسلة + سلايدر آمن
 useEffect(()=>{
   const savedTheme = localStorage.getItem('aroood_theme')
   const savedCart = localStorage.getItem('aroood_cart')
   if(savedTheme) setDark(savedTheme==='dark')
   if(savedCart) setCart(Number(savedCart))
   const id = setInterval(()=> setActive(x=> (x+1)%HERO.length), 4000)
   return ()=> { clearInterval(id); if(typeof window!=='undefined') window.speechSynthesis?.cancel() }
 },[])
 useEffect(()=>{ localStorage.setItem('aroood_theme', dark?'dark':'light') },[dark])
 useEffect(()=>{ localStorage.setItem('aroood_cart', String(cart)) },[cart])

 const show = useCallback((m:string)=>{ setToast(m); setTimeout(()=>setToast(''),2000) },[])

 const filtered = useMemo(()=>{
   if(cat==='متجر حكيم') return OFFERS.filter(o=>o.isOwn)
   return OFFERS.filter(o=> o.category===cat || o.store===cat)
 },[cat])

 const speak = useCallback((text:string)=>{
   if(typeof window==='undefined' ||!('speechSynthesis' in window)) return
   window.speechSynthesis.cancel()
   const u = new SpeechSynthesisUtterance(text)
   u.lang='ar-SA'; u.rate=0.9
   u.onstart=()=>setSpeaking(true)
   u.onend=()=>setSpeaking(false)
   u.onerror=()=>setSpeaking(false)
   utterRef.current=u
   window.speechSynthesis.speak(u)
 },[])

 const stopSpeak = useCallback(()=>{ window.speechSynthesis?.cancel(); setSpeaking(false) },[])

 const openList = useCallback((type:'saudi'|'elec')=>{
   const list = type==='saudi'? BEST_SAUDI : BEST_ELEC
   const sorted=[...list].sort((a,b)=>b.strength-a.strength)
   setOpenStores(type)
   const intro = type==='saudi'? 'عروض المتاجر الأقوى بالترتيب' : 'عروض المتاجر الإلكترونية الأقوى'
   const sentence = sorted.slice(0,3).map((s,i)=>`الترتيب ${i+1} ${s.name} بقوة ${s.strength}`).join('، ')
   setTimeout(()=> speak(`${intro}، ${sentence}`), 250)
 },[speak])

 return(
 <div dir="rtl" style={{background:T.bg, color:T.text}} className="min-h-screen transition-colors">
  <header className="sticky top-0 z-30 backdrop-blur border-b" style={{background:T.card, borderColor:T.border}}>
   <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center">
    <div className="font-black text-xl">عروض<span style={{color:VIOLET}}>كم</span></div>
    <div className="flex gap-2">
     <button type="button" onClick={()=>setDark(v=>!v)} className="w-10 h-10 rounded-full border grid place-items-center text-xs font-bold" style={{background:T.soft, borderColor:T.border}}>{dark?'نهار':'ليل'}</button>
     <div className="px-4 h-10 rounded-full text-white grid place-items-center font-bold text-sm" style={{background:`linear-gradient(to right, ${VIOLET}, #A21CAF)`}}>السلة {cart}</div>
    </div>
   </div>
  </header>

  <main className="max-w-7xl mx-auto px-3 pb-24">
   <div className="mt-4 relative h-[280px] rounded-3xl overflow-hidden bg-black text-white">
    {HERO.map((s,i)=><div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active?'opacity-100':'opacity-0 pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/>
      <div className="relative h-full flex p-6 gap-4 items-center">
       <div className="flex-1"><div className="text-2xl font-black leading-tight">{s.t}</div><div className="mt-2"><span className="text-xl font-black">{s.p} ر.س</span> <span className="line-through opacity-60 text-sm mr-2">{s.old}</span></div></div>
       <img src={s.img} alt={s.t} loading={i===0?'eager':'lazy'} className="w-[36%] h-[70%] object-cover rounded-2xl border border-white/10"/>
      </div>
    </div>)}
   </div>

   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className="rounded-3xl border p-5" style={{background:T.card, borderColor:T.border}}>
     <h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض</div>
     <div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button type="button" key={c.n} onClick={()=>setCat(c.n)} className="h-16 rounded-2xl border font-bold text-xs transition-all" style={{background: cat===c.n?VIOLET:T.soft, color: cat===c.n?'white':T.text, borderColor: cat===c.n?VIOLET:T.border}}>{c.n}</button>)}</div>
    </div>

    <button type="button" onClick={()=>openList('saudi')} className="rounded-3xl border p-5 text-right w-full hover:shadow-md transition text-right" style={{background:T.card, borderColor:T.border}}>
     <div className="flex justify-between items-center"><h3 className="font-black">افضل متاجر السعودية</h3><span className="text-[11px] px-2.5 py-1 rounded-full text-white" style={{background:VIOLET}}>اضغط للفتح ويتحدث</span></div>
     <div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.slice(0,6).map(s=><div key={s.name} className="rounded-2xl border p-2.5 text-center" style={{background: s.name==='متجر حكيم'? (dark?'#2e1065':'#F5F0FF'):T.soft, borderColor:dark?'#4c1d95':'#E9D5FF'}}><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60 mt-0.5">{s.rating} · {s.offers} عرض</div></div>)}</div>
    </button>

    <button type="button" onClick={()=>openList('elec')} className="rounded-3xl border p-5 text-right w-full hover:shadow-md transition" style={{background:T.card, borderColor:T.border}}>
     <div className="flex justify-between"><h3 className="font-black">افضل المتاجر الالكترونية</h3><span className="text-[11px] px-2 py-1 rounded-full text-white bg-zinc-900">يتحدث</span></div>
     <div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.map(s=><div key={s.name} className="rounded-2xl border p-3" style={{background:T.soft, borderColor:T.border}}><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60">قوة {s.strength}</div></div>)}</div>
    </button>
   </div>

   <div className="mt-6 rounded-3xl border p-5 flex flex-col md:flex-row justify-between items-center gap-3" style={{background: dark? T.card : `linear-gradient(to right, #FFFEFB, #FFF3E0)`, borderColor:T.border}}>
    <div><div className="font-black">المكتب العقاري - محسن الحكمي - وسيط معتمد</div><div className="text-xs opacity-70 mt-1">جدة - توثيق عقود - تسويق احترافي</div></div>
    <div className="flex gap-2"><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" rel="noopener noreferrer" className="px-5 h-10 rounded-full text-white text-sm font-bold grid place-items-center" style={{background:VIOLET}}>فتح الملف العقاري</a><button type="button" onClick={()=>speak('المكتب العقاري محسن الحكمي وسيط معتمد في جدة')} className="px-4 h-10 rounded-full border text-xs font-bold" style={{background:T.soft, borderColor:T.border}}>استماع</button></div>
   </div>

   <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
    {filtered.length===0? <div className="col-span-full text-center py-10 opacity-60 text-sm">لا توجد عروض في {cat} حاليا</div> :
     filtered.map(o=><div key={o.id} className="rounded-2xl border overflow-hidden hover:shadow-sm transition" style={{background:T.card, borderColor:T.border}}><img src={o.image} alt={o.title} loading="lazy" className="h-40 w-full object-cover"/><div className="p-3"><div className="text-xs opacity-60">{o.store} · {o.city}</div><div className="font-bold text-sm mt-1 leading-snug">{o.title}</div><div className="flex justify-between items-center mt-3"><span className="font-black" style={{color:VIOLET}}>{o.price} ر.س</span><button type="button" onClick={()=>{setCart(c=>c+1); show('أضيف للسلة')}} className="w-8 h-8 rounded-full bg-zinc-900 text-white grid place-items-center">+</button></div></div></div>)}
   </div>
  </main>

  {openStores && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>{setOpenStores(null); stopSpeak()}}>
    <div role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()} className="w-full max-w-[420px] rounded-3xl p-5 max-h-[80vh] overflow-auto" style={{background:T.card, border:`1px solid ${T.border}`}}>
     <div className="flex justify-between items-center"><h3 className="font-black">{openStores==='saudi'?'المتاجر الأقوى بالترتيب':'المتاجر الإلكترونية'}</h3><button type="button" onClick={()=>{setOpenStores(null); stopSpeak()}} className="w-8 h-8 rounded-full grid place-items-center" style={{background:T.soft}}>✕</button></div>
     <button type="button" onClick={()=>{ const list=openStores==='saudi'?BEST_SAUDI:BEST_ELEC; const sorted=[...list].sort((a,b)=>b.strength-a.strength); speak(sorted.map((s,i)=>`الترتيب ${i+1} ${s.name} بقوة ${s.strength}`).join('. '))}} className="mt-3 px-4 h-9 rounded-full text-white text-xs font-bold" style={{background:VIOLET}}>{speaking?'يتحدث الآن…':'إعادة التحدث'}</button>
     <div className="mt-4 space-y-2.5">{(openStores==='saudi'?BEST_SAUDI:BEST_ELEC).sort((a,b)=>b.strength-a.strength).map((s,i)=><div key={s.name} className="rounded-2xl border p-4 flex justify-between items-center" style={{background: i===0?(dark?'#2e1065':'#F5F0FF'):T.soft, borderColor: i===0?'#8b5cf6':T.border}}><div className="flex gap-3 items-center"><span className="w-8 h-8 rounded-full grid place-items-center font-black text-xs" style={{background: i===0?VIOLET:T.border, color:i===0?'white':T.text}}>{i+1}</span><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.rating} · {s.offers} عرض</div></div></div><div className="font-black text-sm" style={{color:VIOLET}}>{s.strength}</div></div>)}</div>
    </div>
  </div>}

  {toast && <div aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50 shadow-lg">{toast}</div>}
 </div>)
}
