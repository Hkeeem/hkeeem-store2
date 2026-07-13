"use client";
import { useEffect, useState, useCallback } from "react";

function useCountdown(endAt: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date(endAt).getTime() - Date.now();
      if (d <= 0) setT("انتهى");
      else {
        const h = Math.floor(d / 3600000);
        const m = Math.floor((d % 3600000) / 60000);
        const s = Math.floor((d % 60000) / 1000);
        setT(h + "س " + m + "د " + s + "ث");
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endAt]);
  return t;
}

function OfferCard({ o, isFav, onFav }: any) {
  const countdown = useCountdown(o.endAt);
  return (
    <div style={{border:'1px solid #ddd', borderRadius:16, padding:12, background:'#fff'}}>
      <img src={o.image} width="100%" style={{height:160, objectFit:'cover', borderRadius:12}} alt="" />
      <p>{countdown}</p>
      <h3>{o.title}</h3>
      <button onClick={() => {
        const url = "https://www.google.com/maps/dir/?api=1&destination=" + o.lat + "," + o.lng;
        window.open(url, "_blank", "noopener,noreferrer");
      }}>اتجاهات</button>
      <button onClick={onFav} style={{marginLeft:8}}>{isFav ? "❤️" : "🤍"}</button>
    </div>
  );
}

export default function Page() {
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(() => {
    const d = localStorage.getItem("hkeeem_favs");
    if (d) { try { setFavs(JSON.parse(d)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("hkeeem_favs", JSON.stringify(favs));
  }, [favs]);

  const جلب_الموقع = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("تم تحديد موقعك");
      }
    });
  }, []);

  const offers = [
    { id: 1, title: "عرض بنده", image: "https://images.unsplash.com/photo-1542838132-92c53300491e", endAt: new Date(Date.now()+3600000*5).toISOString(), lat: 21.5433, lng: 39.1728 }
  ];

  return (
    <div style={{padding:16}}>
      <button onClick={جلب_الموقع} style={{border:'1px solid #ccc', borderRadius:20, padding:'8px 16px'}}>جلب موقعي</button>
      <div style={{display:'grid', gap:16, marginTop:16}}>
        {offers.map((o:any) => (
          <OfferCard key={o.id} o={o} isFav={favs.includes(o.id)} onFav={() => setFavs(p => p.includes(o.id) ? p.filter((x:number)=>x!==o.id) : [...p, o.id])} />
        ))}
      </div>
    </div>
  );
}
