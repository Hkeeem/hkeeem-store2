"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; isOwn?:boolean; lat:number; lng:number; city:string; dist?:number }

const HERO = [
 {store:'متجر حكيم', d:40, t:'عطر حكيم الملكي + محفظة جلد فاخر', p:399, old:649, code:'HKEEM20', img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800', g:'from-violet-700 via-fuchsia-600 to-indigo-700'},
 {store:'بنده', d:55, t:'سلة التوفير الكبرى', p:89, old:199, code:'PANDA55', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', g:'from-emerald-600 to-green-700'},
 {store:'جرير', d:45, t:'آيباد برو M2 12.9', p:2199, old:3999, code:'J10', img:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', g:'from-blue-600 to-indigo-700'},
]

// صفين - 8 أقسام بدون الكل والإلكترونيات
const CATS_TWO_ROWS = [
 {n:'متجر حكيم', i:'💜'}, {n:'سوبرماركت', i:'🛒'},
 {n:'أزياء', i:'👗'}, {n:'مطاعم', i:'🍔'},
 {n:'ملابس', i:'👕'}, {n:'عطور', i:'🌸'},
 {n:'سفر', i:'✈️'}, {n:'صحة وجمال', i:'💄'},
]

const BEST_SAUDI = [
 {name:'متجر حكيم', icon:'💜', rating:4.9, offers:24, color:'from-violet-600 to-fuchsia-600', badge:'مفعّل'},
 {name:'بنده', icon:'🛒', rating:4.8, offers:128, color:'from-green-600 to-emerald-600'},
 {name:'العثيم', icon:'🏪', rating:4.7, offers:96, color:'from-orange-500 to-amber-500'},
 {name:'جرير', icon:'📚', rating:4.9, offers:112, color:'from-blue-600 to-indigo-600'},
 {name:'نون', icon:'🛍️', rating:4.6, offers:210, color:'from-yellow-500 to-orange-500'},
 {name:'نعناع', icon:'🌿', rating:4.7, offers:54, color:'from-lime-600 to-green-600'},
]

const BEST_ELEC = [
 {name:'جرير', icon:'📱', rating:4.9, del:'توصيل اليوم', color:'from-blue-600 to-cyan-600'},
 {name:'إكسترا', icon:'🔌', rating:4.8, del:'توصيل مجاني', color:'from-red-600 to-orange-600'},
 {name:'نون إلكترونيات', icon:'💻', rating:4.6, del:'خصم 15%', color:'from-zinc-800 to-black'},
 {name:'أمازون', icon:'📦', rating:4.7, del:'برايم', color:'from-sky-600 to-blue-700'},
 {name:'ردسي', icon:'🎧', rating:4.8, del:'أقساط', color:'from-violet-600 to-indigo-600'},
 {name:'STC', icon:'📶', rating:4.5, del:'عروض باقات', color:'from-purple-600 to-fuchsia-600'},
]

const MARKETS = [
 {n:'مطاعم', i:'🍔', c:42, d:'هنقرستيشن، جاهز، مرسول'},
 {n:'ملابس', i:'👕', c:86, d:'شي إن، نمشي، ستايلي'},
 {n:'سوبرماركت', i:'🛒', c:128, d:'بنده، العثيم، كارفور'},
 {n:'إلكترونيات', i:'📱', c:64, d:'جوالات، لابتوب، سماعات'},
 {n:'عطور ومكياج', i:'🌸', c:35, d:'عطور حكيم، سيفورا'},
 {n:'سفر وفنادق', i:'✈️', c:22, d:'تذاكر، فنادق، شاليهات'},
 {n:'ألعاب', i:'🎮', c:18, d:'بلايستيشن، ألعاب أطفال'},
 {n:'أثاث', i:'🏠', c:12, d:'ايكيا، هوم سنتر'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100مل - الأكثر مبيعاً',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد + ساعة فاخرة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير بنده',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'آيباد برو M2',store:'جرير',category:'إلكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'عرض هنقرستيشن - 2 وجبة',store:'هنقرستيشن',category:'مطاعم',price:49,old_price:89,discount:44,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات رجالي 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',lat:21.53,lng:39.18,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [a,setA]=useState(0); const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState<number>(0); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [dark,setDark]=useState(false); const [showFont,setShowFont]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a', t:string, offers?:Offer[]}[]>([{role:'a', t:'أهلاً محسن! أنا المساعد الاقتصادي 💰\nاسألني: وين أوفر؟ أو قل ميزانيتي 300، وأنا أقترح لك أفضل عروض توفر فلوسك.'}])

 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%3),4000);return()=>clearInterval(t)},[])
 useEffect(()=>{try{const f=localStorage.getItem('aro_font') as any; if(f) setFont(f); const d=localStorage.getItem('aro_dark'); if(d) setDark(d==='1')}catch{}},[])
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}
 const fontSize = font==='sm'?'15px':font==='lg'?'19px':'17.5px'

 const filtered = useMemo(()=>{let l=cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn||o.category===cat):OFFERS.filter(o=>o.category===cat || o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist)} return l},[cat,loc,nearby])

 const ask = (text:string)=>{
  if(!text.trim()) return
  setMsgs(m=>[...m,{role:'u', t:text}]); setQ('')
  const qq=text.toLowerCase()
  let res:Offer[]=[]; let ans=''
  if(qq.includes('حكيم')){res=OFFERS.filter(o=>o.isOwn); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`لقيت لك ${res.length} عروض من متجر حكيم المميز 💜 توفر ${save} ر.س إجمالاً. كلها تغليف فاخر وشحن مجاني جدة.`}
  else if(qq.includes('وفر')||qq.includes('رخيص')||qq.includes('توفير')){res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`أوفر 3 عروض لك الآن توفر ${save} ر.س:\n• خصم حتى ${res[0].discount}%`}
  else if(qq.match(/ميزانية|(\d+)/)){const num=parseInt(qq.match(/(\d+)/)?.[1]||'300'); res=OFFERS.filter(o=>o.price<=num).sort((a,b)=>b.discount-a.discount).slice(0,3); ans=res.length?`على ميزانية ${num} ر.س، هذي أفضل اختيارات توفر لك:`:`ما لقيت تحت ${num} ر.س، ارفعها لـ 400 وجرب`}
  else if(qq.includes('قريب')||qq.includes('قريبة')){if(loc?.enabled){res=[...OFFERS].map(o=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)} as any)).sort((a:any,b:any)=>a.dist-b.dist).slice(0,3) as any; ans=`أقرب 3 عروض لك في جدة 📍 يبعد أقرب واحد ${(res[0] as any).dist?.toFixed(1)} كم`}else{ans=`فعّل موقعك أول بالزر فوق 📍 عشان أجيب لك الأقرب ويحسب لك يبعد كم زي الصورة اللي أرسلتها (يبعد 25.6 كم)`; res=[]}}
  else if(qq.includes('مطعم')||qq.includes('اكل')){res=OFFERS.filter(o=>o.category==='مطاعم'); if(!res.length) res=OFFERS.slice(4,5); ans=`عروض مطاعم توفر لك لحد 44% 🍔`}
  else{res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); ans=`اقترحت لك أعلى 3 خصومات توفر أكثر 💰 خصم حتى ${res[0].discount}%`}
  setTimeout(()=>setMsgs(m=>[...m,{role:'a', t:ans, offers:res}]),400)
 }

 const requestLoc=()=>{if(!navigator.geolocation){show('المتصفح لا يدعم الموقع');return} setLoc({loading:true}); navigator.geolocation.getCurrentPosition(p=>{const v={lat:p.coords.latitude,lng:p.coords.longitude,enabled:true,loading:false}; setLoc(v); show(`تم تفعيل موقعك 📍 ${v.lat.toFixed(3)},${v.lng.toFixed(3)}`)},()=>show('فعل GPS'))}

 return(<div dir="rtl" style={{fontSize}} className={`min-h-screen leading-7 ${dark?'bg-zinc-950 text-zinc-100':'bg-[#FFFBFF] text-zinc-900'}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-violet-100'}`}><div className="max-w-7xl mx-auto px-4 h-[64px] flex justify-between items-center"><div className="font-black text-2xl">عروض<span className="text-[#6D28D9]">كم</span></div><div className="flex gap-2 items-center"><div className="relative"><button onClick={()=>setShowFont(!showFont)} className={`w-11 h-11 rounded-full border grid place-items-center font-black ${dark?'bg-zinc-800 border-zinc-700':'bg-white'}`}>أأ</button>{showFont&&<div className={`absolute left-0 top-12 w-36 rounded-2xl border shadow-xl p-2 z-50 ${dark?'bg-zinc-900':'bg-white'}`}><button onClick={()=>{setFont('sm');setShowFont(false)}} className="w-full h-9 rounded-full">صغير</button><button onClick={()=>{setFont('base');setShowFont(false)}} className={`w-full h-9 mt-1 rounded-full ${font==='base'?'bg-[#6D28D9] text-white':''}`}>متوسط</button><button onClick={()=>{setFont('lg');setShowFont(false)}} className="w-full h-9 mt-1 rounded-full">كبير</button></div>}</div><button onClick={()=>setDark(!dark)} className="w-11 h-11 rounded-full border grid place-items-center bg-white dark:bg-zinc-800">{dark?'☀️':'🌙'}</button><button onClick={requestLoc} className={`px-3 h-11 rounded-full border text-[13px] font-bold ${loc?.enabled?'bg-emerald-600 text-white':'bg-white dark:bg-zinc-800'}`}>{loc?.enabled?'مفعّل ✓':'تفعيل الموقع 📍'}</button><div className="px-4 h-11 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white grid place-items-center font-black">السلة {cart}</div></div></div></header>

  <main className="max-w-7xl mx-auto px-3">
   <div className="mt-4 relative h-[300px] md:h-[380px] rounded-[28px] overflow-hidden bg-black text-white shadow-xl">{HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===a?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex flex-col md:flex-row p-6 md:p-8 gap-4 items-center"><div className="flex-1 space-y-3"><span className="px-3 py-1 rounded-full bg-white text-black text-[11px] font-bold">{s.store} {s.store==='متجر حكيم'&&'💜'}</span><div className="text-[28px] md:text-5xl font-black leading-tight">{s.t}</div><div className="flex gap-2 items-baseline"><span className="text-2xl font-black">{s.p} ر.س</span><span className="line-through opacity-60 text-sm">{s.old}</span></div><div className="flex gap-2"><button onClick={()=>setCart(c=>c+1)} className="px-6 h-11 rounded-full bg-white text-black font-black">احصل الآن</button><button className="px-5 h-11 rounded-full bg-white/20 border border-white/30">مشاركة ↗</button></div></div><img src={s.img} className="w-[92%] md:w-[40%] h-44 md:h-[78%] object-cover rounded-[20px]"/></div></div>)}</div>

   {/* صفين - بدون الكل والإلكترونيات */}
   <div className="mt-6"><div className="font-black mb-3">الأقسام • صفين</div><div className="grid grid-cols-4 md:grid-cols-4 gap-3">{CATS_TWO_ROWS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`h-[84px] rounded-[18px] border flex flex-col items-center justify-center gap-1 font-bold transition-all ${cat===c.n?'bg-[#6D28D9] text-white border-[#6D28D9] scale-[1.02] shadow-lg':'bg-white border-violet-100 hover:border-violet-300'} ${dark&&cat!==c.n?'!bg-zinc-900!border-zinc-800':''}`}><span className="text-[22px]">{c.i}</span><span className="text-[12px]">{c.n}</span></button>)}</div></div>

   {/* أفضل متاجر السعودية */}
   <div className="mt-8"><div className="flex justify-between items-center"><h2 className="font-black text-[18px]">🏆 أفضل متاجر السعودية</h2><span className="text-[12px] opacity-60">موثوقة ومجربة</span></div><div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-3">{BEST_SAUDI.map(s=><div key={s.name} className={`rounded-[18px] border p-3 text-center ${s.name==='متجر حكيم'?'ring-2 ring-violet-300 bg-violet-50/50 border-violet-200':'bg-white border-zinc-100'} ${dark?'!bg-zinc-900!border-zinc-800':''}`}><div className={`w-11 h-11 mx-auto rounded-full bg-gradient-to-br ${s.color} grid place-items-center text-white text-[18px]`}>{s.icon}</div><div className="font-black text-[13px] mt-2">{s.name} {s.badge&&<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-600 text-white align-middle">{s.badge}</span>}</div><div className="text-[11px] opacity-60">★ {s.rating} • {s.offers} عرض</div></div>)}</div></div>

   {/* أفضل المتاجر الإلكترونية */}
   <div className="mt-8"><h2 className="font-black text-[18px]">💻 أفضل المتاجر الإلكترونية</h2><div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">{BEST_ELEC.map(s=><div key={s.name} className={`rounded-[18px] border p-4 flex justify-between items-center ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-100'}`}><div className="flex gap-3 items-center"><div className={`w-10 h-10 rounded-full bg-gradient-to-br ${s.color} grid place-items-center text-white`}>{s.icon}</div><div><div className="font-black text-[13px]">{s.name}</div><div className="text-[11px] opacity-60">{s.del}</div></div></div><span className="text-[11px] px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">★ {s.rating}</span></div>)}</div></div>

   {/* تصنيف الأسواق */}
   <div className="mt-8"><h2 className="font-black text-[18px]">🗂️ تصنيف الأسواق</h2><div className="mt-3 grid grid-cols-2 gap-3">{MARKETS.map(m=><button key={m.n} onClick={()=>setCat(m.n)} className={`rounded-[18px] border p-4 text-right flex justify-between items-center ${cat===m.n?'bg-zinc-900 text-white border-zinc-900':'bg-white border-zinc-100'} ${dark&&cat!==m.n?'!bg-zinc-900!border-zinc-800':''}`}><div><div className="font-black text-[14px] flex gap-1.5 items-center"><span>{m.i}</span>{m.n}</div><div className="text-[11px] opacity-70 mt-0.5">{m.d}</div></div><span className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${cat===m.n?'bg-white/20 text-white':'bg-violet-50 text-violet-700'}`}>{m.c} عرض</span></button>)}</div></div>

   <div className="mt-8 grid md:grid-cols-[1fr_360px] gap-6 pb-24">
    <div>
     <div className="flex items-center justify-between"><h3 className="font-black">{cat} {nearby&&'• قريب منك'}</h3><label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)} className="w-4 h-4 accent-violet-600"/> العروض القريبة فقط (&lt;10كم) <span className="opacity-50">{loc?.lat?.toFixed(3)},{loc?.lng?.toFixed(3)}</span></label></div>
     <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className={`rounded-[20px] border overflow-hidden ${o.isOwn?'ring-1 ring-violet-200':''} ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-100'}`}><div className="relative"><img src={o.image} className="h-44 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#6D28D9] text-white text-[11px] font-black">-{o.discount}%</span>{o.dist!=null&&<span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">يبعد {o.dist.toFixed(1)} كم</span>}<span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 grid place-items-center">↗</span></div><div className="p-3"><div className="text-[11px] opacity-60">{o.store} • {o.city}</div><div className="font-bold text-[14px] leading-6 mt-0.5">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black text-violet-700">{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-9 h-9 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black">+</button></div></div></div>)}</div>
    </div>

    {/* المساعد الاقتصادي */}
    <aside className="md:sticky md:top-[80px] h-fit">
     <div className={`rounded-[22px] border overflow-hidden flex flex-col h-[560px] ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-violet-100 shadow-sm'}`}>
      <div className="p-4 bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white"><div className="font-black">🤖 المساعد الاقتصادي</div><div className="text-[12px] opacity-90 leading-5 mt-1">يرد عليك، يقترح عروض، ويحسب توفيرك تلقائياً</div><div className="mt-2 flex gap-1.5 flex-wrap">{['وين أوفر؟','اقترح عروض حكيم','ميزانية 300 ر.س','العروض القريبة'].map(t=><button key={t} onClick={()=>ask(t)} className="px-2.5 py-1 rounded-full bg-white/20 border border-white/20 text-[11px]">{t}</button>)}</div></div>
      <div className="flex-1 overflow-auto p-3 space-y-3 bg-zinc-50/60 dark:bg-zinc-950/40">{msgs.map((m,i)=><div key={i} className={`max-w-[88%] rounded-[16px] px-3 py-2.5 text-[13px] leading-6 ${m.role==='u'?'mr-auto bg-zinc-900 text-white dark:bg-white dark:text-black':'ml-auto bg-white border border-violet-100 dark:bg-zinc-900 dark:border-zinc-800'}`}><div className="whitespace-pre-line">{m.t}</div>{m.offers&&<div className="mt-2 space-y-2">{m.offers.map((o:any)=><div key={o.id} className="flex gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border"><img src={o.image} className="w-12 h-12 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-[12px] leading-4 line-clamp-2">{o.title}</div><div className="text-[11px] text-violet-600 font-black">{o.price} ر.س <span className="line-through opacity-50 text-[10px]">{o.old_price}</span> • توفر {o.old_price-o.price} ر.س</div></div><button onClick={()=>setCart(c=>c+1)} className="w-7 h-7 rounded-full bg-[#6D28D9] text-white text-[12px]">+</button></div>)}</div>}</div>)}</div>
      <div className="p-3 border-t flex gap-2 bg-white dark:bg-zinc-900"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)} placeholder="اسأل: وين أرخص آيفون؟" className="flex-1 h-11 px-4 rounded-full bg-zinc-100 dark:bg-zinc-800 outline-none text-[13px]"/><button onClick={()=>ask(q)} className="w-11 h-11 rounded-full bg-[#6D28D9] text-white font-black">↗</button></div>
     </div>
     <div className="mt-3 rounded-[18px] border p-4 bg-gradient-to-br from-[#1A1033] to-[#6D28D9] text-white"><div className="font-black text-[13px]">💜 متجر حكيم يوفر لك</div><div className="text-[12px] mt-1 opacity-90 leading-5">اطلب الآن: عطر + محفظة 399 ر.س بدل 649 • توفير 250 ر.س + تغليف فاخر مجاني</div></div>
    </aside>
   </div>
  </main>
  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-[13px] z-50">{toast}</div>}
 </div>)
   }
