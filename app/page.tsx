"use client"
import { useEffect, useState } from 'react'

const HERO=[
 {store:'متجر حكيم',d:35,t:'باقة ساعة + محفظة جلد فاخرة',p:399,old:619,code:'HKEEM20',img:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',g:'from-zinc-800 to-black'},
 {store:'بنده',d:55,t:'سلة التوفير الكبرى - وفر 60%',p:89,old:199,code:'PANDA55',img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',g:'from-emerald-700 to-green-600'},
 {store:'هنقرستيشن',d:43,t:'وجبة عائلية دجاج مع أرز',p:69,old:120,code:'FAMILY43',img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',g:'from-orange-600 to-amber-600'},
]
const CATS=[{n:'الكل',i:'✨'},{n:'متجر حكيم',i:'💎'},{n:'سوبرماركت',i:'🛒'},{n:'إلكترونيات',i:'📱'},{n:'أزياء',i:'👗'},{n:'مطاعم',i:'🍔'},{n:'صيدلية',i:'💊'}]
const COMPARISONS=[
 {id:1,name:'زيت عافية دوار الشمس 1.8 لتر',img:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',prices:[{store:'بنده',price:52,was:69,cheap:true},{store:'الدانوب',price:19},{store:'العثيم',price:24},{store:'لولو',price:45}]},
 {id:2,name:'حليب المراعي طويل الأجل 12×1لتر',img:'https://images.unsplash.com/photo-1550583724-5f7a2ca5e3d6?w=400',prices:[{store:'بنده',price:27,cheap:true},{store:'التميمي',price:29},{store:'العثيم',price:65,was:75},{store:'الدانوب',price:69}]},
]
const OFFERS=[
 {id:1,title:'عطر حكيم الملكي 100مل',store:'متجر حكيم',cat:'أزياء',price:199,old:349,d:43,img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',code:'HKEEM10',own:true},
 {id:2,title:'وجبة عائلية دجاج مع أرز',store:'هنقرستيشن',cat:'مطاعم',price:69,old:120,d:43,img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',code:'FAMILY43',own:false,note:'التوفير 43 ريال - من المقطع الصوتي'},
 {id:3,title:'بيتزا خضار ومشروم',store:'جاهز',cat:'مطاعم',price:25,old:51,d:51,img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600',code:'PIZZA51'},
 {id:4,title:'أرز بسمتي أبو كاس 10كغ',store:'أسواق التميمي',cat:'سوبرماركت',price:43,old:75,d:43,img:'https://images.unsplash.com/photo-1586201375761-386a5d0b8b0d?w=600',code:'RICE43'},
 {id:5,title:'شاشة سامسونج 55 بوصة',store:'اكسترا',cat:'إلكترونيات',price:1499,old:2599,d:42,img:'https://images.unsplash.com/photo-1593359677879-a4bb92f367d8?w=600',code:'TV42'},
 {id:6,title:'آيفون 15 برو 256 جيجا',store:'جرير',cat:'إلكترونيات',price:4199,old:4999,d:16,img:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',code:'IPHONE16'},
]
const COUPONS=[
 {store:'هنقرستيشن',code:'HS30',disc:'30%',type:'أول طلب',desc:'خصم 30% على أول طلب'},
 {store:'جرير',code:'JARIR10',disc:'10%',type:'خصم عام',desc:'خصم 10% إلكترونيات'},
 {store:'اكسترا',code:'EXTRA15',disc:'15%',type:'خصم عام',desc:'خصم 15% أجهزة'},
 {store:'جاهز',code:'JAHEZ25',disc:'25 ر.س',type:'شحن مجاني',desc:'خصم 25 مع شحن مجاني'},
 {store:'الدانوب',code:'DANUBE12',disc:'12%',type:'سوبرماركت',desc:'خصم 12% مقاضي'},
]
const STORES=['الكل','بنده','العثيم','الدانوب','لولو','التميمي','جرير','اكسترا']

export default function Page(){
 const [hi,setHi]=useState(0); const [cat,setCat]=useState('الكل'); const [storeF,setStoreF]=useState('الكل'); const [tab,setTab]=useState('الرئيسية'); const [cart,setCart]=useState(0); const [toast,setToast]=useState(''); const [q,setQ]=useState(''); const [list,setList]=useState(['أرز بسمتي','زيت طبخ','حليب','دجاج','بيض']); const [input,setInput]=useState(''); const [chatOpen,setChatOpen]=useState(false); const [chatMsg,setChatMsg]=useState([{from:'bot',text:'هلا! اسألني: وين أرخص وجبة عائلية؟'}]); const [chatIn,setChatIn]=useState(''); const [points,setPoints]=useState(0)

 useEffect(()=>{const t=setInterval(()=>setHi(x=>(x+1)%HERO.length),4000);return()=>clearInterval(t)},[])
 const show=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2200)}
 const filtered=OFFERS.filter(o=>(cat==='الكل'||o.cat===cat||(cat==='متجر حكيم'&&o.own))&&(storeF==='الكل'||o.store===storeF)&&(q===''||o.title.includes(q)))
 const ask=(txt:string)=>{
   const lower=txt.toLowerCase()
   let ans='جاري البحث...'
   if(lower.includes('وجبة')||lower.includes('دجاج')) ans='عندك وجبة عائلية دجاج مع أرز في هنقرستيشن 69 ريال بدل 120 والتوفير حوالي 43 ريال وتنتهي اليوم - من المقطع اللي أرسلته'
   else if(lower.includes('زيت')) ans='أرخص زيت عافية 1.8 لتر في بنده 52 ريال بدل 69، وفي الدانوب 19 ريال للعرض اليومي'
   else if(lower.includes('حليب')) ans='حليب المراعي 12 حبة أرخص في بنده 27 ريال، التميمي 29'
   else ans='جمعت لك كل العروض - متوسط التوفير 60% من 14 متجر مشارك'
   setChatMsg(m=>[...m,{from:'user',text:txt},{from:'bot',text:ans}])
   if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(ans);u.lang='ar-SA';u.rate=0.9;speechSynthesis.speak(u)}
 }

 return(
 <div dir="rtl" style={{background:'#F2F3F5'}} className="min-h-screen text-zinc-900 pb-24">
  <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{background:'#F9FAFB',borderColor:'#E5E7EB'}}>
   <div className="max-w-7xl mx-auto px-4 h-[64px] flex justify-between items-center">
    <div className="font-black text-xl">وفّر <span className="text-zinc-400 font-normal">×</span> <span style={{color:'#6D28D9'}}>حكيم</span></div>
    <div className="flex gap-2 items-center">
     <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن منتج..." className="hidden md:block w-56 h-10 rounded-full bg-white border px-4 text-sm outline-none" style={{borderColor:'#E5E7EB'}}/>
     <div className="h-10 px-4 rounded-full bg-black text-white grid place-items-center text-sm font-bold">السلة {cart}</div>
    </div>
   </div>
  </header>

  <main className="max-w-7xl mx-auto px-3">
   {tab==='الرئيسية' && <>
    <div className="mt-4 relative h-[320px] rounded-[32px] overflow-hidden bg-black text-white">
     {HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i===hi?'opacity-100':'opacity-0'}`}><div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/><div className="relative h-full flex p-6 md:p-8 gap-6 items-center"><div className="flex-1"><span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold">{s.store}</span><div className="mt-3 text-5xl md:text-6xl font-black">خصم {s.d}%</div><div className="mt-2 text-xl font-bold">{s.t}</div><div className="mt-3 flex items-baseline gap-3"><span className="text-3xl font-black">{s.p} ر.س</span><span className="line-through opacity-60">{s.old}</span></div><div className="mt-4 flex gap-2"><button onClick={()=>{setCart(c=>c+1);show('أضيف ✓')}} className="h-11 px-6 rounded-full bg-white text-black font-bold">احصل الآن</button><button onClick={()=>{navigator.clipboard.writeText(s.code);setPoints(p=>p+10);show('نسخت '+s.code+' +10 نقاط')}} className="h-11 px-4 rounded-full bg-white/20 border border-white/20 text-sm">{s.code}</button></div></div><img src={s.img} className="w-[38%] h-[80%] object-cover rounded-2xl hidden md:block"/></div></div>)}
     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{HERO.map((_,i)=><div key={i} className={`h-1.5 rounded-full transition-all ${i===hi?'w-6 bg-white':'w-1.5 bg-white/50'}`}/>)}</div>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-3">
     <div className="rounded-2xl bg-white border p-3 text-center" style={{borderColor:'#E5E7EB'}}><div className="font-black text-lg">+14</div><div className="text-xs opacity-60">متجر مشارك</div></div>
     <div className="rounded-2xl bg-white border p-3 text-center" style={{borderColor:'#E5E7EB'}}><div className="font-black text-lg">60%</div><div className="text-xs opacity-60">متوسط التوفير</div></div>
     <div className="rounded-2xl bg-white border p-3 text-center" style={{borderColor:'#E5E7EB'}}><div className="font-black text-lg">24/7</div><div className="text-xs opacity-60">مراقبة الأسعار</div></div>
    </div>

    <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-hide pb-2">{CATS.map(c=><button key={c.n} onClick={()=>setCat(c.n)} className="flex flex-col items-center min-w-[72px]"><div className={`w-16 h-16 rounded-full grid place-items-center text-xl border transition-all ${cat===c.n?'bg-violet-600 text-white scale-105 border-violet-600':'bg-white'}`} style={{borderColor:cat===c.n?'#6D28D9':'#E5E7EB'}}>{c.i}</div><span className="mt-1.5 text-[11px] font-bold">{c.n}</span></button>)}</div>

    <div className="mt-6"><h3 className="font-black">قارن الأسعار - نفس المنتج من كل المتاجر</h3><div className="mt-3 grid md:grid-cols-2 gap-3">{COMPARISONS.map(cp=><div key={cp.id} className="rounded-3xl bg-white border p-4" style={{borderColor:'#E5E7EB'}}><div className="flex gap-3"><img src={cp.img} className="w-14 h-14 rounded-xl object-cover"/><div className="flex-1"><div className="font-bold text-sm">{cp.name}</div><div className="mt-2 grid grid-cols-2 gap-2">{cp.prices.map(pr=><div key={pr.store} className={`rounded-xl border px-2.5 py-2 flex justify-between items-center text-xs ${pr.cheap?'bg-emerald-50 border-emerald-200':''}`} style={{borderColor:pr.cheap?'#A7F3D0':'#E5E7EB'}}><span className="font-bold">{pr.store}</span><span><b>{pr.price} ر.س</b> {pr.was&&<span className="line-through opacity-50 mr-1">{pr.was}</span>}</span></div>)}</div></div></div></div>)}</div></div>

    <div className="mt-6 rounded-3xl border p-5" style={{background:'#FFFFFF',borderColor:'#E5E7EB'}}>
     <div className="flex justify-between items-start"><div><h3 className="font-black">قائمة تسوق ذكية - من فكرة وفر</h3><p className="text-xs opacity-60 mt-1">اكتب اللي تبغاه وراح أرتب لك أرخص المتاجر</p></div><span className="text-[10px] px-2 py-1 rounded-full bg-violet-100 text-violet-700 font-bold">AI</span></div>
     <div className="mt-3 flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="مثال: أرز بسمتي، زيت طبخ، دجاج..." className="flex-1 h-11 rounded-full bg-[#F2F3F5] border px-4 text-sm outline-none" style={{borderColor:'#E5E7EB'}}/><button onClick={()=>{if(!input.trim())return;setList([...list,input]);setInput('');show('أضيف للقائمة')}} className="h-11 px-5 rounded-full bg-black text-white text-sm font-bold">أضف</button></div>
     <div className="mt-3 flex flex-wrap gap-1.5">{list.map((it,i)=><span key={i} className="px-3 h-7 rounded-full bg-[#EDEEF0] text-xs grid place-items-center">{it}</span>)}</div>
     <button onClick={()=>{setTab('قائمتي');show('تم بناء قائمتك الذكية')}} className="mt-4 w-full h-11 rounded-full text-white font-bold" style={{background:'#0B7A3E'}}>ابنِ قائمتي الذكية - احسب التوفير</button>
    </div>

    <div className="mt-8"><div className="flex justify-between items-center"><h3 className="font-black text-lg">أفضل العروض الآن</h3><button onClick={()=>setTab('العروض')} className="text-xs text-violet-600 font-bold">عرض الكل ←</button></div><div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">{filtered.slice(0,6).map(o=><div key={o.id} className="rounded-2xl bg-white border overflow-hidden" style={{borderColor:'#E5E7EB'}}><div className="relative"><img src={o.img} className="h-36 w-full object-cover"/><span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black">-{o.d}%</span>{o.own&&<span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[10px]">حكيم</span>}</div><div className="p-3"><div className="text-[11px] opacity-60">{o.store}</div><div className="font-bold text-sm leading-tight mt-0.5 line-clamp-2">{o.title}</div>{o.note&&<div className="text-[10px] text-emerald-600 mt-1">{o.note}</div>}<div className="mt-2 flex justify-between items-center"><span className="font-black" style={{color:'#0B7A3E'}}>{o.price} ر.س</span><button onClick={()=>{setCart(c=>c+1);show('أضيف')}} className="w-8 h-8 rounded-full bg-black text-white grid place-items-center">+</button></div></div></div>)}</div></div>

    <div className="mt-6 rounded-3xl border p-4 flex justify-between items-center" style={{background:'#FFFFFF',borderColor:'#E5E7EB'}}><div><div className="font-black text-sm">المكتب العقاري - محسن الحكمي</div><div className="text-xs opacity-60">وسيط معتمد - جدة - من فكرتك الأصلية</div></div><a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4" target="_blank" className="h-10 px-5 rounded-full text-white grid place-items-center text-sm font-bold" style={{background:'#6D28D9'}}>فتح الملف</a></div>
   </>}

   {tab==='العروض' && <div className="mt-4"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن منتج..." className="w-full h-12 rounded-2xl bg-white border px-4 outline-none" style={{borderColor:'#E5E7EB'}}/><div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-2">{STORES.map(s=><button key={s} onClick={()=>setStoreF(s)} className={`h-9 px-4 rounded-full border text-sm whitespace-nowrap ${storeF===s?'bg-black text-white border-black':'bg-white'}`} style={{borderColor:storeF===s?'#000':'#E5E7EB'}}>{s}</button>)}</div><div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">{filtered.map(o=><div key={o.id} className="rounded-2xl bg-white border overflow-hidden" style={{borderColor:'#E5E7EB'}}><img src={o.img} className="h-36 w-full object-cover"/><div className="p-3"><div className="font-bold text-sm">{o.title}</div><div className="flex justify-between mt-2"><span className="font-black text-emerald-600">{o.price} ر.س</span><button onClick={()=>{setCart(c=>c+1);show('أضيف')}} className="px-3 h-8 rounded-full bg-black text-white text-xs">أضف</button></div></div></div>)}</div></div>}

   {tab==='الكوبونات' && <div className="mt-4"><div className="rounded-[28px] p-6 text-white" style={{background:'linear-gradient(135deg,#0B7A3E,#C8A415)'}}><h3 className="font-black text-xl">كوبونات وأكواد خصم</h3><p className="text-sm opacity-90 mt-1">انسخ الكود واستفده في المتجر - وكل نسخة تكسبك 10 نقاط</p></div><div className="mt-4 grid gap-3">{COUPONS.map(cp=><div key={cp.code} className="rounded-2xl bg-white border p-4 flex justify-between items-center" style={{borderColor:'#E5E7EB'}}><div className="flex gap-3 items-center"><div className="w-11 h-11 rounded-full bg-[#F2F3F5] grid place-items-center font-black">{cp.store[0]}</div><div><div className="font-bold text-sm">{cp.desc}</div><div className="text-xs opacity-60">{cp.store} • {cp.type}</div><div className="mt-1 inline-flex px-2.5 py-1 rounded-full bg-zinc-900 text-white text-xs font-mono">{cp.code}</div></div></div><div className="flex flex-col gap-1.5"><span className="px-3 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold grid place-items-center">{cp.disc}</span><button onClick={()=>{navigator.clipboard.writeText(cp.code);setPoints(p=>p+10);show(`نسخت ${cp.code} +10 نقاط`)}} className="h-8 px-3 rounded-full border text-xs" style={{borderColor:'#E5E7EB'}}>نسخ</button></div></div>)}</div></div>}

   {tab==='قائمتي' && <div className="mt-4 rounded-3xl bg-white border p-5" style={{borderColor:'#E5E7EB'}}><h3 className="font-black">قائمتي الذكية</h3><div className="mt-3 space-y-2">{list.map((it,i)=><div key={i} className="flex justify-between h-11 items-center px-4 rounded-full" style={{background:'#F2F3F5'}}><span className="text-sm">{it}</span><span className="text-xs opacity-60">أرخص: بنده</span></div>)}</div><div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm"><b>إجمالي التوفير المتوقع:</b> 127 ر.س إذا اشتريت كل شي من أرخص متجر مقارن</div></div>}

   {tab==='النقاط' && <div className="mt-4 space-y-3"><div className="rounded-3xl bg-white border p-5" style={{borderColor:'#E5E7EB'}}><div className="flex justify-between"><div><div className="font-black">مستوى برونزي</div><div className="text-2xl font-black mt-1">{points} نقطة</div></div><div className="w-12 h-12 rounded-full bg-amber-100 grid place-items-center text-xl">🥉</div></div><div className="mt-4 h-2 rounded-full bg-[#EDEEF0] overflow-hidden"><div className="h-full bg-black" style={{width:`${Math.min(points,100)}%`}}/></div></div><div className="rounded-3xl bg-white border p-5" style={{borderColor:'#E5E7EB'}}><h4 className="font-bold text-sm">كيف تجمع نقاط؟</h4><div className="mt-2 space-y-2 text-sm"><div className="flex justify-between"><span>نسخ كوبون</span><span className="font-bold">+10</span></div><div className="flex justify-between"><span>مشاركة عرض</span><span className="font-bold">+5</span></div><div className="flex justify-between"><span>بناء قائمة ذكية</span><span className="font-bold">+15</span></div></div></div></div>}
  </main>

  <button onClick={()=>setChatOpen(true)} className="fixed bottom-20 left-4 w-14 h-14 rounded-full shadow-xl grid place-items-center text-white text-xl z-30" style={{background:'#0B7A3E'}}>💬</button>

  {chatOpen && <div className="fixed inset-0 z-40 bg-black/50 grid place-items-end p-0 md:p-4" onClick={()=>setChatOpen(false)}><div onClick={e=>e.stopPropagation()} className="w-full md:max-w-[380px] h-[78vh] bg-white rounded-t-[28px] md:rounded-[28px] flex flex-col overflow-hidden"><div className="h-14 border-b flex justify-between items-center px-4" style={{borderColor:'#E5E7EB'}}><b>اسألني بالصوت أو الكتابة</b><button onClick={()=>setChatOpen(false)} className="w-8 h-8 rounded-full bg-[#F2F3F5]">✕</button></div><div className="flex-1 overflow-auto p-3 space-y-2">{chatMsg.map((m,i)=><div key={i} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from==='bot'?'bg-[#F2F3F5]':'bg-black text-white ml-auto'}`}>{m.text}</div>)}</div><div className="p-3 border-t flex gap-2" style={{borderColor:'#E5E7EB'}}><input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){ask(chatIn);setChatIn('')}}} placeholder="مثال: وين أرخص وجبة عائلية؟" className="flex-1 h-11 rounded-full bg-[#F2F3F5] px-4 text-sm outline-none"/><button onClick={()=>{if(chatIn.trim()){ask(chatIn);setChatIn('')}}} className="w-11 h-11 rounded-full bg-black text-white">↑</button></div><div className="px-3 pb-3 flex gap-1.5 flex-wrap">{['أي أوفر وجبة عائلية','وين أرخص أرز بسمتي؟','قارن أسعار الزيت'].map(ex=><button key={ex} onClick={()=>ask(ex)} className="px-3 h-7 rounded-full bg-[#EDEEF0] text-[11px]">{ex}</button>)}</div></div></div>}

  <nav className="fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-xl" style={{background:'#FFFFFFF2',borderColor:'#E5E7EB'}}><div className="max-w-7xl mx-auto grid grid-cols-5 h-[68px]">{[
   {n:'الرئيسية',i:'🏠'},{n:'العروض',i:'🏷️'},{n:'الكوبونات',i:'🎟️'},{n:'قائمتي',i:'🛒'},{n:'النقاط',i:'⭐'},
  ].map(t=><button key={t.n} onClick={()=>setTab(t.n)} className={`flex flex-col items-center justify-center gap-0.5 ${tab===t.n?'text-black':'opacity-50'}`}><span className="text-[18px]">{t.i}</span><span className="text-[10px] font-bold">{t.n}</span>{tab===t.n&&<span className="w-1 h-1 rounded-full bg-black mt-0.5"/>}</button>)}</div></nav>

  {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm z-50">{toast}</div>}
 </div>
)
}
