"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; isHakeem?:boolean; lat:number; lng:number; city:string }

const CONTACTS = {
  email: "alhkmy11@gmail.com",
  facebook: "https://www.facebook.com/share/1BqEoZmeJQ/",
  x: "https://x.com/hkeeeeem",
  snap: "https://www.snapchat.com/add/maktb24?share_id=C-xFLFscZTA&locale=ar-AE",
  insta: "https://www.instagram.com/alhkmy11?igsh=MmlrYndpMGQzOG1n",
  tiktok: "https://www.tiktok.com/@hkeeeeem?_r=1&_t=ZS-97xbgSgFxMj",
  realEstate: "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4"
}

const HERO = [
 { store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد فاخرة', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-700 via-fuchsia-600 to-indigo-700', active:true },
 { store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, code:'PANDA55', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', g:'from-emerald-600 to-green-700' },
 { store:'جرير', d:45, t:'آيباد برو M2 12.9', p:2199, old:3999, code:'J10', img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', g:'from-violet-600 to-indigo-700' },
]

const CATS = [
 { n:'متجر حكيم', i:'💜', active:true },
 { n:'الكل', i:'✨' },
 { n:'عروضكم', i:'🛒' },
 { n:'أفضل المتاجر', i:'🏆' },
 { n:'إلكترونيات', i:'📱' },
 { n:'عروض حراج', i:'🏷️' },
]

const OFFERS: Offer[] = [
 { id:1, title:'عطر حكيم الملكي 100مل - الأكثر مبيعاً', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', isHakeem:true, lat:21.5433, lng:39.1728, city:'جدة' },
 { id:2, title:'محفظة جلد طبيعي + ساعة فاخرة', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', isHakeem:true, lat:21.545, lng:39.174, city:'جدة' },
 { id:3, title:'باقة حكيم الملكية - عطر + محفظة + مسبحة', store:'متجر حكيم', category:'متجر حكيم', price:499, old_price:899, discount:44, image:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', isHakeem:true, lat:21.542, lng:39.171, city:'جدة' },
 { id:4, title:'سلة بنده التوفير', store:'بنده', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', lat:21.55, lng:39.18, city:'جدة' },
 { id:5, title:'آيباد برو M2', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', lat:21.56, lng:39.19, city:'جدة' },
 { id:6, title:'كنب مستعمل نظيف', store:'حراج', category:'عروض حراج', price:1200, old_price:2699, discount:55, image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', lat:21.53, lng:39.16, city:'جدة' },
]

const BEST = [
 { name:'متجر حكيم', icon:'💜', rating:4.9, offers:24, color:'from-violet-600 to-fuchsia-600', cat:'متجر حكيم' },
 { name:'بنده', icon:'🛒', rating:4.8, offers:128, color:'from-emerald-600 to-green-600', cat:'عروضكم' },
 { name:'جرير', icon:'📚', rating:4.9, offers:96, color:'from-blue-600 to-indigo-600', cat:'إلكترونيات' },
 { name:'إكسترا', icon:'📱', rating:4.7, offers:84, color:'from-orange-600 to-red-600', cat:'إلكترونيات' },
]

function haversine(lat1:number,lon1:number,lat2:number,lon2:number){
 const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLon=(lon2-lon1)*Math.PI/180;
 const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2; return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState<{id:number;qty:number}[]>([]); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [showFont,setShowFont]=useState(false); const [dark,setDark]=useState(false);
 const [share,setShare]=useState<any>(null); const [showCart,setShowCart]=useState(false); const [showLogin,setShowLogin]=useState(false); const [showDash,setShowDash]=useState(false); const [page,setPage]=useState<'privacy'|'terms'|'contact'|null>(null);
 const [phone,setPhone]=useState(''); const [otp,setOtp]=useState(''); const [otpSent,setOtpSent]=useState(false); const [timer,setTimer]=useState(0); const [user,setUser]=useState<any>(null);
 const [loc,setLoc]=useState<{lat:number;lng:number;enabled:boolean;loading:boolean}|null>(null); const [nearby,setNearby]=useState(false);

 const fontSize = font==='sm'?'15px':font==='lg'?'20px':'17.5px'

 useEffect(()=>{ const t=setInterval(()=>setA(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
 useEffect(()=>{ try{ const f=localStorage.getItem('aroood_font') as any; if(f) setFont(f); const d=localStorage.getItem('aroood_dark'); if(d) setDark(d==='1'); const c=localStorage.getItem('aroood_cart'); if(c) setCart(JSON.parse(c)); const u=localStorage.getItem('aroood_user'); if(u) setUser(JSON.parse(u)); const l=localStorage.getItem('aroood_loc'); if(l) setLoc(JSON.parse(l)) }catch{} },[])
 useEffect(()=>{ try{ localStorage.setItem('aroood_font',font)}catch{} },[font]); useEffect(()=>{ try{ localStorage.setItem('aroood_dark',dark?'1':'0')}catch{} },[dark]); useEffect(()=>{ try{ localStorage.setItem('aroood_cart',JSON.stringify(cart))}catch{} },[cart]);
 useEffect(()=>{ if(timer>0){ const t=setTimeout(()=>setTimer(timer-1),1000); return()=>clearTimeout(t)} },[timer])

 const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(''),2600) }

 const filtered = useMemo(()=>{
  let list = cat==='الكل'? OFFERS : OFFERS.filter(o=> o.category===cat || (cat==='متجر حكيم' && o.isHakeem))
  if(nearby && loc?.enabled){ list = list.map(o=>({...o, dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist) as any }
  else if(loc?.enabled){ list = list.map(o=>({...o, dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).sort((x:any,y:any)=>x.dist-y.dist) as any }
  return list
 },[cat,loc,nearby])

 const cartCount = cart.reduce((s,c)=>s+c.qty,0)
 const cartTotal = useMemo(()=> cart.reduce((s,c)=>{ const o=OFFERS.find(x=>x.id===c.id); return s+(o?o.price*c.qty:0)},0),[cart])

 const sendOtp = ()=>{
  if(!/^0?5\d{8}$/.test(phone.replace(/\s/g,'')) &&!/^\+9665\d{8}$/.test(phone)){ show('رقم الجوال غير صحيح'); return }
  setOtpSent(true); setTimer(60); show('رمز التحقق: 1234 (تجريبي) ✓')
 }
 const verifyOtp = ()=>{
  if(otp==='1234'){ const u={name:'محسن الحكمي', phone, verified:true, points:150}; setUser(u); localStorage.setItem('aroood_user',JSON.stringify(u)); setShowLogin(false); setOtp(''); setOtpSent(false); show('تم التحقق ✓ أهلاً بك في متجر حكيم 💜') }
  else show('رمز خاطئ، جرب 1234')
 }
 const requestLoc = ()=>{
  if(!navigator.geolocation){ show('المتصفح لا يدعم الموقع'); return }
  setLoc({lat:0,lng:0,enabled:false,loading:true} as any)
  navigator.geolocation.getCurrentPosition(pos=>{
    const l={lat:pos.coords.latitude,lng:pos.coords.longitude,enabled:true,loading:false}; setLoc(l as any); localStorage.setItem('aroood_loc',JSON.stringify(l)); show('تم تفعيل الموقع 📍 جدة')
  },()=>{ setLoc(null); show('فشل تحديد الموقع') })
 }
 const shareText = (o:any)=> `🔥 ${o.title||o.t} - ${o.price||o.p} ر.س بدل ${o.old_price||o.old} (خصم ${o.discount||o.d}%) من ${o.store} عبر عروضكم 💜 https://e2.vercel.app?offer=${o.id||o.code} 🏡 مكتب محسن: ${CONTACTS.realEstate}`
 const doShare = (type:string)=>{
  if(!share) return; const text=shareText(share); const url=`https://e2.vercel.app?offer=${share.id||share.code}`
  if(type==='whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`)
  else if(type==='telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`)
  else if(type==='facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
  else if(type==='x') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
  else if(type==='snap'){ navigator.clipboard.writeText(text); window.open(CONTACTS.snap); show('تم النسخ وفتح سناب') }
  else if(type==='insta'){ navigator.clipboard.writeText(text); window.open(CONTACTS.insta); show('تم النسخ وفتح انستقرام') }
  else if(type==='tiktok'){ navigator.clipboard.writeText(text); window.open(CONTACTS.tiktok); show('تم النسخ وفتح تيك توك') }
  else if(type==='copy'){ navigator.clipboard.writeText(text); show('تم نسخ رابط العرض 💜'); setShare(null) }
 }

 return(
 <div dir="rtl" style={{fontSize}} className={`min-h-screen transition-colors leading-7 ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}>
   <div className="max-w-7xl mx-auto px-4 h-[68px] flex justify-between items-center">
    <h1 className="font-black text-2xl">عروض<span className="text-[#6D28D9]">كم</span> <span className="text-[11px] px-2 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white align-middle">متجر حكيم مفعّل</span></h1>
    <div className="flex items-center gap-2">
     <div className="relative"><button onClick={()=>setShowFont(!showFont)} className={`w-11 h-11 rounded-full grid place-items-center border font-black text-[18px] ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>أأ</button>
      {showFont&&<div className={`absolute left-0 top-12 w-36 rounded-2xl border shadow-xl p-2 z-20 ${dark?'bg-zinc-900 border-zinc-800':'bg-white'}`}><button onClick={()=>{setFont('sm');setShowFont(false)}} className={`w-full h-9 rounded-full text-[15px] ${font==='sm'?'bg-[#6D28D9] text-white':''}`}>صغير</button><button onClick={()=>{setFont('base');setShowFont(false)}} className={`w-full h-9 rounded-full mt-1 ${font==='base'?'bg-[#6D28D9] text-white':''}`}>متوسط - مكبر</button><button onClick={()=>{setFont('lg');setShowFont(false)}} className={`w-full h-9 rounded-full mt-1 text-[17px] ${font==='lg'?'bg-[#6D28D9] text-white':''}`}>كبير جداً</button></div>}</div>
     <button onClick={()=>setDark(!dark)} className={`w-11 h-11 rounded-full grid place-items-center border ${dark?'bg-zinc-800 border-zinc-700':'bg-white border-violet-100'}`}>{dark?'☀️':'🌙'}</button>
     <button onClick={requestLoc} className={`px-3 h-11 rounded-full border text-[14px] font-bold ${loc?.enabled?'bg-emerald-600 text-white border-emerald-600':'bg-white border-violet-100'}`}>{loc?.loading?'...':loc?.enabled?'جدة • مفعّل ✓':'تفعيل الموقع 📍'}</button>
     <button onClick={()=>setShowCart(true)} className="px-4 h-11 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black text-[15px]">السلة {cartCount}</button>
     {user? <button onClick={()=>setShowDash(true)} className="w-11 h-11 rounded-full bg-zinc-900 text-white font-black">{user.phone.slice(-2)}</button> : <button onClick={()=>setShowLogin(true)} className="px-4 h-11 rounded-full bg-zinc-900 text-white text-[14px] font-bold">دخول برقم الجوال</button>}
    </div>
   </div>
  </header>

  <main>
   <section className="max-w-7xl mx-auto px-3 mt-5"><div className="relative h-[56vh] rounded-[32px] overflow-hidden bg-zinc-900 text-white shadow-xl">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0 pointer-events-none'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-8 gap-6 items-center"><div className="flex-1 space-y-4"><span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-[13px] font-black">{s.store} {s.active&&'💜 مفعّل'}</span><div className="text-6xl font-black leading-none">خصم {s.d}%</div><div className="text-2xl font-bold">{s.t}</div><div className="flex gap-2 items-center"><span className="text-3xl font-black">{s.p} ر.س</span><span className="line-through opacity-70">{s.old}</span></div><div className="flex gap-2"><button onClick={()=>{setCart(c=>{const ex=c.find(x=>x.id===999);return ex?c.map(x=>x.id===999?{...x,qty:x.qty+1}:x):[...c,{id:999,qty:1}] as any}); show('أضيف لسلة حكيم ✓')}} className="px-7 py-3 rounded-full bg-white text-zinc-900 font-black text-[16px]">احصل الآن من حكيم</button><button onClick={()=>setShare(s)} className="px-5 py-3 rounded-full bg-white/20 border border-white/30 font-bold">مشاركة ↗</button></div></div><img src={s.img} alt={s.t} className="w-[88%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px] shadow-2xl"/></div></div>)}</div></section>

   <section className="max-w-7xl mx-auto px-4 mt-6 flex gap-2.5 overflow-x-auto py-2 scrollbar-hide">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-6 h-12 rounded-full border font-black text-[15px] transition-all ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9] scale-105 shadow-lg shadow-violet-200':'bg-white border-violet-100 text-zinc-700'} ${dark&&cat!==c.n?'!bg-zinc-900!border-zinc-800!text-zinc-300':''}`}>{c.i} {c.n} {c.active&&'•'}</button>)}</section>

   {cat==='متجر حكيم'&&<section className="max-w-7xl mx-auto px-4 mt-2"><div className="rounded-[24px] p-5 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-indigo-700 text-white flex-col md:flex-row justify-between items-center gap-3"><div className="font-black text-[18px]">💜 متجر حكيم مفعّل الآن - خصومات حصرية + شحن مجاني داخل جدة + دفع عند الاستلام</div><div className="flex gap-2"><span className="px-3 py-1 rounded-full bg-white text-violet-700 text-[12px] font-black">موثق ✓</span><span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-[12px]">تقييم 4.9 ★</span></div></div></section>}

   <section className="max-w-7xl mx-auto px-4 mt-5 flex items-center justify-between"><div className="flex items-center gap-3"><h2 className="font-black text-[20px]">{cat==='متجر حكيم'?'عطور وباقات حكيم الفاخرة':cat==='أفضل المتاجر'?'أفضل المتاجر':'العروض القريبة منك'}</h2>{loc?.enabled&&<span className="text-[13px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">يبعد حسب موقعك • جدة</span>}</div><label className="flex items-center gap-2 text-[13px] font-bold cursor-pointer"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)} className="w-4 h-4"/> العروض القريبة فقط (&lt;12 كم)</label></section>

   {cat==='أفضل المتاجر'?<section className="max-w-7xl mx-auto px-4 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">{BEST.map(b=><div key={b.name} className={`rounded-[20px] border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><div className={`w-12 h-12 rounded-full bg-gradient-to-r ${b.color} grid place-items-center text-xl text-white`}>{b.icon}</div><h3 className="font-black mt-3 text-[17px]">{b.name} {b.name==='متجر حكيم'&&<span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">مفعّل</span>}</h3><div className="text-[13px] mt-1 opacity-70">★ {b.rating} • {b.offers} عرض</div><button onClick={()=>setCat(b.cat)} className="w-full mt-3 h-10 rounded-full bg-zinc-900 text-white text-[13px] font-black">تصفح المتجر</button></div>)}</section>:
   <section className="max-w-7xl mx-auto px-4 mt-4 grid md:grid-cols-[1fr_360px] gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{filtered.map((o:any)=><article key={o.id} className={`rounded-[22px] border overflow-hidden group hover:shadow-xl transition-all ${o.isHakeem?'ring-2 ring-violet-200 border-violet-200':''} ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><div className="relative"><img src={o.image} alt={o.title} className="h-48 w-full object-cover"/><span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[13px] font-black bg-[#6D28D9] text-white">-{o.discount}%</span>{o.isHakeem&&<span className="absolute top-3 left-12 px-3 py-1 rounded-full text-[11px] font-black bg-white text-[#6D28D9] shadow">حكيم 💜</span>}<button onClick={()=>setShare(o)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow">↗</button>{o.dist!=null&&<span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px]">يبعد {o.dist.toFixed(1)} كم • {o.city}</span>}</div><div className="p-4"><div className="text-[12px] opacity-60">{o.store} • {o.city}</div><h3 className="font-black mt-1 leading-6 text-[16px]">{o.title}</h3><div className="flex justify-between items-center mt-3"><div><span className="font-black text-[#6D28D9] text-[18px]">{o.price} ر.س</span><span className="mr-2 line-through opacity-50 text-[13px]">{o.old_price}</span></div><button onClick={()=>{setCart(c=>{const ex=c.find(x=>x.id===o.id);return ex?c.map(x=>x.id===o.id?{...x,qty:x.qty+1}:x):[...c,{id:o.id,qty:1}]}) ; show('أضيف لسلة حكيم ✓')}} className="w-10 h-10 rounded-full bg-zinc-900 text-white font-black text-[18px]">+</button></div></div></article>)}</div>
    <aside className="space-y-4">
     <div className={`rounded-[20px] border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><h3 className="font-black text-[16px]">💜 متجر حكيم مفعّل</h3><p className="text-[14px] leading-6 mt-2 opacity-80">كل طلبات حكيم تشمل تغليف فاخر + كرت إهداء + ضمان استرجاع.</p><button onClick={()=>setCat('متجر حكيم')} className="w-full mt-3 h-11 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black">تسوق حكيم الآن</button></div>
     <div className="rounded-[20px] p-6 text-white bg-gradient-to-br from-[#1A1033] via-[#3B1F75] to-[#6D28D9]"><h3 className="font-black text-[16px]">🏡 مكتبي العقاري</h3><p className="text-[14px] leading-7 mt-2 opacity-90">محسن الحكمي - وسيط معتمد<br/>يسعدني استقبال طلباتكم</p><a href={CONTACTS.realEstate} target="_blank" className="mt-4 inline-flex h-11 px-5 rounded-full bg-white text-[#4C1D95] text-[13px] font-black items-center">فتح الملف العقاري ↗</a></div>
     <div className={`rounded-[20px] border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-white'}`}><h3 className="font-black text-[15px]">تواصل معنا</h3><div className="grid grid-cols-2 gap-2 mt-3"><a href={`mailto:${CONTACTS.email}`} className="h-10 rounded-full bg-zinc-900 text-white grid place-items-center text-[12px] font-bold">ايميل</a><a href={CONTACTS.facebook} target="_blank" className="h-10 rounded-full bg-[#1877F2] text-white grid place-items-center text-[12px] font-bold">فيسبوك</a><a href={CONTACTS.x} target="_blank" className="h-10 rounded-full bg-black text-white grid place-items-center text-[12px]">X</a><a href={CONTACTS.insta} target="_blank" className="h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white grid place-items-center text-[12px] font-bold">انستقرام</a><a href={CONTACTS.snap} target="_blank" className="h-10 rounded-full bg-[#FFFC00] text-black grid place-items-center text-[12px] font-black">سناب</a><a href={CONTACTS.tiktok} target="_blank" className="h-10 rounded-full bg-black text-white grid place-items-center text-[12px]">تيك توك</a></div><div className="text-[12px] mt-3 opacity-60 break-all">{CONTACTS.email}</div></div>
    </aside>
   </section>}

   <footer className="max-w-7xl mx-auto px-4 mt-12 mb-10 flex flex-wrap gap-3 justify-center"><button onClick={()=>setPage('privacy')} className="px-5 h-10 rounded-full border text-[13px] font-bold">سياسة الخصوصية</button><button onClick={()=>setPage('terms')} className="px-5 h-10 rounded-full border text-[13px] font-bold">الشروط والأحكام</button><button onClick={()=>setPage('contact')} className="px-5 h-10 rounded-full bg-zinc-900 text-white text-[13px] font-bold">تواصل معنا - كل الروابط</button></footer>
  </main>

  {share&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShare(null)}><div onClick={e=>e.stopPropagation()} className={`w-full max-w-[380px] rounded-[24px] p-6 ${dark?'bg-zinc-900':'bg-white'} shadow-2xl`}><div className="flex justify-between items-center"><h3 className="font-black text-[18px]">مشاركة العرض 💜</h3><button onClick={()=>setShare(null)} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">✕</button></div><p className="text-[13px] mt-2 opacity-70 leading-6 line-clamp-2">{share.title||share.t}</p><div className="grid grid-cols-2 gap-2.5 mt-5"><button onClick={()=>doShare('whatsapp')} className="h-12 rounded-full bg-[#25D366] text-white font-black text-[14px]">واتساب</button><button onClick={()=>doShare('telegram')} className="h-12 rounded-full bg-[#229ED9] text-white font-black">تيليجرام</button><button onClick={()=>doShare('facebook')} className="h-12 rounded-full bg-[#1877F2] text-white font-black">فيسبوك</button><button onClick={()=>doShare('x')} className="h-12 rounded-full bg-black text-white font-black">اكس / X</button><button onClick={()=>doShare('snap')} className="h-12 rounded-full bg-[#FFFC00] text-black font-black">سناب</button><button onClick={()=>doShare('insta')} className="h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black">انستقرام</button><button onClick={()=>doShare('tiktok')} className="h-12 rounded-full bg-black text-white font-black border-zinc-700">تيك توك</button><button onClick={()=>doShare('copy')} className="h-12 rounded-full bg-zinc-900 text-white font-black col-span-2">نسخ الرابط 📋</button></div></div>}

  {showCart&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-end md:place-items-center p-0 md:p-4" onClick={()=>setShowCart(false)}><div onClick={e=>e.stopPropagation()} className={`w-full md:max-w-[420px] h-[88vh] md:h-auto md:rounded-[24px] p-6 overflow-auto ${dark?'bg-zinc-900':'bg-white'}`}><div className="flex justify-between"><h3 className="font-black text-[18px]">سلة متجر حكيم 🛒</h3><button onClick={()=>setShowCart(false)}>✕</button></div>{cart.length===0?<p className="mt-8 text-center opacity-60">السلة فارغة</p>:<><div className="mt-4 space-y-3">{cart.map(c=>{const o=OFFERS.find(x=>x.id===c.id)||{title:'منتج حكيم',price:399} as any; return <div key={c.id} className="flex justify-between items-center border-b pb-3"><div><div className="font-bold text-[15px]">{o.title}</div><div className="text-[13px] text-[#6D28D9] font-black">{o.price} ر.س</div></div><div className="flex items-center gap-2"><button onClick={()=>setCart(s=>s.map(x=>x.id===c.id?{...x,qty:Math.max(1,x.qty-1)}:x))} className="w-8 h-8 rounded-full border grid place-items-center">-</button><span className="w-6 text-center font-black">{c.qty}</span><button onClick={()=>setCart(s=>s.map(x=>x.id===c.id?{...x,qty:x.qty+1}:x))} className="w-8 h-8 rounded-full bg-zinc-900 text-white grid place-items-center">+</button><button onClick={()=>setCart(s=>s.filter(x=>x.id!==c.id))} className="mr-2 text-red-500">🗑️</button></div></div>})}</div><div className="mt-6 p-4 rounded-2xl bg-violet-50 border border-violet-100 text-violet-900"><div className="flex justify-between font-black"><span>الإجمالي</span><span>{cartTotal} ر.س</span></div><div className="text-[12px] mt-1">شحن مجاني لعملاء حكيم داخل جدة 💜</div></div><button onClick={()=>{show('تم تأكيد الطلب - سيتواصل متجر حكيم معك'); setCart([]); setShowCart(false)}} className="w-full mt-4 h-12 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white font-black">تأكيد الطلب من حكيم</button></>}</div></div>}

  {showLogin&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShowLogin(false)}><div onClick={e=>e.stopPropagation()} className={`w-full max-w-[360px] rounded-[24px] p-6 ${dark?'bg-zinc-900':'bg-white'}`}><h3 className="font-black text-[18px]">التسجيل برقم الجوال 📱</h3><p className="text-[13px] opacity-70 mt-1">لتفعيل متجر حكيم والعروض القريبة</p>{!otpSent?<><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xxxxxxxx" className={`w-full mt-4 h-12 rounded-full border px-4 text-[16px] outline-none ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50 border-zinc-200'}`}/><button onClick={sendOtp} className="w-full mt-3 h-12 rounded-full bg-[#6D28D9] text-white font-black">إرسال رمز التحقق</button></>:<><div className="mt-4 text-[13px]">أدخل الرمز المرسل (تجريبي 1234) {timer>0&&<span className="text-violet-600">({timer}ث)</span>}</div><input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="1234" maxLength={4} className={`w-full mt-2 h-12 rounded-full border px-4 text-center tracking-[8px] text-[20px] font-black outline-none ${dark?'bg-zinc-800 border-zinc-700':'bg-zinc-50'}`}/><button onClick={verifyOtp} className="w-full mt-3 h-12 rounded-full bg-emerald-600 text-white font-black">تحقق وتفعيل</button><button disabled={timer>0} onClick={sendOtp} className="w-full mt-2 h-10 rounded-full border text-[13px] disabled:opacity-40">إعادة الإرسال</button></>}<button onClick={()=>setShowLogin(false)} className="w-full mt-3 text-[13px] opacity-60">إغلاق</button></div></div>}

  {showDash&&user&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setShowDash(false)}><div onClick={e=>e.stopPropagation()} className={`w-full max-w-[360px] rounded-[24px] p-6 ${dark?'bg-zinc-900':'bg-white'}`}><h3 className="font-black">مرحباً {user.name} 💜</h3><div className="mt-3 space-y-2 text-[14px]"><div className="flex justify-between"><span>الجوال</span><b>{user.phone}</b></div><div className="flex justify-between"><span>النقاط</span><b className="text-violet-600">{user.points}</b></div><div className="flex justify-between"><span>الموقع</span><b>{loc?.enabled?'مفعّل ✓ جدة':'غير مفعّل'}</b></div><div className="flex justify-between"><span>المتجر المفضل</span><b>حكيم مفعّل</b></div></div><button onClick={()=>{setUser(null); localStorage.removeItem('aroood_user'); setShowDash(false); show('تم تسجيل الخروج')}} className="w-full mt-5 h-11 rounded-full bg-zinc-900 text-white font-bold">تسجيل خروج</button></div></div>}

  {page&&<div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={()=>setPage(null)}><div onClick={e=>e.stopPropagation()} className={`w-full max-w-[480px] max-h-[85vh] overflow-auto rounded-[24px] p-6 ${dark?'bg-zinc-900':'bg-white'}`}><div className="flex justify-between"><h3 className="font-black text-[18px]">{page==='privacy'?'سياسة الخصوصية':page==='terms'?'الشروط والأحكام':'تواصل معنا'}</h3><button onClick={()=>setPage(null)}>✕</button></div>{page==='contact'?<div className="mt-4 space-y-3"><a href={`mailto:${CONTACTS.email}`} className="flex justify-between p-3 rounded-xl border"><span>البريد</span><b>{CONTACTS.email}</b></a>{Object.entries({فيسبوك:CONTACTS.facebook, 'اكس':CONTACTS.x, سناب:CONTACTS.snap, انستقرام:CONTACTS.insta, تيك_توك:CONTACTS.tiktok, العقاري:CONTACTS.realEstate}).map(([k,v])=><a key={k} href={v} target="_blank" className="flex justify-between p-3 rounded-xl bg-zinc-50 border text-[13px]"><span>{k}</span><span className="truncate max-w-[180px] text-violet-600">{v}</span></a>)}</div>:<p className="mt-4 text-[14px] leading-7 opacity-80">{page==='privacy'?'نحترم خصوصيتك، بيانات جوالك وموقعك تستخدم فقط لتحسين العروض القريبة وتفعيل متجر حكيم، لا نشاركها.' : 'باستخدامك عروضكم توافق على الشروط، متجر حكيم يقدم منتجات أصلية مع ضمان استرجاع 7 أيام داخل جدة.'}</p>}</div></div>}

  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full text-[14px] font-bold shadow-xl z-[60]">{toast}</div>}
 </div>
 )
                                                                                                                                                                                                                                                                                       }
