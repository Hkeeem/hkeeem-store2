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
const fmtPrice = (n:number)=> new Intl.NumberFormat("ar-SA",{style:"currency",currency:"SAR"}).format(n)
const fmtKm = (k:number)=> k<1? `${Math.round(k*1000)} م` : `${k.toFixed(1)} كم`

export default function Page(){
  const [q,setQ]=useState("")
  const [loc,setLoc]=useState<LatLng|null>(null)
  const [scan,setScan]=useState(false)
  const [sort,setSort]=useState<"near"|"cheap"|"store">("near")
  const qr = useRef<Html5Qrcode|null>(null)

  useEffect(()=>{ 
    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude}), ()=>{}, {enableHighAccuracy:true})
  },[])

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
    <div dir="rtl" style={{minHeight:"100vh", background:"#FFFCF7", fontFamily:"system-ui"}}>
      <header style={{position:"sticky", top:0, background:"#fff", borderBottom:"1px solid #eee", zIndex:10}}>
        <div style={{maxWidth:900, margin:"0 auto", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <b style={{color:GOLD, fontSize:18}}>hkeeem-store2</b>
          <span style={{fontSize:13, color:"#888"}}>{list.length} عروض</span>
        </div>
      </header>
      <main style={{maxWidth:900, margin:"0 auto", padding:"16px"}}>
        <div style={{display:"flex", gap:8, marginTop:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن عرض أو متجر..." style={{flex:1, border:"1px solid #ddd", borderRadius:12, padding:"12px 16px", outline:"none", fontSize:15}} />
          <button onClick={scan?stop:start} style={{background:GOLD, color:"#fff", border:"none", borderRadius:12, padding:"0 20px", fontWeight:600}}>{scan?"إيقاف":"مسح"}</button>
        </div>
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button onClick={()=>setSort("near")} style={{padding:"6px 14px", borderRadius:20, border:"1px solid #ddd", fontSize:13, background: sort==="near" ? "#111":"#fff", color: sort==="near" ? "#fff":"#111"}}>الأقرب</button>
          <button onClick={()=>setSort("cheap")} style={{padding:"6px 14px", borderRadius:20, border:"1px solid #ddd", fontSize:13, background: sort==="cheap" ? "#111":"#fff", color: sort==="cheap" ? "#fff":"#111"}}>الأرخص</button>
          <button onClick={()=>setSort("store")} style={{padding:"6px 14px", borderRadius:20, border:"1px solid #ddd", fontSize:13, background: sort==="store" ? "#111":"#fff", color: sort==="store" ? "#fff":"#111"}}>المتجر</button>
        </div>
        {scan && <div style={{marginTop:16, border:"1px solid #ddd", borderRadius:12, overflow:"hidden", background:"#000"}}><div id="reader" style={{width:"100%"}}/></div>}
        <div style={{marginTop:20, display:"grid", gap:12}}>
          {list.map(o=>(
            <div key={o.id} style={{background:"#fff", border:"1px solid #e9e2d6", borderRadius:16, padding:16}}>
              <div style={{fontWeight:700, fontSize:16, color:"#111", lineHeight:1.4}}>{o.title}</div>
              <div style={{fontSize:13, color:"#777", marginTop:6}}>{o.store} · {loc?fmtKm(o.d):"جاري تحديد الموقع"}</div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14}}>
                <div style={{fontWeight:800, fontSize:16, color:"#111"}}>{fmtPrice(o.price)}</div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <span style={{fontSize:12, padding:"5px 10px", borderRadius:20, background:"#fef9c3", color:GOLD, fontWeight:600}}>متوفر</span>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${o.lat},${o.lng}`} target="_blank" style={{fontSize:12, padding:"6px 12px", borderRadius:20, border:"1px solid #ccc", color:"#111", textDecoration:"none", background:"#fff"}}>توجيه</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
