"use client"
import { useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views?:number; isNew?:boolean }
type CartItem = Offer & { qty:number }

const PROFILE_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile"
const PROFILE_NAME = "مؤسسة محسن لخدمات الاعمال"
const PROFILE_MSG_SHORT = "يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة"
const PROFILE_MSG_FULL = `${PROFILE_MSG_SHORT} - ${PROFILE_NAME}`

const OFFERS: Offer[] = [
  { id:9, title:'ساعة RICEGGO بيبسي - إطار أحمر أزرق', store:'متجر حكيم', category:'متجر حكيم', price:200, old_price:450, discount:56, image:'/watch-pepsi.jpg', views:3420, isNew:true },
  { id:7, title:'ساعة حكيم الفاخرة - خصم 250 ر.س', store:'متجر حكيم', category:'متجر حكيم', price:349, old_price:599, discount:42, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:2100 },
  { id:8, title:'نظارة حكيم الفاخرة - خصم 250', store:'متجر حكيم', category:'متجر حكيم', price:299, old_price:549, discount:45, image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', views:1850 },
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:2980 },
]

function OfferCard({ o, onGo }: { o:Offer, onGo:(o:Offer)=>void }){
  return (
    <div className="bg-white rounded-[20px] border border-zinc-100 overflow-hidden flex flex-col shadow-sm">
      <div className="relative h-[132px] bg-zinc-50 overflow-hidden"><img src={o.image} alt={o.title} className="w-full h-full object-cover" /><span className="absolute top-2 left-2 bg-[#FF2D55] text-white text-[11px] font-black px-2 h-6 rounded-full grid place-items-center">-{o.discount}%</span>{o.isNew && <span className="absolute top-2 right-2 bg-amber-400 text-black text-[10px] font-black px-2 h-5 rounded-full grid place-items-center">جديد</span>}</div>
      <div className="p-3 flex-1 flex flex-col"><div className="text-[11px] font-bold text-[#6D28D9]">🏬 {o.store}</div><div className="mt-1 font-bold text-[13px] leading-[18px] line-clamp-2 min-h-[36px]">{o.title}</div><div className="mt-2 flex items-end gap-1.5"><span className="font-black text-[15px]">{o.price} ر.س</span><span className="text-[11px] text-zinc-400 line-through">{o.old_price} ر.س</span></div><button onClick={()=>onGo(o)} className="mt-3 w-full h-9 rounded-full bg-[#6D28D9] text-white text-[13px] font-black">اذهب للعرض →</button></div>
    </div>
  )
}

