
"use client";
import { useState } from "react";

const OFFERS = [
  {id:1,title:"بيتزا كبيرة + مشروب",now:42,old:85,disc:51,emoji:"🍕",store:"جاهز",cat:"مطاعم"},
  {id:2,title:"أرز سمتي أبو كاس 10 كجم",now:45,old:87,disc:48,emoji:"🍚",store:"أسواق العثيم",cat:"سوبرماركت"},
  {id:3,title:"شاورما عربي + مشروب",now:19,old:37,disc:48,emoji:"🌯",store:"شاورما عربي",cat:"مطاعم"},
  {id:4,title:"برجر لحم مضاعف + بطاطس",now:29,old:55,disc:47,emoji:"🍔",store:"برجر كنج",cat:"مطاعم"},
  {id:5,title:"زيت عافية دوار الشمس 1.8 لتر",now:19,old:36,disc:47,emoji:"🫒",store:"الدانوب",cat:"سوبرماركت"},
  {id:6,title:"فينادون شراب 1000 مل",now:60,old:112,disc:46,emoji:"💊",store:"النهدي",cat:"صيدلية"},
];

const COMPARE = [
  {product:"أرز سمتي أبو كاس 10 كجم",icon:"🍚",stores:[{name:"أسواق العثيم",price:45,best:true},{name:"لولو هايبر",price:52},{name:"أسواق المزرعة",price:65},{name:"بنده",price:69}]},
  {product:"زيت عافية دوار الشمس 1.8 لتر",icon:"🫒",stores:[{name:"الدانوب",price:19,best:true},{name:"أسواق العثيم",price:19,best:true},{name:"بنده",price:24}]},
];

const HARAJ = [
  {t:"سييرا 2026 حرق 169,000 - نضمن أرخص سعر",p:"169,000 ر.س",city:"الرياض",em:"🛻"},
  {t:"اكسنت 2026 سمارت يا بلاش كاش وتقسيط",p:"59,900 ر.س",city:"الرياض",em:"🚗"},
  {t:"النترا 2026 فل كامل صدمة 2026",p:"78,500 ر.س",city:"الرياض",em:"🚙"},
  {t:"فيلا بمسبح فخم طيبة الرحيلي فرصة",p:"1,750,000 ر.س",city:"جدة",em:"🏠"},
  {t:"مرسيدس C200 AMG 2026 بالكرتون",p:"105,999 ر.س",city:"الرياض",em:"🏎️"},
  {t:"تظليل 3M أمريكي -45% عرض التأسيس",p:"1,722 ر.س",city:"جدة",em:"🛠️"},
];

const CATS = ["الكل","سوبرماركت","مطاعم","إلكترونيات","صيدلية","الحراج"];
const CITIES = ["الكل","الرياض","جدة"];

