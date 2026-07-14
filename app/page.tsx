'use client'
import { useState } from 'react'
import OfficeTab from '../components/OfficeTab'

export default function Page(){
  const [tab, setTab] = useState<'home' | 'stores' | 'office' | 'mystore'>('home')

  return(
    <div className="min-h-screen bg-[#FFFCF6] pb-20">
      <div className="h-14 bg-white border-b flex items-center justify-between px-4">
        <b>عروضكم</b><span className="text-xs">alhkmy11</span>
      </div>

      <main className="p-3">
        {tab==='home' && <div className="rounded-2xl bg-yellow-400 p-4 font-black">🔥 عروض المتاجر</div>}
        {tab==='stores' && <div className="font-black">🏬 المتاجر الإلكترونية</div>}
        {tab==='office' && <OfficeTab />}
        {tab==='mystore' && <div className="space-y-3"><h3 className="font-black">❤️ متجر حكيم</h3><OfficeTab /></div>}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
        <button onClick={()=>setTab('home')} className="text-xs">🏠<br/>عروض</button>
        <button onClick={()=>setTab('stores')} className="text-xs">🏬<br/>المتاجر</button>
        <button onClick={()=>setTab('office')} className="text-xs">🏢<br/>مكتبي</button>
        <button onClick={()=>setTab('mystore')} className="text-xs">❤️<br/>حكيم</button>
      </nav>
    </div>
  )
}
