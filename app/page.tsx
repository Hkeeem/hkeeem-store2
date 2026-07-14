'use client'
import { useState } from 'react'
import OfficeTab from '../components/OfficeTab'

export default function Page(){
  const [tab,setTab]=useState('home')
  return(
    <div className="min-h-screen bg-[#FFFCF6] pb-20">
      <main className="p-3">
        {tab==='home'&&<div className="rounded-2xl bg-yellow-400 p-4 font-black">🔥 عروض المتاجر</div>}
        {tab==='stores'&&<div className="font-black">🏬 المتاجر الإلكترونية</div>}
        {tab==='office'&&<OfficeTab/>}
        {tab==='mystore'&&<div className="space-y-3"><h3 className="font-black">متجر حكيم</h3><OfficeTab/></div>}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
        <button onClick={()=>setTab('home')}>عروض</button>
        <button onClick={()=>setTab('stores')}>المتاجر</button>
        <button onClick={()=>setTab('office')}>مكتبي</button>
        <button onClick={()=>setTab('mystore')}>حكيم</button>
      </nav>
    </div>
  )
}
