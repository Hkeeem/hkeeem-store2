"use client"
import { useEffect, useState } from 'react'

const HERO=[
 {store:'متجر حكيم',d:40,t:'عطر حكيم الملكي + محفظة جلد',p:399,old:649,code:'HKEEM20',img:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800',g:'from-violet-600 via-fuchsia-600 to-indigo-600',mauve:true},
 {store:'عروضكم',d:60,t:'كل عروض المملكة في مكان واحد',p:0,old:0,code:'AROOD60',img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',g:'from-emerald-600 to-green-700',mauve:false},
 {store:'عروض حراج',d:55,t:'مستعمل نظيف - شبه جديد',p:1200,old:2699,code:'HARAJ55',img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',g:'from-violet-700 via-purple-600 to-indigo-700',mauve:true},
]

const CATS=[
 {n:'الكل',i:'✨'},
 {n:'متجر حكيم',i:'💜',mauve:true},
 {n:'عروضكم',i:'🛒'},
 {n:'المساعد الاقتصادي',i:'🤖',mauve:true},
 {n:'عروض حراج',i:'🏷️',mauve:true},
]

const MOCK=[
 {id:1,title:'عطر حكيم الملكي 100مل',store:'متجر حكيم',category:'متجر حكيم',price:199,old_price:349,discount:43,image:'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',isOwn:true,mauve:true},
 {id:2,title:'محفظة جلد + ساعة كلاسيك',store:'متجر حكيم',category:'متجر حكيم',price:399,old_price:619,discount:35,image:'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600',isOwn:true,mauve:true},
 {id:3,title:'سلة التوفير الكبرى',store:'عروضكم',category:'عروضكم',price:89,old_price:149,discount:40,image:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'},
 {id:4,title:'آيفون 15 برو 256',store:'عروضكم',category:'عروضكم',price:4199,old_price:4999,discount:16,image:'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'},
 {id:5,title:'كنب 3 قطع مستعمل نظيف',store:'عروض حراج',category:'عروض حراج',price:1200,old_price:2699,discount:55,image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',mauve:true},
 {id:6,title:'شاشة سامسونج 55 بوصة',store:'عروض حراج',category:'عروض حراج',price:1499,old_price:2599,discount:42,image:'https://images.unsplash.com/photo-1593359677879-a4bb92f367d8?w=600',mauve:true},
]

export default function Page(){
 const [a,setA]=useState(0)
 const [cat,setCat]=useState('الكل')
 const [cart,setCart]=useState(0)
 const [toast,setToast]=useState('')
 const [q,setQ]=useState('')

 useEffect(()=>{const t=setInterval(()=>setA(x=>(x+1)%HERO.length),3800); return()=>clearInterval(t)},[])
 const filtered = cat==='الكل'? MOCK : MOCK.filter(o=>o.category===cat)
 const show=(m:string)=>{setToast(m); setTimeout(()=>setToast(''),1800)}

 return (
 <div className="min-h-screen bg-[#FFFBFF]">
  <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-violet-100">
   <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
    <div className="font-black text-xl">عروض<span className="text-[#8B5CF6]">كم</span><span className="mr-2 inline-flex w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]"></span></div>
    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm shadow">السلة {cart}</div>
   </div>
  </header>

  <div className="max-w-7xl mx-auto px-3 mt-5">
   <div className="relative h-[54vh] rounded-[32px] overflow-hidden bg-black text-white shadow-[0_20px_60px_-20px_rgba(139,92,246,0.5)]">
    {HERO.map((s,i)=><div key={i} className={`absolute inset-0 transition-all duration-700 ${i===a?'opacity-100':'opacity-0'}`}>
     <div className={`absolute inset-0 bg-gradient-to-r ${s.g}`}/>
     <div className="relative h-full flex flex-col md:flex-row p-8 gap-6 items-center">
      <div className="flex-1 space-y-3">
       <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.mauve?'bg-white text-[#7C3AED]':'bg-white text-black'}`}>{s.store}</span>
       <div className="text-
