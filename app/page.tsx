"use client"
import { useState } from "react"

const STORES_META:any={
  tamimi:{name:"أسواق التميمي",color:"bg-[#E53935]"},
  danube:{name:"الدانوب",color:"bg-[#1E88E5]"},
  othaim:{name:"أسواق العثيم",color:"bg-[#FB8C00]"},
  panda:{name:"بنده",color:"bg-[#2E7D32]"},
  lulu:{name:"لولو هايبر",color:"bg-[#43A047]"},
  jahez:{name:"جاهز",color:"bg-[#FF5722]"},
}

const COMPARE=[
  {title:"زيت عافية دوار الشمس 1.8 لتر",icon:"🫒",prices:[
    {id:"tamimi",name:"أسواق التميمي",price:19,cheapest:true},
    {id:"danube",name:"الدانوب",price:19},
    {id:"othaim",name:"أسواق العثيم",price:24},
    {id:"panda",name:"بنده",price:52,old:69}]},
  {title:"حليب المراعي طويل الأجل 12×1 لتر",icon:"🥛",prices:[
    {id:"tamimi",name:"أسواق التميمي",price:27,cheapest:true},
    {id:"panda",name:"بنده",price:27},
    {id:"othaim",name:"أسواق العثيم",price:29}]},
  {title:"أرز بسمتي أبو كاس 5 كجم",icon:"🍚",prices:[
    {id:"panda",name:"بنده",price:45,cheapest:true},
    {id:"othaim",name:"أسواق العثيم",price:45},
    {id:"tamimi",name:"أسواق التميمي",price:55,old:65},
    {id:"lulu",name:"لولو هايبر",price:69}]},
]

const BEST=[
  {id:1,title:"بيتزا خضار + مشروب",shop:"جاهز",price:42,old:85,discount:51,icon:"🍕",cat:"مطاعم"},
  {id:2,title:"أرز بسمتي أبو كاس",shop:"أسواق العثيم",price:45,old:88,discount:49,icon:"🍚",cat:"سوبرماركت"},
  {id:3,title:"وجبة عائلية دجاج مع أرز",shop:"البيك",price:69,old:120,discount:43,icon:"🍗",cat:"مطاعم"},
  {id:4,title:"شاورما عربي +",shop:"شاورمكان",price:19,old:35,discount:46,icon:"🌯",cat:"مطاعم"},
  {id:5,title:"آيفون 15 برو 256 جيجا",shop:"جرير",price:4199,old:4999,discount:16,icon:"📱",cat:"إلكترونيات"},
  {id:6,title:"شاشة سامسونج 55 بوصة",shop:"إكسترا",price:1499,old:2599,discount:42,icon:"📺",cat:"إلكترونيات"},
  {id:7,title:"لابتوب HP Pavilion i7",shop:"جرير",price:2799,old:4299,discount:35,icon:"💻",cat:"إلكترونيات"},
  {id:8,title:"سماعة AirPods Pro 2",shop:"جرير",price:699,old:999,discount:30,icon:"🎧",cat:"إلكترونيات"},
]

const COUPONS=[
  {code:"HS30",store:"هنقرستيشن",title:"خصم 30% على أول طلب",desc:"يصل حتى 25 ر.س - للعملاء الجدد",type:"أول طلب",discount:"30%",color:"bg-[#D32F2F]"},
  {code:"JARIR10",store:"جرير",title:"خصم إضافي 10%",desc:"على الجوالات والإلكترونيات",type:"خصم عام",discount:"10%",color:"bg-[#1565C0]"},
  {code:"EXTRA15",store:"إكسترا",title:"خصم 25 ر.س",desc:"خصم الصيف على المكيفات",type:"خصم عام",discount:"15%",color:"bg-[#2E7D32]"},
  {code:"JAHEZ25",store:"جاهز",title:"خصم 20% + توصيل مجاني",desc:"على أول طلب مطاعم",type:"مطاعم",discount:"20%",color:"bg-[#EF6C00]"},
  {code:"NAHDI20",store:"النهدي",title:"خصم 20 ر.س",desc:"عند الشراء 150 ر.س",type:"صيدلية",discount:"20 ر.س",color:"bg-[#00897B]"},
  {code:"DANUBE12",store:"الدانوب",title:"خصم 12% خضار وفواكه",desc:"كل اثنين وثلاثاء",type:"سوبرماركت",discount:"12%",color:"bg-[#6A1B9A]"},
  {code:"LULU25",store:"لولو",title:"خصم 25 ر.س عند 250",desc:"قسائم تسوق",type:"سوبرماركت",discount:"25 ر.س",color:"bg-[#F57F17]"},
]

