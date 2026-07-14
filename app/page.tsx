'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import OfficeTab from '@/components/OfficeTab'

type Tab = 'home'|'stores'|'haraj'|'office'|'mystore'

export default function Page(){
  const [active,setActive]=useState<Tab>('office')
  return (
    <div className="min-h-screen bg-[#FFFCF6] pb-20">
      <Navbar />
      <main className="p-3">
        {active==='home' && (
          <div className="space-y-4">
            <h2 className="font-black text-lg">عروضكم</h2>
            <div className="grid grid-cols-2 gap-3">
              <ProductCard p={{name:'عطر فاخر',price:'250 ر.س'}} />
              <ProductCard p={{name:'عود ملكي',price:'390 ر.س'}} />
            </div>
          </div>
        )}
        {active==='stores' && <div className="p-4 bg-white rounded-2xl border">قريباً - المتاجر</div>}
        {active==='haraj' && <div className="p-4 bg-white rounded-2xl border">قريباً - الحراج</div>}
        {active==='office' && <OfficeTab />}
        {active==='mystore' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border p-4"><h3 className="font-bold">المفضلة</h3><p className="text-sm text-zinc-500 mt-1">عطر - 250 ر.س</p></div>
            <div className="bg-white rounded-2xl border divide-y">
              <div className="p-4 text-sm">سياسة الخصوصية</div>
              <div className="p-4 text-sm">الشروط والأحكام</div>
              <div className="p-4 text-sm">تواصل معنا</div>
              <div className="p-4 text-sm">مشاركة التطبيق</div>
            </div>
          </div>
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center z-20">
        <button onClick={()=>setActive('home')} className={`flex flex-col items-center text-xs ${active==='home'?'font-black':''}`}><span>🏠</span>الرئيسية</button>
        <button onClick={()=>setActive('stores')} className={`flex flex-col items-center text-xs ${active==='stores'?'font-black':''}`}><span>🏬</span>المتاجر</button>
        <button onClick={()=>setActive('haraj')} className={`flex flex-col items-center text-xs ${active==='haraj'?'font-black':''}`}><span>🔨</span>حراج</button>
        <button onClick={()=>setActive('office')} className={`flex flex-col items-center text-xs ${active==='office'?'font-black text-[#7A5A16]':''}`}><span>🏢</span>مكتبي العقاري</button>
        <button onClick={()=>setActive('mystore')} className={`flex flex-col items-center text-xs ${active==='mystore'?'font-black':''}`}><span>❤️</span>متجر حكيم</button>
      </nav>
    </div>
  )
}
