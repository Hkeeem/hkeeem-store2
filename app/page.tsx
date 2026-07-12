"use client"
import { useEffect, useMemo, useState } from 'react'

type Offer = { id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; lat:number; lng:number; city:string; isOwn?:boolean; dist?:number }
type StoreRank = { name:string; rating:number; offers:number; avgDiscount:number; tag?:string }

const CREAM = "#FFF8F0"
const VIOLET = "#6D28D9"

const CATS_BOX = [
 {n:'متجر حكيم'}, {n:'سوبرماركت'},
 {n:'ازياء'}, {n:'مطاعم'},
 {n:'ملابس'}, {n:'عطور'},
 {n:'سفر'}, {n:'صحة وجمال'},
]

const BEST_SAUDI: StoreRank[] = [
 {name:'متجر حكيم', rating:4.9, offers:24, avgDiscount:42, tag:'مفعل'},
 {name:'بنده', rating:4.8, offers:128, avgDiscount:38},
 {name:'العثيم', rating:4.7, offers:96, avgDiscount:35},
 {name:'جرير', rating:4.9, offers:112, avgDiscount:44},
 {name:'نون', rating:4.6, offers:210, avgDiscount:40},
 {name:'نعناع', rating:4.7, offers:54, avgDiscount:33},
]

const BEST_ELEC: StoreRank[] = [
 {name:'جرير', rating:4.9, offers:112, avgDiscount:44},
 {name:'اكسترا', rating:4.8, offers:88, avgDiscount:41},
 {name:'نون الكترونيات', rating:4.6, offers:95, avgDiscount:39},
 {name:'امازون', rating:4.7, offers:130, avgDiscount:36},
 {name:'ردسي', rating:4.8, offers:42, avgDiscount:37},
 {name:'STC', rating:4.5, offers:28, avgDiscount:32},
]

