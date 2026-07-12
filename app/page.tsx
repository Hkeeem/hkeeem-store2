"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }
type StoreRank = { name:string; rating:number; offers:number; strength:number; tag?:string }

const CREAM_BG = "#FFFBF0"
const CARD_BG = "#FFFEFB"
const CARD_SOFT = "#FFF8EC"
const BORDER_CREAM = "#F5E6D3"
const VIOLET = "#6D28D9"

const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
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
 {name:'ردسي', rating:4.8, offers:60, strength:80},
 {name:'STC', rating:4.5, offers:40, strength:65},
]

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة فاخرة', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-violet-600 to-purple-700'},
 {store:'جرير', d:45, t:'ايباد برو M2', p:2199, old:3999, img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', g:'from-violet-700 to-indigo-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'وجبة عائلية دجاج مع رز',store:'هنقرستيشن',category:'مطاعم',price:69,old_price:120,discount:42,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [dark,setDark]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [openStores,setOpenStores]=useState<null|'saudi'|'elec'>(null); const [speaking,setSpeaking]=useState(false);
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a', t:string}[]>([{role:'a', t:'اهلا انا المساعد الاقتصادي اسالني وين اوفر'}])

 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%3),4000);return()=>clearInterval(t)},[])
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}
 const filtered = useMemo(()=>{let l=cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn):OFFERS.filter(o=>o.category===cat||o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12)} return l},[cat,loc,nearby])

 const speak = (text:string)=>{ if(!('speechSynthesis' in window)) {show('المتصفح لا يدعم النطق'); return} window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ar-SA'; u.rate=0.9; u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false); window.speechSynthesis.speak(u); }

 const openSaudi = ()=>{ const sorted=[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength); setOpenStores('saudi'); const txt=`عروض المتاجر الاقوى بالترتيب . الترتيب الاول ${sorted[0].name} بقوة ${sorted[0].strength} . الثاني ${sorted[1].name} . الثالث ${sorted[2].name} . اضغط على اي متجر لعرض عروضه`; setTimeout(()=>speak(txt),300); }
 const openElec = ()=>{ const sorted=[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); setOpenStores('elec'); const txt=`عروض المتاجر الالكترونية الاقوى . الاول ${sorted[0].name} بقوة ${sorted[0].strength} . الثاني ${sorted[1].name}`; setTimeout(()=>speak(txt),300); }

 return(<div dir="rtl" style={{background: dark ? '#09090b' : CREAM_BG}} className={`min-h-screen leading-7 ${dark?'text-zinc-100':'text-zinc-900'}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FFFEFB]/90'}`} style={{borderColor: BORDER_CREAM}}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروض<span style={{color:VIOLET}}>كم</span></div><div className="flex gap-2 items-center"><button onClick={()=>setDark(!dark)} className="w-10 h-10 rounded-full border bg-white grid place-items-center">{dark?'نهار':'ليل'}</button><button onClick={()=>{if(!navigator.geolocation){show('لا يدعم الموقع');return} navigator.geolocation.getCurrentPosition(p=>{setLoc({lat:p.coords.latitude,lng:p.coords.longitude,enabled:true}); show('تم تفعيل الموقع')})}} className={`px-3 h-10 rounded-full border text-xs font-bold ${loc?.enabled?'bg-emerald-600 text-white':'bg-white'}`}>{loc?.enabled?'مفعل':'تفعيل الموقع'}</button><div className="px-4 h-10 rounded-full text-white grid place-items-center font-bold text-sm" style={{background:`linear-gradient(to right, ${VIOLET}, #A21CAF)`}}>السلة {cart}</div></div></div></header>

  <main className="max-w-7xl mx-auto px-3 pb-24">
   <div className="mt-4 relative h-[300px] rounded-[24px] overflow-hidden bg-black text-white shadow-xl">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-6 gap-4 items-center"><div className="flex-1 space-y-2"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{s.store}</span><div className="text-2xl md:text-3xl font-black">{s.t}</div><div className="flex gap-2 items-baseline"><span className="text-xl font-black">{s.p} ر.س</span><span className="line-through opacity-60 text-sm">{s.old}</span></div><button onClick={()=>setCart(c=>c+1)} className="px-6 h-10 rounded-full bg-white text-black font-bold text-sm">احصل الان</button></div><img src={s.img} className="w-[90%] md:w-[36%] h-36 md:h-[70%] object-cover rounded-[16px]"/></div></div>)}</div>

   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className="rounded-[24px] border p-5" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض - صفين</div><div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className="h-16 rounded-2xl border font-bold text-xs text-center p-1" style={{background: cat===c.n?VIOLET:CARD_SOFT, color: cat===c.n?'white':'black', borderColor: cat===c.n?VIOLET:'#F0DCC3'}}>{c.n}</button>)}</div></div>

    <button onClick={openSaudi} className="rounded-[24px] border p-5 text-right w-full text-left hover:shadow-md transition" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="flex justify-between items-center"><h3 className="font-black">افضل متاجر السعودية</h3><span className="text-xs px-2 py-1 rounded-full text-white" style={{background:VIOLET}}>اضغط للفتح ويتحدث</span></div><div className="text-xs opacity-60 mt-1">اذا لمست الملف يفتح ويظهر المتاجر الاقوى بالترتيب ويتحدث</div><div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.map(s=><div key={s.name} className="rounded-2xl border p-2.5 text-center" style={{background: s.name==='متجر حكيم'?'#F5F0FF':CARD_SOFT, borderColor:'#E9D5FF'}}><div className="font-bold text-xs">{s.name} {s.tag==='مفعل'&&<span className="text-[9px] px-1 py-0.5 rounded-full text-white" style={{background:VIOLET}}>مفعل</span>}</div><div className="text-[11px] opacity-60 mt-0.5">{s.rating} - {s.offers} عرض</div></div>)}</div></button>

    <button onClick={openElec} className="rounded-[24px] border p-5 text-right w-full text-left hover:shadow-md transition" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="flex justify-between items-center"><h3 className="font-black">افضل المتاجر الالكترونية</h3><span className="text-xs px-2 py-1 rounded-full bg-zinc-900 text-white">يتحدث</span></div><div className="text-xs opacity-60 mt-1">ترتيب حسب قوة العروض</div><div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.slice(0,4).map(s=><div key={s.name} className="rounded-2xl border p-3" style={{background:CARD_SOFT, borderColor:'#F0DCC3'}}><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60">قوة {s.strength}</div></div>)}</div></button>
   </div>

   <div className="mt-6 rounded-[24px] border p-5 flex flex-col md:flex-row justify-between items-center gap-3" style={{background: `linear-gradient(to right, #FFFEFB, #FFF3E0)`, borderColor: BORDER_CREAM}}><div><div className="font-black">المكتب العقاري - محسن الحكمي - وسيط معتمد</div><div className="text-xs opacity-70 mt-1">جدة - توثيق عقود - تسويق احترافي</div></div><div className="flex gap-2"><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="px-5 h-10 rounded-full text-white text-sm font-bold grid place-items-center" style={{background:VIOLET}}>فتح الملف العقاري</a><button onClick={()=>speak('المكتب العقاري محسن الحكمي وسيط معتمد في جدة')} className="px-4 h-10 rounded-full border bg-white text-xs font-bold">استماع</button></div></div>

   <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-6"><div><div className="flex justify-between items-center"><h3 className="font-black">{cat}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)}/> القريبة فقط</label></div><div className="mt-3 grid grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className="rounded-2xl border overflow-hidden" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="relative"><img src={o.image} className="h-40 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-xs font-bold" style={{background:VIOLET}}>-{o.discount}%</span></div><div className="p-3"><div className="text-xs opacity-60">{o.store}</div><div className="font-bold text-sm">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black" style={{color:VIOLET}}>{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-8 h-8 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div></div><aside className="rounded-[24px] border p-4 h-fit" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="font-bold text-sm">المساعد الاقتصادي</div><div className="mt-2 flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="وين اوفر" className="flex-1 h-10 px-3 rounded-full border text-xs outline-none" style={{background:CARD_SOFT, borderColor:'#F0DCC3'}}/><button onClick={()=>{if(!q) return; setMsgs(m=>[...m,{role:'u',t:q},{role:'a',t:'اقترحت لك عروض توفر'}]); setQ('')}} className="w-10 h-10 rounded-full text-white" style={{background:VIOLET}}>ارسال</button></div></aside></div>
  </main>

  {openStores&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}}><div onClick={e=>e.stopPropagation()} className="w-full max-w-[420px] rounded-[24px] p-5 max-h-[80vh] overflow-auto" style={{background: CARD_BG, border:`1px solid ${BORDER_CREAM}`}}><div className="flex justify-between items-center"><h3 className="font-black">{openStores==='saudi'?'عروض المتاجر - الاقوى بالترتيب':'عروض المتاجر الالكترونية - الاقوى'}</h3><button onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">اغلاق</button></div><div className="mt-3 flex gap-2"><button onClick={()=>{const sorted=openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); const t=sorted.map((s,i)=>`الترتيب ${i+1} ${s.name} بقوة ${s.strength}`).join(' . '); speak(t)}} className="px-3 h-9 rounded-full text-white text-xs font-bold" style={{background:VIOLET}}>{speaking?'يتحدث الان':'اعادة التحدث'}</button></div><div className="mt-4 space-y-2.5">{(openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength)).map((s,i)=><div key={s.name} className="rounded-2xl border p-4 flex justify-between items-center" style={{background: i===0?'#F5F0FF':CARD_SOFT, borderColor: i===0?'#DDD6FE':'#F0DCC3'}}><div className="flex gap-3 items-center"><span className="w-8 h-8 rounded-full grid place-items-center font-black text-xs" style={{background: i===0?VIOLET:i===1?'#27272a':'#e4e4e7', color: i<=1?'white':'black'}}>{i+1}</span><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.rating} تقييم - {s.offers} عرض</div></div></div><div className="text-right"><div className="font-black text-sm" style={{color:VIOLET}}>قوة {s.strength}</div><button onClick={()=>{setCat(s.name); setOpenStores(null); window.speechSynthesis.cancel();}} className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 text-white mt-1">شوف العروض</button></div></div>)}</div></div></div>}

  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
}
