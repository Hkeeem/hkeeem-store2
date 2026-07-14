'use client'
import { useState } from 'react'
import OfficeTab from '../components/OfficeTab'

const offers=[
 {name:'AirPods Pro',price:'449 ر.س',old:'599',store:'جرير',emoji:'🎧'},
 {name:'ساعة Apple Watch',price:'899 ر.س',old:'1299',store:'إكسترا',emoji:'⌚'},
 {name:'جوال سامسونج A54',price:'1099 ر.س',old:'1399',store:'نون',emoji:'📱'},
 {name:'لابتوب HP',price:'2199 ر.س',old:'2899',store:'أمازون',emoji:'💻'},
]
const eStores=[
 {name:'أمازون السعودية',cat:'إلكترونيات عامة',icon:'🛒',count:'1,240 عرض'},
 {name:'نون',cat:'جوالات واكسسوارات',icon:'📱',count:'890 عرض'},
 {name:'جرير',cat:'كمبيوترات وألعاب',icon:'🎮',count:'560 عرض'},
 {name:'إكسترا',cat:'أجهزة منزلية ذكية',icon:'📺',count:'430 عرض'},
 {name:'تكنو بلو',cat:'قطع غيار وصيانة',icon:'🔧',count:'210 عرض'},
]

export default function Page(){
 const [tab,setTab]=useState('home')
 return(
  <div className="min-h-screen bg-[#FFFCF6] pb-20">
   <div className="h-14 bg-white border-b sticky top-0 z-10 flex items-center justify-between px-4"><b>عروضكم</b><span className="text-xs">alhkmy11 👋</span></div>
   <main className="p-3">
    {tab==='home'&&<div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-l from-[#FFD86A] to-[#FFA800] p-4"><h2 className="font-black text-lg">🔥 عروض المتاجر اليوم</h2><p className="text-sm">أهم العروض من المتاجر الإلكترونية</p></div>
      <div className="grid grid-cols-2 gap-3">{offers.map((o,i)=><div key={i} className="bg-white rounded-2xl border p-3"><div className="h-20 bg-[#F5F1E8] rounded-xl grid place-items-center text-2xl">{o.emoji}</div><h3 className="font-bold text-sm mt-2">{o.name}</h3><p className="text-xs text-zinc-500">{o.store}</p><div className="flex gap-2 items-center mt-1"><b className="text-sm">{o.price}</b><span className="text-xs line-through text-zinc-400">{o.old}</span></div></div>)}</div>
    </div>}
    {tab==='stores'&&<div className="space-y-3">
      <h2 className="font-black text-lg">🏬 المتاجر الإلكترونية</h2>
      <div className="grid gap-3">{eStores.map((s,i)=><div key={i} className="bg-white rounded-2xl border p-4 flex justify-between items-center"><div className="flex gap-3 items-center"><div className="w-12 h-12 rounded-xl bg-[#FFF3CC] grid place-items-center text-xl">{s.icon}</div><div><h3 className="font-bold text-sm">{s.name}</h3><p className="text-xs text-zinc-500">{s.cat} • {s.count}</p></div></div><span className="text-xs bg-black text-white px-3 py-1 rounded-full">شاهد العروض</span></div>)}</div>
    </div>}
    {tab==='office'&&<OfficeTab/>}
    {tab==='mystore'&&<div className="space-y-4">
      <div className="bg-white rounded-2xl border p-4"><h3 className="font-bold">❤️ المفضلة</h3><p className="text-xs text-zinc-500 mt-1">3 منتجات محفوظة</p></div>
      <div className="bg-white rounded-2xl border divide-y text-sm"><div className="p-4">سياسة الخصوصية</div><div className="p-4">الشروط والأحكام</div><div className="p-4">تواصل معنا</div></div>
      <h3 className="font-black">مكتبك العقاري 👇</h3>
      <OfficeTab/>
    </div>}
   </main>
   <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-20">
    <button onClick={()=>setTab('home')} className={`text-xs ${tab==='home'?'font-black':''}`}>🏠<br/>عروض المتاجر</button>
    <button onClick={()=>setTab('stores')} className={`text-xs ${tab==='stores'?'font-black':''}`}>🏬<br/>المتاجر</button>
    <button onClick={()=>setTab('office')} className={`text-xs ${tab==='office'?'font-black text-[#7A5A16]':''}`}>🏢<br/>مكتبي</button>
    <button onClick={()=>setTab('mystore')} className={`text-xs ${tab==='mystore'?'font-black':''}`}>❤️<br/>متجر حكيم</button>
   </nav>
  </div>
 )
}
