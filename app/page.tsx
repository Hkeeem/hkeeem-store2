"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type Hero = {
  id: string
  store: string
  d: number
  t: string
  p: number
  old: number
  code: string
  img: string
  g: string
  mauve: boolean
}

type Offer = {
  id: number
  title: string
  store: string
  category: string
  price: number
  old_price: number
  discount: number
  image: string
  mauve?: boolean
  isOwn?: boolean
}

type SharePayload = {
  id: string | number
  title: string
  store: string
  price: number
  old_price: number
  discount: number
  image: string
}

const HERO: Hero[] = [
  { id: 'HKEEM20', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-600 via-fuchsia-600 to-indigo-600', mauve:true },
  { id: 'AROOD60', store:'عروضكم', d:60, t:'كل عروض المملكة في مكان واحد', p:0, old:0, code:'AROOD60', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', g:'from-emerald-600 to-green-700', mauve:false },
  { id: 'HARAJ55', store:'عروض حراج', d:55, t:'مستعمل نظيف - شبه جديد', p:1200, old:2699, code:'HARAJ55', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', g:'from-violet-700 via-purple-600 to-indigo-700', mauve:true },
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
  if ('title' in item) return { id: item.id, title: item.title, store: item.store, price: item.price, old_price: item.old_price, discount: item.discount, image: item.image }
  return { id: item.code, title: item.t, store: item.store, price: item.p, old_price: item.old, discount: item.d, image: item.img }
}

export default function Page(){
  const [active, setActive] = useState(0)
  const [cat, setCat] = useState('الكل')
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState('')
  const [shareItem, setShareItem] = useState<SharePayload | null>(null)

  useEffect(() => {
    const t = setInterval(() => setActive(x => (x + 1) % HERO.length), 3800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('aroood_cart')
    if(saved) setCart(Number(saved))
  }, [])
  useEffect(() => { localStorage.setItem('aroood_cart', String(cart)) }, [cart])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') setShareItem(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    if(cat === 'الكل') return OFFERS
    if(cat === 'المساعد الاقتصادي') return []
    return OFFERS.filter(o => o.category === cat)
  }, [cat])

  const show = useCallback((m: string) => {
    setToast(m); setTimeout(() => setToast(''), 2200)
  }, [])

  const shareText = useCallback((o: SharePayload) =>
    `🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nالرابط: https://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`
 , [])

  const doShare = useCallback(async (type: 'whatsapp' | 'telegram' | 'copy' | 'native') => {
    if(!shareItem) return
    const text = shareText(shareItem)
    const url = `https://e2.vercel.app?offer=${shareItem.id}`
    if(type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    else if(type === 'telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    else if(type === 'copy'){ await navigator.clipboard.writeText(text); show('تم نسخ رابط المشاركة 💜'); setShareItem(null) }
    else if(type === 'native' && navigator.share){ try{ await navigator.share({ title: shareItem.title, text, url }) } catch{} }
  }, [shareItem, shareText, show])

  return (
    <div className="min-h-screen bg-[#FFFBFF] text-zinc-900" dir="rtl">
      {/* نفس الـ header والهيرو عندك، فقط استبدل onClick */}
      {/* مثال للهيرو */}
      <div className="max-w-7xl mx-auto px-3 mt-4">
        <div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-black text-white">
          {HERO.map((s,i) => (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`} />
              <div className="relative h-full flex flex-col md:flex-row p-7 gap-6 items-center">
                <div className="flex-1 space-y-3">
                  <div className="text-5xl font-black">خصم {s.d}%</div>
                  <div className="text-xl font-bold">{s.t}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setCart(c=>c+1); show('أضيف ✓') }} className="px-6 py-3 rounded-full bg-white text-black font-bold">احصل الآن</button>
                    <button type="button" onClick={() => setShareItem(toSharePayload(s))} className="px-4 py-3 rounded-full bg-white/15 border border-white/20">مشاركة ↗</button>
                  </div>
                </div>
                <img src={s.img} alt={s.t} loading={i===0? 'eager' : 'lazy'} className="w-[86%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* فئات */}
      <div className="max-w-7xl mx-auto px-4 mt-5 flex gap-2.5 overflow-x-auto py-2">
        {CATS.map(c => (
          <button type="button" key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-10 rounded-full text-[13px] border font-bold ${cat===c.n? (c.mauve? 'bg-[#8B5CF6] text-white' : 'bg-black text-white') : 'bg-white border-violet-100'}`}>{c.i} {c.n}</button>
        ))}
      </div>

      {/* العروض */}
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-6 pb-28 mt-3">
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(o => (
            <div key={o.id} className="bg-white rounded-[22px] border border-violet-50 overflow-hidden">
              <div className="relative">
                <img src={o.image} alt={o.title} loading="lazy" className="h-40 w-full object-cover" />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#8B5CF6] text-white">-{o.discount}%</span>
                <button type="button" aria-label="مشاركة" onClick={()=>setShareItem(toSharePayload(o))} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 grid place-items-center">↗</button>
              </div>
              <div className="p-3">
                <div className="font-bold text-[13px]">{o.title}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-black text-[#7C3AED]">{o.price} ر.س</span>
                  <button type="button" onClick={()=>{setCart(c=>c+1); show('أضيف للسلة')}} className="w-8 h-8 rounded-full bg-black text-white">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {shareItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShareItem(null)}>
          <div className="w-full max-w-[360px] bg-white rounded-[28px] p-5" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between"><h3 className="font-black">مشاركة العرض 💜</h3><button type="button" onClick={()=>setShareItem(null)}>✕</button></div>
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <button type="button" onClick={()=>doShare('whatsapp')} className="h-12 rounded-full bg-[#25D366] text-white font-bold">واتساب</button>
              <button type="button" onClick={()=>doShare('telegram')} className="h-12 rounded-full bg-[#229ED9] text-white font-bold">تيليجرام</button>
              <button type="button" onClick={()=>doShare('copy')} className="h-12 rounded-full bg-zinc-900 text-white font-bold">نسخ الرابط</button>
              <button type="button" onClick={()=>doShare('native')} className="h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold">مشاركة النظام</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full text-sm z-[60]">{toast}</div>}
    </div>
  )
}
