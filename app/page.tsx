"use client";
import { useEffect, useState, useCallback } from "react";

function useCountdown(endAt: string) {
  const [t, setT] = useState("");
  useEffect(() => {
    const i = setInterval(() => {
      const d = new Date(endAt).getTime() - Date.now();
      if (d <= 0) setT("انتهى");
      else {
        const h = Math.floor(d / 3600000);
        const m = Math.floor((d % 3600000) / 60000);
        const s = Math.floor((d % 60000) / 1000);
        setT(`${h}س ${m}د ${s}ث`);
      }
    }, 1000);
    return () => clearInterval(i);
  }, [endAt]);
  return t;
}

function OfferCard({ o, isFav, onFav }: any) {
  const countdown = useCountdown(o.endAt);
  return (
    <div style={{border:'1px solid #ddd', borderRadius:16, padding:12}}>
      <img src={o.image} style={{width:'100%', height:160, objectFit:'cover', borderRadius:12}} />
      <p>{countdown}</p>
      <h3>{o.title}</h3>
      <button onClick={()=> {
        const url=`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`;
        window.open(url,"_blank","noopener,noreferrer");
      }}>اتجاهات</button>
      <button onClick={onFav}>{isFav? "❤️" : "🤍"}</button>
    </div>
  )
}

export default function Page() {
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(()=>{
    const d = localStorage.getItem("hkeeem_favs");
    if(d) setFavs(JSON.parse(d));
  },[]);

  useEffect(()=>{
    localStorage.setItem("hkeeem_favs", JSON.stringify(favs));
  }, [favs]);

  const جلب_الموقع = useCallback(()=>{
    if(!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos=>{
      console.log(pos.coords);
      if(typeof window!== "undefined" && "Notification" in window && Notification.permission === "granted"){
        new Notification("تم تحديد موقعك");
      }
    });
  },[]);

  const offers = [
    {id:1, title:"عرض تجريبي", image:"https://images.unsplash.com/photo-1542838132-92c53300491e", endAt: new Date(Date.now()+3600000).toISOString(), lat:21.5, lng:39.1}
  ];

  return (
    <div style={{padding:16}}>
      <button onClick={جلب_الموقع}>جلب موقعي</button>
      <div style={{display:'grid', gap:12, marginTop:16}}>
        {offers.map(o=>(
          <OfferCard key={o.id} o={o} isFav={favs.includes(o.id)} onFav={()=> setFavs(p=> p.includes(o.id)? p.filter(x=>x!==o.id) : [...p, o.id])} />
        ))}
      </div>
    </div>
  )
}