const OFFERS: Offer[] = [
 {id:1,title:'عطر حكيم الملكي 100 مل',store:'متجر حكيم',category:'عطور',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,lat:21.5433,lng:39.1728,city:'جدة'},
 {id:2,title:'محفظة جلد مع ساعة',store:'متجر حكيم',category:'ملابس',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,lat:21.545,lng:39.174,city:'جدة'},
 {id:3,title:'سلة التوفير',store:'بنده',category:'سوبرماركت',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',lat:21.54,lng:39.16,city:'جدة'},
 {id:4,title:'ايباد برو M2',store:'جرير',category:'الكترونيات',price:2199,old_price:3999,discount:45,image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',lat:21.56,lng:39.19,city:'جدة'},
 {id:5,title:'وجبة عائلية دجاج مع رز 69 بدل 120',store:'هنقرستيشن',category:'مطاعم',price:69,old_price:120,discount:42,image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',lat:21.54,lng:39.17,city:'جدة'},
 {id:6,title:'تيشيرتات 3 قطع',store:'نمشي',category:'ملابس',price:129,old_price:249,discount:48,image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',lat:21.53,lng:39.18,city:'جدة'},
]

function haversine(a:number,b:number,c:number,d:number){const R=6371;const dLa=(c-a)*Math.PI/180;const dLo=(d-b)*Math.PI/180;const s=Math.sin(dLa/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}

export default function Page(){
 const [cat,setCat]=useState('متجر حكيم'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [font,setFont]=useState<'sm'|'base'|'lg'>('base'); const [dark,setDark]=useState(false); const [loc,setLoc]=useState<any>(null); const [nearby,setNearby]=useState(false);
 const [modal,setModal]=useState<'saudi'|'elec'|null>(null); const [speaking,setSpeaking]=useState(false);
 const [smartList,setSmartList]=useState<string[]>(['رز','دجاج','زيت']); const [newItem,setNewItem]=useState('');
 const [dashboardTab,setDashboardTab]=useState<'overview'|'points'|'orders'>('overview');
 const [q,setQ]=useState(''); const [msgs,setMsgs]=useState<{role:'u'|'a',t:string}[]>([{role:'a',t:'انا المساعد الاقتصادي اقدر اقترح لك ارخص العروض واحسب توفيرك'}])

 const fontSize = font==='sm'?'15px':font==='lg'?'19px':'17.5px'
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),2200)}

 const filtered = useMemo(()=>{let l=cat==='متجر حكيم'?OFFERS.filter(o=>o.isOwn):OFFERS.filter(o=>o.category===cat||o.store===cat); if(nearby&&loc?.enabled){l=(l as any).map((o:any)=>({...o,dist:haversine(loc.lat,loc.lng,o.lat,o.lng)})).filter((o:any)=>o.dist<12).sort((x:any,y:any)=>x.dist-y.dist)} return l},[cat,loc,nearby])

 const rankedSaudi = useMemo(()=>[...BEST_SAUDI].sort((a,b)=>b.avgDiscount+b.offers/10 - (a.avgDiscount+a.offers/10)),[])
 const rankedElec = useMemo(()=>[...BEST_ELEC].sort((a,b)=>b.avgDiscount+b.offers/10 - (a.avgDiscount+a.offers/10)),[])

 const speakStores = (stores:StoreRank[])=>{
   if(!('speechSynthesis' in window)) {show('المتصفح لا يدعم النطق'); return}
   window.speechSynthesis.cancel()
   const text = `اقوى المتاجر في العروض بالترتيب. ${stores.map((s,i)=>`${i+1} ${s.name} متوسط خصم ${s.avgDiscount} بالمئة و ${s.offers} عرض`).join('. ')}`
   const u = new SpeechSynthesisUtterance(text); u.lang='ar-SA'; u.rate=0.95
   u.onstart=()=>setSpeaking(true); u.onend=()=>setSpeaking(false)
   window.speechSynthesis.speak(u)
 }

 useEffect(()=>{if(modal==='saudi') speakStores(rankedSaudi); if(modal==='elec') speakStores(rankedElec)},[modal])

 const addToList=()=>{if(!newItem.trim()) return; setSmartList(s=>[...s,newItem.trim()]); setNewItem(''); show('اضيف للقائمة الذكية')}
 const totalSaving = useMemo(()=>OFFERS.filter(o=>smartList.some(it=>o.title.includes(it))).reduce((s,o)=>s+o.old_price-o.price,0),[smartList])

 return(<div dir="rtl" style={{fontSize, backgroundColor:CREAM}} className={`min-h-screen leading-7 ${dark?'!bg-zinc-950 text-zinc-100':''}`}>
  <header className={`sticky top-0 z-30 backdrop-blur border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FFFBF5]/90 border-violet-100'}`}><div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center"><div className="font-black text-xl">عروض<span style={{color:VIOLET}}>كم</span></div><div className="flex gap-2 items-center"><button onClick={()=>setFont(f=>f==='base'?'lg':f==='lg'?'sm':'base')} className="w-10 h-10 rounded-full border bg-white grid place-items-center">أأ</button><button onClick={()=>setDark(!dark)} className="w-10 h-10 rounded-full border bg-white">{dark?'نهار':'ليل'}</button><div className="px-4 h-10 rounded-full text-white grid place-items-center font-bold text-sm" style={{background:`linear-gradient(to right, ${VIOLET}, #A21CAF)`}}>السلة {cart}</div></div></div></header>

  <main className="max-w-7xl mx-auto px-3 pb-24">
   {/* 3 مربعات رئيسية */}
   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className={`rounded-3xl border p-5 shadow-sm ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><h3 className="font-black">التصنيفات</h3><div className="text-xs opacity-60 mt-1">اختر قسم لتصفية العروض - صفين</div><div className="mt-4 grid grid-cols-4 gap-2.5">{CATS_BOX.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className={`h-16 rounded-2xl border font-bold text-xs text-center p-1 transition ${cat===c.n?`text-white border-[${VIOLET}] shadow-lg`:'bg-[#FFF8F0] border-zinc-100 hover:border-violet-200'} ${dark&&cat!==c.n?'!bg-zinc-800!border-zinc-700':''}`} style={cat===c.n?{background:VIOLET, borderColor:VIOLET}:{}}>{c.n}</button>)}</div></div>

    <button onClick={()=>setModal('saudi')} className={`rounded-3xl border p-5 shadow-sm text-right w-full transition hover:scale-[1.01] ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><div className="flex justify-between items-center"><h3 className="font-black">افضل متاجر السعودية</h3><span className="text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">اضغط للفتح ويتحدث</span></div><div className="mt-4 grid grid-cols-3 gap-2.5">{BEST_SAUDI.slice(0,6).map(s=><div key={s.name} className={`rounded-2xl border p-2.5 text-center ${s.name==='متجر حكيم'?'bg-violet-50 border-violet-200':'bg-[#FFF8F0] border-zinc-100'}`}><div className="font-bold text-xs">{s.name} {s.tag==='مفعل'&&<span className="text-[9px] px-1 py-0.5 rounded-full text-white" style={{background:VIOLET}}>مفعل</span>}</div><div className="text-[11px] opacity-60 mt-0.5">{s.rating} - {s.offers} عرض</div></div>)}</div></button>

    <button onClick={()=>setModal('elec')} className={`rounded-3xl border p-5 shadow-sm text-right w-full transition hover:scale-[1.01] ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><div className="flex justify-between items-center"><h3 className="font-black">افضل المتاجر الالكترونية</h3><span className="text-xs px-2 py-1 rounded-full bg-violet-50 text-violet-700 border">اضغط للفتح ويتحدث</span></div><div className="mt-4 grid grid-cols-2 gap-2.5">{BEST_ELEC.slice(0,6).map(s=><div key={s.name} className="rounded-2xl border p-3 bg-[#FFF8F0] border-zinc-100 flex justify-between items-center"><div><div className="font-bold text-xs">{s.name}</div><div className="text-[11px] opacity-60">{s.offers} عرض - خصم {s.avgDiscount}%</div></div><span className="text-[11px]">{s.rating}</span></div>)}</div></button>
   </div>

   {/* المكتب العقاري رجع */}
   <div className="mt-4 rounded-3xl p-5 text-white flex flex-col md:flex-row justify-between items-center gap-3" style={{background:`linear-gradient(to right, #1A1033, ${VIOLET})`}}><div><div className="font-black">مكتب محسن الحكمي العقاري - وسيط معتمد</div><div className="text-sm opacity-90 mt-1">جدة - توثيق عقود - تسويق احترافي - متابعة حتى الافراغ</div></div><div className="flex gap-2"><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="px-5 h-11 rounded-full bg-white text-violet-800 font-bold text-sm grid place-items-center">فتح الملف العقاري</a><button onClick={()=>{if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance('مكتب محسن الحكمي العقاري في جدة وسيط معتمد توثيق عقود وتسويق احترافي');u.lang='ar-SA';speechSynthesis.speak(u)}}} className="px-4 h-11 rounded-full bg-white/20 border border-white/30 text-sm">استماع</button></div></div>

   {/* قائمة + لوحة تحكم + واجهات ذكية */}
   <div className="mt-6 grid md:grid-cols-3 gap-4">
    <div className={`rounded-3xl border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><h3 className="font-black">القائمة الذكية</h3><div className="text-xs opacity-60 mt-1">اكتب احتياجاتك والذكاء يجيب ارخص سعر</div><div className="mt-3 flex gap-2"><input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addToList()} placeholder="اضف رز دجاج زيت" className="flex-1 h-10 px-3 rounded-full bg-[#FFF8F0] border text-sm outline-none"/><button onClick={addToList} className="px-4 h-10 rounded-full text-white text-sm font-bold" style={{background:VIOLET}}>اضافة</button></div><div className="mt-3 space-y-2">{smartList.map((it,i)=><div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-[#FFF8F0] border text-sm"><span>{it}</span><span className="text-xs opacity-60">{OFFERS.find(o=>o.title.includes(it))?`ارخص ${OFFERS.find(o=>o.title.includes(it))?.price} ر.س`:'ابحث'}</span></div>)}</div><div className="mt-3 p-3 rounded-xl bg-violet-50 border-violet-100 text-sm">التوفير المتوقع <b>{totalSaving} ر.س</b> من قائمتك</div></div>

    <div className={`rounded-3xl border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><div className="flex justify-between items-center"><h3 className="font-black">لوحة التحكم</h3><div className="flex gap-1">{['overview','points','orders'].map(t=><button key={t} onClick={()=>setDashboardTab(t as any)} className={`px-2.5 py-1 rounded-full text-xs border ${dashboardTab===t?'text-white':'bg-white'}`} style={dashboardTab===t?{background:VIOLET,borderColor:VIOLET}:{}}>{t==='overview'?'نظرة':'نقاط'}</button>)}</div></div>{dashboardTab==='overview'&&<div className="mt-4 grid grid-cols-2 gap-3"><div className="p-3 rounded-2xl bg-[#FFF8F0] border"><div className="text-xs opacity-60">اجمالي التوفير</div><div className="font-black text-lg">342 ر.س</div></div><div className="p-3 rounded-2xl bg-[#FFF8F0] border"><div className="text-xs opacity-60">نقاطك</div><div className="font-black text-lg">150</div></div><div className="p-3 rounded-2xl bg-[#FFF8F0] border"><div className="text-xs opacity-60">طلبات</div><div className="font-black text-lg">{cart}</div></div><div className="p-3 rounded-2xl bg-[#FFF8F0] border"><div className="text-xs opacity-60">متاجر مفضلة</div><div className="font-black text-lg">6</div></div></div>}{dashboardTab==='points'&&<div className="mt-4 text-sm leading-6 opacity-80">اكسب 10 نقاط مع كل مشاركة عرض و 15 نقطة عند بناء قائمة ذكية. استبدل 100 نقطة بكود شحن مجاني.</div>}</div>

    <div className={`rounded-3xl border p-5 ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><h3 className="font-black">واجهات ذكية</h3><div className="mt-3 space-y-2.5"><button onClick={()=>{const rec:any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition; if(!rec){show('المتصفح لا يدعم الصوت'); return} const r=new rec(); r.lang='ar-SA'; r.onresult=(e:any)=>{const t=e.results[0][0].transcript; setQ(t); setMsgs(m=>[...m,{role:'u',t},{role:'a',t:`بحثت عن ${t} لقيت لك ${OFFERS.filter(o=>o.title.includes(t)).length} عروض`}])}; r.start(); show('تحدث الان')} } className="w-full h-12 rounded-2xl border bg-[#FFF8F0] text-sm font-bold flex justify-between items-center px-4"><span>بحث صوتي - اضغط وتحدث</span><span className="w-8 h-8 rounded-full bg-zinc-900 text-white grid place-items-center">mic</span></button><div className="p-3 rounded-2xl bg-[#FFF8F0] border"><div className="text-xs opacity-60">المساعد الاقتصادي</div><div className="mt-2 flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="اسال وين ارخص" className="flex-1 h-9 px-3 rounded-full bg-white border text-xs outline-none"/><button onClick={()=>{if(!q) return; setMsgs(m=>[...m,{role:'u',t:q},{role:'a',t:`اقترحت لك ${OFFERS.slice(0,2).map(o=>o.title).join(' و ')}`}]); setQ('')}} className="px-3 h-9 rounded-full text-white text-xs" style={{background:VIOLET}}>ارسال</button></div><div className="mt-2 space-y-1 max-h-24 overflow-auto">{msgs.slice(-3).map((m,i)=><div key={i} className={`text-xs p-2 rounded-xl ${m.role==='a'?'bg-white border':'bg-zinc-900 text-white'}`}>{m.t}</div>)}</div></div><button onClick={()=>show('ارفع صورة المنتج وسيبحث الذكاء عن ارخص سعر قريبا')} className="w-full h-12 rounded-2xl border bg-[#FFF8F0] text-sm font-bold">بحث بالصورة - قريبا</button></div></div>
   </div>

   <div className="mt-6 grid md:grid-cols-[1fr_360px] gap-6">
    <div><div className="flex justify-between items-center"><h3 className="font-black">{cat}</h3><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={nearby} onChange={e=>setNearby(e.target.checked)}/> العروض القريبة فقط</label></div><div className="mt-3 grid grid-cols-2 gap-4">{filtered.map((o:any)=><div key={o.id} className={`rounded-3xl border overflow-hidden ${dark?'bg-zinc-900 border-zinc-800':'bg-white border-zinc-100'}`}><div className="relative"><img src={o.image} className="h-40 w-full object-cover"/><span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-xs font-bold" style={{background:VIOLET}}>-{o.discount}%</span>{o.dist&&<span className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-emerald-600 text-white text-xs">يبعد {o.dist.toFixed(1)} كم</span>}</div><div className="p-3"><div className="text-xs opacity-60">{o.store}</div><div className="font-bold text-sm">{o.title}</div><div className="flex justify-between items-center mt-2"><span className="font-black" style={{color:VIOLET}}>{o.price} ر.س</span><button onClick={()=>setCart(c=>c+1)} className="w-8 h-8 rounded-full bg-zinc-900 text-white">+</button></div></div></div>)}</div></div>
    <div className={`rounded-3xl border p-4 h-fit ${dark?'bg-zinc-900 border-zinc-800':'bg-[#FFFDFA] border-violet-100'}`}><div className="font-bold text-sm">ملخص سكري</div><div className="text-xs opacity-70 mt-1 leading-5">الخلفية الان سكري #{CREAM.replace('#','')} مثل ما طلبت، والمربعات قابلة للمس وتفتح وترتب وتتحدث.</div></div>
   </div>
  </main>

  {modal&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={()=>{setModal(null); window.speechSynthesis?.cancel()}}><div onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-[#FFFDFA] border border-violet-100 p-5 shadow-2xl"><div className="flex justify-between items-center"><h3 className="font-black">{modal==='saudi'?'عروض المتاجر - الاقوى اولا':'عروض المتاجر الالكترونية - الاقوى اولا'}</h3><button onClick={()=>{setModal(null); window.speechSynthesis?.cancel()}} className="w-8 h-8 rounded-full bg-zinc-100 grid place-items-center">اغلاق</button></div><div className="mt-2 flex gap-2"><button onClick={()=>speakStores(modal==='saudi'?rankedSaudi:rankedElec)} className="px-3 h-9 rounded-full text-white text-xs font-bold flex items-center gap-1" style={{background:VIOLET}}>{speaking?'يتحدث الان...':'استمع للترتيب'}</button><span className="text-xs opacity-60 py-2">مرتبة حسب قوة العروض ومتوسط الخصم</span></div><div className="mt-4 space-y-2 max-h-80 overflow-auto">{(modal==='saudi'?rankedSaudi:rankedElec).map((s,i)=><div key={s.name} className="flex justify-between items-center p-3 rounded-2xl bg-[#FFF8F0] border"><div className="flex gap-3 items-center"><span className="w-7 h-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs font-bold">{i+1}</span><div><div className="font-bold text-sm">{s.name}</div><div className="text-xs opacity-60">{s.offers} عرض - خصم {s.avgDiscount}% - تقييم {s.rating}</div></div></div><button onClick={()=>{setCat(s.name.includes('متجر')?'متجر حكيم':s.name); setModal(null)}} className="px-3 h-8 rounded-full bg-white border text-xs font-bold">عرض</button></div>)}</div></div></div>}

  {toast&&<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm z-50">{toast}</div>}
 </div>)
}
