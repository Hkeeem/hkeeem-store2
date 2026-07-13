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
        setT(`${h}س ${m}د ${s}ث`);
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
  const فتح_الخريطة = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div style={{border:'1px solid #ddd', borderRadius:16, padding:12, background:'#fff'}}>
      <img src={o.image} style={{width:'100%', height:160, objectFit:'cover', borderRadius:12}} />
      <p style={{fontSize:12, marginTop:6}}>{countdown}</p>
      <h3>{o.title}</h3>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button onClick={فتح_الخريطة} style={{flex:1, padding:8, borderRadius:12, background:'#000', color:'#fff'}}>اتجاهات</button>
        <button onClick={onFav}>{isFav? "❤️" : "🤍"}</button>
      </div>
    </div>
  );
}

export default function Page() {
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("hkeeem_favs");
    if (saved) {
      try { setFavs(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hkeeem_favs", JSON.stringify(favs));
  }, [favs]);

  const جلب_الموقع = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos.coords);
      if (typeof window!== "undefined" && "Notification" in window && Notification.permission === "granted") {
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
        {offers.map((o) => (
          <OfferCard key={o.id} o={o} isFav={favs.includes(o.id)} onFav={() => setFavs(p => p.includes(o.id)? p.filter(x=>x!==o.id) : [...p, o.id])} />
        ))}
      </div>
    </div>
  );
}
