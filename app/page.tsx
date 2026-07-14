"use client"
import { useEffect, useMemo, useState } from "react"

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
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(n)

const formatDistance = (k: number) =>
  k < 1? `${Math.round(k * 1000)} م` : `${k.toFixed(1)} كم`

function useCountdown(end?: string) {
  const [left, setLeft] = useState("")
  useEffect(() => {
    if (!end) return
    const id = setInterval(() => {
      const diff = new Date(end).getTime() - Date.now()
      if (diff <= 0) {
        setLeft("انتهى")
        clearInterval(id)
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setLeft(`${h}س ${m}د`)
    }, 1000)
    return () => clearInterval(id)
  }, [end])
  return left
}

export default function Page() {
  const [offers] = useState<Offer[]>(OFFERS_INIT)
  const [userLoc, setUserLoc] = useState<LatLng | null>(null)
  const [query, setQuery] = useState("")
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setUserLoc(null)
    )
  }, [])

  const startScanner = async () => {
    setScanning(true)
    // هنا تحط كود تشغيل الكاميرا الحقيقي مثل html5-qrcode
    // مؤقتا نعتبره محاكاة
    setTimeout(() => setScanning(false), 3000)
  }

  const handleBarcode = (code: string) => {
    setQuery(code)
    setScanning(false)
  }

  const filtered = useMemo(() => {
    return offers
     .map((o) => ({
       ...o,
        distance: userLoc? haversine(userLoc, { lat: o.lat, lng: o.lng }) : undefined,
      }))
     .filter((o) => o.title.includes(query) || o.store.includes(query) || query === "")
     .sort((a, b) => (a.distance?? 999) - (b.distance?? 999))
  }, [offers, userLoc, query])

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-zinc-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <h1 className="font-bold" style={{ color: GOLD_DARK }}>hkeeem-store2</h1>
          <span className="text-sm opacity-60">{filtered.length} عروض</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="mt-3 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن عرض أو متجر..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
          />
          <button
            onClick={startScanner}
            className="px-5 py-3 rounded-xl text-white font-medium"
            style={{ background: GOLD_DARK }}
          >
            مسح
          </button>
        </div>

        {scanning && (
          <div className="mt-4 p-4 border-2 border-dashed rounded-xl text-center">
            <p>الكاميرا تعمل... وجه الباركود للكاميرا</p>
            <button onClick={() => handleBarcode("100مل")} className="mt-2 text-sm underline">
              محاكاة قراءة باركود
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <div key={o.id} className="border rounded-2xl p-4 bg-white shadow-sm">
              <h3 className="font-semibold">{o.title}</h3>
              <p className="text-sm opacity-60 mt-1">
                {o.store} · {o.distance? formatDistance(o.distance) : "جاري تحديد الموقع"}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <b>{formatPrice(o.price)}</b>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50" style={{ color: GOLD_DARK }}>
                  {o.endsAt? useCountdown(o.endsAt) : "متوفر"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
