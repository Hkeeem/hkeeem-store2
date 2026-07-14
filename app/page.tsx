'use client'
import { useState } from 'react'
import OfficeTab from '../components/OfficeTab'

export default function Page(){
  const [tab,setTab]=useState('office')
  return(
    <div className="min-h-screen bg-[#FFFCF6] pb-24">
      <div className="h-14 flex items-center justify-between px-4 bg-white border-b sticky top-0 z-10">
        <b className="font-black">عروضكم</b>
        <span className="text-sm">alhkmy11 👋</span>
      </div>

      <div className="p-3">
        {tab==='office' && <OfficeTab />}
        {tab==='home' && <div className="bg-white rounded-2xl border p-6 text-center">الرئيسية - عروضكم قريباً</div>}
        {tab==='store' && <div className="bg-white rounded-2xl border p-6 text-center">متجر حكيم - المفضلة</div>}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-20">
        <button onClick={()=>setTab('home')} className={`text-xs ${tab==='home'?'font-black':''}`}>🏠<br/>الرئيسية</button>
        <button onClick={()=>setTab('office')} className={`text-xs ${tab==='office'?'font-black text-[#7A5A16]':''}`}>🏢<br/>مكتبي العقاري</button>
        <button onClick={()=>setTab('store')} className={`text-xs ${tab==='store'?'font-black':''}`}>❤️<br/>متجر حكيم</button>
      </nav>
    </div>
  )
}
