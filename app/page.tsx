"use client"
import { useState } from "react"

const PRODUCTS = [
  { id: 1, name: "عطر هكيم الخاص", price: 249, cat: "عطور", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id: 2, name: "ساعة كلاسيك", price: 399, cat: "ساعات", img: "https://images.unsplash.com/photo-1524805444973-bf35bb96a0d3?w=600" },
  { id: 3, name: "محفظة جلد فاخرة", price: 129, cat: "جلديات", img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600" },
  { id: 4, name: "نظارة حماية", price: 189, cat: "اكسسوارات", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600" },
  { id: 5, name: "حقيبة ظهر", price: 279, cat: "حقائب", img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600" },
  { id: 6, name: "سماعة عازلة", price: 319, cat: "تقنية", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
]

export default function Home() {
  const [cart, setCart] = useState<any[]>([])
  const [cat, setCat] = useState("الكل")
  const cats = ["الكل", ...Array.from(new Set(PRODUCTS.map(p=>p.cat)))]
  const filtered = cat === "الكل" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat)
  const total = cart.reduce((s,i)=>s+i.price,0)
  const add = (p:any) => setCart([...cart, p])

  const orderText = `مرحبا، طلب جديد من متجر حكيم:%0A${cart.map(c=>`- ${c.name} (${c.price} ر.س)`).join("%0A")}%0A%0Aالمجموع: ${total} ر.س`

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800 p-4 flex justify-between items-center">
        <b className="text-xl tracking-widest">HKEEEM</b>
        <div className="flex gap-2 items-center">
          <span className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">السلة {cart.length}</span>
        </div>
      </header>

      <section className="text-center py-12 px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-3">متجر حكيـم</h1>
        <p className="text-zinc-400">تشكيلة مختارة بعناية • دفع عند الاستلام • شحن سريع</p>
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-5 py-2 rounded-full text-sm border ${cat===c ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400'}`}>{c}</button>
          ))}
        </div>
      </section>

      <main className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 p-4">
        {filtered.map(p=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-[20px] overflow-hidden">
            <img src={p.img} className="w-full h-48 md:h-64 object-cover" />
            <div className="p-4">
              <div className="text-[11px] text-zinc-500 mb-1">{p.cat}</div>
              <h3 className="font-bold text-[15px]">{p.name}</h3>
              <div className="flex justify-between items-center mt-3">
                <span className="font-black">{p.price} ر.س</span>
                <button onClick={()=>add(p)} className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">إضافة</button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900/90 backdrop-blur border-t border-zinc-800">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div><div className="text-sm text-zinc-400">المجموع</div><div className="font-black text-lg">{total} ر.س</div></div>
            <div className="flex gap-2">
              <button onClick={()=>setCart([])} className="px-4 py-3 rounded-full border border-zinc-700 text-sm">تفريغ</button>
              <a href={`https://wa.me/966500000000?text=${orderText}`} target="_blank" className="bg-[#25D366] text-black font-black px-6 py-3 rounded-full text-sm">طلب واتساب</a>
            </div>
          </div>
        </div>
      )}
      <div className="h-24"></div>
    </div>
  )
}
