"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

type LatLng = { lat: number; lng: number };
type City = { name: string; label: string; lat: number; lng: number };
type Offer = { id: number; title: string; store: string; price: number; oldPrice?: number; image: string; endAt: string; location: LatLng; city: string };

const GOLD = "#B68A2E";
const GOLD_DARK = "#8A6A22";

const CITIES: City[] = [
  { name: 'جدة', label: 'جدة، الروضة', lat: 21.5433, lng: 39.1728 },
  { name: 'مكة', label: 'مكة، العزيزية', lat: 21.3891, lng: 39.8579 },
  { name: 'الرياض', label: 'الرياض، العليا', lat: 24.7136, lng: 46.6753 },
];

const OFFERS: Offer[] = [
  { id: 1, title: 'عطر حكيم الملكي 100مل', store: 'حكيم', price: 199, oldPrice: 350, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601', endAt: new Date(Date.now() + 1000*60*60*5).toISOString(), location: { lat: 21.5433, lng: 39.1728 }, city: 'جدة' },
  { id: 2, title: 'مكيف سبيلت 18000 وحدة', store: 'اكسترا', price: 2199, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', endAt: new Date(Date.now() + 1000*60*60*10).toISOString(), location: { lat: 21.58, lng: 39.16 }, city: 'جدة' },
  { id: 3, title: 'سلة التوفير - بنده', store: 'بنده', price: 99, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e', endAt: new Date(Date.now() + 1000*60*30).toISOString(), location: { lat: 21.3891, lng: 39.8579 }, city: 'مكة' },
];

function haversine(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
}
const formatPrice = (n: number) => `${n.toLocaleString('ar-SA')} ر.س`;
const formatDistance = (k: number) => k < 1? `${Math.round(k*1000)} م` : `${k.toFixed(1)} كم`;

// 1. تم إصلاح الـ Hook خارج الـ map
function useCountdown(end: string) {
  const [txt, setTxt] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(end).getTime() - Date.now();
      if (diff <= 0) return setTxt('انتهى');
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTxt(`${h}س ${m}د ${s}ث`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);
  return txt;
}

// 2. مكون مستقل يحل مشكلة Rules of Hooks
function OfferCard({ offer, dist, isFav, onFav }: { offer: Offer; dist?: string; isFav: boolean; onFav: ()=>void }) {
  const countdown = useCountdown(offer.endAt);
  const فتح_الخريطة = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${offer.location.lat},${offer.location.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="rounded-2xl border bg-white p-3 dark:bg-zinc-900">
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <Image src={offer.image} alt={offer.title} fill className="object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">{countdown}</span>
      </div>
      <h3 className="mt-2 font-bold">{offer.title}</h3>
      <p className="text-sm opacity-60">{offer.store} {dist? `• ${dist}` : ''}</p>
      <p className="mt-1 font-bold" style={{color:GOLD}}>{formatPrice(offer.price)}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={فتح_الخريطة} className="flex-1 rounded-xl bg-black py-2 text-white">اتجاهات</button>
        <button onClick={onFav} className="rounded-xl border px-3">{isFav? '❤️' : '🤍'}</button>
      </div>
    </div>
  );
}

export default function Page() {
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<number[]>([]);

  // 3. إصلاح localStorage مع SSR
  useEffect(() => {
    const data = localStorage.getItem("hkeeem_favs");
    if (data) { try { setFavs(JSON.parse(data)) } catch {} }
  }, []);
  useEffect(() => {
    localStorage.setItem("hkeeem_favs", JSON.stringify(favs));
  }, [favs]);

  // 4. إصلاح اسم الدالة وتم توحيده
  const جلب_الموقع = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      if (typeof window!== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("تم تحديد موقعك بنجاح");
      }
    });
  }, []);

  const المفلترة = useMemo(() => {
    return OFFERS.filter(o => o.title.includes(query) || o.store.includes(query));
  }, [query]);

  return (
    <main className="p-4">
      <header className="mb-4 flex justify-between">
        <h1 className="text-xl font-black">عروضكم</h1>
        <button onClick={جلب_الموقع} className="rounded-full border px-4 py-2">العروض القريبة</button>
      </header>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="وش تدور؟" className="mb-4 w-full rounded-xl border p-3" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {المفلترة.map(o => {
          const d = userLoc? formatDistance(haversine(userLoc, o.location)) : undefined;
          return <OfferCard key={o.id} offer={o} dist={d} isFav={favs.includes(o.id)} onFav={()=> setFavs(p=> p.includes(o.id)? p.filter(x=>x!==o.id) : [...p, o.id])} />
        })}
      </div>
    </main>
  );
}
