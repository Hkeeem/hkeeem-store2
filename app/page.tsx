"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type Hero = { id:string; store:string; d:number; t:string; p:number; old:number; code:string; img:string; g:string; mauve:boolean }
type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; mauve?:boolean; isOwn?:boolean }
type SharePayload = { id:string|number; title:string; store:string; price:number; old_price:number; discount:number; image:string }

const HERO: Hero[] = [
  { id:'HKEEM20', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-700 via-fuchsia-600 to-indigo-700', mauve:true },
  { id:'AROOD60', store:'عروضكم', d:60, t:'كل عروض المملكة في مكان واحد', p:0, old:0, code:'AROOD60', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', g:'from-emerald-700 to-green-700', mauve:false },
  { id:'HARAJ55', store:'عروض حراج', d:55, t:'مستعمل نظيف - شبه جديد', p:1200, old:2699, code:'HARAJ55', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', g:'from-violet-800 via-purple-700 to-indigo-800', mauve:true },
]

const CATS = [
  { n:'الكل', i:'✨' },
  { n:'متجر حكيم', i:'💜', mauve:true },
  { n:'عروضكم', i:'🛒' },
  { n:'المساعد الاقتصادي', i:'🤖', mauve:true },
  { n:'عروض حراج', i:'🏷️', mauve:true },
]

const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', mauve:true, isOwn:true },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', mauve:true, isOwn:true },
  { id:3, title:'سلة التوفير الكبرى - بنده', store:'عروضكم', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' },
  { id:4, title:'كنب 3 قطع مستعمل نظيف', store:'عروض حراج', category:'عروض حراج', price:1200, old_price:2699, discount:55, image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', mauve:true },
  { id:5, title:'زيت زيتون بكر 1 لتر - 4 متاجر', store:'عروضكم', category:'عروضكم', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600' },
]

function toSharePayload(item: Offer | Hero): SharePayload {
  if ('title' in item) return { id:item.id, title:item.title, store:item.store, price:item.price, old_price:item.old_price, discount:item.discount, image:item.image }
  return { id:item.code, title:item.t, store:item.store, price:item.p, old_price:item.old, discount:item.d, image:item.img }
}

export default function Page(){
  const [active,setActive]=useState(0); const [cat,setCat]=useState('الكل'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [shareItem,setShareItem]=useState<SharePayload|null>(null)
  useEffect(()=>{const t=setInterval(()=>setActive(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
  useEffect(()=>{const s=localStorage.getItem('aroood_cart'); if(s) setCart(Number(s))},[])
  useEffect(()=>{localStorage.setItem('aroood_cart',String(cart))},[cart])
  useEffect(()=>{const k=(e:KeyboardEvent)=>{if(e.key==='Escape') setShareItem(null)}; window.addEventListener('keydown',k); return()=>window.removeEventListener('keydown',k)},[])

  const filtered=useMemo(()=>{ if(cat==='الكل') return OFFERS; if(cat==='المساعد الاقتصادي') return []; return OFFERS.filter(o=>o.category===cat)},[cat])
  const show=useCallback((m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)},[])
  const shareText=useCallback((o:SharePayload)=>`🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nالرابط: https://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي العقاري: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`,[])
  const doShare=useCallback(async(type:'whatsapp'|'telegram'|'copy'|'native')=>{
    if(!shareItem) return; const text=shareText(shareItem); const url=`https://e2.vercel.app?offer=${shareItem.id}`
    if(type==='whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer')
    else if(type==='telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer')
    else if(type==='copy'){await navigator.clipboard.writeText(text); show('تم نسخ رابط المشاركة 💜'); setShareItem(null)}
    else if(type==='native' && navigator.share){try{await navigator.share({title:shareItem.title,text,url})}catch{}}
  },[shareItem,shareText,show])

  return (
    <div className="min-h-screen bg-[#FFFBFF] text-zinc-900" dir="rtl">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span></h1>
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-sm font-bold">السلة {cart}</div>
        </div>
      </header>

      <main>
        <section aria-label="عروض مميزة" className="max-w-7xl mx-auto px-3 mt-4">
          <div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-zinc-900 text-white">
            {HERO.map((s,i)=>(
              <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active?'opacity-100':'opacity-0 pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`} />
                <div className="relative h-full flex flex-col md:flex-row p-7 md:p-9 gap-6 items-center">
                  <div className="flex-1 space-y-3">
                    <span className="px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-bold">{s.store}</span>
                    <h2 className="text-5xl md:text-6xl font-black leading-none">خصم {s.d}%</h2>
                    <p className="text-xl font-bold">{s.t}</p>
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={()=>{setCart(c=>c+1); show('أضيف ✓')}} className="px-6 py-3 rounded-full bg-white text-zinc-900 font-bold">احصل الآن</button>
                      <button type="button" onClick={()=>setShareItem(toSharePayload(s))} className="px-5 py-3 rounded-full bg-white/20 border border-white/30 backdrop-blur text-white font-bold">مشاركة ↗</button>
                    </div>
                  </div>
                  <img src={s.img} alt={s.t} className="w-[86%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px] border border-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="التصنيفات" className="max-w-7xl mx-auto px-4 mt-5 flex gap-2.5 overflow-x-auto py-2">
          {CATS.map(c=>(
            <button type="button" key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-11 rounded-full text-[13px] border font-bold transition ${cat===c.n?(c.mauve?'bg-[#6D28D9] text-white border-violet-700 shadow-[0_6px_16px_-6px_#6D28D9]':'bg-zinc-900 text-white'):'bg-white border-violet-100 text-zinc-800 hover:border-violet-200'}`}>{c.i} {c.n}</button>
          ))}
        </section>

        <section aria-label="قائمة العروض" className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-6 pb-28 mt-4">
          <div>
            {cat==='المساعد الاقتصادي'?(
              <div className="bg-gradient-to-br from-violet-700 via-fuchsia-600 to-indigo-700 rounded-[28px] p-6 text-white">
                <h2 className="font-black text-xl">🤖 المساعد الاقتصادي</h2>
                <p className="text-sm mt-2 leading-6 opacity-95">أسألني وين أوفر بين متجر حكيم + عروضكم + حراج</p>
                <div className="mt-5 grid gap-2">
                  <div className="bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-3 text-sm">💜 متجر حكيم أوفر 43% على العطور هذا الأسبوع</div>
                  <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-sm">🏷️ حراج: كنب يوفر 1499 ر.س</div>
                  <div className="bg-white/15 border border-white/20 rounded-2xl p-3 text-sm">🛒 عروضكم: زيت 19 ر.س أرخص سعر</div>
                </div>
                <input aria-label="سؤال المساعد" placeholder="مثال: وين أرخص ساعة رجالية؟" className="w-full mt-5 h-12 px-4 rounded-full bg-white text-zinc-900 text-sm outline-none" />
              </div>
            ):(
              <div className="grid grid-cols-2 gap-4">
                {filtered.map(o=>(
                  <article key={o.id} className="bg-white rounded-[22px] border border-violet-100 overflow-hidden shadow-sm">
                    <div className="relative">
                      <img src={o.image} alt={o.title} loading="lazy" className="h-40 w-full object-cover" />
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#6D28D9] text-white">-{o.discount}%</span>
                      <button type="button" aria-label={`مشاركة ${o.title}`} onClick={()=>setShareItem(toSharePayload(o))} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 grid place-items-center shadow font-bold text-zinc-900">↗</button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-[13px] leading-snug">{o.title}</h3>
                      <p className="text-[11px] text-zinc-600 mt-1">{o.store}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-black text-[#5B21B6]">{o.price} ر.س</span>
                        <button type="button" onClick={()=>{setCart(c=>c+1); show('أضيف للسلة')}} className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold">+</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-[20px] border border-violet-100 p-4">
              <h2 className="font-black text-sm">💜 مشاركة سريعة</h2>
              <p className="text-xs text-zinc-600 mt-2 leading-5">كل مشاركة = 5 نقاط. رابط مكتبك ينضاف تلقائيا للرسالة.</p>
              <button type="button" onClick={()=>{if(filtered[0]) setShareItem(toSharePayload(filtered[0]))}} className="w-full mt-3 h-11 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-sm font-black">مشاركة أول عرض</button>
            </div>
            <div className="bg-gradient-to-br from-[#1A1033] via-[#3B1F75] to-[#6D28D9] rounded-[22px] p-5 text-white relative overflow-hidden">
              <h2 className="font-bold text-sm">🏡 مكتبي العقاري</h2>
              <p className="text-[13px] leading-6 opacity-95 mt-2">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة<br/><span className="font-black">(محسن الحكمي)</span></p>
              <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-10 px-5 rounded-full bg-white text-[#4C1D95] text-xs font-black items-center">فتح الملف العقاري ↗</a>
            </div>
          </aside>
        </section>
      </main>

      {shareItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShareItem(null)}>
          <div className="w-full max-w-[360px] bg-white rounded-[28px] p-5 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center"><h2 className="font-black text-base">مشاركة العرض 💜</h2><button type="button" onClick={()=>setShareItem(null)} className="w-8 h-8 rounded-full bg-zinc-100">✕</button></div>
            <div className="mt-4 flex gap-3"><img src={shareItem.image} alt="" className="w-16 h-16 rounded-xl object-cover"/><div><p className="font-bold text-sm leading-tight">{shareItem.title}</p><p className="text-xs text-zinc-600 mt-1">{shareItem.store} • {shareItem.price} ر.س</p></div></div>
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button type="button" onClick={()=>doShare('whatsapp')} className="h-12 rounded-full bg-[#25D366] text-white font-bold text-sm">واتساب</button>
              <button type="button" onClick={()=>doShare('telegram')} className="h-12 rounded-full bg-[#229ED9] text-white font-bold text-sm">تيليجرام</button>
              <button type="button" onClick={()=>doShare('copy')} className="h-12 rounded-full bg-zinc-900 text-white font-bold text-sm">نسخ الرابط</button>
              <button type="button" onClick={()=>doShare('native')} className="h-12 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-bold text-sm">مشاركة النظام</button>
            </div>
            <p className="text-[11px] text-zinc-500 text-center mt-3 leading-4">يتم إضافة رابط مكتبك العقاري تلقائيا في الرسالة</p>
          </div>
        </div>
      )}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-3 rounded-full text-sm shadow-xl z-[60]">{toast}</div>}
    </div>
  )
           }
