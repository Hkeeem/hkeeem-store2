'use client'
import { useState } from 'react'
const WA='966565604856';const DISP='0565604856';const EMAIL='alhkmy11@gmail.com';const DEAL='https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4'
const offers=[{n:'AirPods Pro',p:'449 ر.س',o:'599',s:'جرير',e:'🎧'},{n:'ساعة ذكية',p:'899 ر.س',o:'1299',s:'إكسترا',e:'⌚'},{n:'جوال سامسونج',p:'1099 ر.س',o:'1399',s:'نون',e:'📱'},{n:'لابتوب HP',p:'2199 ر.س',o:'2899',s:'أمازون',e:'💻'}]
const stores=[{n:'أمازون',c:'إلكترونيات',i:'🛒',co:'1240 عرض'},{n:'نون',c:'جوالات',i:'📱',co:'890 عرض'},{n:'جرير',c:'كمبيوترات',i:'🎮',co:'560 عرض'},{n:'إكسترا',c:'أجهزة ذكية',i:'📺',co:'430 عرض'}]

function OfficeCard(){
 return(
 <div className="space-y-3">
  <div className="rounded-[28px] bg-black text-white p-5">
   <div className="flex justify-between"><div className="text-right"><h2 className="font-black">مؤسسة محسن لخدمات الأعمال</h2><p className="text-xs text-white/60 mt-1">محسن الحكمي • وسيط معتمد ✅ مرخص فال</p></div><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E7C27A] to-[#8B6F2E] grid place-items-center font-black">م</div></div>
   <div className="grid grid-cols-3 gap-2 mt-4">
    <a href={`mailto:${EMAIL}`} className="h-11 rounded-full bg-white/10 border border-white/20 grid place-items-center text-sm">ايميل</a>
    <a href={`https://wa.me/${WA}`} target="_blank" className="h-11 rounded-full bg-[#25D366] grid place-items-center text-xs font-black">واتساب<br/>{DISP}</a>
    <a href={DEAL} target="_blank" className="h-11 rounded-full bg-white text-black grid place-items-center text-xs font-black">DealApp ملفي</a>
   </div>
  </div>
  <div className="bg-white rounded-2xl border p-3"><h3 className="font-bold text-sm">🤖 المساعد العقاري</h3><p className="text-xs text-zinc-500 mt-1">أطلب عقار أو أعرض عقارك وبيجيك الرد واتساب على {DISP}</p><a href={`https://wa.me/${WA}?text=${encodeURIComponent('السلام عليكم جايك من عروضكم')}`} target="_blank" className="mt-3 h-10 rounded-full bg-black text-white grid place-items-center text-sm font-bold">تواصل واتساب الآن</a><a href={`mailto:${EMAIL}`} className="mt-2 h-10 rounded-full bg-[#FFF3CC] border grid place-items-center text-sm">راسلنا على {EMAIL}</a></div>
 </div>)
}

export default function Page(){
 const [tab,setTab]=useState('home')
 return(
 <div className="min-h-screen bg-[#FFFCF6] pb-20">
  <div className="h-14 bg-white border-b sticky top-0 z-10 flex items-center justify-between px-4"><b>عروضكم</b><span className="text-xs">alhkmy11 👋</span></div>
  <main className="p-3">
   {tab==='home'&&<div className="space-y-4"><div className="rounded-2xl bg-gradient-to-l from-[#FFD86A] to-[#FFA800] p-4"><h2 className="font-black">🔥 عروض المتاجر</h2><p className="text-sm">أهم شي في التطبيق</p></div><div className="grid grid-cols-2 gap-3">{offers.map((o,i)=><div key={i} className="bg-white rounded-2xl border p-3"><div className="h-20 bg-[#F5F1E8] rounded-xl grid place-items-center text-2xl">{o.e}</div><h3 className="font-bold text-sm mt-2">{o.n}</h3><p className="text-xs text-zinc-500">{o.s}</p><b className="text-sm">{o.p}</b></div>)}</div></div>}
   {tab==='stores'&&<div className="space-y-3"><h2 className="font-black text-lg">🏬 المتاجر الإلكترونية</h2>{stores.map((s,i)=><div key={i} className="bg-white rounded-2xl border p-4 flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-12 h-12 rounded-xl bg-[#FFF3CC] grid place-items-center text-xl">{s.i}</div><div><h3 className="font-bold text-sm">{s.n}</h3><p className="text-xs text-zinc-500">{s.c} • {s.co}</p></div></div><span className="text-xs bg-black text-white px-3 py-1 rounded-full">عروض</span></div>)}</div>}
   {tab==='office'&&<OfficeCard/>}
   {tab==='mystore'&&<div className="space-y-4"><div className="bg-white rounded-2xl border p-4"><h3 className="font-bold">❤️ متجر حكيم</h3><p className="text-xs text-zinc-500">المفضلة • سياسة الخصوصية • الشروط</p></div><h3 className="font-black">مكتبك العقاري تحت متجر حكيم 👇</h3><OfficeCard/></div>}
  </main>
  <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center"><button onClick={()=>setTab('home')} className={`text-xs ${tab==='home'?'font-black':''}`}>🏠<br/>عروض المتاجر</button><button onClick={()=>setTab('stores')} className={`text-xs ${tab==='stores'?'font-black':''}`}>🏬<br/>المتاجر</button><button onClick={()=>setTab('office')} className={`text-xs ${tab==='office'?'font-black':''}`}>🏢<br/>مكتبي</button><button onClick={()=>setTab('mystore')} className={`text-xs ${tab==='mystore'?'font-black text-[#7A5A16]':''}`}>❤️<br/>متجر حكيم</button></nav>
 </div>)
}
