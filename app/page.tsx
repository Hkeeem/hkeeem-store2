'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Offer, OfferWithDistance, Tab, City, LegalType } from '@/types'
import { haversine } from '@/lib/utils'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import HomeTab from '@/components/HomeTab'
import StoresTab from '@/components/StoresTab'
import HarajTab from '@/components/HarajTab'
import OfficeTab from '@/components/OfficeTab'
import HkeemTab from '@/components/HkeemTab'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import AssistantModal from '@/components/AssistantModal'
import LegalModals from '@/components/LegalModals'
import { supabase } from '@/lib/supabase'

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

const OFFERS: Offer[] = [
  { id:1, title:'毓胤乇 丨賰賷賲 丕賱賲賱賰賷 100賲賱', store:'賲鬲噩乇 丨賰賷賲', price:199, old_price:349, discount:43, image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600', isOwn:true, location:{lat:21.5439,lng:39.1731,address:'丨賷 丕賱乇賵囟丞貙 噩丿丞',district:'丕賱乇賵囟丞'} },
  { id:2, title:'賲丨賮馗丞 噩賱丿 + 爻丕毓丞', store:'賲鬲噩乇 丨賰賷賲', price:399, old_price:619, discount:35, image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600', isOwn:true, location:{lat:21.5451,lng:39.1702,address:'丨賷 丕賱乇賵囟丞貙 噩丿丞',district:'丕賱乇賵囟丞'} },
  { id:3, title:'爻賱丞 丕賱鬲賵賮賷乇 - 亘賳丿賴', store:'亘賳丿賴', price:89, old_price:149, discount:40, image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', location:{lat:21.57961,lng:39.13214,address:'卮丕乇毓 賮賱爻胤賷賳貙 噩丿丞',district:'丕賱丨賲乇丕亍'} },
]

export default function Page(){
  const [tab,setTab]=useState<Tab>('home')
  const [user,setUser]=useState<any>(null)
  const [userLoc,setUserLoc]=useState<{lat:number;lng:number}|null>(null)
  const [cityManual,setCityManual]=useState<City|null>(null)
  const [radiusKm,setRadiusKm]=useState(5)
  const [nearbyOnly,setNearbyOnly]=useState(false)
  const [searchQ,setSearchQ]=useState('')
  const [toast,setToast]=useState('')
  const [authOpen,setAuthOpen]=useState(false)
  const [assistantOpen,setAssistantOpen]=useState(false)
  const [legal,setLegal]=useState<LegalType>(null)
  const [showAllMap,setShowAllMap]=useState(false)
  const [mapFor,setMapFor]=useState<OfferWithDistance|null>(null)

  const showToast = useCallback((m:string)=>{ setToast(m); setTimeout(()=>setToast(''),2500)},[])

  useEffect(()=>{ supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null)); const {data:listener}=supabase.auth.onAuthStateChange((_,s)=>setUser(s?.user||null)); return ()=>{listener.subscription.unsubscribe()} },[])

  const refPoint = useMemo(()=> userLoc || (cityManual?{lat:cityManual.lat,lng:cityManual.lng}:null),[userLoc,cityManual])
  const sorted:OfferWithDistance[] = useMemo(()=>{ if(!refPoint) return OFFERS.map(o=>({...o,distance:null})); return OFFERS.map(o=>({...o,distance:haversine(refPoint,o.location)})).sort((a,b)=>(a.distance??Infinity)-(b.distance??Infinity)) },[refPoint])
  const filtered = useMemo(()=>{ let l=sorted; if(searchQ.trim()){ const q=searchQ.trim(); l=l.filter(o=>o.title.includes(q)||o.store.includes(q)) } if(nearbyOnly&&refPoint) return l.filter(o=>o.distance!==null&&o.distance<=radiusKm); return l },[sorted,searchQ,nearbyOnly,radiusKm,refPoint])
  const label = useMemo(()=> cityManual?`馃搷 ${cityManual.label}`: refPoint?`馃搷 賲賵賯毓賰 丕賱丨丕賱賷`: null,[cityManual,refPoint])

  const locate = useCallback(()=>{ if(!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(p=>{ setUserLoc({lat:p.coords.latitude,lng:p.coords.longitude}); setCityManual(null); setNearbyOnly(true); showToast('鬲賲 鬲丨丿賷丿 賲賵賯毓賰') }) },[showToast])

  return (
    <div className="min-h-screen pb-28 bg-[#FDF6E8] text-[#1F1B16]" dir="rtl">
      <Header currentLabel={label} user={user} onOpenAuth={()=>setAuthOpen(true)} onOpenShare={()=>setLegal('share')} />
      <main className="max-w-7xl mx-auto px-4">
        {tab==='home' && <HomeTab offers={filtered} searchQ={searchQ} setSearchQ={setSearchQ} onToast={showToast} radiusKm={radiusKm} setRadiusKm={setRadiusKm} nearbyOnly={nearbyOnly} setNearbyOnly={setNearbyOnly} cityManual={cityManual} setCityManual={setCityManual} onLocate={locate} onMap={setMapFor} onOpenAllMap={()=>setShowAllMap(true)} />}
        {tab==='stores' && <StoresTab />}
        {tab==='haraj' && <HarajTab />}
        {tab==='office' && <OfficeTab onOpenLegal={setLegal} />}
        {tab==='hkeem' && <HkeemTab />}
        <Footer onOpenLegal={setLegal} />
      </main>
      <BottomNav tab={tab} setTab={setTab} />
      <button onClick={()=>setShowAllMap(true)} className="fixed bottom-24 left-4 z-30 h-12 px-5 rounded-full shadow-xl border-2 border-white text-sm font-black text-white bg-gradient-to-br from-[#7A5A16] to-[#D4AF37]">馃椇锔� 丕賱禺乇賷胤丞</button>
      <button onClick={()=>setAssistantOpen(true)} className="fixed bottom-24 right-4 z-30 w-14 h-14 rounded-full shadow-xl border-2 border-white grid place-items-center text-xl bg-gradient-to-br from-[#7A5A16] to-[#D4AF37]">馃</button>
      {toast && <div className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2 rounded-full text-xs z-50">{toast}</div>}
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onToast={showToast} />
      <AssistantModal open={assistantOpen} onClose={()=>setAssistantOpen(false)} offers={sorted} />
      <LegalModals type={legal} onClose={()=>setLegal(null)} onToast={showToast} />
      {mapFor && <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-3" onClick={()=>setMapFor(null)}><div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg" onClick={e=>e.stopPropagation()}><div className="p-3 flex justify-between border-b"><b>{mapFor.store}</b><button onClick={()=>setMapFor(null)}>鉁�</button></div><div className="h-[360px]"><LeafletMap offers={[mapFor]} center={mapFor.location} /></div></div></div>}
      {showAllMap && <div className="fixed inset-0 z-50 bg-[#FDF6E8]"><div className="h-14 px-4 flex justify-between items-center border-b bg-white"><h3 className="font-black">馃椇锔� 禺乇賷胤丞 賰賱 丕賱毓乇賵囟</h3><button onClick={()=>setShowAllMap(false)} className="px-4 h-9 rounded-full bg-black text-white text-sm">廿睾賱丕賯</button></div><LeafletMap offers={filtered} center={refPoint||{lat:21.5433,lng:39.1727}} /></div>}
    </div>
  )
}
