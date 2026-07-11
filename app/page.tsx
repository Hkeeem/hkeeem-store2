"use client"
import { useState, useEffect } from "react"

const CITIES = ["الكل","الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك"]
const STORES = ["الكل","نون","أمازون","جرير","إكسترا"]

const CITY_COORDS: Record<string,{lat:number,lng:number}> = {
  "الرياض":{lat:24.71,lng:46.67}, "جدة":{lat:21.54,lng:39.17},
  "مكة":{lat:21.38,lng:39.85}, "المدينة":{lat:24.46,lng:39.61},
}

const FALLBACK = [
  { id:1, store:"نون", city:"الرياض", title:"عطور فاخرة خصم حتى 75%", price:149, image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"جرير", city:"الكل", title:"آيباد وسماعات عروض قوية", price:2199, image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600" },
]

function nearestCity(lat:number,lng:number){
  let best="الرياض", d=Infinity
  for(const [c,co] of Object.entries(CITY_COORDS)){ const cur=Math.hypot(lat-co.lat,lng-co.lng); if(cur<d){d=cur;best=c} }
  return best
}

export default function Page(){
  const [ecomCity,setEcomCity]=useState("الكل")
  const [store,setStore]=useState("الكل")
  const [loc,setLoc]=useState<"idle"|"loading"|"granted"|"denied">("idle")
  const [userCity,setUserCity]=useState<string|null>(null)
  const [offers,setOffers]=useState<any[]>(FALLBACK)
  const [showLogin,setShowLogin]=useState(false)
  const [toast,setToast]=useState("")

  useEffect(()=>{
    const s = localStorage.getItem("hakeem_city")
    if(s){ setUserCity(s); setEcomCity(s); setLoc("granted") }
  },[])

  useEffect(()=>{
    fetch(`/api/offers?city=${encodeURIComponent(ecomCity)}`)
     .then(r=>r.ok?r.json():null)
     .then(d=>{ if(d && Array.isArray(d) && d.length>0) setOffers(d) })
     .catch(()=>{})
  },[ecomCity])

  const requestLoc=()=>{
    if(!navigator.geolocation) return
    setLoc("loading")
    navigator.geolocation.getCurrentPosition(p=>{
      const near=nearestCity(p.coords.latitude,p.coords.longitude)
      setUserCity(near); setEcomCity(near); setLoc("granted")
      localStorage.setItem("hakeem_city",near)
      setToast(`تم حفظ موقعك: ${near}`)
    },()=>setLoc("denied"),{enableHighAccuracy:true,timeout:8000})
  }

  const filtered = offers.filter((o:any)=>
    (store==="الكل"||o.store===store) &&
    (ecomCity==="الكل"||o.city===ecomCity||o.city==="الكل")
  )

  return(
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    {/* زر الدخول بجانب السماح بالم
