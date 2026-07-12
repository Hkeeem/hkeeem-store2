"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }

const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI = [
 {name:'متجر حكيم', rating:4.9, offers:24, strength:95},
 {name:'بنده', rating:4.8, offers:128, strength:88},
 {name:'العثيم', rating:4.7, offers:96, strength:82},
 {name:'جرير', rating:4.9, offers:112, strength:90},
 {name:'نون', rating:4.6, offers:210, strength:85},
 {name:'نعناع', rating:4.7, offers:54, strength:70},
]

const BEST_ELEC = [
 {name:'جرير', rating:4.9, offers:112, strength:96},
 {name:'اكسترا', rating:4.8, offers:98, strength:92},
 {name:'نون الكترونيات', rating:4.6, offers:180, strength:88},
 {name:'امازون', rating:4.7, offers:150, strength:85},
 {name:'ردسي', rating:4.8, offers:60, strength:80},
 {name:'STC', rating:4.5, offers:40, strength:65},
]

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة جلد فاخر', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-violet-600 to-purple-700'},
 {store:'جرير', d:45, t:'ايباد برو M2', p:2199, old:3999, img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', g:'from-violet-700 to-indigo-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير بنده',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'وجبة عائلية دجاج مع رز',store:'هنقرستيشن',category:'مطاعم',price:69,old_price:120,discount:42,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',lat:21.53,lng:39.18,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [dark,setDark]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [openStores,setOpenStores]=useState<null|'saudi'|'elec'>(null); const [speaking,setSpeaking]=useState(false);
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a', t:string, offers?:Offer[]}[]>([{role:'a', t:'اهلا انا المساعد الاقتصادي. اسالني وين اوفر او قل ميزانيتي 300.'}])

 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%3),4000);return()=>clearInterval(t)},[])
 const fontSize = font==='sm'?'15px':font==='lg'?'19px':'17.5px'
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}

 const filtered = useMemo(()=>{let l=cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn):OFFERS.filter(o=>o.category===cat||o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist)} return l},[cat,loc,nearby])

 const speak = (text:string)=>{ if(!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang='ar-SA'; u.rate=0.9; u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false); window.speechSynthesis.speak(u); }

 const openSaudi = ()=>{ const sorted=[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength); setOpenStores('saudi'); const txt=`اقوى متاجر السعودية في العروض. الترتيب الاول ${sorted[0].name} بقوة ${sorted[0].strength} وتسعة عروض. الثاني ${sorted[1].name}. الثالث ${sorted[2].name}. اضغط على اي متجر لتشوف عروضه.`; setTimeout(()=>speak(txt),300); }
 const openElec = ()=>{ const sorted=[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); setOpenStores('elec'); const txt=`اقوى المتاجر الالكترونية. الاول ${sorted[0].name} بقوة ${sorted[0].strength}. الثاني ${sorted[1].name}. الثالث ${sorted[2].name}.`; setTimeout(()=>speak(txt),300); }

 const ask=(text:string)=>{if(!text.trim()) return; setMsgs(m=>[...m,{role:'u',t:text}]); setQ(''); const qq=text.toLowerCase(); let res:Offer[]=[]; let ans=''; if(qq.includes('حكيم')){res=OFFERS.filter(o=>o.isOwn); ans=`لقيت ${res.length} عروض حكيم.`} else if(qq.includes('وفر')){res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); ans=`اوفر 3 عروض خصم حتى ${res[0].discount} بالمئة.`} else {res=OFFERS.slice(0,3); ans=`اقترحت لك 3 عروض.`} setTimeout(()=>setMsgs(m=>[...m,{role:'a',t:ans,offers:res}]),300)}

 const requestLoc=()=>{if(!navigator.geolocation){show('المتصفح لا يدعم الموقع');return} navigator.geolocation.getCurrentPosition(p=>{setLoc({lat:p.coords.latitude,lng:p.coords.longitude,enabled:true}); show('تم تفعيل الموقع')},()=>show('فعل GPS'))}

 // الوان سكرية
 const bgMain = dark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#FFFBF0] text-zinc-900'
 const cardBg = dark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#FFFEFB] border-[#F5E6D3] shadow-sm'
 const cardSoft = dark ? 'bg-zinc-800 border-zinc-700' : 'bg-[#FFF8EC] border-[#F0DCC3]'

 return(<div dir="rtl" style={{fontSize}} className={`min-h-screen leading-7 ${bgMain}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FFFEFB]/90 border-[#F5E6D3]'}`}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span></div><div className="flex gap-2 items-center"><button onClick={()=>setFont(f=>f==='base'?'lg':'base')} className={`w-10 h-10 rounded-full border grid place-items-center ${cardSoft}`}>أأ</button><button onClick={()=>setDark(!dark)} className={`w-10 h-10 rounded-full border grid place-items-center ${cardSoft}`}>{dark?'نهار':'ليل'}</button><button onClick={requestLoc} className={`px-3 h-10 rounded-full border text-xs font-bold ${loc?.enabled?'bg-emerald-600 text-white':'bg-[#FFFEFB] dark:bg-zinc-800'}`}>{loc?.enabled?'مفعل':'تفعيل الموقع'}</button><div className="px-4 h-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white grid place-items-center font-bold text-sm">السلة {cart}</div></div></header>

  <main className="max-w-7xl mx-auto px-3">
   <div className="mt-4 relative h-[300px] rounded- overflow-hidden bg-black text-white shadow-xl">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-6 gap-4 items-center"><div className="flex-1 space-y-2"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{s.store}</span><div className="text-2xl md:text-3xl font-black leading-tight">{s.t}</div><div className="flex gap-2 items-baseline"><span className="text-xl font-black">{s.p} ر.س</span><span className="line-through opacity-60 text-sm">{s.old}</span></div><button onClick={()=>setCart(c=>c+1)} className="px-6 h-10 rounded-full bg-white text-black font-bold text-sm">احصل الان</button></div><img src={s.img} className="w-[90%] md:w-[36%] h-36 md:h-[70%] object-cover rounded-"/></div></div>)}</div>

   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className={`rounded- border p-5 ${cardBg}`}><h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض - صفين</div><div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`h-16 rounded-2xl border font-bold text-xs flex items-center justify-center text-center p-1 ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9] shadow-lg':'bg-[#FFF8EC] border-[#F0DCC3] hover:border-violet-300'} ${dark&&cat!==c.n?'!bg-zinc-800!border-zinc-700':''}`}>{c.n}</button>)}</div></div>

    {/* عروض المتاجر - يفتح ويتكلم */}
    <button onClick={openSaudi} className={`rounded- border p-5 text-right w-full text-left transition hover:shadow-md ${cardBg} hover:border-violet-300`}><div className="flex justify-between items-center"><h3 className="font-black">عروض المتاجر</h3><span className="text-xs px-2 py-1 rounded-full bg-[#6D28D9] text-white">اضغط للفتح</span></div><div className="text-xs opacity-60 mt-1">اذا لمست الملف يفتح ويظهر المتاجر الاقوى بالترتيب ويتحدث</div><div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.slice(0,6).map(s=><div key={s.name} className={`rounded-2xl border p-2.5 text-center ${s.name==='متجر حكيم'?'bg-violet-50 border-violet-200':'bg-[#FFF8EC] border-[#F0DCC3]'} ${dark?'!bg-zinc-800!border-zinc-700':''}`}><div className="font-bold text-xs">{s.name}</div><div className="text- opacity-60 mt-0.5">{s.rating} - {s.offers} عرض</div></div>)}</div></button>

    {/* عروض المتاجر الالكترونية */}
    <button onClick={openElec} className={`rounded- border p-5 text-right w-full text-left transition hover:shadow-md ${cardBg} hover:border-violet-300`}><div className="flex justify-between items-center"><h3 className="font-black">عروض المتاجر الالكترونية</h3><span className="text-xs px-2 py-1 rounded-full bg-zinc-900 text-white">يتحدث</span></div><div className="text-xs opacity-60 mt-1">ترتيب حسب قوة العروض والتوفير</div><div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.slice(0,4).map(s=><div key={s.name} className={`rounded-2xl border p-3 bg-[#FFF8EC] border-[#F0DCC3] ${dark?'!bg-zinc-800!border-zinc-700':''}`}><div className="font-bold text-xs">{s.name}</div><div className="text- opacity-60">{s.rating} - قوة {s.strength}</div></div>)}</div></button>
   </div>

   {/* المكتب العقاري رجع */}
   <div className={`mt-6 rounded- border p-5 flex flex-col md:flex-row justify-between items-center gap-3 ${dark?'bg-zinc-900 border-zinc-800':'bg-gradient-to-r from-[#FFFEFB] to-[#FFF3E0] border-[#F5E6D3]'}`}><div className="font-black">المكتب العقاري - محسن الحكمي</div><div className="text-xs opacity-70 mt-1">وسيط معتمد في جدة - استقبل طلباتكم وعروضكم العقارية</div></div><div className="flex gap-2"><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="px-5 h-10 rounded-full bg-[#6D28D9] text-white text-sm font-bold grid place-items-center">فتح الملف العقاري</a><button onClick={()=>speak('المكتب العقاري محسن الحكمي وسيط معتمد في جدة استقبل طلباتكم')} className="px-4 h-10 rounded-full border bg-white text-xs font-bold">استماع</button></div></div>

   <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-6 pb-20">
    <div><div className="flex justify-between items-center"><h3 className="font-black">{cat}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)} className="accent-violet-600"/> القريبة فقط اقل من 10 كم</label></div><div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className={`rounded-2xl border overflow-hidden ${cardBg}`}><div className="relative"><img src={o.image} className="h-44 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#6D28D9] text-white text-xs font-bold">-{o.discount}%</span>{o.dist!=null&&<span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs">يبعد {o.dist.toFixed(1)} كم</span>}</div><div className="p-3"><div className="text-xs opacity-60">{o.store} - {o.city}</div><div className="font-bold text-sm mt-1">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-[#6D28D9]">{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-9 h-9 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div></div>

    <aside className="md:sticky md:top-16 h-fit"><div className={`rounded-2xl border overflow-hidden flex flex-col h-[520px] ${cardBg}`}><div className="p-4 bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white"><div className="font-black">المساعد الاقتصادي</div><div className="text-xs opacity-90 mt-1">يرد ويقترح ويوفر لك</div></div><div className="flex-1 overflow-auto p-3 space-y-3 bg-[#FFFBF0]/50">{msgs.map((m,i)=><div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm ${m.role==='u'?'mr-auto bg-zinc-900 text-white':'ml-auto bg-white border border-[#F5E6D3]'}`}>{m.t}</div>)}</div><div className="p-3 border-t flex gap-2 bg-[#FFFEFB]"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)} placeholder="وين اوفر" className="flex-1 h-11 px-4 rounded-full bg-[#FFF8EC] border border-[#F0DCC3] outline-none text-sm"/><button onClick={()=>ask(q)} className="w-11 h-11 rounded-full bg-[#6D28D9] text-white font-bold">ارسال</button></div></div></aside>
   </div>
  </main>

  {openStores&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}}><div onClick={e=>e.stopPropagation()} className={`w-full max-w-[420px] rounded- p-5 max-h-[80vh] overflow-auto ${dark?'bg-zinc-900':'bg-[#FFFEFB] border border-[#F5E6D3]'}`}><div className="flex justify-between items-center"><h3 className="font-black">{openStores==='saudi'?'عروض المتاجر - الاقوى بالترتيب':'عروض المتاجر الالكترونية - الاقوى'}</h3><button onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">اغلاق</button></div><div className="mt-2 flex gap-2"><button onClick={()=>{const sorted=openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); const t=sorted.map((s,i)=>`الترتيب ${i+1} ${s.name} بقوة ${s.strength}`).join(' . '); speak(t)}} className="px-3 h-9 rounded-full bg-[#6D28D9] text-white text-xs font-bold">{speaking?'يتحدث الان':'اعادة التحدث'}</button><span className="text-xs opacity-60 self-center">الترتيب حسب قوة العروض والتوفير</span></div><div className="mt-4 space-y-2.5">{(openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength)).map((s,i)=><div key={s.name} className={`rounded-2xl border p-4 flex justify-between items-center ${i===0?'bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200':'bg-white border-[#F0DCC3]'} ${dark?'!bg-zinc-800!border-zinc-700':''}`}><div className="flex gap-3 items-center"><span className={`w-8 h-8 rounded-full grid place-items-center font-black text-xs ${i===0?'bg-[#6D28D9] text-white':i===1?'bg-zinc-800 text-white':'bg-zinc-200'}`}>{i+1}</span><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.rating} تقييم - {s.offers} عرض</div></div></div><div className="text-right"><div className="font-black text-sm text-[#6D28D9]">قوة {s.strength}</div><button onClick={()=>{setCat(s.name); setOpenStores(null); window.speechSynthesis.cancel();}} className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 text-white mt-1">شوف العروض</button></div></div>)}</div></div></div>}

  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
}
