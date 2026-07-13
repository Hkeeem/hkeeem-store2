"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type Hero = { id:string; store:string; d:number; t:string; p:number; old:number; code:string; img:string; g:string; mauve:boolean }
type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; mauve?:boolean; isOwn?:boolean }
type CartItem = Offer & { qty:number }
type SharePayload = { id:string|number; title:string; store:string; price:number; old_price:number; discount:number; image:string }

const HERO: Hero[] = [
  { id:'HKEEM20', store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-700 via-fuchsia-600 to-indigo-700', mauve:true },
  { id:'AROOD60', store:'عروضكم', d:60, t:'كل عروض المملكة في مكان واحد', p:0, old:0, code:'AROOD60', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', g:'from-emerald-700 to-green-700', mauve:false },
  { id:'HARAJ55', store:'عروض حراج', d:55, t:'مستعمل نظيف - شبه جديد', p:1200, old:2699, code:'HARAJ55', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', g:'from-violet-800 via-purple-700 to-indigo-800', mauve:true },
]

const CATS = [
  { n:'الكل', i:'✨' }, { n:'متجر حكيم', i:'💜', mauve:true }, { n:'عروضكم', i:'🛒' },
  { n:'أفضل المتاجر', i:'🏆', mauve:true }, { n:'إلكترونيات', i:'📱' },
  { n:'المساعد الاقتصادي', i:'🤖', mauve:true }, { n:'عروض حراج', i:'🏷️', mauve:true },
]

const OFFERS: Offer[] = [
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
  const [active,setActive]=useState(0); const [cat,setCat]=useState('الكل')
  const [cart,setCart]=useState<CartItem[]>([]); const [toast,setToast]=useState('')
  const [share,setShare]=useState<SharePayload|null>(null); const [dark,setDark]=useState(false)
  const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [showFont,setShowFont]=useState(false)
  const [showCart,setShowCart]=useState(false); const [showLogin,setShowLogin]=useState(false)
  const [showDash,setShowDash]=useState(false); const [page,setPage]=useState<'privacy'|'terms'|'contact'|null>(null)
  const [user,setUser]=useState<{name:string,email:string,points:number}|null>(null)
  const [contact,setContact]=useState({name:'',msg:''})

  useEffect(()=>{const t=setInterval(()=>setActive(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
  useEffect(()=>{try{const c=localStorage.getItem('cart'); if(c) setCart(JSON.parse(c)); const d=localStorage.getItem('dark'); if(d) setDark(d==='1'); const f=localStorage.getItem('font') as any; if(f) setFont(f); const u=localStorage.getItem('user'); if(u) setUser(JSON.parse(u))}catch{}},[])
  useEffect(()=>{try{localStorage.setItem('cart',JSON.stringify(cart)); localStorage.setItem('dark',dark?'1':'0'); localStorage.setItem('font',font); if(user) localStorage.setItem('user',JSON.stringify(user))}catch{}},[cart,dark,font,user])

  const total = useMemo(()=>cart.reduce((s,i)=>s+i.price*i.qty,0),[cart])
  const count = useMemo(()=>cart.reduce((s,i)=>s+i.qty,0),[cart])
  const filtered = useMemo(()=>{ if(cat==='الكل') return OFFERS; if(cat==='أفضل المتاجر') return []; if(cat==='إلكترونيات') return OFFERS.filter(x=>x.category==='إلكترونيات'); if(cat==='المساعد الاقتصادي') return []; return OFFERS.filter(x=>x.category===cat)},[cat])
  const show = useCallback((m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)},[])
  const add = (o:Offer)=>{setCart(p=>{const f=p.find(x=>x.id===o.id); if(f) return p.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x); return [...p,{...o,qty:1}]}); show('أضيف للسلة ✓')}
  const shareText = (o:SharePayload)=>`🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nhttps://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`

  return (
    <div className={`min-h-screen transition-colors ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'} ${font==='sm'?'text-[14px]':font==='lg'?'text-[18px]':'text-[16px]'}`} dir="rtl">
      <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span></h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={()=>setShowFont(!showFont)} className={`w-10 h-10 rounded-full border grid place-items-center font-bold ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>أأ</button>
              {showFont&&<div className={`absolute left-0 top-12 w-32 rounded-2xl border shadow-xl p-2 ${dark?'bg-zinc-900 border-zinc-700':'bg-white'}`}><button onClick={()=>{setFont('sm');setShowFont(false)}} className={`w-full h-8 rounded-full text-xs ${font==='sm'?'bg-[#6D28D9] text-white':''}`}>صغير</button><button onClick={()=>{setFont('base');setShowFont(false)}} className={`w-full h-8 rounded-full text-xs mt-1 ${font==='base'?'bg-[#6D28D9] text-white':''}`}>متوسط</button><button onClick={()=>{setFont('lg');setShowFont(false)}} className={`w-full h-8 rounded-full text-xs mt-1 ${font==='lg'?'bg-[#6D28D9] text-white':''}`}>كبير</button></div>}
            </div>
            <button onClick={()=>setDark(!dark)} className={`w-10 h-10 rounded-full border grid place-items-center ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>{dark?'☀️':'🌙'}</button>
            <button onClick={()=>user?setShowDash(true):setShowLogin(true)} className={`px-3 h-10 rounded-full border text-sm font-bold ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>{user?user.name.slice(0,6):'دخول'}</button>
            <button onClick={()=>setShowCart(true)} className="px-4 h-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-sm font-bold">السلة {count}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-3 mt-4"><div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-zinc-900 text-white">{HERO.map((s,i)=><div key={s.id} className={`absolute inset-0 transition-opacity duration-700 ${i===active?'opacity-100':'opacity-0 pointer-events-none'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`} /><div className="relative h-full flex flex-col md:flex-row p-7 gap-6 items-center"><div className="flex-1 space-y-3"><span className="px-3 py-1 rounded-full bg-white text-zinc-900 text-xs font-bold">{s.store}</span><h2 className="text-5xl font-black">خصم {s.d}%</h2><p className="text-xl font-bold">{s.t}</p><div className="flex gap-2"><button onClick={()=>{const o=OFFERS.find(x=>x.store===s.store)||OFFERS[0]; add(o)}} className="px-6 py-3 rounded-full bg-white text-zinc-900 font-bold">احصل الآن</button><button onClick={()=>setShare(toShare(s))} className="px-5 py-3 rounded-full bg-white/20 border border-white/30 text-white font-bold">مشاركة ↗</button></div></div><img src={s.img} alt={s.t} className="w-[86%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px]" /></div></div>)}</div></section>

        <section className="max-w-7xl mx-auto px-4 mt-5 flex gap-2 overflow-x-auto py-2">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-11 rounded-full text-[13px] border font-bold ${cat===c.n?(c.mauve?'bg-[#6D28D9] text-white':'bg-zinc-900 text-white'):(dark?'bg-zinc-900 border-zinc-800 text-zinc-300':'bg-white border-violet-100')}`}>{c.i} {c.n}</button>)}</section>

        {cat==='أفضل المتاجر'?(
          <section className="max-w-7xl mx-auto px-4 mt-4"><h2 className="font-black text-lg mb-4">🏆 أفضل المتاجر</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{BEST.map(s=><div key={s.name} className={`rounded-[22px] border p-4 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><div className="text-2xl">{s.icon}</div><div className="font-black mt-2">{s.name}</div><div className="text-xs opacity-70">★ {s.r} • {s.o} عرض</div><button onClick={()=>setCat(s.name==='متجر حكيم'?'متجر حكيم':'عروضكم')} className="w-full mt-3 h-9 rounded-full bg-zinc-900 text-white text-xs dark:bg-white dark:text-zinc-900">تصفح</button></div>)}</div></section>
        ):(
          <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-6 mt-4 pb-28">
            <div className="grid grid-cols-2 gap-4">{filtered.map(o=><article key={o.id} className={`rounded-[22px] border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><div className="relative"><img src={o.image} alt={o.title} className="h-40 w-full object-cover"/><span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#6D28D9] text-white">-{o.discount}%</span><button onClick={()=>setShare(toShare(o))} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 grid place-items-center">↗</button></div><div className="p-3"><h3 className="font-bold text-sm">{o.title}</h3><div className="flex justify-between items-center mt-3"><span className="font-black text-[#8B5CF6]">{o.price} ر.س</span><button onClick={()=>add(o)} className="w-8 h-8 rounded-full bg-zinc-900 text-white">+</button></div></div></article>)}</div>
            <aside className="space-y-4">
              <div className={`rounded-[22px] border p-4 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><h3 className="font-black text-sm">💜 مشاركة سريعة</h3><p className="text-xs mt-1 opacity-70">رابط مكتبك ينضاف تلقائيا</p><button onClick={()=>{if(filtered[0]) setShare(toShare(filtered[0]))}} className="w-full mt-3 h-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white text-sm font-black">مشاركة</button></div>
              <div className="bg-gradient-to-br from-[#1A1033] via-[#3B1F75] to-[#6D28D9] rounded-[22px] p-5 text-white"><h3 className="font-bold text-sm">🏡 مكتبي العقاري</h3><p className="text-[13px] leading-6 mt-2 opacity-95">يسعدني استقبال طلباتكم عبر رابط مكتبي العقاري (محسن الحكمي)</p><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="mt-3 inline-flex h-9 px-4 rounded-full bg-white text-[#4C1D95] text-xs font-black">فتح الملف ↗</a></div>
            </aside>
          </section>
        )}
      </main>

      <footer className={`border-t mt-10 py-8 ${dark?'border-zinc-800 bg-zinc-900/50':'border-violet-100 bg-white'}`}><div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 text-xs"><button onClick={()=>setPage('privacy')} className="underline">سياسة الخصوصية</button><button onClick={()=>setPage('terms')} className="underline">الشروط والأحكام</button><button onClick={()=>setPage('contact')} className="underline">تواصل معنا</button><span className="opacity-60">© 2026 عروضكم - محسن الحكمي</span></div></footer>

      {showCart&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-end md:place-items-center p-0 md:p-4" onClick={()=>setShowCart(false)}><div className={`w-full md:max-w-[420px] h-[92vh] md:h-auto md:rounded-[28px] p-5 flex flex-col ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center"><h2 className="font-black text-lg">🛒 السلة ({count})</h2><button onClick={()=>setShowCart(false)} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center">✕</button></div><div className="flex-1 overflow-auto mt-4 space-y-3">{cart.length===0?<p className="text-center opacity-60 mt-10">السلة فاضية</p>:cart.map(i=><div key={i.id} className="flex gap-3 border-b pb-3 border-zinc-100 dark:border-zinc-800"><img src={i.image} className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{i.title}</div><div className="text-xs opacity-70">{i.price} ر.س</div><div className="flex items-center gap-2 mt-1"><button onClick={()=>setCart(p=>p.map(x=>x.id===i.id?{...x,qty:Math.max(1,x.qty-1)}:x))} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800">-</button><span className="text-sm w-6 text-center">{i.qty}</span><button onClick={()=>setCart(p=>p.map(x=>x.id===i.id?{...x,qty:x.qty+1}:x))} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800">+</button></div></div><button onClick={()=>setCart(p=>p.filter(x=>x.id!==i.id))} className="text-xs text-red-500">حذف</button></div>)}</div><div className="border-t pt-4 border-zinc-100 dark:border-zinc-800"><div className="flex justify-between font-black"><span>الإجمالي</span><span>{total} ر.س</span></div><button onClick={()=>{show('تم تأكيد الطلب ✓'); setCart([]); setShowCart(false)}} className="w-full mt-3 h-12 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black">إتمام الشراء</button></div></div></div>}

      {showLogin&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShowLogin(false)}><div className={`w-full max-w-[360px] rounded-[28px] p-6 ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><h2 className="font-black text-lg">تسجيل الدخول</h2><input id="name" placeholder="الاسم" className={`w-full mt-4 h-11 px-4 rounded-full border outline-none ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50 border-violet-100'}`} /><input id="email" placeholder="الإيميل" className={`w-full mt-2 h-11 px-4 rounded-full border outline-none ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50 border-violet-100'}`} /><button onClick={()=>{const n=(document.getElementById('name') as HTMLInputElement).value||'زائر'; const e=(document.getElementById('email') as HTMLInputElement).value||'guest@aroood.com'; setUser({name:n,email:e,points:120}); setShowLogin(false); show(`أهلا ${n} 💜`)}} className="w-full mt-4 h-11 rounded-full bg-[#6D28D9] text-white font-black">دخول</button></div></div>}

      {showDash&&user&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShowDash(false)}><div className={`w-full max-w-[380px] rounded-[28px] p-6 ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><h2 className="font-black">لوحة التحكم - {user.name}</h2><div className="grid grid-cols-3 gap-2 mt-4"><div className="rounded-2xl bg-violet-600 text-white p-3 text-center"><div className="text-xl font-black">{user.points}</div><div className="text-[11px]">نقطة</div></div><div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-3 text-center"><div className="font-black">{cart.length}</div><div className="text-[11px]">طلبات</div></div><div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-3 text-center"><div className="font-black">{count}</div><div className="text-[11px]">سلة</div></div></div><button onClick={()=>{setUser(null); localStorage.removeItem('user'); setShowDash(false); show('تم تسجيل الخروج')}} className="w-full mt-5 h-10 rounded-full border text-sm">تسجيل خروج</button></div></div>}

      {page&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 overflow-auto" onClick={()=>setPage(null)}><div className={`w-full max-w-[600px] rounded-[28px] p-6 my-8 ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><div className="flex justify-between"><h2 className="font-black text-lg">{page==='privacy'?'سياسة الخصوصية':page==='terms'?'الشروط والأحكام':'تواصل معنا'}</h2><button onClick={()=>setPage(null)} className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800">✕</button></div><div className="mt-4 text-sm leading-7 opacity-90 space-y-3">{page==='privacy'&&<><p>نحترم خصوصيتك في عروضكم ومتجر حكيم. لا نشارك بياناتك مع طرف ثالث.</p><p>البيانات المحفوظة: السلة، تفضيل الخط والوضع الليلي، ونقاط المشاركة فقط في جهازك.</p><p>رابط مكتبك العقاري يضاف فقط عند المشاركة بموافقتك.</p></>}{page==='terms'&&<><p>1- الأسعار قد تتغير حسب المتجر الأصلي.</p><p>2- متجر حكيم منتجاته أصلية ومضمونة.</p><p>3- عروض حراج مسؤولية البائع.</p><p>4- نقاط المشاركة لا تعني خصم نقدي إلا بإعلان رسمي.</p></>}{page==='contact'&&<><div className="space-y-2"><input value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})} placeholder="اسمك" className={`w-full h-11 px-4 rounded-full border ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`} /><textarea value={contact.msg} onChange={e=>setContact({...contact,msg:e.target.value})} placeholder="رسالتك" rows={4} className={`w-full p-4 rounded-2xl border ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`} /><button onClick={()=>{show('تم إرسال رسالتك ✓'); setPage(null); setContact({name:'',msg:''})}} className="w-full h-11 rounded-full bg-[#6D28D9] text-white font-black">إرسال</button><p className="text-xs opacity-70">أو تواصل مباشر: واتساب عبر زر المشاركة - مكتب محسن الحكمي العقاري</p></div></>}</div></div></div>}

      {share&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShare(null)}><div className={`w-full max-w-[360px] rounded-[28px] p-5 shadow-2xl ${dark?'bg-zinc-900':'bg-white'}`} onClick={e=>e.stopPropagation()}><h3 className="font-black">مشاركة العرض 💜</h3><div className="mt-3 flex gap-3"><img src={share.image} className="w-16 h-16 rounded-xl object-cover"/><div><div className="font-bold text-sm">{share.title}</div><div className="text-xs opacity-70">{share.store} • {share.price} ر.س</div></div></div><div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(shareText(share))}`)} className="h-11 rounded-full bg-[#25D366] text-white font-bold text-sm">واتساب</button><button onClick={()=>navigator.clipboard.writeText(shareText(share))} className="h-11 rounded-full bg-zinc-900 text-white font-bold text-sm">نسخ الرابط</button></div></div></div>}

      {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-[60]">{toast}</div>}
    </div>
  )
    }
