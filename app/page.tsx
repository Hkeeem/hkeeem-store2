"use client"
import { useEffect, useState } from 'react'

const HERO=[
 {store:'متجر حكيم',d:40,t:'عطر حكيم الملكي + محفظة جلد',p:399,old:649,code:'HKEEM20',img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',g:'from-violet-600 via-fuchsia-600 to-indigo-600'},
 {store:'عروضكم',d:60,t:'كل عروض المملكة في مكان واحد',p:0,old:0,code:'AROOD60',img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',g:'from-emerald-600 to-green-700'},
 {store:'عروض حراج',d:55,t:'مستعمل نظيف - شبه جديد',p:1200,old:2699,code:'HARAJ55',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',g:'from-violet-700 via-purple-600 to-indigo-700'},
]

const CATS=[
 {n:'الكل',i:'✨'},
 {n:'متجر حكيم',i:'💜',mauve:true},
 {n:'عروضكم',i:'🛒'},
 {n:'المساعد الاقتصادي',i:'🤖',mauve:true},
 {n:'عروض حراج',i:'🏷️',mauve:true},
]

const MOCK=[
 {id:1,title:'عطر حكيم الملكي 100مل',store:'متجر حكيم',category:'متجر حكيم',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',mauve:true},
 {id:2,title:'محفظة جلد + ساعة',store:'متجر حكيم',category:'متجر حكيم',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',mauve:true},
 {id:3,title:'سلة التوفير الكبرى',store:'عروضكم',category:'عروضكم',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'},
 {id:4,title:'كنب مستعمل نظيف 3 قطع',store:'عروض حراج',category:'عروض حراج',price:1200,old_price:2699,discount:55,image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',mauve:true},
]

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('الكل'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [shareItem,setShareItem]=useState<any>(null);
 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[]);
 const filtered = cat==='الكل'? MOCK : cat==='المساعد الاقتصادي'? [] : MOCK.filter(o=>o.category===cat);
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2000)};

 const getShareText=(o:any)=>{
  return `🔥 ${o.title} - ${o.price} ر.س بدل ${o.old_price} (خصم ${o.discount}%)\nمن ${o.store} عبر عروضكم 💜\nوفر الآن: https://e2.vercel.app?offer=${o.id}\n🏡 مكتب محسن الحكمي العقاري: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4`
 };
 const doShare=(type:string)=>{
  if(!shareItem) return; const text=getShareText(shareItem); const url=`https://e2.vercel.app?offer=${shareItem.id}`;
  if(type==='whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');
  else if(type==='telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,'_blank');
  else if(type==='copy'){navigator.clipboard.writeText(text); show('تم نسخ رابط المشاركة 💜'); setShareItem(null);}
  else if(type==='native' && (navigator as any).share) (navigator as any).share({title:shareItem.title,text,url}).catch(()=>{});
 };

 return (<div className="min-h-screen bg-[#FFFBFF]">
  <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-violet-100"><div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center"><div className="font-black text-xl">عروض<span className="text-[#8B5CF6]">كم</span></div><div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm">السلة {cart}</div></div></header>

  <div className="max-w-7xl mx-auto px-3 mt-5"><div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-black text-white shadow-[0_20px_60px_-20px_rgba(139,92,246,0.5)]">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-all duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-7 gap-6 items-center"><div className="flex-1 space-y-3"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{s.store}</span><div className="text-5xl font-black">خصم {s.d}%</div><div className="text-xl font-bold">{s.t}</div><div className="flex gap-2"><button onClick={()=>{setCart(c=>c+1); show('أضيف ✓')}} className="px-6 py-3 rounded-full bg-white text-black font-bold">احصل الآن</button><button onClick={()=>setShareItem({id:0,title:s.t,price:s.p,old_price:s.old,store:s.store,discount:s.d,image:s.img})} className="px-4 py-3 rounded-full bg-white/15 border border-white/20 text-sm">مشاركة ↗</button></div></div><img src={s.img} className="w-[85%] md:w-[42%] h-56 md:h-full object-cover rounded-[24px]"/></div></div>)}</div></div>

  <div className="max-w-7xl mx-auto px-4 mt-6 flex gap-3 overflow-x-auto py-2">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`whitespace-nowrap px-5 h-10 rounded-full text-sm border font-bold ${cat===c.n?(c.mauve?'bg-[#8B5CF6] text-white border-violet-400 shadow-[0_6px_16px_-6px_#8B5CF6]':'bg-black text-white'):'bg-white border-violet-100'}`}>{c.i} {c.n}</button>)}</div>

  <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1fr_340px] gap-6 pb-28 mt-4">
   <div>{cat==='المساعد الاقتصادي'? (<div className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 rounded-[28px] p-6 text-white"><h3 className="font-black text-xl">🤖 المساعد الاقتصادي</h3><p className="text-sm opacity-90 mt-2">أقارن لك بين متجر حكيم + عروضكم + حراج</p><input placeholder="وين أرخص ساعة؟" className="w-full mt-4 h-12 px-4 rounded-full bg-white text-black text-sm outline-none"/></div>):(<div className="grid grid-cols-2 gap-4">{filtered.map(o=><div key={o.id} className="bg-white rounded-[20px] border border-violet-50 overflow-hidden"><div className="relative"><img src={o.image} className="h-40 w-full object-cover"/><span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black text-white ${o.mauve?'bg-[#8B5CF6]':'bg-black'}`}>-{o.discount}%</span><button onClick={()=>setShareItem(o)} className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 grid place-items-center shadow">↗</button></div><div className="p-3"><div className="text-[11px] text-zinc-500">{o.store}</div><div className="font-bold text-[13px] mt-1">{o.title}</div><div className="flex justify-between items-center mt-3"><span className="font-black text-[#7C3AED]">{o.price} ر.س</span><button onClick={()=>{setCart(c=>c+1); show('أضيف')}} className="w-8 h-8 rounded-full bg-black text-white">+</button></div></div></div>)}</div>)}</div>

   <div className="space-y-4">
    <div className="bg-white rounded-[20px] border border-violet-100 p-4"><div className="font-bold text-sm">💜 مشاركة سريعة</div><p className="text-xs text-zinc-500 mt-1">كل مشاركة = 5 نقاط + رابط مكتبك ينضاف تلقائيا</p><button onClick={()=>{if(filtered[0]) setShareItem(filtered[0])}} className="w-full mt-3 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold">مشاركة أول عرض</button></div>
    <div className="bg-gradient-to-br from-[#1A1033] via-[#3B1F75] to-[#7C3AED] rounded-[22px] p-5 text-white"><h4 className="font-bold text-sm">🏡 مكتبي العقاري</h4><p className="text-[12px] leading-5 opacity-90 mt-2">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة<br/>(محسن الحكمي)</p><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-3 inline-flex h-9 px-4 rounded-full bg-white text-[#5B21B6] text-xs font-black">فتح الملف العقاري ↗</a></div>
   </div>
  </div>

  {shareItem && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>setShareItem(null)}><div className="w-full max-w-[360px] bg-white rounded-[28px] p-5 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex justify-between items-center"><h3 className="font-black">مشاركة العرض 💜</h3><button onClick={()=>setShareItem(null)} className="w-8 h-8 rounded-full bg-zinc-100">✕</button></div><div className="mt-4 flex gap-3"><img src={shareItem.image} className="w-16 h-16 rounded-xl object-cover"/><div><div className="font-bold text-sm">{shareItem.title||shareItem.t}</div><div className="text-xs text-zinc-500 mt-1">{shareItem.store} • {shareItem.price} ر.س</div></div></div><div className="grid grid-cols-2 gap-2.5 mt-5"><button onClick={()=>doShare('whatsapp')} className="h-12 rounded-full bg-[#25D366] text-white font-bold text-sm">واتساب</button><button onClick={()=>doShare('telegram')} className="h-12 rounded-full bg-[#229ED9] text-white font-bold text-sm">تيليجرام</button><button onClick={()=>doShare('copy')} className="h-12 rounded-full bg-zinc-900 text-white font-bold text-sm">نسخ الرابط</button><button onClick={()=>doShare('native')} className="h-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-sm">مشاركة النظام</button></div><p className="text-[11px] text-zinc-400 text-center mt-3">يتم إضافة رابط مكتبك العقاري تلقائيا</p></div></div>}

  {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2.5 rounded-full text-sm z-[60]">{toast}</div>}
 </div>)
}
