
'use client'
import { useEffect, useState, useRef } from 'react'
// import { supabase } from '@/lib/supabase' // فعّل بعد إضافة المفاتيح

type Offer = { id:any; title:string; store:string; category:string; region:string; price:number; oldPrice:number; discount:number; coupon:string; image:string; isOwn?:boolean; aiScore?:number }

const SLIDES = [
 {store:'جرير', discount:45, title:'آيباد برو M2 12.9 - خصم تاريخي', price:2199, old:3999, code:'J10', img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', grad:'from-violet-600 to-indigo-700', ai:'أقل سعر خلال 60 يوم • وفر 1,800 ر.س'},
 {store:'بنده', discount:55, title:'سلة التوفير الكبرى', price:89, old:199, code:'PANDA55', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', grad:'from-emerald-600 to-green-700', ai:'الأكثر طلباً في أبها'},
 {store:'أمازون', discount:41, title:'ديور سوفاج 200مل أصلي', price:349, old:589, code:'AMZ41', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', grad:'from-orange-500 to-red-600', ai:'مضمون أصلي • تقييم 4.9'},
 {store:'متجر حكيم', discount:35, title:'ساعة كلاسيك + محفظة - باقة حكيم', price:399, old:619, code:'HKEEM20', img:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900', grad:'from-zinc-800 to-black', ai:'باقة حصرية من متجرك'},
 {store:'نون', discount:41, title:'سوني WH-1000XM5 عازلة ضوضاء', price:999, old:1699, code:'NOON15', img:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900', grad:'from-amber-500 to-yellow-600', ai:'الأكثر مبيعاً'},
]

const CATS = [
 {n:'الكل', i:'✨', c:1240, bg:'#fff'},
 {n:'سوبرماركت', i:'🛒', c:420, bg:'#E8F5E9'},
 {n:'إلكترونيات', i:'📱', c:380, bg:'#E3F2FD'},
 {n:'أزياء', i:'👗', c:560, bg:'#FCE4EC'},
 {n:'مطاعم', i:'🍔', c:210, bg:'#FFF3E0'},
 {n:'سفر', i:'✈️', c:95, bg:'#E0F7FA'},
 {n:'صحة وجمال', i:'💄', c:310, bg:'#F3E5F5'},
 {n:'أثاث', i:'🛋️', c:180, bg:'#EFEBE9'},
 {n:'أطفال', i:'🧸', c:140, bg:'#E8EAF6'},
]

export default function Page(){
 const [active,setActive]=useState(0)
 const [activeCat,setActiveCat]=useState('الكل')
 const [offers,setOffers]=useState<Offer[]>([])
 const [cart,setCart]=useState(0)
 const [sound,setSound]=useState(false)
 const [toastMsg,setToastMsg]=useState('')
 const [timer,setTimer]=useState(20238)
 const [showInstall,setShowInstall]=useState(true)
 const [chat,setChat]=useState<{role:'user'|'ai', text:string, offers?:Offer[]}[]>([{role:'ai', text:'أهلاً! أنا مساعد عروضكم الذكي. اسألني: وين أرخص آيفون؟ عروض بنده اليوم؟'}])
 const [input,setInput]=useState('')
 const progRef=useRef<HTMLDivElement>(null)

 useEffect(()=>{
  const id=setInterval(()=>setTimer(s=>s>0?s-1:20238),1000)
  return ()=>clearInterval(id)
 },[])
 useEffect(()=>{
  const id=setInterval(()=>setActive(a=>(a+1)%SLIDES.length),4000)
  return ()=>clearInterval(id)
 },[])
 useEffect(()=>{ fetchOffers() },[])

 async function fetchOffers(){
   // حاول سحب من متجرك الحقيقي
   try{
     const r=await fetch('https://hkeeem-store2.vercel.app/api/products',{cache:'no-store'})
     if(r.ok){
       const data=await r.json()
       const mapped:Offer[]=(Array.isArray(data)?data:[]).slice(0,4).map((p:any,i:number)=>({
         id:'hkeem-'+i, title:p.name||p.title, store:'متجر حكيم', category:p.category||'أزياء', region:'أبها', price:p.price, oldPrice:p.originalPrice||p.price+120, discount:Math.round((1-p.price/(p.originalPrice||p.price+120))*100), coupon:'HKEEM', image:p.image||p.img, isOwn:true, aiScore:98
       }))
       if(mapped.length){ setOffers([...mapped, ...MOCK]); showToast('تم سحب عروض متجر حكيم الحقيقية ✓'); return }
     }
   }catch(e){}
   // fallback + مستقبلاً: const {data}=await supabase.from('offers').select('*').eq('is_active',true).order('ai_score',{ascending:false})
   setOffers(MOCK)
 }

 function showToast(t:string){ setToastMsg(t); setTimeout(()=>setToastMsg(''),2500)}
 function beep(){ if(!sound) return; try{ const ctx=new (window.AudioContext||(window as any).webkitAudioContext)(); const o=ctx.createOscillator(); o.frequency.value=880; const g=ctx.createGain(); g.gain.value=0.12; o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.12)}catch{}}
 useEffect(()=>{ if(sound) beep() },[active])

 const filtered = activeCat==='الكل'?offers:offers.filter(o=>o.category===activeCat)
 const h=Math.floor(timer/3600), m=Math.floor(timer%3600/60), s=timer%60
 const timeStr=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`

 function handleChat(){
   if(!input.trim()) return
   const q=input.toLowerCase()
   const found=offers.filter(o=> q.includes('بنده')?o.store.includes('بنده'): q.includes('ايفون')||q.includes('إلكترونيات')?o.category==='إلكترونيات':true).slice(0,2)
   setChat(c=>[...c,{role:'user',text:input},{role:'ai',text: found.length?`لقيت لك ${found.length} عروض مناسبة 👇`:`أفضل عرض حالياً هو ${offers[0]?.title} بسعر ${offers[0]?.price} ر.س`, offers:found}])
   setInput('')
 }

 return (
 <div className="min-h-screen">
  {/* Header */}
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
   <div className="max-w-7xl mx-auto px-4 h-[64px] flex items-center justify-between">
    <div className="font-black text-xl tracking-tight">عروضكم<span className="text-[#FF6B00]">.</span></div>
    <div className="hidden md:flex items-center gap-2 text-sm">
      <span className="px-3 py-1.5 rounded-full bg-black text-white">أبها</span>
      <button onClick={()=>fetchOffers()} className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200">🔄 تحديث من متجري</button>
    </div>
    <div className="flex items-center gap-2">
     <button onClick={()=>setSound(!sound)} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">{sound?'🔊':'🔇'}</button>
     <div className="px-4 py-2 rounded-full bg-black text-white text-sm font-bold">السلة {cart}</div>
    </div>
   </div>
   <div className="h-[3px] w-full bg-zinc-100"><div ref={progRef} key={active} className="h-full bg-[#FF6B00] progress"/></div>
  </header>

  {/* Hero Carousel 50% screen */}
  <div className="max-w-7xl mx-auto px-3 md:px-6 mt-5">
   <div className="relative h-[52vh] min-h-[480px] rounded-[32px] overflow-hidden bg-zinc-900 border border-black/5">
     {SLIDES.map((sl,i)=>(
       <div key={i} className={`absolute inset-0 transition-all duration-700 ${i===active?'opacity-100 translate-x-0':'opacity-0 translate-x-10 pointer-events-none'}`}>
         <div className={`absolute inset-0 bg-gradient-to-r ${sl.grad}`}/>
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
         <div className="relative h-full flex flex-col md:flex-row items-center p-6 md:p-10 gap-6">
           <div className="flex-1 text-white space-y-3">
             <div className="flex gap-2"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{sl.store}</span><span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur border border-white/20 text-xs">حصري</span><span className="px-3 py-1 rounded-full bg-[#FF6B00] text-xs font-bold">عروض اليوم</span></div>
             <div className="text-[56px] md:text-[72px] font-black leading-none">خصم {sl.discount}%</div>
             <h2 className="text-2xl md:text-3xl font-bold">{sl.title}</h2>
             <div className="flex items-baseline gap-3"><span className="text-3xl font-black">{sl.price} ر.س</span><span className="line-through opacity-60">{sl.old} ر.س</span><span className="text-xs bg-white/20 px-2 py-1 rounded-full">ينتهي خلال {timeStr}</span></div>
             <div className="inline-flex px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs border border-white/10">🤖 {sl.ai}</div>
             <div className="flex gap-2 pt-2"><button onClick={()=>setCart(c=>c+1)} className="px-7 py-3.5 rounded-full bg-white text-black font-bold">احصل على العرض الآن</button><button onClick={()=>{navigator.clipboard.writeText(sl.code);showToast('تم نسخ '+sl.code)}} className="px-5 py-3.5 rounded-full bg-black/30 backdrop-blur border border-white/20 text-sm">📋 {sl.code}</button></div>
           </div>
           <div className="flex-1 h-[220px] md:h-full w-full flex items-center justify-center" onMouseMove={e=>{const el=e.currentTarget.firstChild as HTMLElement; if(!el) return; const r=el.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-0.5; const y=(e.clientY-r.top)/r.height-0.5; el.style.transform=`perspective(1000px) rotateY(${x*14}deg) rotateX(${-y*12}deg) scale(1.05)`}} onMouseLeave={e=>{const el=e.currentTarget.firstChild as HTMLElement; if(el) el.style.transform='perspective(1000px) rotateY(0) rotateX(0) scale(1)'}}>
             <div className="float w-[88%] h-full rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-zinc-800 transition-transform duration-150"><img src={sl.img} className="w-full h-full object-cover" alt=""/></div>
           </div>
         </div>
       </div>
     ))}
     <button onClick={()=>setActive(a=>(a-1+SLIDES.length)%SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white">‹</button>
     <button onClick={()=>setActive(a=>(a+1)%SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white">›</button>
     <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">{SLIDES.map((_,i)=><button key={i} onClick={()=>setActive(i)} className={`h-2 rounded-full transition-all ${i===active?'w-8 bg-white':'w-2 bg-white/40'}`}/>)}</div>
   </div>
  </div>

  {/* Quick Categories */}
  <div className="max-w-7xl mx-auto px-4 mt-8">
    <div className="flex justify-between items-center"><h3 className="font-bold text-lg">تسوق حسب الفئة</h3><button className="text-[#FF6B00] text-sm">عرض الكل</button></div>
    <div className="flex gap-5 overflow-x-auto scrollbar-hide py-5 snap-x">
      {CATS.map(c=>(
        <button key={c.n} onClick={()=>setActiveCat(c.n)} className="snap-start flex flex-col items-center min-w-[84px]">
          <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-[26px] border shadow-sm transition-all ${activeCat===c.n?'bg-[#FF6B00] text-white border-[#FF6B00] scale-110 shadow-lg':'bg-white border-zinc-100'}`} style={activeCat!==c.n?{background:c.bg}: {}}>{c.i}</div>
          <span className={`mt-2 text-[13px] ${activeCat===c.n?'text-[#FF6B00] font-bold':'text-zinc-700'}`}>{c.n}</span>
          <span className="text-[11px] text-zinc-400">{c.c} عرض</span>
        </button>
      ))}
    </div>
  </div>

  {/* Grid + Assistant */}
  <div className="max-w-7xl mx-auto px-4 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="flex justify-between items-center mb-4"><h3 className="font-bold">العروض المباشرة</h3><span className="text-xs text-zinc-500">{filtered.length} عرض</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(o=>(
          <div key={o.id} className="bg-white rounded-[24px] border border-zinc-100 overflow-hidden hover:shadow-lg transition">
            <div className="relative h-48 bg-zinc-100 overflow-hidden"><img src={o.image} className="w-full h-full object-cover" alt=""/><span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-[11px] font-bold">خصم {o.discount}%</span>{o.isOwn&&<span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FF6B00] text-white text-[11px]">متجرك</span>}</div>
            <div className="p-4"><div className="text-[11px] text-zinc-500">{o.store} • {o.region}</div><div className="font-bold mt-1 leading-tight">{o.title}</div><div className="mt-2 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-orange-700">🤖 أقل سعر خلال 30 يوم • وفر {o.oldPrice-o.price} ر.س</div><div className="flex justify-between items-center mt-3"><div><span className="font-black text-emerald-600">{o.price} ر.س</span> <span className="text-xs line-through text-zinc-400">{o.oldPrice}</span></div><button onClick={()=>{navigator.clipboard.writeText(o.coupon);showToast('نسخ '+o.coupon)}} className="px-3 py-1.5 rounded-full bg-zinc-100 text-xs">📋 {o.coupon}</button></div><button onClick={()=>setCart(c=>c+1)} className="w-full mt-3 py-3 rounded-full bg-black text-white font-bold text-sm">إضافة للسلة</button></div>
          </div>
        ))}
      </div>
    </div>

    {/* AI Assistant */}
    <div className="bg-white rounded-[24px] border border-zinc-100 p-4 h-fit sticky top-[80px]">
      <div className="flex items-center gap-2 mb-3"><div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">🤖</div><div><div className="font-bold text-sm">مساعد عروضكم الذكي</div><div className="text-[11px] text-emerald-600">● متصل الآن</div></div></div>
      <div className="h-[360px] overflow-y-auto space-y-3 pr-1">
        {chat.map((m,i)=><div key={i} className={`${m.role==='user'?'ml-auto bg-black text-white':'bg-zinc-100'} max-w-[85%] p-3 rounded-2xl text-sm`}><div>{m.text}</div>{m.offers&&<div className="mt-2 space-y-2">{m.offers.map(o=><div key={o.id} className="bg-white rounded-xl p-2 flex gap-2 border"><img src={o.image} className="w-12 h-12 rounded-lg object-cover"/><div className="flex-1"><div className="text-xs font-bold">{o.title}</div><div className="text-[11px] text-emerald-600">{o.price} ر.س</div></div><button onClick={()=>setCart(c=>c+1)} className="px-2 py-1 rounded-full bg-black text-white text-[10px]">أضف</button></div>)}</div>}</div>)}
      </div>
      <div className="flex gap-2 mt-3"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleChat()} placeholder="اسأل: وين أرخص آيفون؟" className="flex-1 px-4 py-3 rounded-full bg-zinc-100 text-sm outline-none"/><button onClick={handleChat} className="w-11 h-11 rounded-full bg-[#FF6B00] text-white">↑</button></div>
      <div className="flex gap-1.5 mt-3 flex-wrap">{['عروض بنده اليوم','أرخص إلكترونيات','كود خصم نون'].map(q=><button key={q} onClick={()=>{setInput(q); setTimeout(handleChat,0)}} className="px-3 py-1.5 rounded-full bg-zinc-50 border text-[11px]">{q}</button>)}</div>
    </div>
  </div>

  {/* PWA Install Banner */}
  {showInstall&&<div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[420px] bg-zinc-900 text-white rounded-[20px] p-4 flex items-center gap-3 shadow-2xl z-50"><div className="w-12 h-12 rounded-xl bg-[#FF6B00] flex items-center justify-center font-black">W</div><div className="flex-1"><div className="font-bold text-sm">ثبت عروضكم على جوالك</div><div className="text-xs text-zinc-400">يعمل كتطبيق • بدون إنترنت</div></div><button onClick={()=>{showToast('تم التثبيت ✓ افتح من الشاشة الرئيسية');setShowInstall(false)}} className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold">تثبيت</button><button onClick={()=>setShowInstall(false)} className="w-8 h-8 rounded-full bg-white/10">✕</button></div>}

  {toastMsg&&<div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl z-50">{toastMsg}</div>}
</div>
)
}

const MOCK:Offer[]=[
 {id:1,title:'عطر حكيم الخاص 100مل',store:'متجر حكيم',category:'أزياء',region:'أبها',price:249,oldPrice:350,discount:29,coupon:'HKEEM10',image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,aiScore:98},
 {id:2,title:'ساعة كلاسيك ستيل',store:'متجر حكيم',category:'أزياء',region:'الرياض',price:399,oldPrice:550,discount:27,coupon:'HKEEM20',image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,aiScore:95},
 {id:3,title:'محفظة جلد فاخرة',store:'متجر حكيم',category:'أزياء',region:'جدة',price:129,oldPrice:199,discount:35,coupon:'WAFAR',image:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',isOwn:true,aiScore:92},
 {id:4,title:'سلة بنده الأسبوعية',store:'بنده',category:'سوبرماركت',region:'أبها',price:89,oldPrice:149,discount:40,coupon:'PANDA',image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',aiScore:88},
 {id:5,title:'سماعة سوني WH-1000XM5',store:'نون',category:'إلكترونيات',region:'الرياض',price:999,oldPrice:1699,discount:41,coupon:'NOON',image:'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',aiScore:96},
 {id:6,title:'البيك وجبة عائلية',store:'البيك',category:'مطاعم',region:'جدة',price:69,oldPrice:99,discount:30,coupon:'ALBAIK',image:'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=600',aiScore:85},
]
