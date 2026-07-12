"use client"
import { useEffect, useState } from 'react'

const HERO=[
 {store:'متجر حكيم',d:40,t:'عطر حكيم الملكي + محفظة جلد',p:399,old:649,code:'HKEEM20',img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',g:'from-violet-600 via-fuchsia-600 to-indigo-600',mauve:true},
 {store:'عروضكم',d:60,t:'كل عروض المملكة في مكان واحد',p:0,old:0,code:'AROOD60',img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',g:'from-emerald-600 to-green-700',mauve:false},
 {store:'عروض حراج',d:55,t:'مستعمل نظيف - شبه جديد',p:1200,old:2699,code:'HARAJ55',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',g:'from-violet-700 via-purple-600 to-indigo-700',mauve:true},
]

const CATS=[
 {n:'الكل',i:'✨'},
 {n:'متجر حكيم',i:'💜',mauve:true},
 {n:'عروضكم',i:'🛒'},
 {n:'المساعد الاقتصادي',i:'🤖',mauve:true},
 {n:'عروض حراج',i:'🏷️',mauve:true},
]

const OFFERS=[
 {id:1,title:'عطر حكيم الملكي 100مل',store:'متجر حكيم',category:'متجر حكيم',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',mauve:true,isOwn:true},
 {id:2,title:'محفظة جلد + ساعة كلاسيك',store:'متجر حكيم',category:'متجر حكيم',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',mauve:true,isOwn:true},
 {id:3,title:'سلة التوفير الكبرى - بنده',store:'عروضكم',category:'عروضكم',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'},
 {id:4,title:'كنب 3 قطع مستعمل نظيف',store:'عروض حراج',category:'عروض حراج',price:1200,old_price:2699,discount:55,image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',mauve:true},
 {id:5,title:'زيت زيتون بكر 1 لتر - 4 متاجر',store:'عروضكم',category:'عروضكم',price:19,old_price:39,discount:51,image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600'},
]

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('الكل'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [shareItem,setShareItem]=useState<any>(null);
 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
 const filtered = cat==='الكل'? OFFERS : cat==='المساعد الاقتصادي'? [] : OFFERS.filter(o=>o.category===cat)
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}
 const getShareText=(o:any)=>`🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nالرابط: https://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`
 const doShare=(type:string)=>{
  if(!shareItem) return; const text=getShareText(shareItem); const url=`https://e2.vercel.app?offer=${shareItem.id}`
  if(type==='whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank')
  else if(type==='telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,'_blank')
  else if(type==='copy'){navigator.clipboard.writeText(text); show('تم نسخ رابط المشاركة 💜'); setShareItem(null)}
  else if(type==='native' && (navigator as any).share) (navigator as any).share({title:shareItem.title,text,url}).catch(()=>{})
 }

 return (<div className="min-h-screen bg-[#FFFBFF] text-zinc-900" dir="rtl">
  <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-violet-100"><div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center"><div className="font-black text-xl">عروض<span className="text-[#8B5CF6]">كم</span><span className="mr-2 inline-flex w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_10px_#8B5CF6]"></span></div><div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm">السلة {cart}</div></div></header>

  <div className="max-w-7xl mx-auto px-3 mt-4"><div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-black text-white shadow-[0_20px_60px_-20px_rgba(139,92,246,0.5)]">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-all duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-7 md:p-9 gap-6 items-center"><div className="flex-1 space-y-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${s.mauve?'bg-white text-[#7C3AED]':'bg-white text-black'}`}>{s.store}</span><div className="text-5xl md:text-6xl font-black leading-none">خصم {s.d}%</div><div className="text-xl font-bold">{s.t}</div>{s.p>0&&<div className="flex gap-2 items-baseline"><span className="text-3xl font-black">{s.p} ر.س</span><span className="line-through opacity-60">{s.old}</span></div>}<div className="flex gap-2 pt-1"><button onClick={()=>{setCart(c=>c+1); show('أضيف ✓')}} className="px-6 py-3 rounded-full bg-white text-black font-bold">احصل الآن</button><button onClick={()=>setShareItem(s)} className="px-4 py-3 rounded-full bg-white/15 border border-white/20 backdrop-blur text-sm">مشاركة ↗</button></div></div><img src={s.img} className="w-[86%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px] border border-white/10 shadow-2xl"/></div></div>)}</div></div>

  <div className="max-w-7xl mx-auto px-4 mt-5 flex gap-2.5 overflow-x-auto scrollbar-hide py-2">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-10 rounded-full text-[13px] border font-bold transition-all ${cat===c.n?(c.mauve?'bg-[#8B5CF6] text-white border-violet-400 shadow-[0_6px_16px_-6px_#8B5CF6]':'bg-black text-white border-black'):'bg-white border-violet-100 hover:border-violet-200'}`}>{c.i} {c.n}</button>)}</div>

  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-6 pb-28 mt-3">
   <div>
    {cat==='المساعد الاقتصادي'?(
     <div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 rounded-[28px] p-6 text-white relative overflow-hidden"><div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"/><h3 className="font-black text-xl relative">🤖 المساعد الاقتصادي</h3><p className="text-sm opacity-90 mt-2 leading-6 relative">أقارن لك تلقائيا بين متجر حكيم + عروضكم + حراج</p><div className="mt-5 grid gap-2 relative"><div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-3 text-sm">💜 متجر حكيم أوفر 43% على العطور</div><div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-sm">🏷️ حراج: كنب يوفر 1499 ر.س</div><div className="bg-white/10 border border-white/15 rounded-2xl p-3 text-sm">🛒 عروضكم: زيت 19 ر.س أرخص سعر</div></div><input placeholder="اكتب: وين أوفر عطر؟" className="w-full mt-5 h-12 px-4 rounded-full bg-white text-black text-sm outline-none"/></div>
    ):(
     <div className="grid grid-cols-2 gap-4">{filtered.map(o=><div key={o.id} className="bg-white rounded-[22px] border border-violet-50 overflow-hidden shadow-[0_8px_24px_-12px_rgba(139,92,246,0.15)] hover:shadow-[0_12px_32px_-12px_rgba(139,92,246,0.25)] transition-all"><div className="relative"><img src={o.image} className="h-40 w-full object-cover"/><span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black text-white ${o.mauve?'bg-[#8B5CF6]':'bg-black'}`}>-{o.discount}%</span><button onClick={()=>setShareItem(o)} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur grid place-items-center text-sm shadow">↗</button>{o.isOwn&&<span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-full text-[10px] font-bold bg-[#8B5CF6] text-white">متجر حكيم</span>}</div><div className="p-3"><div className="text-[11px] text-zinc-500">{o.store}</div><div className="font-bold text-[13px] mt-1 leading-snug">{o.title}</div><div className="flex justify-between items-center mt-3"><span className="font-black text-[#7C3AED]">{o.price} ر.س</span><button onClick={()=>{setCart(c=>c+1); show('أضيف للسلة')}} className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">+</button></div></div></div>)}</div>
    )}
   </div>

   <div className="space-y-4">
    <div className="bg-white rounded-[22px] border border-violet-100 p-4 shadow-sm"><div className="font-black text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>مشاركة سريعة</div><p className="text-xs text-zinc-500 mt-2 leading-5">شارك أي عرض واكسب 5 نقاط. رابط مكتبك ينضاف تلقائيا.</p><button onClick={()=>{if(filtered[0]) setShareItem(filtered[0])}} className="w-full mt-3 h-11 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-black shadow">💜 مشاركة أول عرض</button></div>
    <div className="bg-gradient-to-br from-[#1A1033] via-[#3B1F75] to-[#7C3AED] rounded-[22px] p-5 text-white relative overflow-hidden"><div className="absolute -bottom-16 -right-16 w-48 h-48 bg-fuchsia-400/20 rounded-full blur-2xl"/><h4 className="font-bold text-sm relative">🏡 مكتبي العقاري</h4><p className="text-[12px] leading-5 opacity-90 mt-2 relative">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة<br/><span className="font-black">(محسن الحكمي)</span></p><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-3 inline-flex h-9 px-4 rounded-full bg-white text-[#5B21B6] text-xs font-black items-center gap-1 relative">فتح الملف العقاري ↗</a></div>
   </div>
  </div>

  {shareItem && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShareItem(null)}><div className="w-full max-w-[360px] bg-white rounded-[28px] p-5 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center"><h3 className="font-black">مشاركة العرض 💜</h3><button onClick={()=>setShareItem(null)} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">✕</button></div><div className="mt-4 flex gap-3"><img src={shareItem.image||HERO[0].img} className="w-16 h-16 rounded-xl object-cover"/><div><div className="font-bold text-sm leading-tight">{shareItem.title||shareItem.t}</div><div className="text-xs text-zinc-500 mt-1">{shareItem.store} • {shareItem.price} ر.س</div></div></div><div className="grid grid-cols-2 gap-2.5 mt-5"><button onClick={()=>doShare('whatsapp')} className="h-12 rounded-full bg-[#25D366] text-white font-bold text-sm flex items-center justify-center gap-2">واتساب</button><button onClick={()=>doShare('telegram')} className="h-12 rounded-full bg-[#229ED9] text-white font-bold text-sm">تيليجرام</button><button onClick={()=>doShare('copy')} className="h-12 rounded-full bg-zinc-900 text-white font-bold text-sm">نسخ الرابط</button><button onClick={()=>doShare('native')} className="h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm">مشاركة النظام</button></div><p className="text-[11px] text-zinc-400 text-center mt-3 leading-4">يتم إضافة رابط مكتبك العقاري تلقائيا<br/>https://dealapp.sa/...</p></div></div>}

  {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-full text-sm shadow-xl z-[60]">{toast}</div>}

  <div className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-violet-100 md:hidden"><div className="grid grid-cols-5 h-[72px] text-[11px]"><div className="flex flex-col items-center justify-center text-[#8B5CF6] font-black"><span className="text-xl">🏠</span>الرئيسية</div><div className="flex flex-col items-center justify-center text-zinc-400"><span className="text-xl">🏷️</span>العروض</div><div className="flex flex-col items-center justify-center text-zinc-400"><span className="text-xl">🎟️</span>كوبونات</div><div className="flex flex-col items-center justify-center text-zinc-400"><span className="text-xl">⭐</span>نقاطي</div><div className="flex flex-col items-center justify-center text-zinc-400"><span className="text-xl">🤖</span>المساعد</div></div></div>
 </div>)
}
