"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'

type LatLng = { lat:number; lng:number }
type City = { name:string; label:string; lat:number; lng:number }
type Offer = {
  id:number; title:string; store:string; category:string; price:number; old_price:number; discount:number; image:string; views:number; priceDropToday?:boolean; recommended?:boolean; isOwn?:boolean
  location: LatLng & { address:string; district:string }
}
type OfferWithDistance = Offer & { distance:number|null }

const GOLD = "#B68A2E"
const GOLD_DARK = "#7A5A16"
const GOLD_LIGHT = "#D4AF37"
const BEIGE_BG = "bg-[#FDF6E8]"

const CITIES: City[] = [
  { name:'جدة', label:'حي الروضة، جدة', lat:21.543333, lng:39.172778 },
  { name:'مكة', label:'العزيزية، مكة', lat:21.389082, lng:39.857912 },
  { name:'الرياض', label:'العليا، الرياض', lat:24.713552, lng:46.675297 },
  { name:'الدمام', label:'الشاطئ، الدمام', lat:26.42068, lng:50.088795 },
]

const OFFERS: Offer[] = [
  { id:1, title:'عطر حكيم الملكي 100مل', store:'متجر حكيم', category:'متجر حكيم', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', views:5420, recommended:true, isOwn:true, location:{lat:21.5439, lng:39.1731, address:'حي الروضة، جدة', district:'الروضة'} },
  { id:2, title:'محفظة جلد + ساعة كلاسيك', store:'متجر حكيم', category:'متجر حكيم', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', views:3210, isOwn:true, location:{lat:21.5451, lng:39.1702, address:'حي الروضة، جدة', district:'الروضة'} },
  { id:3, title:'سلة التوفير - بنده', store:'بنده', category:'عروضكم', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', views:8920, priceDropToday:true, location:{lat:21.57961, lng:39.13214, address:'شارع فلسطين، جدة', district:'الحمراء'} },
  { id:4, title:'آيباد برو M2 12.9', store:'جرير', category:'إلكترونيات', price:2199, old_price:3999, discount:45, image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600', views:10230, priceDropToday:true, location:{lat:21.55226, lng:39.15801, address:'شارع التحلية، جدة', district:'الأندلس'} },
  { id:5, title:'زيت زيتون بكر', store:'التميمي', category:'عروضكم', price:19, old_price:39, discount:51, image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', views:6730, priceDropToday:true, location:{lat:21.48581, lng:39.19250, address:'حي السامر، جدة', district:'السامر'} },
]

function haversine(a:LatLng, b:LatLng){
  const R=6371
  const dLat=(b.lat-a.lat)*Math.PI/180
  const dLng=(b.lng-a.lng)*Math.PI/180
  const s1=Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s1))
}
const formatDistance = (km:number)=> km<1? `${Math.round(km*1000)} م` : `${km.toFixed(1)} كم`
const formatPrice = (n:number)=> `${n.toLocaleString('ar-SA')} ر.س`

export default function Page(){
  const [userLoc,setUserLoc]=useState<LatLng|null>(null)
  const [cityManual,setCityManual]=useState<City|null>(null)
  const [locLoading,setLocLoading]=useState(false)
  const [locError,setLocError]=useState('')
  const [showMapFor,setShowMapFor]=useState<OfferWithDistance|null>(null)
  const [showAllMap,setShowAllMap]=useState(false)
  const 