export default function Page(){
  const [tab,setTab]=useState<"home"|"offers"|"coupons"|"points"|"assistant">("home")
  const [active,setActive]=useState("الكل")
  const [search,setSearch]=useState("")
  const [toast,setToast]=useState("")
  const [chatInput,setChatInput]=useState("")
  const [messages,setMessages]=useState<any>([{role:"bot",text:"هلا! اسألني بالصوت أو كتابة.. مثلاً: وين أرخص وجبة عائلية؟"}])
  const show=(t:string)=>{setToast(t);setTimeout(()=>setToast(""),1600)}

  const filtered=BEST.filter(b=>{
    if(active!=="الكل"&&b.shop!==active&&b.cat!==active) return false
    if(search&&!b.title.includes(search)) return false
    return true
  })

  const handleChat=()=>{
    if(!chatInput.trim()) return
    const q=chatInput
    setMessages((m:any)=>[...m,{role:"user",text:q}])
    setChatInput("")
    setTimeout(()=>{
      let ans="جرب تكتب: زيت، حليب، أرز، دجاج، بيتزا، آيفون"
      if(q.includes("دجاج")||q.includes("عائلية")){
        ans="عندك وجبة عائلية دجاج مع أرز في البيك بـ 69 ر.س بدل 120 ر.س 🔥 التوفير حوالي 51 ر.س (43%) وتنتهي اليوم. تبغاني أضيفها لقائمتك الذكية؟"
      }else if(q.includes("زيت")) ans="أرخص زيت عافية 1.8ل: 19 ر.س في التميمي والدانوب (بدل 32). توفر 13 ر.س."
      else if(q.includes("حليب")) ans="حليب المراعي 12×1ل: 27 ر.س في التميمي وبنده (أرخص) و 29 ر.س في العثيم."
      else if(q.includes("أرز")) ans="أرز أبو كاس 5كجم: 45 ر.س في بنده والعثيم (أرخص)، خصم 49%!"
      setMessages((m:any)=>[...m,{role:"bot",text:ans}])
    },400)
  }

  return(
    <div dir="rtl" className="min-h-screen bg-[#FFFBF0] max-w-[430px] mx-auto pb-20">
      <header className="sticky top-0 z-20 bg-[#FFFBF0]/90 backdrop-blur px-4 h-14 flex justify-between items-center border-b border-black/5">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B3D12] to-[#D1AA00] grid place-items-center text-white font-black text-xs">و</div><div><div className="font-black text-sm leading-none">وفّر</div><div className="text-[10px] text-zinc-500">كل عروض المملكة</div></div></div>
        <div className="w-8 h-8 rounded-full bg-white border grid place-items-center">🔔</div>
      </header>

      {tab==="home"&&(
        <div className="p-3 space-y-4">
          <div className="rounded-[28px] p-5 text-white bg-gradient-to-br from-[#102F12] via-[#195A1A] to-[#C7A20A] relative overflow-hidden">
            <div className="text-[11px] bg-white/15 border border-white/10 inline-flex px-3 py-1 rounded-full">✨ مدعوم بالذكاء الاصطناعي</div>
            <h1 className="text-[26px] font-black leading-[1.15] mt-3">كل عروض المملكة<br/>في مكان واحد.</h1>
            <p className="text-[12.5px] opacity-80 mt-2 leading-5 max-w-[280px]">جمعنا لك عروض العثيم، بنده، الدانوب، لولو وجرير ورتبناها بالأرخص</p>
            <div className="flex gap-2 mt-4"><button onClick={()=>setTab("offers")} className="h-9 px-4 bg-white text-[#133A14] rounded-full text-xs font-bold">تصفّح كل العروض ←</button><button onClick={()=>setTab("assistant")} className="h-9 px-4 bg-white/15 border border-white/15 rounded-full text-xs">قائمة تسوق ذكية</button></div>
            <div className="grid grid-cols-3 gap-2 mt-5"><div className="bg-white/10 border border-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">+14</div><div className="text-[10px] opacity-70">متجر</div></div><div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">60%</div><div className="text-[10px] opacity-70">توفير</div></div><div className="bg-white/10 rounded-2xl py-2.5 text-center"><div className="font-black">24/7</div><div className="text-[10px] opacity-70">مراقبة</div></div></div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[{k:"سوبرماركت",i:"🛒"},{k:"مطاعم",i:"🍕"},{k:"إلكترونيات",i:"📱"},{k:"صيدلية",i:"💊"}].map(c=>(
              <button key={c.k} onClick={()=>{setTab("offers");setActive(c.k)}} className="bg-white border rounded-[18px] h-[72px] flex flex-col items-center justify-center gap-1 shadow-sm">{c.i}<span className="text-[11px]">{c.k}</span></button>
            ))}
          </div>

          <div><div className="flex justify-between items-center mb-2"><h3 className="font-black text-sm">مقارنة الأسعار الحية</h3><button onClick={()=>setTab("offers")} className="text-[11px] text-zinc-500">عرض الكل</button></div>
            <div className="space-y-3">{COMPARE.map((o:any,idx:number)=><div key={idx} className="bg-white rounded-[18px] border shadow-sm overflow-hidden"><div className="flex items-center gap-2.5 p-3 pb-2"><div className="w-11 h-11 rounded-xl bg-[#FFFBF2] border grid place-items-center text-xl">{o.icon}</div><div><div className="font-bold text-[13px]">{o.title}</div><div className="text-[11px] text-zinc-400">{o.prices.length} متاجر</div></div></div><div className="px-2 pb-2 space-y-1.5">{o.prices.map((p:any)=><div key={p.id} className={`flex justify-between items-center h-9 px-3 rounded-full border text-xs ${p.cheapest?"bg-[#FFF8E1] border-[#F5D78A]":"bg-[#FFFEF7]"}`}><div className="flex items-center gap-2"><span className={`w-6 h-6 rounded-full grid place-items-center text-white text-[10px] font-bold ${STORES_META[p.id]?.color}`}>{p.name[0]}</span>{p.name}{p.cheapest&&<span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full">أرخص سعر</span>}</div><div className="flex gap-2 items-center">{p.old&&<span className="line-through text-zinc-400 text-[11px]">{p.old}</span>}<span className="font-black text-[#B91C1C] bg-[#FFF1F2] border border-red-100 px-2.5 py-0.5 rounded-full">{p.price} ر.س</span></div></div>)}</div></div>)}</div>
          </div>

          <div><div className="flex justify-between items-center"><h3 className="font-black text-sm">🔥 أفضل العروض الآن</h3></div>
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">{BEST.slice(0,4).map(b=><div key={b.id} className="bg-white rounded-[18px] border p-2.5 relative"><div className="absolute top-2.5 left-2.5 bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{b.discount}%</div><div className="h-[86px] bg-[#FFFBEB] rounded-xl grid place-items-center text-3xl mt-6">{b.icon}</div><div className="mt-2.5"><div className="text-[11px] text-zinc-500">{b.shop} • {b.cat}</div><div className="font-bold text-[12px] leading-tight mt-1 line-clamp-2 min-h-[32px]">{b.title}</div><div className="flex justify-between items-end mt-2"><div><div className="font-black text-sm text-[#B91C1C]">{b.price} ر.س</div><div className="text-[11px] line-through text-zinc-400">{b.old}</div></div><button onClick={()=>show("تمت الإضافة")} className="w-7 h-7 rounded-full bg-black text-white grid place-items-center">+</button></div></div></div>)}</div>
          </div>
        </div>
      )}

      {tab==="offers"&&(
        <div className="p-3"><h2 className="font-black text-lg">كل العروض</h2><div className="mt-3 relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عن منتج..." className="w-full h-11 pr-10 pl-4 bg-white border rounded-full text-[13px] outline-none"/><span className="absolute right-3.5 top-3">🔍</span></div>
          <div className="flex gap-1.5 mt-3 overflow-x-auto scrollbar-hide"><{["الكل","سوبرماركت","مطاعم","إلكترونيات","صيدلية"].map(c=><button key={c} onClick={()=>setActive(c)} className={`whitespace-nowrap h-8 px-3.5 rounded-full text-xs border ${active===c?"bg-black text-white":"bg-white"}`}>{c}</button>)}</div>
          <div className="grid grid-cols-2 gap-2.5 mt-3">{filtered.map(b=><div key={b.id} className="bg-white rounded-[18px] border p-2.5"><div className="h-[92px] bg-[#FFFBEB] rounded-xl grid place-items-center text-3xl">{b.icon}</div><div className="mt-2"><div className="text-[11px] text-zinc-500">{b.shop}</div><div className="font-bold text-[12px] line-clamp-2 min-h-[30px]">{b.title}</div><div className="flex justify-between items-end mt-2"><div><div className="font-black text-[#B91C1C]">{b.price} ر.س</div><div className="text-[11px] line-through text-zinc-400">{b.old}</div></div><button onClick={()=>show("أضيف")} className="w-7 h-7 rounded-full bg-black text-white">+</button></div></div></div>)}</div>
        </div>
      )}

      {tab==="coupons"&&(
        <div className="p-3"><div className="rounded-[22px] bg-gradient-to-br from-[#134A15] to-[#A88A00] p-4 text-white"><h2 className="font-black text-lg">كوبونات وأكواد خصم</h2><p className="text-[11px] opacity-80 mt-1">انسخ الكود واكسب 10 نقاط 🎉</p></div>
          <div className="mt-3 space-y-2.5">{COUPONS.map(c=><div key={c.code} className="bg-white rounded-[16px] border p-3 flex gap-3 items-center"><div className={`w-12 h-12 rounded-xl ${c.color} text-white grid place-items-center font-black text-[13px]`}>{c.code.slice(0,2)}</div><div className="flex-1"><div className="flex items-center gap-1.5"><span className="font-bold text-xs">{c.store}</span><span className="text-[10px] bg-[#FFF1F2] text-[#B91C1C] border px-1.5 py-0.5 rounded-full font-bold">{c.discount}</span></div><div className="font-bold text-xs mt-0.5">{c.title}</div><div className="text-[11px] text-zinc-500">{c.desc}</div><div className="flex gap-1.5 mt-2"><button onClick={()=>{navigator.clipboard.writeText(c.code);show(`نسخ ${c.code}`)}} className="h-7 px-2.5 bg-[#FFFBEB] border rounded-full text-[11px]">📋 نسخ <b>{c.code}</b></button><button className="h-7 px-2.5 bg-white border rounded-full text-[11px]">شارك ↗</button></div></div></div>)}</div>
        </div>
      )}

      {tab==="assistant"&&(
        <div className="flex flex-col h-[calc(100vh-120px)]"><div className="p-3"><div className="rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-[#FFF8E1] border p-3 flex gap-2 items-center"><div className="w-9 h-9 rounded-full bg-black text-white grid place-items-center">🎙️</div><div className="flex-1"><div className="font-bold text-xs">مساعد وفّر الصوتي</div><div className="text-[11px] text-zinc-500">اسألني بالصوت أو الكتابة</div></div></div></div>
          <div className="flex-1 overflow-y-auto px-3 space-y-2.5 pb-3">{messages.map((m:any,i:number)=><div key={i} className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${m.role==="user"?"bg-black text-white self-end ml-auto rounded-br-sm":"bg-white border shadow-sm"}`}>{m.text}</div>)}<div className="flex flex-wrap gap-1.5">{["أبي أوفر وجبة عائلية","وين ألقى أرخص زيت؟","قارن أسعار الحليب"].map(s=><button key={s} onClick={()=>{setChatInput(s);setTimeout(()=>{const e={key:"Enter"} as any; handleChat()},0)}} className="text-[11px] bg-white border px-3 h-7 rounded-full">{s}</button>)}</div></div>
          <div className="p-3 bg-white border-t flex gap-2 items-center"><button className="w-10 h-10 rounded-full bg-[#E8F5E9] border grid place-items-center">🎤</button><input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleChat()} placeholder="اكتب سؤالك..." className="flex-1 h-10 bg-[#F6F6F6] border rounded-full px-4 text-[13px] outline-none"/><button onClick={handleChat} className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">➤</button></div>
        </div>
      )}

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur border-t flex justify-around py-1.5 z-20">
        {[{k:"home",l:"الرئيسية",i:"🏠"},{k:"offers",l:"العروض",i:"🏷️"},{k:"coupons",l:"كوبونات",i:"🎟️"},{k:"points",l:"نقاطي",i:"⭐"},{k:"assistant",l:"المساعد",i:"🤖"}].map(t=><button key={t.k} onClick={()=>setTab(t.k as any)} className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl ${tab===t.k?"text-[#1B5E20] bg-[#E8F5E9]":"text-zinc-400"}`}><span className="text-[16px]">{t.i}</span><span className="text-[10px]">{t.l}</span></button>)}
      </nav>
      {toast&&<div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-4 py-2 rounded-full z-50">{toast}</div>}
    </div>
  )
      }
