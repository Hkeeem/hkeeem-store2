"use client"
import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

type LatLng = { lat: number; lng: number }
type Offer = { id: number; title: string; store: string; price: number; lat: number; lng: number }

const GOLD = "#7A5A16"
const OFFERS: Offer[] = [
  { id: 1, title: "عطر حكيم الملكي 100مل", store: "حكيم", price: 199, lat: 21.5433, lng: 39.1728 },
  { id: 2, title: "مكيف سبيلت 18000 وحدة", store: "إكسترا", price: 2199, lat: 21.62, lng: 39.15 },
  { id: 3, title: "سلة التوفير - بنده", store: "بنده", price: 99, lat: 21.58, lng: 39.19 },
  { id: 4, title: "جوال ايفون 15 - 128GB", store: "جرير", price: 3499, lat: 21.6, lng: 39.18 },
  { id: 5, title: "عطر مسك العود الفاخر", store: "حكيم", price: 249, lat: 21.5433, lng: 39.1728 },
  { id: 6, title: "قلاية هوائية 5.5 لتر", store: "إكسترا", price: 329, lat: 21.62, lng: 39.15 },
]

function dist(a: LatLng, b: LatLng) {
  const R = 6371
  const d1 = (b.lat - a.lat) * Math.PI / 180
  const d2 = (b.lng - a.lng) * Math.PI / 180
  const s = Math.sin(d1/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(d2/2)**2
  return 2 * R * Math.asin(Math.sqrt(s))
}
const price = (n:number)=> new Intl.NumberFormat("ar-SA",{style:"currency",currency:"SAR"}).format(n)
const km = (k:number)=> k<1? `${Math.round(k*1000)} م` : `${k.toFixed(1)} كم`

export default function Page(){
  const [q,setQ]=useState("")
  const [loc,setLoc]=useState<LatLng|null>(null)
  const [scan,setScan]=useState(false)
  const [sort,setSort]=useState<"near"|"cheap"|"store">("near")
  const qr = useRef<Html5Qrcode|null>(null)

  useEffect(()=>{ navigator.geolocation?.getCurrentPosition(p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude})) },[])

  const stop = async()=>{ try{await qr.current?.stop(); await qr.current?.clear()}catch{} setScan(false) }
  const onScan = (code:string)=>{ setQ(code); stop() }
  const start = async()=>{
    setScan(true)
    setTimeout(async()=>{
      try{
        const r = new Html5Qrcode("reader")
        qr.current=r
        await r.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:250}},(d)=>onScan(d),()=>{})
      }catch{ setScan(false) }
    },200)
  }

  let list = OFFERS.map(o=>{ const d=loc?dist(loc,{lat:o.lat,lng:o.lng}):999; return {...o,d} }).filter(o=> !q || o.title.includes(q) || o.store.includes(q))
  if(sort==="cheap") list=list.sort((a,b)=>a.price-b.price)
  else if(sort==="store") list=list.sort((a,b)=>a.store.localeCompare(b.store,"ar"))
  else list=list.sort((a,b)=>a.d-b.d)

  return(
    <div className="min-h-screen bg-[#FFFCF7]">
      <header className="sticky top-0 bg-white border-b"><div className="max-w-6xl mx-auto p-4 flex justify-between"><b style={{color:GOLD}}>hkeeem-store2</b><span className="text-sm opacity-60">{list.length} عروض</span></div></header>
      <main className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mt-3"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن عرض أو متجر..." className="flex-1 border rounded-xl px-4 py-3"/><button onClick={scan?stop:start} style={{background:GOLD}} className="px-5 rounded-xl text-white">{scan?"إيقاف":"مسح"}</button></div>
        <div className="flex gap-2 mt-3"><button onClick={()=>setSort("near")} className={`px-3 py-1.5 rounded-full border text-sm ${sort==="near"?"bg-black text-white":"bg-white"}`}>الأقرب</button><button onClick={()=>setSort("cheap")} className={`px-3 py-1.5 rounded-full border text-sm ${sort==="cheap"?"bg-black text-white":"bg-white"}`}>الأرخص</button><button onClick={()=>setSort("store")} className={`px-3 py-1.5 rounded-full border text-sm ${sort==="store"?"bg-black text-white":"bg-white"}`}>المتجر</button></div>
        {scan && <div className="mt-4 border rounded-xl overflow-hidden bg-black"><div id="reader"/></div>}
        <div className="mt-6 grid gap-3">{list.map(o=><div key={o.id} className="bg-white border rounded-2xl p-4"><h3 className="font-semibold">{o.title}</h3><p className="text-sm opacity-60">{o.store} · {loc?km(o.d):"جاري تحديد الموقع"}</p><div className="flex justify-between items-center mt-3"><b>{price(o.price)}</b><div className="flex gap-2"><span className="text-xs px-2.5 py-1 rounded-full bg-amber-50" style={{color:GOLD}}>متوفر</span><a href={`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`} target="_blank" className="text-xs border px-3 py-1.5 rounded-full">توجيه</a></div></div></div>)}</div>
      </main>
    </div>
  )
}
