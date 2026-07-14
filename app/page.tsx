'use client'
import { useState } from 'react'
const WA='966565604856'
const DISP='0565604856'
const EMAIL='alhkmy11@gmail.com'
const DEAL='https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4'

function Office(){
 return(
 <div className="space-y-3">
  <div className="rounded-[28px] bg-black text-white p-5">
   <div className="flex justify-between">
    <div>
     <h2 className="font-black">
      مؤسسة محسن لخدمات الأعمال
     </h2>
     <p className="text-xs text-white/60 mt-1">
      محسن الحكمي • وسيط معتمد ✅
     </p>
    </div>
    <div className="w-12 h-12 rounded-xl bg-[#C9A86A] grid place-items-center font-black">م</div>
   </div>
   <div className="grid grid-cols-3 gap-2 mt-5">
    <a href={`mailto:${EMAIL}`} className="h-11 rounded-full bg-white/10 border grid place-items-center text-sm">ايميل</a>
    <a href={`https://wa.me/${WA}`} target="_blank" className="h-11 rounded-full bg-[#25D366] grid place-items-center text-xs font-black">واتساب<br/>{DISP}</a>
    <a href={DEAL} target="_blank" className="h-11 rounded-full bg-white text-black grid place-items-center text-xs">DealApp</a>
   </div>
  </div>
  <div className="bg-white rounded-2xl border p-3">
   <h3 className="font-bold text-sm">المساعد العقاري</h3>
   <p className="text-xs text-zinc-500 mt-1">تواصل على {DISP} او {EMAIL}</p>
  </div>
 </div>
 )
}

export default function Page(){
 const [tab,setTab]=useState('home')
 const offers=[
  {n:'AirPods',p:'449 ر.س',e:'🎧'},
  {n:'ساعة ذكية',p:'899 ر.س',e:'⌚'},
  {n:'جوال',p:'1099 ر.س',e:'📱'},
  {n:'لابتوب',p:'2199 ر.س',e:'💻'},
 ]
 const stores=[
  {n:'أمازون',c:'إلكترونيات',i:'🛒'},
  {n:'نون',c:'جوالات',i:'📱'},
  {n:'جرير',c:'كمبيوترات',i:'🎮'},
  {n:'إكسترا',c:'أجهزة ذكية',i:'📺'},
 ]
 return(
 <div className="min-h-screen bg-[#FFFCF6] pb-20">
  <div className="h-14 bg-white border-b flex items-center justify-between px-4 sticky top-0">
   <b>عروضكم</b><span className="text-xs">alhkmy11</span>
  </div>
  <main className="p-3">
   {tab==='home'&&<div className="space-y-3">
    <div className="rounded-2xl bg-yellow-400 p-4"><h2 className="font-black">🔥 عروض المتاجر</h2><p className="text-sm">اهم شي في التطبيق</p></div>
    <div className="grid grid-cols-2 gap-3">{offers.map((o,i)=><div key={i} className="bg-white rounded-2xl border p-3"><div className="h-16 bg-zinc-100 rounded-xl grid place-items-center text-xl">{o.e}</div><h3 className="font-bold text-sm mt-2">{o.n}</h3><b className="text-sm">{o.p}</b></div>)}</div>
   </div>}
   {tab==='stores'&&<div className="space-y-3"><h2 className="font-black">🏬 المتاجر الإلكترونية</h2>{stores.map((s,i)=><div key={i} className="bg-white rounded-2xl border p-4 flex justify-between"><div className="flex gap-2 items-center"><div className="w-10 h-10 bg-yellow-100 rounded-xl grid place-items-center">{s.i}</div><div><b className="text-sm">{s.n}</b><p className="text-xs text-zinc-500">{s.c}</p></div></div><span className="text-xs bg-black text-white px-3 py-1 rounded-full">عروض</span></div>)}</div>}
   {tab==='office'&&<Office/>}
   {tab==='mystore'&&<div className="space-y-4"><div className="bg-white rounded-2xl border p-4"><b>❤️ متجر حكيم</b><p className="text-xs text-zinc-500">المفضلة والسياسات</p></div><h3 className="font-black">مكتبك تحت متجر حكيم 👇</h3><Office/></div>}
  </main>
  <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
   <button onClick={()=>setTab('home')} className="text-xs">🏠<br/>عروض المتاجر</button>
   <button onClick={()=>setTab('stores')} className="text-xs">🏬<br/>المتاجر</button>
   <button onClick={()=>setTab('office')} className="text-xs">🏢<br/>مكتبي</button>
   <button onClick={()=>setTab('mystore')} className="text-xs font-black text-[#7A5A16]">❤️<br/>متجر حكيم</button>
  </nav>
 </div>
 )
}
