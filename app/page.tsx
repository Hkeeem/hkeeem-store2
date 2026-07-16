"use client"
import { useState } from "react"

const offers = [
  { id:1, store:"أمازون", title:"iPhone 15 Pro 256GB", price:4199, old:4619, save:420, img:"https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=600&q=80", dist:"0.8 كم", time:"قبل ساعتين" },
  { id:2, store:"إكسترا", title:"غسالة LG 7 كيلو", price:1449, old:1799, save:350, img:"https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=600&q=80", dist:"1.2 كم", time:"قبل 45 د" },
  { id:3, store:"نون", title:"Apple Watch Series 9", price:1699, old:1999, save:300, img:"https://images.unsplash.com/photo-1579811217875-89b34b0d2c5b?w=600&q=80", dist:"2.5 كم", time:"قبل 5 ساعات" },
  { id:4, store:"جرير", title:"Sony WH-1000XM5", price:1299, old:1499, save:200, img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80", dist:"0.4 كم", time:"قبل 15 د" },
]

export default function Page(){
  const [activeTab,setActiveTab]=useState("home")
  const [showMenu,setShowMenu]=useState(false)

  return(
  <div dir="rtl" className="min-h-screen bg-[#F6F0FF] font-[Tajawal,Cairo]">

    {/* الشريط العلوي الأسود */}
    <header className="bg-black text-white h-[62px] flex items-center justify-between px-4 sticky top-0 z-50">
      <button className="h-9 px-6 rounded-full bg-[#1C1C1C] border border-white/10 text-[13px]">السلة</button>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="text-[#D4AF37] font-black tracking-widest text-[20px]">hkeeem</div>
          <div className="text-[11px] text-white/60 -mt-1">متجر حكيم</div>
          {/* خطوط القائمة تحت الشعار */}
          <button onClick={()=>setShowMenu(!showMenu)} className="mt-1 flex flex-col gap-[3px] items-end">
            <span className="w-5 h-[2px] bg-white/80 rounded"></span>
            <span className="w-4 h-[2px] bg-white/80 rounded"></span>
            <span className="w-5 h-[2px] bg-white/80 rounded"></span>
          </button>
        </div>
        <div className="w-11 h-11 rounded-full border border-[#D4AF37]/50 bg-[#111] grid place-items-center">
          <span className="text-[10px] text-[#D4AF37]">حكيم</span>
        </div>
      </div>
    </header>

    {/* الشريط الأبيض الثاني - المساعد بين الشعار والدخول */}
    <div className="bg-white border-b border-black/5 h-[68px] flex items-center justify-between px-4 sticky top-[62px] z-40">
      {/* تسجيل / دخول يسار */}
      <div className="flex flex-col leading-tight">
        <button className="text-[#7C3AED] font-bold text-[13px]">تسجيل</button>
        <button className="text-black/40 text-[13px] -mt-0.5">دخول</button>
      </div>

      {/* المساعد الاقتصادي في الوسط - تم رفعه فوق */}
      <button className="h-11 px-6 rounded-full bg-[#7C3AED] text-white font-bold text-[14px] shadow-[0_8px_20px_rgba(124,58,237,0.35)] flex items-center gap-2">
        ✨ المساعد الاقتصادي AI
      </button>

      {/* الشعار يمين */}
      <div className="flex items-center gap-2">
        <div className="text-[#4C1D95] font-black text-[22px]">hkeeem</div>
        <div className="w-11 h-11 rounded-xl border border-amber-300/50 bg-amber-50 grid place-items-center text-[18px]">🧺</div>
      </div>
    </div>

    {/* قائمة جانبية تظهر عند الضغط على الخطوط */}
    {showMenu && (
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={()=>setShowMenu(false)}>
        <div className="absolute right-0 top-0 w-[260px] h-full bg-white p-5" onClick={e=>e.stopPropagation()}>
          <div className="font-black text-[18px] mb-6">القائمة</div>
          <div className="flex flex-col gap-4 text-[14px]">
            <button className="text-right py-2 border-b">🏠 الرئيسية</button>
            <button className="text-right py-2 border-b">🏬 المتاجر</button>
            <button className="text-right py-2 border-b">🎟️ كوبوناتي</button>
            <button className="text-right py-2 border-b">📦 طلباتي</button>
            <button className="text-right py-2 border-b">⚙️ الإعدادات</button>
          </div>
        </div>
      </div>
    )}

    {/* المحتوى - خلفية بنفسجي فاتح */}
    <main className="max-w-[480px] mx-auto px-3 pt-5 pb-28 bg-[#F6F0FF] min-h-screen">
      <h2 className="text-right font-black text-[16px] mb-4">قائمة العروض المتاحة</h2>

      <div className="grid grid-cols-2 gap-3">
        {offers.map(o=>(
          <div key={o.id} className="rounded-[20px] overflow-hidden bg-white border border-black/5 shadow-[0_4px_15px_rgba(0,0,0,0.04)]">
            <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-gray-50">
              <img src={o.img} className="w-full h-full object-cover" alt=""/>
              <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[11px] font-black">وفر {o.save} ر.س</span>
              <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 text-white text-[10px]">📍 {o.dist}</span>
            </div>
            <div className="px-3.5 pb-3 pt-1">
              <div className="text-[11px] text-black/40">{o.store} • {o.time}</div>
              <div className="font-bold text-[13px] leading-5 line-clamp-2 mt-1">{o.title}</div>
              <div className="flex gap-1.5 items-baseline mt-1"><span className="text-[#7C3AED] font-black text-[14px]">{o.price} ر.س</span><span className="text-[11px] line-through text-black/20">{o.old}</span></div>
            </div>
          </div>
        ))}
      </div>
    </main>

    {/* القائمة السفلية 5 خانات */}
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[72px] bg-white border-t border-black/5 flex justify-around items-center px-2 z-50">
      {[
        {id:"home", icon:"🏠", label:"الرئيسية"},
        {id:"offers", icon:"🎟️", label:"العروض"},
        {id:"cart", icon:"🛒", label:"السلة"},
        {id:"fav", icon:"❤️", label:"المفضلة"},
        {id:"account", icon:"👤", label:"حسابي"},
      ].map(t=>(
        <button key={t.id} onClick={()=>setActiveTab(t.id)} className={`flex flex-col items-center justify-center w-[64px] h-[56px] rounded-2xl ${activeTab===t.id?"bg-[#F3E8FF] text-[#7C3AED]":"text-black/40"}`}>
          <span className="text-[20px]">{t.icon}</span>
          <span className="text-[11px] font-bold mt-1">{t.label}</span>
        </button>
      ))}
    </nav>

  </div>
  )
}