export default function Page(){
  const [cat,setCat]=useState('متجر حكيم')
  const [cart,setCart]=useState<CartItem[]>([])
  const [toast,setToast]=useState('')
  const [showCart,setShowCart]=useState(false)
  const [showContact,setShowContact]=useState(false)
  const [aiInput,setAiInput]=useState('')
  const [aiMessages,setAiMessages]=useState([{role:'assistant',text:'أهلا! أنا مساعد حكيم 💜'}] as any)
  const [aiResults,setAiResults]=useState<Offer[]>([])
  const add = (o:Offer)=>{setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); setToast('أضيف للسلة ✓'); setTimeout(()=>setToast(''),2000)}
  const goOffer = (o:Offer)=>{ add(o); setShowCart(true) }
  const runAI = (q:string)=>{ if(!q.trim()) return; let res=OFFERS.filter(x=>x.store==='متجر حكيم').slice(0,3); if(q.includes('ساعة')) res=OFFERS.filter(o=>o.title.includes('ساعة')); setAiMessages((p:any)=>[...p,{role:'user',text:q},{role:'assistant',text:`لقيت ${res.length} عروض`} ]); setAiResults(res); setAiInput('') }
  const mostViewed = useMemo(()=>[...OFFERS].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4),[])
  const priceDropped = useMemo(()=>OFFERS.filter(o=>o.discount>=42).slice(0,4),[])
  const hakimPicks = useMemo(()=>OFFERS.filter(o=>o.store==='متجر حكيم').slice(0,4),[])

  return (
    <div dir="rtl" className="min-h-screen bg-[#FFFBFF] text-zinc-900 pb-[88px]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-violet-100"><div className="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between"><h1 className="font-black text-[18px]">عروض<span className="text-[#6D28D9]">كم</span></h1><button onClick={()=>setShowCart(true)} className="h-9 px-4 rounded-full bg-[#6D28D9] text-white text-sm font-bold">🛒</button></div></header>
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-auto pb-2">{['متجر حكيم','الكل','المساعد الاقتصادي'].map(n=><button key={n} onClick={()=>setCat(n)} className={`whitespace-nowrap h-9 px-4 rounded-full border text-[13px] font-bold ${cat===n?'bg-[#6D28D9] text-white border-[#6D28D9]':'bg-white border-zinc-200'}`}>{n}</button>)}</div>
        {cat==='المساعد الاقتصادي'?(
          <div className="mt-5 bg-white rounded-[24px] border p-4"><div className="font-black">🤖 مساعد حكيم</div><div className="mt-3 h-[260px] overflow-auto bg-[#FBF8FF] rounded-2xl p-3 space-y-2">{aiMessages.map((m:any,i:number)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`px-3 py-2 rounded-2xl text-[13px] max-w-[85%] ${m.role==='user'?'bg-[#6D28D9] text-white':'bg-white border'}`}>{m.text}</div></div>)}{aiResults.length>0&&<div className="grid grid-cols-2 gap-2">{aiResults.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div>}</div><div className="mt-3 flex gap-2"><input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runAI(aiInput)} placeholder="أبغى ساعة ب 200" className="flex-1 h-11 px-4 rounded-full border bg-zinc-50 outline-none text-sm"/><button onClick={()=>runAI(aiInput)} className="w-11 h-11 rounded-full bg-[#6D28D9] text-white">↗</button></div></div>
        ):(
          <div className="mt-6 space-y-7">
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black text-[16px]">🔥 أكثر العروض مشاهدة</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{mostViewed.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black text-[16px]">📉 نزل سعره اليوم</h2><span className="text-[11px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">توفير حتى 56%</span></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{priceDropped.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>
            <section><div className="flex justify-between items-center mb-3"><h2 className="font-black text-[16px]">⭐ توصيات حكيم لك</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{hakimPicks.map(o=><OfferCard key={o.id} o={o} onGo={goOffer} />)}</div></section>

            {/* بطاقة مؤسستك المحدثة - النص الجديد */}
            <section className="mt-8 rounded-[24px] bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#201a33] text-white p-6 border border-white/10 shadow-xl overflow-hidden relative">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#6D28D9]/40 blur-[70px] rounded-full" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 h-7 rounded-full text-[11px] font-bold border border-white/10">🏢 {PROFILE_NAME} • مكتب معتمد</div>
                <h3 className="mt-3 font-black text-[17px] leading-7">{PROFILE_MSG_SHORT}</h3>
                <p className="mt-1 text-[12px] text-white/60">{PROFILE_NAME}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={PROFILE_LINK} target="_blank" className="h-11 px-6 rounded-full bg-white text-zinc-900 font-black text-[13px] grid place-items-center">فتح رابط مكتبي العقاري ↗</a>
                  <button onClick={()=>setShowContact(true)} className="h-11 px-6 rounded-full bg-[#6D28D9] text-white font-black text-[13px]">تواصل الآن</button>
                </div>
                <div className="mt-4 text-[11px] text-white/40 break-all">{PROFILE_LINK}</div>
              </div>
            </section>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t flex justify-around items-center px-2 z-30">
        <button onClick={()=>setCat('متجر حكيم')} className="flex flex-col items-center gap-1 text-[#6D28D9]"><span className="text-[20px]">🏠</span><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button onClick={()=>setCat('الكل')} className="flex flex-col items-center gap-1 text-zinc-400"><span className="text-[20px]">🔍</span><span className="text-[10px] font-bold">البحث</span></button>
        <button onClick={()=>setCat('المساعد الاقتصادي')} className="flex flex-col items-center -mt-5"><span className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white grid place-items-center text-[24px] shadow-lg border-4 border-white">🤖</span><span className="text-[10px] font-black mt-1 text-[#6D28D9]">مساعد حكيم</span></button>
        <button className="flex flex-col items-center gap-1 text-zinc-400"><span className="text-[20px]">❤️</span><span className="text-[10px] font-bold">المفضلة</span></button>
        <button onClick={()=>setShowContact(true)} className="flex flex-col items-center gap-1 text-zinc-400"><span className="text-[20px]">👤</span><span className="text-[10px] font-bold">مكتبي</span></button>
      </nav>

      {showContact&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShowContact(false)}><div className="w-full max-w-[380px] bg-white rounded-[24px] p-6 text-center" onClick={e=>e.stopPropagation()}><div className="w-16 h-16 mx-auto rounded-2xl bg-[#6D28D9]/10 grid place-items-center text-2xl">🏢</div><h3 className="mt-3 font-black text-[16px]">{PROFILE_NAME}</h3><p className="mt-2 text-[13px] leading-6 text-zinc-600">{PROFILE_MSG_SHORT}</p><p className="mt-1 text-[11px] text-zinc-400">سنقوم بخدمتكم في أقرب فرصة</p><a href={PROFILE_LINK} target="_blank" className="mt-5 h-12 w-full rounded-full bg-zinc-900 text-white font-bold grid place-items-center text-[13px]">زيارة الملف على DealApp ↗</a><a href={`https://wa.me/?text=${encodeURIComponent(PROFILE_MSG_FULL+" - "+PROFILE_LINK)}`} target="_blank" className="mt-2 h-12 w-full rounded-full bg-[#25D366] text-white font-bold grid place-items-center text-[13px]">إرسال عبر واتساب</a><button onClick={()=>setShowContact(false)} className="mt-2 w-full h-11 rounded-full border font-bold text-sm">إغلاق</button></div></div>}

      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-end p-0" onClick={()=>setShowCart(false)}><div className="w-full max-w-[400px] h-[80vh] bg-white rounded-t-[24px] p-5 flex flex-col" onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h3 className="font-black">السلة</h3><button onClick={()=>setShowCart(false)}>✕</button></div><div className="flex-1 overflow-auto mt-4">{cart.length===0?<p className="text-center opacity-50 mt-10">فارغة</p>:cart.map(i=><div key={i.id} className="flex gap-3 border-b pb-2 mb-2"><img src={i.image} className="w-12 h-12 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{i.title}</div><div className="text-xs">{i.price} ر.س × {i.qty}</div></div></div>)}</div><button className="w-full h-12 rounded-full bg-[#6D28D9] text-white font-black">إتمام الشراء</button></div></div>}

      {toast&&<div className="fixed bottom-[90px] left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-4 py-2 rounded-full text-sm z-50">{toast}</div>}

      <footer className="mt-10 border-t bg-white py-7 text-center px-4"><div className="font-black text-[13px]">{PROFILE_NAME}</div><div className="mt-1.5 text-[12px] leading-6 text-zinc-600 max-w-[34ch] mx-auto">{PROFILE_MSG_SHORT}</div><a href={PROFILE_LINK} className="mt-3 inline-block text-[11px] text-[#6D28D9] font-bold underline break-all">{PROFILE_LINK}</a><div className="mt-3 text-[10px] opacity-40">© 2026 عروضكم - متجر حكيم</div></footer>
    </div>
  )
}
