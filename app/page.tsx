"use client"
import { useState } from "react"

const META:any={
  tamimi:{n:"أسواق التميمي",c:"bg-[#E53935]"},
  danube:{n:"الدانوب",c:"bg-[#1E88E5]"},
  othaim:{n:"أسواق العثيم",c:"bg-[#FB8C00]"},
  panda:{n:"بنده",c:"bg-[#2E7D32]"},
  lulu:{n:"لولو هايبر",c:"bg-[#43A047]"},
}

const COMPARE=[
  {t:"زيت عافية دوار الشمس 1.8 لتر",i:"🫒",ps:[
    {id:"tamimi",p:19,cheapest:true},{id:"danube",p:19},{id:"othaim",p:24},{id:"panda",p:52,old:69}]},
  {t:"حليب المراعي طويل الأجل 12×1 لتر",i:"🥛",ps:[
    {id:"tamimi",p:27,cheapest:true},{id:"panda",p:27},{id:"othaim",p:29}]},
  {t:"أرز بسمتي أبو كاس 5 كجم",i:"🍚",ps:[
    {id:"panda",p:45,cheapest:true},{id:"othaim",p:45},{id:"tamimi",p:55,old:65},{id:"lulu",p:69}]},
]

const BEST=[
  {id:1,t:"بيتزا خضار + مشروب",s:"جاهز",p:42,o:85,d:51,i:"🍕",k:"مطاعم"},
  {id:2,t:"أرز بسمتي أبو كاس",s:"أسواق العثيم",p:45,o:88,d:49,i:"🍚",k:"سوبرماركت"},
  {id:3,t:"وجبة عائلية دجاج مع أرز",s:"البيك",p:69,o:120,d:43,i:"🍗",k:"مطاعم"},
  {id:4,t:"شاورما عربي +",s:"شاورمكان",p:19,o:35,d:46,i:"🌯",k:"مطاعم"},
  {id:5,t:"آيفون 15 برو 256",s:"جرير",p:4199,o:4999,d:16,i:"📱",k:"إلكترونيات"},
  {id:6,t:"شاشة سامسونج 55 بوصة",s:"إكسترا",p:1499,o:2599,d:42,i:"📺",k:"إلكترونيات"},
]

const COUPONS=[
  {code:"HS30",st:"هنقرستيشن",tt:"خصم 30% على أول طلب",ds:"يصل حتى 25 ر.س",tp:"أول طلب",d:"30%",co:"bg-[#D32F2F]"},
  {code:"JARIR10",st:"جرير",tt:"خصم إضافي 10%",ds:"على الجوالات",tp:"خصم عام",d:"10%",co:"bg-[#1565C0]"},
  {code:"JAHEZ25",st:"جاهز",tt:"خصم 20% + توصيل مجاني",ds:"أول طلب مطاعم",tp:"مطاعم",d:"20%",co:"bg-[#EF6C00]"},
]

