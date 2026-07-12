"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }

// صفين - بدون الكل وبدون الكترونيات
const CATS = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'أزياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI = [
 {name:'متجر حكيم', rating:4.9, offers:24, note:'مفعل'},
 {name:'بنده', rating:4.8, offers:128, note:'الأكثر انتشارا'},
 {name:'العثيم', rating:4.7, offers:96, note:''},
 {name:'جرير', rating:4.9, offers:112, note:''},
 {name:'نون', rating:4.6, offers:210, note:''},
 {name:'نعناع', rating:4.7, offers:54, note:''},
]

const BEST_ELEC = [
 {name:'جرير', rating:4.9, del:'توصيل اليوم'},
 {name:'اكسترا', rating:4.8, del:'توصيل مجاني'},
 {name:'نون الكترونيات', rating:4.6, del:'خصم 15%'},
 {name:'امازون', rating:4.7, del:'برايم'},
 {name:'ردسي', rating:4.8, del:'اقساط'},
 {name:'STC', rating:4.5, del:'عروض باقات'},
]

const MARKETS = [
 {n:'مطاعم', c:42, d:'هنقرستيشن وجاهز ومرسول'},
 {n:'ملابس', c:86, d:'شي ان ونمشي وستايلي'},
 {n:'سوبرماركت', c:128, d:'بنده والعثيم وكارفور'},
 {n:'الكترونيات', c:64, d:'جوالات ولابتوب وسماعات'},
 {n:'عطور ومكياج', c:35, d:'عطور حكيم وسيفورا'},
 {n:'سفر وفنادق', c:22, d:'تذاكر وفنادق وشاليهات'},
 {n:'العاب', c:18, d:'بلايستيشن والعاب اطفال'},
 {n:'اثاث', c:12, d:'ايكيا وهوم سنتر'},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل الاكثر مبيعا',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد طبيعي مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير بنده',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو M2',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'عرض مطعم 2 وجبة',store:'هنقرستيشن',category:'مطاعم',price:49,old_price:89,discount:44,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات رجالي 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',lat:21.53,lng:39.18,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [dark,setDark]=useState(false); const [showFont,setShowFont]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a', t:string, offers?:Offer[]}[]>([{role:'a', t:'اهلا محسن انا المساعد الاقتصادي. اسألني وين اوفر او قل ميزانيتي 300 وانا اقترح لك افضل عروض توفر فلوسك وتحسب لك التوفير.'}])

 const fontSize = font==='sm'?'15px':font==='lg'?'19px':'17.5px'
 const show = (m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}

 const filtered = useMemo(()=>{let l=OFFERS.filter(o=>cat==='متجر حكيم'?o.isOwn:o.category===cat||o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist)} return l},[cat,loc,nearby])

 const ask = (text:string)=>{
  if(!text.trim()) return
  setMsgs(m=>[...m,{role:'u', t:text}]); setQ('')
  const qq=text.toLowerCase()
  let res:Offer[]=[]; let ans=''
  if(qq.includes('حكيم')){res=OFFERS.filter(o=>o.isOwn); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`لقيت لك ${res.length} عروض من متجر حكيم توفر ${save} ريال اجمالا مع تغليف فاخر وشحن مجاني جدة.`}
  else if(qq.includes('وفر')||qq.includes('رخيص')||qq.includes('توفير')){res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); const save=res.reduce((s,o)=>s+o.old_price-o.price,0); ans=`اوفر 3 عروض لك الان توفر ${save} ريال خصم حتى ${res[0].discount} بالمئة.`}
  else if(qq.match(/ميزانية|(\d+)/)){const num=parseInt(qq.match(/(\d+)/)?.[1]||'300'); res=OFFERS.filter(o=>o.price<=num).sort((a,b)=>b.discount-a.discount).slice(0,3); ans=res.length?`على ميزانية ${num} ريال هذه افضل 3 خيارات توفر لك:`:`ما لقيت تحت ${num} ريال جرب ترفع الميزانية الى 400`}
  else if(qq.includes('قريب')){if(loc?.enabled){res=[...OFFERS].map(o=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)} as any)).sort((a:any,b:any)=>a.dist-b.dist).slice(0,3) as any; ans=`اقرب 3 عروض لك في جدة يبعد اقرب واحد ${(res[0] as any).dist?.toFixed(1)} كم كما في الصورة.`}else{ans=`فعل موقعك اولا من زر تفعيل الموقع عشان اجيب لك الاقرب ويحسب يبعد كم مثل 25.6 كم.`; res=[]}}
  else if(qq.includes('مطعم')||qq.includes('اكل')){res=OFFERS.filter(o=>o.category==='مطاعم'); ans=`عروض مطاعم توفر لحد 44 بالمئة.`}
  else{res=[...OFFERS].sort((a,b)=>b.discount-a.discount).slice(0,3); ans=`اقترحت لك اعلى 3 خصومات توفر اكثر خصم حتى ${res[0].discount} بالمئة.`}
  setTimeout(()=>setMsgs(m=>[...m,{role:'a', t:ans, offers:res}]),350)
 }

 const requestLoc=()=>{if(!navigator.geolocation){show('المتصفح لا يدعم الموقع');return} setLoc({loading:true}); navigator.geolocation.getCurrentPosition(p=>{const v={lat:p.coords.latitude,lng:p.coords.longitude,enabled:true,loading:false}; setLoc(v); show(`تم تفعيل موقعك ${v.lat.toFixed(3)} ${v.lng.toFixed(3)}`)},()=>show('فعل GPS'))}

 return(<div dir="rtl" style={{fontSize}} className={`min-h-screen leading-7 ${dark?'bg-zinc-950 text-zinc-100':'bg-white text-zinc-900'}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-white/90 border-zinc-100'}`}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروضكم</div><div className="flex gap-2 items-center"><div className="relative"><button onClick={()=>setShowFont(!showFont)} className="w-10 h-10 rounded-full border grid place-items-center font-black">أأ</button>{showFont&&<div className={`absolute left-0 top-11 w-32 rounded-xl border shadow p-2 z-50 ${dark?'bg-zinc-900':'bg-white'}`}><button onClick={()=>{setFont('sm');setShowFont(false)}} className="w-full h-8 rounded-full text-sm">صغير</button><button onClick={()=>{setFont('base');setShowFont(false)}} className={`w-full h-8 mt-1 rounded-full ${font==='base'?'bg-zinc-900 text-white':''}`}>متوسط</button><button onClick={()=>{setFont('lg');setShowFont(false)}} className="w-full h-8 mt-1 rounded-full">كبير</button></div>}</div><button onClick={()=>setDark(!dark)} className="w-10 h-10 rounded-full border grid place-items-center bg-white dark:bg-zinc-800">{dark?'نهار':'ليل'}</button><button onClick={requestLoc} className={`px-3 h-10 rounded-full border text-sm font-bold ${loc?.enabled?'bg-emerald-600 text-white':'bg-white dark:bg-zinc-800'}`}>{loc?.enabled?'مفعل':'تفعيل الموقع'}</button><div className="px-4 h-10 rounded-full bg-zinc-900 text-white grid place-items-center font-bold text-sm">السلة {cart}</div></div></div></header>

  <main className="max-w-7xl mx-auto px-3">
   <div className="mt-5"><div className="font-black mb-3">الاقسام</div><div className="grid grid-cols-4 gap-3">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`h-20 rounded-2xl border flex items-center justify-center font-bold text-sm transition ${cat===c.n?'bg-zinc-900 text-white border-zinc-900':'bg-white border-zinc-200 hover:border-zinc-400'} ${dark&&cat!==c.n?'!bg-zinc-900!border-zinc-800':''}`}>{c.n}</button>)}</div><div className="text-xs opacity-50 mt-2">تم حذف الكل والالكترونيات وعرض الاقسام في صفين</div></div>

   <div className="mt-8"><div className="flex justify-between items-center"><h2 className="font-black">افضل متاجر السعودية</h2><span className="text-xs opacity-60">موثوقة ومجربة</span></div><div className="mt-3 grid grid-cols-3 md:grid-cols-6 gap-3">{BEST_SAUDI.map(s=><div key={s.name} className={`rounded-2xl border p-3 text-center ${s.name==='متجر حكيم'?'ring-2 ring-violet-200 bg-violet-50 border-violet-200':'bg-white border-zinc-100'} ${dark?'!bg-zinc-900!border-zinc-800':''}`}><div className="font-black text-sm">{s.name} {s.note==='مفعل'&&<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-600 text-white align-middle">مفعل</span>}</div><div className="text-xs opacity-60 mt-1">{s.rating} تقييم - {s.offers} عرض</div></div>)}</div></div>

   <div className="mt-8"><h2 className="font-black">افضل المتاجر الالكترونية</h2><div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">{BEST_ELEC.map(s=><div key={s.name} className={`rounded-2xl border p-4 flex justify-between items-center ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-100'}`}><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.del}</div></div><span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">{s.rating}</span></div>)}</div></div>

   <div className="mt-8"><h2 className="font-black">تصنيف الاسواق</h2><div className="mt-3 grid grid-cols-2 gap-3">{MARKETS.map(m=><button key={m.n} onClick={()=>setCat(m.n)} className={`rounded-2xl border p-4 text-right flex justify-between items-center ${cat===m.n?'bg-zinc-900 text-white border-zinc-900':'bg-white border-zinc-100'} ${dark&&cat!==m.n?'!bg-zinc-900!border-zinc-800':''}`}><div><div className="font-bold text-sm">{m.n}</div><div className="text-xs opacity-70 mt-0.5">{m.d}</div></div><span className={`text-xs px-2.5 py-1 rounded-full font-bold ${cat===m.n?'bg-white/20 text-white':'bg-zinc-100 text-zinc-700'}`}>{m.c} عرض</span></button>)}</div></div>

   <div className="mt-8 grid md:grid-cols-[1fr_360px] gap-6 pb-24">
    <div>
     <div className="flex items-center justify-between"><h3 className="font-black">{cat} {nearby&&'قريب منك'}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)} className="w-4 h-4"/> العروض القريبة فقط اقل من 10 كم {loc&&<span className="opacity-50">{loc.lat?.toFixed(3)},{loc.lng?.toFixed(3)}</span>}</label></div>
     <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className={`rounded-2xl border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-100'}`}><div className="relative"><img src={o.image} className="h-44 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-bold">-{o.discount}%</span>{o.dist!=null&&<span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs">يبعد {o.dist.toFixed(1)} كم</span>}</div><div className="p-3"><div className="text-xs opacity-60">{o.store} - {o.city}</div><div className="font-bold text-sm leading-6 mt-0.5">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black">{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-9 h-9 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div>
    </div>

    <aside className="md:sticky md:top-16 h-fit">
     <div className={`rounded-2xl border overflow-hidden flex flex-col h-[560px] ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-200'}`}>
      <div className="p-4 bg-zinc-900 text-white"><div className="font-black">المساعد الاقتصادي</div><div className="text-xs opacity-80 leading-5 mt-1">يرد عليك ويقترح عروض ويحسب توفيرك</div><div className="mt-2 flex gap-1.5 flex-wrap">{['وين اوفر','اقترح عروض حكيم','ميزانية 300','العروض القريبة'].map(t=><button key={t} onClick={()=>ask(t)} className="px-2.5 py-1 rounded-full bg-white/15 border border-white/15 text-xs">{t}</button>)}</div></div>
      <div className="flex-1 overflow-auto p-3 space-y-3 bg-zinc-50/60 dark:bg-zinc-950/40">{msgs.map((m,i)=><div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-6 ${m.role==='u'?'mr-auto bg-zinc-900 text-white dark:bg-white dark:text-black':'ml-auto bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'}`}><div className="whitespace-pre-line">{m.t}</div>{m.offers&&<div className="mt-2 space-y-2">{m.offers.map((o:any)=><div key={o.id} className="flex gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border"><img src={o.image} className="w-12 h-12 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-xs leading-4 line-clamp-2">{o.title}</div><div className="text-xs font-bold mt-1">{o.price} ر.س <span className="line-through opacity-50">{o.old_price}</span> توفر {o.old_price-o.price}</div></div><button onClick={()=>setCart(c=>c+1)} className="w-7 h-7 rounded-full bg-zinc-900 text-white text-xs">+</button></div>)}</div>}</div>)}</div>
      <div className="p-3 border-t flex gap-2 bg-white dark:bg-zinc-900"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)} placeholder="اسأل وين ارخص ايفون" className="flex-1 h-11 px-4 rounded-full bg-zinc-100 dark:bg-zinc-800 outline-none text-sm"/><button onClick={()=>ask(q)} className="w-11 h-11 rounded-full bg-zinc-900 text-white font-black">ارسال</button></div>
     </div>
    </aside>
   </div>
  </main>
  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
  }
