"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"

type LatLng = { lat: number; lng: number }
type Offer = {
  id: number
  title: string
  store: string
  price: number
  lat: number
  lng: number
  endsAt?: string
}

const GOLD_DARK = "#7A5A16"

const OFFERS_INIT: Offer[] = [
  { id: 1, title: "عطر حكيم الملكي 100مل", store: "حكيم", price: 199, lat: 21.5433, lng: 39.1728 },
  { id: 2, title: "مكيف سبيلت 18000 وحدة", store: "إكسترا", price: 2199, lat: 21.62, lng: 39.15 },
  { id: 3, title: "سلة التوفير - بنده", store: "بنده", price: 99, lat: 21.58, lng: 39.19 },
  { id: 4, title: "جوال ايفون 15 - 128GB", store: "جرير", price: 3499, lat: 21.60, lng: 39.18 },
  { id: 5, title: "عطر مسك العود الفاخر", store: "حكيم", price: 249, lat: 21.5433, lng: 39.1728 },
  { id: 6, title: "قلاية هوائية 5.5 لتر", store: "إكسترا", price: 329, lat: 21.62, lng: 39.15 },
]

function haversine(a: LatLng, b: LatLng) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return 2 * R * Math.asin(Math.sqrt(s))
}

const formatPrice = (n:number) => new Intl.NumberFormat("ar-SA",{style:"currency",currency:"SAR"}).format(n)
const formatDistance = (k:number) => k<1? `${Math.round(k*1000)} م` : `${k.toFixed(1)} كم`

function Countdown({ end }: { end?: string }) {
  const [txt, setTxt] = useState("متوفر")
  useEffect(()=>{
    if(!end) return
    const id = setInterval(()=>{
      const diff = new Date(end).getTime() - Date.now()
      if(diff<=0){ setTxt("انتهى"); clearInterval(id); return }
      setTxt(`${Math.floor(diff/3600000)}س ${Math.floor(diff%3600000/60000)}د`)
    },1000)
    return ()=>clearInterval(id)
  },[end])
  return <span>{txt}</span>
}

export default function Page(){
  const [offers] = useState<Offer[]>(OFFERS_INIT)
  const [userLoc, setUserLoc] = useState<LatLng|null>(null)
  const [query, setQuery] = useState("")
  const [scanning, setScanning] = useState(false)
  const [sortBy, setSortBy] = useState<"distance"|"price"|"store">("distance")
  const qrRef = useRef<Html5Qrcode|null>(null)

  useEffect(()=>{
    navigator.geolocation?.getCurrentPosition(p=>setUserLoc({lat:p.coords.latitude,lng:p.coords.longitude}))
  },[])

  const stopScanner = async ()=>{
    try{ await qrRef.current?.stop(); await qrRef.current?.clear() }catch{}
    setScanning(false)
  }

  const handleBarcode = (code:string)=>{
    setQuery(code)
    stopScanner()
  }

  const startScanner = async ()=>{
    setScanning(true)
    setTimeout(async ()=>{
      try{
        const qr = new Html5Qrcode("reader")
        qrRef.current = qr
        await qr.start(
          { facingMode:"environment" },
          { fps:10, qrbox:{width:250,height:250} },
          (decoded)=>{ handleBarcode(decoded) },
          ()=>{}
        )
      }catch{ setScanning(false) }
    },150)
  }

  const filtered = useMemo(()=>{
    const list = offers.map(o=>({...o,distance:userLoc?haversine(userLoc,{lat:o.lat,lng:o.lng}):undefined}))
     .filter(o=> o.title.includes(query) || o.store.includes(query) || query==="")
    if(sortBy==="price") list.sort((a,b)=>a.price-b.price)
    else if(sortBy==="store") list.sort((a,b)=>a.store.localeCompare(b.store,"ar"))
    else list.sort((a,b)=>(a.distance??999)-(b.distance??999))
    return list
  },[offers,userLoc,query,sortBy])

  return(
    <div className="min-h-screen bg-[#FFFCF7]">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <h1 className="font-bold" style={{color:GOLD_DARK}}>hkeeem-store2</h1>
          <span className="text-sm opacity-60">{filtered.length} عروض</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="mt-3 flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن عرض أو متجر..." className="flex-1 border rounded-xl px-4 py-3 outline-none" />
          <button onClick={scanning?stopScanner:startScanner} className="px-5 py-3 rounded-xl text-white font-medium" style={{background:GOLD_DARK}}>{scanning?"إيقاف":"مسح"}</button>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={()=>setSortBy("distance")} className={`px-3 py-1.5 rounded-full text-sm border ${sortBy==="distance"?"bg-zinc-900 text-white":"bg-white"}`}>الأقرب</button>
          <button onClick={()=>setSortBy("price")} className={`px-3 py-1.5 rounded-full text-sm border ${sortBy==="price"?"bg-zinc-900 text-white":"bg-white"}`}>الأرخص</button>
          <button onClick={()=>setSortBy("store")} className={`px-3 py-1.5 rounded-full text-sm border ${sortBy==="store"?"bg-zinc-900 text-white":"bg-white"}`}>المتجر</button>
        </div>

        {scanning && <div className="mt-4 overflow-hidden rounded-xl border bg-black"><div id="reader" className="w-full" /></div>}

        <div className="mt-6 grid gap-3">
          {filtered.map(o=>(
            <div key={o.id} className="border rounded-2xl p-4 bg-white shadow-sm">
              <h3 className="font-semibold text-[17px]">{o.title}</h3>
              <p className="text-sm opacity-60 mt-1">{o.store} · {o.distance?formatDistance(o.distance):"جاري تحديد الموقع"}</p>
              <div className="mt-3 flex justify-between items-center">
                <b>{formatPrice(o.price)}</b>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50" style={{color:GOLD_DARK}}><Countdown end={o.endsAt} /></span>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`} target="_blank" className="text-xs px-3 py-1.5 rounded-full border">توجيه</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
