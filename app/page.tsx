"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; city:string; isOwn?:boolean }
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
]

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة فاخرة', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-violet-600 to-purple-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,city:'جدة'},
 {id:3,title:'سلة التوفير',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',city:'جدة'},
]

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [dark,setDark]=useState(false);
 const [openStores,setOpenStores]=useState<null|'saudi'|'elec'>(null); const [speaking,setSpeaking]=useState(false);
 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%2),4000);return()=>clearInterval(t)},[])
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2000)}
 const filtered = useMemo(()=> cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn):OFFERS.filter(o=>o.category===cat||o.store===cat),[cat])
 const speak = (text:string)=>{ if(!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ar-SA'; u.rate=0.9; u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false); window.speechSynthesis.speak(u); }
 const openSaudi = ()=>{ const sorted=[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength); setOpenStores('saudi'); setTimeout(()=>speak(`عروض المتاجر الاقوى بالترتيب الترتيب الاول ${sorted[0].name} بقوة ${sorted[0].strength} الثاني ${sorted[1].name} الثالث ${sorted[2].name}`),300); }
 const openElec = ()=>{ const sorted=[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); setOpenStores('elec'); setTimeout(()=>speak(`عروض المتاجر الالكترونية الاقوى الاول ${sorted[0].name} بقوة ${sorted[0].strength}`),300); }

 return(<div dir="rtl" style={{background: dark? '#09090b' : CREAM_BG}} className={`min-h-screen ${dark?'text-zinc-100':'text-zinc-900'}`}>
  <header className="sticky top-0 z-30 backdrop-blur border-b" style={{background: dark? '#18181b' : CARD_BG, borderColor: BORDER_CREAM}}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروض<span style={{color:VIOLET}}>كم</span></div><div className="flex gap-2"><button onClick={()=>setDark(!dark)} className="w-10 h-10 rounded-full border bg-white">{dark?'نهار':'ليل'}</button><div className="px-4 h-10 rounded-full text-white grid place-items-center font-bold text-sm" style={{background:`linear-gradient(to right, ${VIOLET}, #A21CAF)`}}>السلة {cart}</div></div></div></header>
  <main className="max-w-7xl mx-auto px-3 pb-24">
   <div className="mt-4 relative h-[280px] rounded-3xl overflow-hidden bg-black text-white">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex p-6 gap-4 items-center"><div className="flex-1"><div className="text-2xl font-black">{s.t}</div><div className="mt-2"><span className="text-xl font-black">{s.p} ر.س</span> <span className="line-through opacity-60 text-sm">{s.old}</span></div></div><img src={s.img} className="w-[36%] h-[70%] object-cover rounded-2xl"/></div></div>)}</div>
   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className="rounded-3xl border p-5" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض - صفين</div><div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className="h-16 rounded-2xl border font-bold text-xs" style={{background: cat===c.n?VIOLET:CARD_SOFT, color: cat===c.n?'white':'black', borderColor: cat===c.n?VIOLET:'#F0DCC3'}}>{c.n}</button>)}</div></div>
    <button onClick={openSaudi} className="rounded-3xl border p-5 text-right w-full hover:shadow-md transition" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="flex justify-between"><h3 className="font-black">افضل متاجر السعودية</h3><span className="text-xs px-2 py-1 rounded-full text-white" style={{background:VIOLET}}>اضغط للفتح ويتحدث</span></div><div className="text-xs opacity-60 mt-1">اذا لمست الملف يفتح ويظهر المتاجر الاقوى بالترتيب ويتحدث</div><div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.map(s=><div key={s.name} className="rounded-2xl border p-2.5 text-center" style={{background: s.name==='متجر حكيم'?'#F5F0FF':CARD_SOFT, borderColor:'#E9D5FF'}}><div className="font-bold text-xs">{s.name} {s.tag==='مفعل'&&<span className="text-[9px] px-1 py-0.5 rounded-full text-white" style={{background:VIOLET}}>مفعل</span>}</div><div className="text-[11px] opacity-60 mt-0.5">{s.rating} - {s.offers} عرض</div></div>)}</div></button>
    <button onClick={openElec} className="rounded-3xl border p-5 text-right w-full hover:shadow-md transition" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><div className="flex justify-between"><h3 className="font-black">افضل المتاجر الالكترونية</h3><span className="text-xs px-2 py-1 rounded-full bg-zinc-900 text-white">يتحدث</span></div><div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.map(s=><div key={s.name} className="rounded-2xl border p-3" style={{background:CARD_SOFT, borderColor:'#F0DCC3'}}><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60">قوة {s.strength}</div></div>)}</div></button>
   </div>
   <div className="mt-6 rounded-3xl border p-5 flex flex-col md:flex-row justify-between items-center gap-3" style={{background: `linear-gradient(to right, #FFFEFB, #FFF3E0)`, borderColor: BORDER_CREAM}}><div><div className="font-black">المكتب العقاري - محسن الحكمي - وسيط معتمد</div><div className="text-xs opacity-70 mt-1">جدة - توثيق عقود - تسويق احترافي</div></div><div className="flex gap-2"><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="px-5 h-10 rounded-full text-white text-sm font-bold grid place-items-center" style={{background:VIOLET}}>فتح الملف العقاري</a><button onClick={()=>speak('المكتب العقاري محسن الحكمي وسيط معتمد في جدة')} className="px-4 h-10 rounded-full border bg-white text-xs font-bold">استماع</button></div></div>
   <div className="mt-6 grid grid-cols-2 gap-4">{filtered.map(o=><div key={o.id} className="rounded-2xl border overflow-hidden" style={{background: CARD_BG, borderColor: BORDER_CREAM}}><img src={o.image} className="h-40 w-full object-cover"/><div className="p-3"><div className="text-xs opacity-60">{o.store}</div><div className="font-bold text-sm">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black" style={{color:VIOLET}}>{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-8 h-8 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div>
  </main>
  {openStores&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}}><div onClick={e=>e.stopPropagation()} className="w-full max-w-[420px] rounded-3xl p-5 max-h-[80vh] overflow-auto" style={{background: CARD_BG, border:`1px solid ${BORDER_CREAM}`}}><div className="flex justify-between items-center"><h3 className="font-black">{openStores==='saudi'?'عروض المتاجر - الاقوى بالترتيب':'عروض المتاجر الالكترونية'}</h3><button onClick={()=>{setOpenStores(null); window.speechSynthesis.cancel();}} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">اغلاق</button></div><button onClick={()=>{const sorted=openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength); speak(sorted.map((s,i)=>`الترتيب ${i+1} ${s.name} بقوة ${s.strength}`).join('. '))}} className="mt-3 px-3 h-9 rounded-full text-white text-xs font-bold" style={{background:VIOLET}}>{speaking?'يتحدث الان':'اعادة التحدث'}</button><div className="mt-4 space-y-2.5">{(openStores==='saudi'?[...BEST_SAUDI].sort((a,b)=>b.strength-a.strength):[...BEST_ELEC].sort((a,b)=>b.strength-a.strength)).map((s,i)=><div key={s.name} className="rounded-2xl border p-4 flex justify-between items-center" style={{background: i===0?'#F5F0FF':CARD_SOFT, borderColor: i===0?'#DDD6FE':'#F0DCC3'}}><div className="flex gap-3 items-center"><span className="w-8 h-8 rounded-full grid place-items-center font-black text-xs" style={{background: i===0?VIOLET:'#e4e4e7', color: i===0?'white':'black'}}>{i+1}</span><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.rating} - {s.offers} عرض</div></div></div><div className="font-black text-sm" style={{color:VIOLET}}>قوة {s.strength}</div></div>)}</div></div></div>}
  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
}
