"use client";
import { useEffect, useState } from "react";

function Countdown({ endAt }: { endAt: string }) {
  const [text, setText] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date(endAt).getTime() - Date.now();
      if (d <= 0) {
        setText("انتهى");
        return;
      }
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      setText(h + "س " + m + "د " + s + "ث");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endAt]);
  return <span>{text}</span>;
}

export default function Page() {
  const [favs, setFavs] = useState<number[]>([]);
  useEffect(() => {
    try {
      const v = localStorage.getItem("hkeeem_favs");
      if (v) setFavs(JSON.parse(v));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("hkeeem_favs", JSON.stringify(favs));
    } catch {}
  }, [favs]);

  const offers = [
    {
      id: 1,
      title: "عرض بنده اليوم",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e",
      endAt: new Date(Date.now() + 5 * 3600000).toISOString(),
      lat: 21.5433,
      lng: 39.1728,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h1>عروضكم</h1>
      {offers.map((o) => (
        <div key={o.id} style={{ border: "1px solid #ddd", borderRadius: 16, padding: 12 }}>
          <img src={o.image} alt="" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 12 }} />
          <p><Countdown endAt={o.endAt} /></p>
          <h3>{o.title}</h3>
          <button
            onClick={() => {
              const url = "https://www.google.com/maps/dir/?api=1&destination=" + o.lat + "," + o.lng;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            اتجاهات
          </button>
          <button onClick={() => setFavs((p) => (p.includes(o.id)? p.filter((x) => x!== o.id) : [...p, o.id]))}>
            {favs.includes(o.id)? "❤️" : "🤍"}
          </button>
        </div>
      ))}
    </div>
  );
}
