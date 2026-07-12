"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }

// التصنيفات في مربع واحد - بدون الكل والالكترونيات
const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI = [
 {name:'متجر حكيم', rating:4.9, offers:24, tag:'مفعل'},
 {name:'بنده', rating:4.8, offers:128, tag:''},
 {name:'العثيم', rating:4.7, offers:96, tag:''},
 {name:'جرير', rating:4.9, offers:112, tag:''},
 {name:'نون', rating:4.6, offers:210, tag:''},
 {name:'نعناع', rating:4.7, offers:54, tag:''},
]

const BEST_ELEC = [
 {name:'جرير', rating:4.9, del:'توصيل اليوم'},
 {name:'اكسترا', rating:4.8, del:'توصيل مجاني'},
 {name:'نون الكترونيات', rating:4.6, del:'خصم 15 بالمئة'},
 {name:'امازون', rating:4.7, del:'برايم'},
 {name:'ردسي', rating:4.8, del:'اقساط'},
 {name:'STC', rating:4.5, del:'عروض باقات'},
]

const MARKETS = [
 {n:'مطاعم', c:42, d:'هنقرستيشن وجاهز'},
 {n:'ملابس', c:86, d:'شي ان ونمشي'},
 {n:'سوبرماركت', c:128, d:'بنده والعثيم'},
 {n:'الكترونيات', c:64, d:'جوالات ولابتوب'},
]

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي مع محفظة جلد فاخر', p:399, old:649, img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900', g:'from-emerald-600 to-green-700'},
 {store:'جرير', d:45, t:'ايباد برو M2', p:2199, old:3999, img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900', g:'from-blue-600 to-indigo-700'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد طبيعي مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'وجبة عائلية',store:'هنقرستيشن',category:'مطاعم',price:69,old_price:120,discount:42,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',lat:21.53,lng:39.18,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [dark,setDark]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a', t:string, offers?:Offer[]}[]>([{role:'a', t:'اهلا انا المساعد الاقتصادي. اسالني وين اوفر او قل ميزانيتي 300 وانا اقترح لك افضل عروض توفر فلوسك.'}])

 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%3),4000);return()=>clearInterval(t)},[])
 const fontSize = font==='sm'?'15px':font==='lg'?'19px':'17.5px'
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}

 const filtered = useMemo(()=>{let l=cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn):OFFERS.filter(o=>o.category===cat||o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist)} return l},[cat,loc,nearby])

 const ask=(text:string)=>{if(!text.trim()) return; setMsgs(m=>[...m,{role:'u',t:text}]); setQ(''); const qq=text.toLowerCase(); let res:Offer[]=[]; let ans=''; if(qq.includes('حكيم')){res=OFFERS.filter(o=>o.isOwn); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`لقيت ${res.length} عروض من متجر حكيم توفر ${save} ريال.`} else if(qq.includes('وفر')||qq.includes('رخيص')){res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`اوفر 3 عروض توفر ${save} ريال خصم حتى ${res[0].discount} بالمئة.`} else if(qq.match(/ميزانية|(\d+)/)){const n=parseInt(qq.match(/(\d+)/)?.[1]||'300'); res=OFFERS.filter(o=>o.price<=n).slice(0,3); ans=res.length?`على ميزانية ${n} ريال هذه افضل خيارات:`:`ما لقيت تحت ${n} ريال`} else if(qq.includes('قريب')){if(loc?.enabled){res=[...OFFERS].map(o=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)} as any)).sort((a:any,b:any)=>a.dist-b.dist).slice(0,3) as any; ans=`اقرب 3 عروض لك يبعد اقرب واحد ${(res[0] as any).dist?.toFixed(1)} كم`}else{ans=`فعل موقعك اولا عشان اجيب الاقرب`} } else {res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); ans=`اقترحت اعلى 3 خصومات.`} setTimeout(()=>setMsgs(m=>[...m,{role:'a',t:ans,offers:res}]),300)}

 const requestLoc=()=>{if(!navigator.geolocation){show('المتصفح لا يدعم الموقع');return} navigator.geolocation.getCurrentPosition(p=>{const v={lat:p.coords.latitude,lng:p.coords.longitude,enabled:true}; setLoc(v); show('تم تفعيل الموقع')},()=>show('فعل GPS'))}

 return(<div dir="rtl" style={{fontSize}} className={`min-h-screen leading-7 ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروض<span className="text-[#6D28D9]">كم</span></div><div className="flex gap-2 items-center"><button onClick={()=>setFont(f=>f==='base'?'lg':f==='lg'?'sm':'base')} className="w-10 h-10 rounded-full border grid place-items-center bg-white dark:bg-zinc-800">أأ</button><button onClick={()=>setDark(!dark)} className="w-10 h-10 rounded-full border grid place-items-center bg-white dark:bg-zinc-800">{dark?'نهار':'ليل'}</button><button onClick={requestLoc} className={`px-3 h-10 rounded-full border text-xs font-bold ${loc?.enabled?'bg-emerald-600 text-white':'bg-white dark:bg-zinc-800'}`}>{loc?.enabled?'مفعل':'تفعيل الموقع'}</button><div className="px-4 h-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white grid place-items-center font-bold text-sm">السلة {cart}</div></div></div></header>

  <main className="max-w-7xl mx-auto px-3">
   <div className="mt-4 relative h-[320px] rounded-[32px] overflow-hidden bg-black text-white shadow-xl">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-7 gap-6 items-center"><div className="flex-1 space-y-3"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{s.store}</span><div className="text-3xl md:text-4xl font-black leading-tight">{s.t}</div><div className="flex gap-2 items-baseline"><span className="text-2xl font-black">{s.p} ر.س</span><span className="line-through opacity-60 text-sm">{s.old}</span></div><button onClick={()=>setCart(c=>c+1)} className="px-6 h-11 rounded-full bg-white text-black font-bold">احصل الان</button></div><img src={s.img} className="w-[88%] md:w-[38%] h-40 md:h-[75%] object-cover rounded-[24px]"/></div></div>)}</div>

   <div className="mt-6 grid md:grid-cols-3 gap-4">
    {/* مربع التصنيفات */}
    <div className={`rounded-[24px] border p-5 shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض - صفين</div><div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`h-[72px] rounded-2xl border font-bold text-xs leading-4 flex items-center justify-center text-center p-1 transition ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9] shadow-lg shadow-violet-200':'bg-zinc-50 border-zinc-100 hover:border-violet-200'} ${dark&&cat!==c.n?'!bg-zinc-800!border-zinc-700':''}`}>{c.n}</button>)}</div></div>

    {/* افضل متاجر السعودية */}
    <div className={`rounded-[24px] border p-5 shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><h3 className="font-black">افضل متاجر السعودية</h3><div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.map(s=><div key={s.name} className={`rounded-2xl border p-2.5 text-center ${s.name==='متجر حكيم'?'bg-violet-50 border-violet-200 ring-1 ring-violet-200':'bg-zinc-50 border-zinc-100'} ${dark?'!bg-zinc-800!border-zinc-700':''}`}><div className="font-bold text-xs">{s.name} {s.tag==='مفعل'&&<span className="text-[9px] px-1 py-0.5 rounded-full bg-[#6D28D9] text-white">مفعل</span>}</div><div className="text-[11px] opacity-60 mt-0.5">{s.rating} - {s.offers} عرض</div></div>)}</div></div>

    {/* افضل المتاجر الالكترونية */}
    <div className={`rounded-[24px] border p-5 shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><h3 className="font-black">افضل المتاجر الالكترونية</h3><div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.map(s=><div key={s.name} className={`rounded-2xl border p-3 flex justify-between items-center bg-zinc-50 border-zinc-100 ${dark?'!bg-zinc-800!border-zinc-700':''}`}><div><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60">{s.del}</div></div><span className="text-[11px] px-2 py-1 rounded-full bg-white border">{s.rating}</span></div>)}</div></div>
   </div>

   <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-6">
    <div>
     <div className="flex justify-between items-center"><h3 className="font-black">{cat}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)} className="accent-violet-600"/> العروض القريبة فقط اقل من 10 كم</label></div>
     <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className={`rounded-[20px] border overflow-hidden bg-white ${dark?'!bg-zinc-900!border-zinc-800':''} ${o.isOwn?'ring-1 ring-violet-200 border-violet-200':''}`}><div className="relative"><img src={o.image} className="h-44 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#6D28D9] text-white text-xs font-bold">-{o.discount}%</span>{o.dist!=null&&<span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs">يبعد {o.dist.toFixed(1)} كم</span>}</div><div className="p-3"><div className="text-xs opacity-60">{o.store} - {o.city}</div><div className="font-bold text-sm mt-1 leading-5">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-[#6D28D9]">{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-9 h-9 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div>
    </div>

    <aside className="md:sticky md:top-16 h-fit">
     <div className={`rounded-[24px] border overflow-hidden flex flex-col h-[560px] shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100'}`}><div className="p-4 bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white"><div className="font-black">المساعد الاقتصادي</div><div className="text-xs opacity-90 mt-1">يرد عليك ويقترح عروض ويحسب توفيرك</div><div className="mt-3 flex gap-1.5 flex-wrap">{['وين اوفر','اقترح عروض حكيم','ميزانية 300','العروض القريبة'].map(t=><button key={t} onClick={()=>ask(t)} className="px-2.5 py-1 rounded-full bg-white/15 border-white/20 text-[11px]">{t}</button>)}</div></div><div className="flex-1 overflow-auto p-3 space-y-3 bg-violet-50/30 dark:bg-zinc-950/30">{msgs.map((m,i)=><div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-6 ${m.role==='u'?'mr-auto bg-zinc-900 text-white':'ml-auto bg-white border border-violet-100'}`}><div className="whitespace-pre-line">{m.t}</div>{m.offers&&<div className="mt-2 space-y-2">{m.offers.map((o:any)=><div key={o.id} className="flex gap-2 p-2 rounded-xl bg-zinc-50 border"><img src={o.image} className="w-11 h-11 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-xs leading-4">{o.title}</div><div className="text-xs font-bold mt-0.5">{o.price} ر.س توفر {o.old_price-o.price}</div></div></div>)}</div>}</div>)}</div><div className="p-3 border-t flex gap-2 bg-white dark:bg-zinc-900"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)} placeholder="اسال وين ارخص" className="flex-1 h-11 px-4 rounded-full bg-zinc-100 dark:bg-zinc-800 outline-none text-sm"/><button onClick={()=>ask(q)} className="w-11 h-11 rounded-full bg-[#6D28D9] text-white font-bold">ارسال</button></div></div>
    </aside>
   </div>
  </main>
  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
}