export default function Page(){
  const [tab,setTab]=useState<"home"|"offers"|"coupons"|"points"|"asst">("home")
  const [f,setF]=useState("الكل")
  const [q,setQ]=useState("")
  const [toast,setToast]=useState("")
  const [chat,setChat]=useState("")
  const [msgs,setMsgs]=useState<any[]>([{r:"bot",t:"هلا! اسألني: وين أرخص وجبة عائلية؟ أو أبي أوفر وجبة عائلية"}])
  const show=(x:string)=>{setToast(x);setTimeout(()=>setToast(""),1500)}
  const list=BEST.filter(b=>{if(f!=="الكل"&&b.s!==f&&b.k!==f)return false;if(q&&!b.t.includes(q))return false;return true})
  const ask=()=>{
    if(!chat.trim()) return
    const qu=chat; setMsgs(m=>[...m,{r:"user",t:qu}]); setChat("")
    setTimeout(()=>{
      let a="جرب: زيت، حليب، أرز، دجاج"
      if(qu.includes("دجاج")||qu.includes("عائلية")) a="عندك وجبة عائلية دجاج مع أرز في البيك بـ 69 ر.س بدل 120 ر.س 🔥 التوفير 51 ر.س (43%) وتنتهي اليوم."
      else if(qu.includes("زيت")) a="أرخص زيت عافية 1.8ل: 19 ر.س في التميمي والدانوب بدل 32."
      else if(qu.includes("أرز")) a="أرز أبو كاس 5كجم: 45 ر.س في بنده والعثيم (أرخص) خصم 49%!"
      setMsgs(m=>[...m,{r:"bot",t:a}])
    },400)
  }

  return(
  <div dir="rtl" className="min-h-screen bg-[#FFFBF0] max-w-[430px] mx-auto pb-20">
    <header className="sticky top-0 z-20 bg-[#FFFBF0]/90 backdrop-blur px-4 h-14 flex justify-between items-center border-b border-black/5">
      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B3D12] to-[#D1AA00] grid place-items-center text-white font-black text-xs">و</div><div><div className="font-black text-sm leading-none">وفّر</div><div className="text-[10px] text-zinc-500">كل عروض المملكة</div></div></div><div className="w-8 h-8 rounded-full bg-white border grid place-items-center">🔔</div>
    </header>

    {tab==="home"&&<div className="p-3 space-y-4">
      <div className="rounded-[28px] p-5 text-white bg-gradient-to-br from-[#102F12] via-[#195A1A] to-[#C7A20A]"><div className="text-[11px] bg-white/15 border border-white/10 inline-flex px-3 py-1 rounded-full">✨ مدعوم بالذكاء الاصطناعي</div><h1 className="text-[26px] font-black leading-[1.15] mt-3">كل عروض المملكة<br/>في مكان واحد.</h1><p className="text-[12.5px] opacity-80 mt-2 leading-5 max-w-[280px]">جمعنا لك عروض العثيم، بنده، الدانوب، لولو وجرير ورتبناها بالأرخص</p><div className="flex gap-2 mt-4"><button onClick={()=>setTab("offers")} className="h-9 px-4 bg-white text-[#133A14] rounded-full text-xs font-bold">تصفّح كل العروض ←</button><button onClick={()=>setTab("asst")} className="h-9 px-4 bg-white/15 border border-white/15 rounded-full text-xs">قائمة تسوق ذكية</button></div><div className="grid grid-cols-3 gap-2 mt-5"><div className="bg-white/10 border border-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">+14</div><div className="text-[10px] opacity-70">متجر</div></div><div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">60%</div><div className="text-[10px] opacity-70">توفير</div></div><div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">24/7</div><div className="text-[10px] opacity-70">مراقبة</div></div></div></div>

      <div className="grid grid-cols-4 gap-2">{[{k:"سوبرماركت",i:"🛒"},{k:"مطاعم",i:"🍕"},{k:"إلكترونيات",i:"📱"},{k:"صيدلية",i:"💊"}].map(c=><button key={c.k} onClick={()=>{setTab("offers");setF(c.k)}} className="bg-white border rounded-[18px] h-[72px] flex flex-col items-center justify-center gap-1 shadow-sm">{c.i}<span className="text-[11px]">{c.k}</span></button>)}</div>

      <div><div className="flex justify-between items-center mb-2"><h3 className="font-black text-sm">مقارنة الأسعار الحية</h3></div><div className="space-y-3">{COMPARE.map((o:any,i:number)=><div key={i} className="bg-white rounded-[18px] border shadow-sm overflow-hidden"><div className="flex items-center gap-2.5 p-3 pb-2"><div className="w-11 h-11 rounded-xl bg-[#FFFBF2] border grid place-items-center text-xl">{o.i}</div><div><div className="font-bold text-[13px]">{o.t}</div><div className="text-[11px] text-zinc-400">{o.ps.length} متاجر</div></div></div><div className="px-2 pb-2 space-y-1.5">{o.ps.map((p:any)=><div key={p.id} className={`flex justify-between items-center h-9 px-3 rounded-full border text-xs ${p.cheapest?"bg-[#FFF8E1] border-[#F5D78A]":"bg-[#FFFEF7]"}`}><div className="flex items-center gap-2"><span className={`w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-bold ${META[p.id]?.c}`}>{META[p.id]?.n[0]}</span>{META[p.id]?.n}{p.cheapest&&<span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full">أرخص سعر</span>}</div><div className="flex gap-2 items-center">{p.old&&<span className="line-through text-zinc-400 text-[11px]">{p.old}</span>}<span className="font-black text-[#B91C1C] bg-[#FFF1F2] border border-red-100 px-2.5 py-0.5 rounded-full">{p.p} ر.س</span></div></div>)}</div></div>)}</div></div>

      <div><h3 className="font-black text-sm">🔥 أفضل العروض الآن</h3><div className="grid grid-cols-2 gap-2.5 mt-2.5">{BEST.slice(0,4).map(b=><div key={b.id} className="bg-white rounded-[18px] border p-2.5 relative"><div className="absolute top-2.5 left-2.5 bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{b.d}%</div><div className="h-[86px] bg-[#FFFBEB] rounded-xl grid place-items-center text-3xl mt-6">{b.i}</div><div className="mt-2.5"><div className="text-[11px] text-zinc-500">{b.s} • {b.k}</div><div className="font-bold text-[12px] leading-tight mt-1 line-clamp-2 min-h-[32px]">{b.t}</div><div className="flex justify-between items-end mt-2"><div><div className="font-black text-sm text-[#B91C1C]">{b.p} ر.س</div><div className="text-[11px] line-through text-zinc-400">{b.o}</div></div><button onClick={()=>show("تمت الإضافة")} className="w-7 h-7 rounded-full bg-black text-white">+</button></div></div></div>)}</div></div>
    </div>}

    {tab==="offers"&&<div className="p-3"><h2 className="font-black text-lg">كل العروض</h2><div className="mt-3 relative"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن منتج..." className="w-full h-11 pr-10 pl-4 bg-white border rounded-full text-[13px] outline-none"/><span className="absolute right-3.5 top-3">🔍</span></div><div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide">{["الكل","سوبرماركت","مطاعم","إلكترونيات","صيدلية"].map(c=><button key={c} onClick={()=>setF(c)} className={`whitespace-nowrap h-8 px-3.5 rounded-full text-xs border ${f===c?"bg-black text-white":"bg-white"}`}>{c}</button>)}</div><div className="grid grid-cols-2 gap-2.5 mt-3">{list.map(b=><div key={b.id} className="bg-white rounded-[18px] border p-2.5"><div className="h-[92px] bg-[#FFFBEB] rounded-xl grid place-items-center text-3xl">{b.i}</div><div className="mt-2"><div className="text-[11px] text-zinc-500">{b.s}</div><div className="font-bold text-[12px] line-clamp-2 min-h-[30px]">{b.t}</div><div className="flex justify-between items-end mt-2"><div><div className="font-black text-[#B91C1C]">{b.p} ر.س</div><div className="text-[11px] line-through text-zinc-400">{b.o}</div></div><button onClick={()=>show("أضيف")} className="w-7 h-7 rounded-full bg-black text-white">+</button></div></div></div>)}</div></div>}

    {tab==="coupons"&&<div className="p-3"><div className="rounded-[22px] bg-gradient-to-br from-[#134A15] to-[#A88A00] p-4 text-white"><h2 className="font-black text-lg">كوبونات وأكواد خصم</h2><p className="text-[11px] opacity-80 mt-1">انسخ الكود واكسب 10 نقاط 🎉</p></div><div className="mt-3 space-y-2.5">{COUPONS.map(c=><div key={c.code} className="bg-white rounded-[16px] border p-3 flex gap-3 items-center"><div className={`w-12 h-12 rounded-xl ${c.co} text-white grid place-items-center font-black`}>{c.code.slice(0,2)}</div><div className="flex-1"><div className="flex items-center gap-1.5"><span className="font-bold text-xs">{c.st}</span><span className="text-[10px] bg-[#FFF1F2] text-[#B91C1C] border px-1.5 py-0.5 rounded-full font-bold">{c.d}</span></div><div className="font-bold text-xs mt-0.5">{c.tt}</div><div className="text-[11px] text-zinc-500">{c.ds}</div><div className="flex gap-1.5 mt-2"><button onClick={()=>{navigator.clipboard.writeText(c.code);show(`نسخ ${c.code}`)}} className="h-7 px-2.5 bg-[#FFFBEB] border rounded-full text-[11px]">📋 نسخ <b>{c.code}</b></button></div></div></div>)}</div></div>}

    {tab==="asst"&&<div className="flex flex-col h-[calc(100vh-120px)]"><div className="flex-1 overflow-y-auto px-3 space-y-2.5 py-3">{msgs.map((m:any,i:number)=><div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${m.r==="user"?"bg-black text-white self-end ml-auto":"bg-white border shadow-sm"}`}>{m.t}</div>)}</div><div className="p-3 bg-white border-t flex gap-2"><input value={chat} onChange={e=>setChat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder="اسأل: وين أرخص وجبة عائلية؟" className="flex-1 h-10 bg-[#F6F6F6] border rounded-full px-4 text-[13px] outline-none"/><button onClick={ask} className="w-10 h-10 rounded-full bg-black text-white">➤</button></div></div>}

    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur border-t flex justify-around py-1.5 z-20">{[{k:"home",l:"الرئيسية",i:"🏠"},{k:"offers",l:"العروض",i:"🏷️"},{k:"coupons",l:"كوبونات",i:"🎟️"},{k:"points",l:"نقاطي",i:"⭐"},{k:"asst",l:"المساعد",i:"🤖"}].map(t=><button key={t.k} onClick={()=>setTab(t.k as any)} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl ${tab===t.k?"text-[#1B5E20] bg-[#E8F5E9]":"text-zinc-400"}`}><span className="text-[16px]">{t.i}</span><span className="text-[10px]">{t.l}</span></button>)}</nav>
    {toast&&<div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-full z-50">{toast}</div>}
  </div>
  )
}
