'use client'
import { useState } from 'react'
import OfficeTab from '../components/OfficeTab'

export default function Page(){
 const [tab,setTab]=useState('mystore')
 return(
  <div className="min-h-screen bg-[#FFFCF6] pb-20">
   <div className="h-14 bg-white border-b sticky top-0 z-10 flex items-center justify-between px-4"><b>عروضكم</b><span className="text-sm">alhkmy11 👋</span></div>
   <main className="p-3">
    {tab==='mystore'&&<div className="space-y-4">
      <div className="bg-white rounded-2xl border p-4"><h3 className="font-bold">المفضلة ❤️</h3><p className="text-sm text-zinc-500 mt-1">عطر - 250 ر.س • 3 عناصر</p></div>
      <div className="bg-white rounded-2xl border divide-y text-sm">
        <div className="p-4 flex justify-between"><span>سياسة الخصوصية</span><span>›</span></div>
        <div className="p-4 flex justify-between"><span>الشروط والأحكام</span><span>›</span></div>
        <div className="p-4 flex justify-between"><span>تواصل معنا</span><span>›</span></div>
        <div className="p-4 flex justify-between"><span>مشاركة التطبيق</span><span>›</span></div>
      </div>
      <OfficeTab/>
    </div>}
    {tab==='office'&&<OfficeTab/>}
    {tab==='home'&&<div className="bg-white rounded-2xl border p-10 text-center">الرئيسية - عروضكم</div>}
   </main>
   <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t flex justify-around items-center">
    <button onClick={()=>setTab('home')} className="text-xs">🏠<br/>الرئيسية</button>
    <button onClick={()=>setTab('office')} className={`text-xs ${tab==='office'?'font-black text-[#7A5A16]':''}`}>🏢<br/>مكتبي العقاري</button>
    <button onClick={()=>setTab('mystore')} className={`text-xs ${tab==='mystore'?'font-black text-[#7A5A16]':''}`}>❤️<br/>متجر حكيم</button>
   </nav>
  </div>
 )
}
