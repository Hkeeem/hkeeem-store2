'use client'
import { useState } from 'react'
import OfficeTab from '@/components/OfficeTab'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'

export default function Page(){
 const [tab,setTab]=useState('office')
 return(
  <div className="min-h-screen bg-[#FFFCF6] pb-20">
   <Navbar/>
   <main className="p-3">
    {tab==='home' && <div><h2 className="font-black mb-3">عروضكم</h2><div className="grid grid-cols-2 gap-3"><ProductCard/><ProductCard/></div></div>}
    {tab==='stores' && <div className="bg-white p-6 rounded-2xl border text-center">المتاجر قريباً</div>}
    {tab==='haraj' && <div className="bg-white p-6 rounded-2xl border text-center">الحراج قريباً</div>}
    {tab==='office' && <OfficeTab/>}
    {tab==='store' && <div className="bg-white rounded-2xl border p-4"><h3 className="font-bold">متجر حكيم</h3><p className="text-sm text-zinc-500 mt-2">المفضلة • سياسة الخصوصية • الشروط</p></div>}
   </main>
   <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center">
    <button onClick={()=>setTab('home')} className={tab==='home'?'font-black':''}>🏠<br/>الرئيسية</button>
    <button onClick={()=>setTab('stores')} className={tab==='stores'?'font-black':''}>🏬<br/>المتاجر</button>
    <button onClick={()=>setTab('haraj')} className={tab==='haraj'?'font-black':''}>🔨<br/>حراج</button>
    <button onClick={()=>setTab('office')} className={tab==='office'?'font-black text-[#7A5A16]':''}>🏢<br/>مكتبي العقاري</button>
    <button onClick={()=>setTab('store')} className={tab==='store'?'font-black':''}>❤️<br/>متجر حكيم</button>
   </nav>
  </div>
 )
}