export default function Page(){
  const [activeCat,setActiveCat]=useState("الكل");
  const [activeCity,setActiveCity]=useState("الكل");
  const [harajOpen,setHarajOpen]=useState(false);
  const [toast,setToast]=useState("");
  const [cart,setCart]=useState(0);

  const filtered = activeCat==="الكل"||activeCat==="الحراج" ? OFFERS : OFFERS.filter(o=>o.cat===activeCat);
  const harajFiltered = activeCity==="الكل" ? HARAJ : HARAJ.filter(h=>h.city===activeCity);

  const showToast = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2200); };
  const addCart = ()=>{ setCart(c=>c+1); showToast("حطيناها بالسلة يا ذيب 🛒"); };

  return (
    <div dir="rtl" style={{background:"#fefcf5",minHeight:"100vh",color:"#1a1a1a"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap'); *{font-family:'Tajawal',sans-serif} .no-scrollbar::-webkit-scrollbar{display:none}`}</style>

      <header style={{position:"sticky",top:0,zIndex:20,background:"rgba(254,252,245,0.92)",backdropFilter:"blur(12px)",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #f0e6d3"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800,fontSize:18}}><span style={{width:32,height:32,background:"linear-gradient(135deg,#2d6a4f,#40916c)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>وفر</span> حكيم 👑</div>
        <div style={{display:"flex",gap:8}}>
          <button style={{width:36,height:36,background:"#fff",border:"1px solid #efe6d5",borderRadius:10,cursor:"pointer"}}>🔍</button>
          <button style={{width:36,height:36,background:"#fff",border:"1px solid #efe6d5",borderRadius:10,position:"relative",cursor:"pointer"}}>🛒<span style={{position:"absolute",top:-6,left:-6,background:"#2d6a4f",color:"#fff",fontSize:10,minWidth:18,height:18,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>{cart}</span></button>
        </div>
      </header>

      <div style={{margin:"12px 16px",background:"linear-gradient(135deg,#1b4332 0%,#2d6a4f 25%,#52b788 55%,#f4a261 100%)",borderRadius:22,padding:"22px 18px",color:"#fff",position:"relative",overflow:"hidden"}}>
        <h1 style={{fontSize:22,fontWeight:800,lineHeight:1.25}}>كل عروض المملكة<br/><span style={{color:"#fef3c7"}}>في مكان واحد.</span></h1>
        <p style={{fontSize:12,opacity:.9,marginTop:8,lineHeight:1.7,maxWidth:"85%"}}>جمعنا لك عروض المتاجر بذكاء الوفر، نقارن لك الأسعار ونوفرها بالذكاء الاصطناعي عشان توفر أكثر.</p>
        <button onClick={()=>document.getElementById('offers')?.scrollIntoView({behavior:'smooth'})} style={{marginTop:14,background:"#fff",color:"#1b4332",border:"none",padding:"9px 16px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer"}}>تصفح كل العروض ←</button>
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <div style={{flex:1,background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:14,padding:"10px 8px",textAlign:"center",backdropFilter:"blur(6px)"}}><b style={{display:"block",fontSize:14}}>+14</b><small style={{fontSize:10,opacity:.85}}>متجر</small></div>
          <div style={{flex:1,background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:14,padding:"10px 8px",textAlign:"center"}}><b style={{display:"block",fontSize:14}}>60%</b><small style={{fontSize:10,opacity:.85}}>متوسط التوفير</small></div>
          <div style={{flex:1,background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:14,padding:"10px 8px",textAlign:"center"}}><b style={{display:"block",fontSize:14}}>24/7</b><small style={{fontSize:10,opacity:.85}}>تحديثات حية</small></div>
        </div>
      </div>

      <div style={{display:"flex",gap:12,padding:"16px",overflowX:"auto"}} className="no-scrollbar">
        {CATS.map(c=>{
          const isHaraj=c==="الحراج";
          const icon=c==="سوبرماركت"?"🛒":c==="مطاعم"?"🍽️":c==="إلكترونيات"?"💻":c==="صيدلية"?"💊":c==="الحراج"?"🚗":"✨";
          const active=activeCat===c;
          return (
            <div key={c} onClick={()=>{ if(isHaraj) setHarajOpen(true); else setActiveCat(c); }} style={{flex:"0 0 68px",display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer"}}>
              <div style={{width:56,height:56,background:active? (isHaraj?"linear-gradient(135deg,#f59e0b,#ea580c)":"linear-gradient(135deg,#2d6a4f,#52b788)") : "#fffaf0",border:`1px solid ${active?"#2d6a4f":"#f0e6d3"}`,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:active?"#fff":"#1a1a1a",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",position:"relative",transform:active?"scale(1.05)":"scale(1)",transition:".2s"}}>{icon}{isHaraj&&<span style={{position:"absolute",top:-6,left:-6,background:"#1a1a1a",color:"#fff",fontSize:8,fontWeight:800,padding:"2px 5px",borderRadius:10,border:"1px solid #f59e0b"}}>6</span>}</div>
              <span style={{fontSize:11,fontWeight:500,color:"#5a4e3a"}}>{c}</span>
            </div>
          )
        })}
      </div>

      <div id="offers" style={{display:"flex",justifyContent:"space-between",padding:"8px 16px 0",alignItems:"baseline"}}><h2 style={{fontSize:15,fontWeight:800}}>أفضل العروض الآن ✨</h2><span style={{fontSize:11,color:"#2d6a4f",fontWeight:700}}>عرض الكل</span></div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,padding:"10px 16px 0"}}>
        {filtered.map((o,i)=>(
          <div key={o.id} onClick={addCart} style={{background:"#fff",border:"1px solid #f0e6d3",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.04)",cursor:"pointer"}}>
            <div style={{height:92,background:"#fdf8ee",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontSize:36}}>{o.emoji}<span style={{position:"absolute",top:8,right:8,background:"#ff4d4f",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 7px",borderRadius:12}}>-{o.disc}%</span><span style={{position:"absolute",top:8,left:8,width:20,height:20,background:"#1a1a1a",color:"#fff",fontSize:10,fontWeight:800,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</span></div>
            <div style={{padding:"10px"}}>
              <div style={{fontSize:12,fontWeight:500,lineHeight:1.35,height:32,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as any}}>{o.title}</div>
              <div style={{marginTop:6}}><span style={{fontSize:14,fontWeight:800}}>{o.now} ر.س</span><span style={{fontSize:11,color:"#a99f8e",textDecoration:"line-through",marginRight:6}}>{o.old} ر.س</span></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,paddingTop:6,borderTop:"1px dashed #f0e6d3"}}><span style={{fontSize:10,color:"#7a6f5a",display:"flex",alignItems:"center",gap:4}}><span style={{width:18,height:18,background:"#f5efe2",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{o.store[0]}</span>{o.store}</span><span style={{fontSize:10,background:"#e8f5e9",color:"#2e7d32",padding:"3px 6px",borderRadius:8,fontWeight:700}}>توصيل 1</span></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{margin:"16px",background:"#fff",border:"1px solid #f0e6d3",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
        <div style={{padding:"12px 14px",display:"flex",justifyContent:"space-between",background:"#fffaf0",borderBottom:"1px solid #f0e6d3"}}><h3 style={{fontSize:13,fontWeight:800}}>⚖️ مقارنة الأسعار</h3><span style={{fontSize:11,color:"#8a7e6a"}}>نفس المنتج - أرخص سعر</span></div>
        {COMPARE.map(g=>(
          <div key={g.product}>
            <div style={{padding:"12px 14px 6px",fontWeight:700,fontSize:12,display:"flex",gap:8}}><span>{g.icon}</span>{g.product}</div>
            {g.stores.map(s=>(
              <div key={s.name} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid #faf3e6",fontSize:12}}>
                <span style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:8,height:8,borderRadius:"50%",background:s.best?"#2e7d32":"#d7cfba",display:"inline-block"}}></span>{s.name}</span>
                <span style={{fontWeight:800,color:s.best?"#2e7d32":"#c62828"}}>{s.price} ر.س {s.best?"✓":""}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"space-between",padding:"10px 16px 0"}}><h2 style={{fontSize:15,fontWeight:800}}>🔥 حرق أسعار الحراج</h2><span onClick={()=>setHarajOpen(true)} style={{fontSize:11,color:"#b45309",fontWeight:700,cursor:"pointer"}}>الكل</span></div>
      <div style={{display:"flex",gap:10,overflowX:"auto",padding:"10px 16px 90px"}} className="no-scrollbar">
        {HARAJ.map(h=>(
          <div key={h.t} onClick={()=>window.open("https://haraj.com.sa/tags/حرق_اسعار","_blank")} style={{flex:"0 0 160px",background:"#fff",border:"1px solid #f0e6d3",borderRadius:16,padding:10,cursor:"pointer"}}>
            <div style={{height:64,background:"#fdf8ee",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{h.em}</div>
            <div style={{fontSize:11,fontWeight:700,marginTop:8,lineHeight:1.3,height:30,overflow:"hidden"}}>{h.t}</div>
            <div style={{fontSize:13,fontWeight:800,color:"#b45309",marginTop:4}}>{h.p}</div>
            <div style={{fontSize:10,color:"#8a7e6a"}}>📍 {h.city} • حرق</div>
          </div>
        ))}
      </div>

      {harajOpen && <div onClick={()=>setHarajOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(3px)",zIndex:50}}/>}
      <div style={{position:"fixed",bottom:0,left:0,right:0,maxHeight:"82vh",background:"#fff",borderRadius:"24px 24px 0 0",boxShadow:"0 -8px 32px rgba(0,0,0,0.15)",zIndex:60,transform:harajOpen?"translateY(0)":"translateY(100%)",transition:".36s cubic-bezier(.2,.8,.2,1)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{width:36,height:4,background:"#e0d6c3",borderRadius:2,margin:"12px auto 0"}}/>
        <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",borderBottom:"1px solid #f0e6d3"}}><div><div style={{fontWeight:800,fontSize:14}}>🔥 أفضل حرق أسعار الحراج</div><div style={{fontSize:11,color:"#8a7e6a",marginTop:2}}>مباشر من haraj.com.sa/tags/حرق_اسعار</div></div><button onClick={()=>setHarajOpen(false)} style={{width:32,height:32,borderRadius:10,border:"1px solid #efe6d5",background:"#fff",cursor:"pointer"}}>✕</button></div>
        <div style={{display:"flex",gap:8,padding:"12px 16px",overflowX:"auto"}}>{CITIES.map(c=><button key={c} onClick={()=>setActiveCity(c)} style={{height:30,padding:"0 12px",borderRadius:16,border:`1px solid ${activeCity===c?"#f59e0b":"#efe6d5"}`,background:activeCity===c?"#f59e0b":"#fff",color:activeCity===c?"#000":"#7a6f5a",fontSize:11,cursor:"pointer",fontWeight:activeCity===c?700:400,whiteSpace:"nowrap"}}>{c}</button>)}</div>
        <div style={{overflow:"auto",padding:"0 12px 20px",display:"flex",flexDirection:"column",gap:10}}>{harajFiltered.map(h=><div key={h.t} onClick={()=>window.open("https://haraj.com.sa/tags/حرق_اسعار","_blank")} style={{display:"flex",gap:12,background:"#fdfbf3",border:"1px solid #f0e6d3",borderRadius:14,padding:10,alignItems:"center",cursor:"pointer"}}><div style={{width:46,height:46,background:"#fff",border:"1px solid #f0e6d3",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{h.em}</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{h.t}</div><div style={{fontSize:12,fontWeight:800,color:"#b45309",marginTop:2}}>{h.p}</div><div style={{fontSize:10,color:"#9a8e7a"}}>📍 {h.city}</div></div><div style={{fontSize:11,color:"#2d6a4f",fontWeight:700}}>افتح ↗</div></div>)}</div>
      </div>

      {toast && <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",color:"#fff",padding:"10px 18px",borderRadius:20,fontSize:12,fontWeight:600,zIndex:99,whiteSpace:"nowrap"}}>{toast}</div>}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(254,252,245,0.92)",backdropFilter:"blur(12px)",borderTop:"1px solid #f0e6d3",padding:"10px 16px",textAlign:"center",fontSize:11,color:"#8a7e6a"}}>🛒 {cart} بالسلة • أرخص سعر نجيبه لك يا الغالي</div>
    </div>
  );
}
