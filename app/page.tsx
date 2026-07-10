"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const CONTACT_EMAIL = "Alhkmy11@gmail.com";
const DEALAPP_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile";
const WHATSAPP_PHONE = "966115201661";
const BROKER = "محسن الحكمي";

const AFFILIATE = { noon:"ALHKMY11", amazon:"alhkmy11-21", utm_source:"hakeem_store" };
const C = { main:"#7c3aed", dark:"#4c1d95", bg:"#0f0720", card:"rgba(28,16,51,0.95)", cardBorder:"rgba(139,92,246,0.28)", green:"#10b981", gold:"#fbbf24", muted:"#a78bfa" };

type Offer = { id:string; store:string; product:string; p:number; old:number; coupon:string; img:string; link:string; };
const offersData: Offer[] = [
  {id:"j1", store:"جرير", product:"حامل جوال معدني", p:45, old:90, coupon:"JARIR50", img:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop", link:"https://www.jarir.com"},
  {id:"n1", store:"نون", product:"ساعة ذكية Ultra", p:299, old:599, coupon:"NOON50", img:"https://images.unsplash.com/photo-1524805444973-bf35e3d893aa?w=500&h=500&fit=crop", link:"https://www.noon.com"},
  {id:"a1", store:"أمازون", product:"سماعة لاسلكية", p:149, old:299, coupon:"AMZ15", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop", link:"https://www.amazon.sa"},
  {id:"e1", store:"إكسترا", product:"مكيف 18 وحدة", p:1899, old:2499, coupon:"EXTRA15", img:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop", link:"https://www.extra.com"},
];

type RE = { id:string; title:string; type:string; price:string; loc:string; area:string; img:string; badge:string; dealUrl:string; };
const reData: RE[] = [
  {id:"r1", title:"شقة 4 غرف - جدة الحمراء", type:"بيع", price:"850,000 ر.س", loc:"جدة - الحمراء", area:"180م²", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", badge:"مرخص فال ✅", dealUrl: DEALAPP_LINK},
  {id:"r2", title:"فيلا مودرن - المخواة", type:"بيع", price:"1,250,000 ر.س", loc:"المخواة - الباحة", area:"350م²", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", badge:"عرض حصري", dealUrl: DEALAPP_LINK},
  {id:"r3", title:"أرض سكنية - مخطط معتمد", type:"بيع", price:"420,000 ر.س", loc:"الباحة - المخواة", area:"600م²", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", badge:"صك إلكتروني", dealUrl: DEALAPP_LINK},
  {id:"r4", title:"محل تجاري للإيجار", type:"إيجار", price:"45,000 ر.س/سنة", loc:"جدة - الروضة", area:"90م²", img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop", badge:"موقع مميز", dealUrl: DEALAPP_LINK},
];

export default function Page(){
  const [selected,setSelected]=useState("الكل"); const [toast,setToast]=useState<string|null>(null); const [cart,setCart]=useState<Offer[]>([]); const [search,setSearch]=useState(""); const [active,setActive]=useState<null|'login'|'contact'|'privacy'|'terms'|'usage'>(null); const [phone,setPhone]=useState(""); const [user,setUser]=useState<any>(null); const [cName,setCName]=useState(""); const [cMsg,setCMsg]=useState(""); const scrollRef=useRef<HTMLDivElement>(null); const [pause,setPause]=useState(false); const [clicks,setClicks]=useState<any[]>([]);
  const [showDealApp,setShowDealApp]=useState(false); const [dealUrl,setDealUrl]=useState(DEALAPP_LINK);

  useEffect(()=>{ const u=localStorage.getItem("hkeem_user"); if(u) setUser(JSON.parse(u)); const cl=localStorage.getItem("hkeem_clicks"); if(cl) setClicks(JSON.parse(cl)); },[]);
  useEffect(()=>{ if(pause) return; const iv=setInterval(()=>{ if(scrollRef.current){ const {scrollLeft,scrollWidth,clientWidth}=scrollRef.current; if(scrollLeft+clientWidth>=scrollWidth-10){scrollRef.current.scrollTo({left:0,behavior:'smooth'});} else {scrollRef.current.scrollBy({left:310,behavior:'smooth'});} } },3000); return()=>clearInterval(iv); },[pause]);

  const filtered=useMemo(()=>{ let f:any=offersData; if(selected!=="الكل") f=f.filter((o:any)=>o.store===selected); if(search) f=f.filter((o:any)=>o.product.includes(search)); return f.map((o:any)=>({...o,disc:Math.round((1-o.p/o.old)*100)})); },[selected,search]);
  const handleBuy=(o:Offer)=>{ const n=[...clicks,{store:o.store,price:o.p,time:Date.now()}]; setClicks(n); localStorage.setItem("hkeem_clicks",JSON.stringify(n)); setCart([...cart,o]); setToast(`فتح ${o.store} كوبون ${o.coupon} ✅`); setTimeout(()=>{setToast(null); window.open(`${o.link}?utm_source=${AFFILIATE.utm_source}&ref=${AFFILIATE.noon}`,'_blank');},400); };
  const openDealApp=(url:string=DEALAPP_LINK)=>{ setDealUrl(url); setShowDealApp(true); };

  return(
    <div dir="rtl" style={{fontFamily:"system-ui",background:C.bg,minHeight:"100vh",color:"#fff"}}>
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
      {toast && <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#fff",padding:"8px 16px",borderRadius:16,zIndex:999,fontWeight:800,fontSize:12}}>{toast}</div>}

      <div style={{position:"sticky",top:0,zIndex:30,background:"rgba(15,7,32,0.97)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.cardBorder}`,padding:"8px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}><b>👑 حكيم</b><span style={{background:C.gold,color:"#000",fontSize:8,padding:"2px 6px",borderRadius:8,fontWeight:900}}>فال مرخص</span><button onClick={()=>setActive('login')} style={{background:user?C.green:"#fff",color:user?"#fff":C.dark,border:"none",padding:"4px 9px",borderRadius:12,fontSize:10,fontWeight:800}}>{user?"✅":"دخول"}</button></div>
        <div style={{display:"flex",gap:4}}><button onClick={()=>openDealApp()} style={{background:"#0ea5e9",color:"#fff",border:"none",padding:"5px 10px",borderRadius:11,fontSize:10,fontWeight:800,cursor:"pointer"}}>ديل DealApp 🔗</button><a href="#realestate" style={{background:C.green,color:"#fff",textDecoration:"none",padding:"5px 9px",borderRadius:11,fontSize:10,fontWeight:800}}>عقار 🏠</a><a href="#offers" style={{background:"rgba(255,255,255,0.12)",color:"#fff",textDecoration:"none",padding:"5px 8px",borderRadius:11,fontSize:10}}>عروض</a></div>
      </div>

      <div style={{background:`linear-gradient(135deg,${C.main},${C.dark})`,padding:"18px 12px",textAlign:"center"}}>
        <div style={{display:"inline-flex",gap:5,background:"rgba(255,255,255,0.18)",padding:"4px 10px",borderRadius:20,fontSize:10,marginBottom:8}}>✅ وسيط عقاري مرخص فال • مؤسسة {BROKER} • {CONTACT_EMAIL}</div>
        <h1 style={{fontSize:17,fontWeight:900,margin:"0 0 6px"}}>يسعدني استقبال طلباتكم وعروضكم العقارية</h1>
        <p style={{fontSize:11,opacity:.92,lineHeight:1.7,margin:"0 0 10px"}}>عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة<br/><b style={{color:C.gold}}>({BROKER})</b> - وسيط معتمد الهيئة العامة للعقار</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>openDealApp()} style={{background:"#fff",color:C.dark,border:"none",padding:"8px 14px",borderRadius:18,fontSize:11,fontWeight:900,cursor:"pointer"}}>🔗 عرض ملفي في ديل داخل الموقع</button>
          <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" style={{background:C.green,color:"#fff",textDecoration:"none",padding:"8px 14px",borderRadius:18,fontSize:11,fontWeight:900}}>واتساب {WHATSAPP_PHONE} 💬</a>
        </div>
        <div style={{marginTop:8,fontSize:9,opacity:.8}}>للشكاوى والاستفسارات: {CONTACT_EMAIL}</div>
      </div>

      <div id="offers" style={{paddingTop:12}}><div style={{padding:"0 10px",display:"flex",justifyContent:"space-between"}}><h2 style={{fontSize:12,fontWeight:900,margin:0}}>⚡ عروض أوفر اليوم</h2><span style={{fontSize:9,color:C.muted}}>وفرت {cart.reduce((a,b)=>a+(b.old-b.p),0)} ر.س</span></div>
        <div style={{display:"flex",gap:4,padding:"7px 10px",overflowX:"auto"}}>{["الكل","جرير","نون","أمازون","إكسترا"].map(s=><button key={s} onClick={()=>setSelected(s)} style={{whiteSpace:"nowrap",padding:"4px 9px",borderRadius:10,border:`1px solid ${selected===s?C.main:C.cardBorder}`,background:selected===s?C.main:C.card,color:"#fff",fontSize:9,fontWeight:700}}>{s}</button>)}</div>
        <div ref={scrollRef} onMouseEnter={()=>setPause(true)} onMouseLeave={()=>setPause(false)} style={{display:"flex",gap:9,overflowX:"auto",padding:"4px 10px",scrollSnapType:"x mandatory"}}>
          {filtered.map((o:any)=><div key={o.id} style={{minWidth:260,scrollSnapAlign:"start",background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:12,overflow:"hidden"}}><div style={{height:130}}><img src={o.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div><div style={{padding:7}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9}}><b>{o.store}</b><span style={{background:"#22c55e",padding:"1px 5px",borderRadius:5,fontWeight:800}}>-{o.disc}%</span></div><div style={{fontSize:11,fontWeight:700,marginTop:3}}>{o.product}</div><div style={{fontSize:12,fontWeight:900,marginTop:3}}>{o.p} ر.س <span style={{fontSize:8,color:"#888",textDecoration:"line-through"}}>{o.old}</span></div><button onClick={()=>handleBuy(o)} style={{width:"100%",marginTop:5,background:"#fff",color:C.dark,border:"none",padding:"6px",borderRadius:7,fontWeight:800,fontSize:10}}>كوبون {o.coupon} - شراء</button></div></div>)}
        </div>
      </div>

      <div id="dealapp" style={{margin:"14px 8px",background:"linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0f172a 100%)",border:"1px solid rgba(14,165,233,0.4)",borderRadius:16,padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><h2 style={{fontSize:14,fontWeight:900,margin:"0 0 3px"}}>🔗 ديل DealApp - مكتبي العقاري الرسمي <span style={{background:"#fff",color:"#0ea5e9",fontSize:8,padding:"2px 6px",borderRadius:6,marginRight:6}}>موثق ✅</span></h2><div style={{fontSize:10,opacity:.9}}>{BROKER} - وسيط عقاري مرخص فال - جدة 📍 مؤسسة محسن ..</div></div>
        </div>
        <div style={{background:"rgba(0,0,0,0.35)",borderRadius:12,padding:11,border:"1px solid rgba(255,255,255,0.1)",textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:800,lineHeight:1.7}}>يسعدني مساعدتكم في البحث عن عقاراتكم وتسويقها<br/>ويسعدني استقبال طلباتكم وعروضكم</div>
          <div style={{fontSize:12,fontWeight:900,color:C.gold,marginTop:4}}>({BROKER}) - وسيط عقاري مرخص فال</div>
          <div style={{marginTop:10,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>openDealApp()} style={{background:"#fff",color:"#000",border:"none",padding:"9px 16px",borderRadius:20,fontWeight:900,fontSize:11,cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,0.2)"}}>عرض عقاراتي داخل الموقع 🏠</button>
            <button onClick={()=>{navigator.clipboard.writeText(DEALAPP_LINK); setToast('تم نسخ رابط ديل 📋'); setTimeout(()=>setToast(null),1500);}} style={{background:"rgba(255,255,255,0.15)",color:"#fff",border:"1px solid rgba(255,255,255,0.2)",padding:"8px 12px",borderRadius:20,fontSize:10,fontWeight:800,cursor:"pointer"}}>نسخ رابط المكتب 📋</button>
          </div>
          <div style={{marginTop:8,background:"rgba(255,255,255,0.08)",padding:"6px 8px",borderRadius:8,fontSize:8,wordBreak:"break-all",direction:"ltr"}}>{DEALAPP_LINK}</div>
          <button onClick={()=>openDealApp()} style={{marginTop:10,width:"100%",background:"#facc15",color:"#000",border:"none",padding:"10px",borderRadius:12,fontWeight:900,fontSize:12,cursor:"pointer"}}>مشاركة رابط المكتب 📤</button>
        </div>
      </div>

      <div id="realestate" style={{margin:"0 8px",background:"linear-gradient(180deg, rgba(16,185,129,0.14), rgba(28,16,51,0.96))",border:"1px solid rgba(16,185,129,0.28)",borderRadius:14,padding:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><h2 style={{fontSize:13,fontWeight:900,margin:0}}>🏠 عروضي العقارية المعروضة حالياً - مرخص فال</h2><button onClick={()=>openDealApp()} style={{fontSize:9,background:C.green,color:"#fff",border:"none",padding:"4px 8px",borderRadius:8,fontWeight:800,cursor:"pointer"}}>عرض في ديل ↗</button></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:7}}>
          {reData.map(r=><div key={r.id} style={{background:"rgba(15,7,32,0.88)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,overflow:"hidden"}}><div style={{height:110,position:"relative"}}><img src={r.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/><span style={{position:"absolute",top:5,right:5,background:r.type==="بيع"?"#ef4444":C.main,color:"#fff",fontSize:7,padding:"2px 5px",borderRadius:5,fontWeight:800}}>{r.type}</span><span style={{position:"absolute",top:5,left:5,background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:6,padding:"2px 5px",borderRadius:5}}>{r.badge}</span></div><div style={{padding:7}}><div style={{fontSize:10,fontWeight:800}}>{r.title}</div><div style={{fontSize:8,color:"#aaa",marginTop:2}}>📍 {r.loc} • {r.area}</div><div style={{fontSize:12,fontWeight:900,color:C.gold,marginTop:4}}>{r.price}</div><div style={{display:"flex",gap:4,marginTop:6}}><a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`استفسار عن ${r.title}`)}`} target="_blank" style={{flex:1,background:C.green,color:"#fff",textAlign:"center",textDecoration:"none",padding:"5px",borderRadius:6,fontSize:8,fontWeight:800}}>واتساب</a><button onClick={()=>openDealApp(r.dealUrl)} style={{flex:1,background:"#0ea5e9",color:"#fff",border:"none",padding:"5px",borderRadius:6,fontSize:8,fontWeight:800,cursor:"pointer"}}>عرض في ديل</button></div></div></div>)}
        </div>
        <div style={{textAlign:"center",marginTop:8}}><button onClick={()=>openDealApp()} style={{display:"inline-block",background:"#fff",color:"#000",border:"none",padding:"8px 16px",borderRadius:16,fontSize:10,fontWeight:900,cursor:"pointer"}}>شاهد كل ما أعرضه حالياً في DealApp 🏘️</button></div>
        <div style={{marginTop:8,textAlign:"center",fontSize:8,color:"#888"}}>جميع العروض موثقة برخصة فال • للشكاوى: {CONTACT_EMAIL}</div>
      </div>

      <footer style={{background:"#08010f",borderTop:`1px solid ${C.cardBorder}`,padding:"14px 10px",marginTop:12,fontSize:9}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><b>متجر حكيم 👑 - {BROKER}</b><div style={{color:"#777",marginTop:4,lineHeight:1.6}}>وسيط عقاري مرخص فال<br/>جدة • مؤسسة محسن<br/><button onClick={()=>openDealApp()} style={{background:"none",border:"none",color:"#0ea5e9",fontSize:9,padding:0,cursor:"pointer"}}>DealApp - ملفي الرسمي</button></div></div>
          <div><b>تواصل وشكاوى ✉️</b><div style={{display:"flex",flexDirection:"column",gap:4,marginTop:4}}><a href={`mailto:${CONTACT_EMAIL}`} style={{color:C.gold,textDecoration:"none",fontWeight:800}}>{CONTACT_EMAIL}</a><a href={`https://wa.me/${WHATSAPP_PHONE}`} style={{color:C.green,textDecoration:"none"}}>+{WHATSAPP_PHONE}</a></div></div>
        </div>
        <div style={{textAlign:"center",color:"#555",marginTop:10,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:7}}>© 2026 {BROKER} • ديل DealApp • {CONTACT_EMAIL}</div>
      </footer>

      {active && <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:12}} onClick={()=>setActive(null)}><div onClick={e=>e.stopPropagation()} style={{background:"#170a2e",border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:12,width:"100%",maxWidth:380}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><b style={{fontSize:12}}>{active==='contact'?'تواصل - ديل':active}</b><button onClick={()=>setActive(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",width:22,height:22,borderRadius:"50%"}}>✕</button></div>
        {active==='login' && <><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xxxxxxxx" style={{width:"100%",padding:"8px",borderRadius:7,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",fontSize:11}}/><button onClick={()=>{ if(phone.length>=10){const u={phone,joined:new Date().toISOString()}; setUser(u); localStorage.setItem("hkeem_user",JSON.stringify(u)); setActive(null); setToast('تم الدخول ✅'); setTimeout(()=>setToast(null),1200);} }} style={{width:"100%",marginTop:6,background:C.main,color:"#fff",border:"none",padding:"8px",borderRadius:7,fontWeight:800,fontSize:11}}>دخول</button></>}
        {active==='contact' && <div><div style={{background:"rgba(14,165,233,0.15)",padding:8,borderRadius:8,fontSize:10,marginBottom:6,lineHeight:1.6,border:"1px solid rgba(14,165,233,0.2)"}}>يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة<br/><b>({BROKER})</b></div><button onClick={()=>openDealApp()} style={{width:"100%",background:"#0ea5e9",color:"#fff",border:"none",padding:"8px",borderRadius:7,fontWeight:800,fontSize:11,marginBottom:6}}>فتح ملفي في ديل داخل الموقع 🔗</button><div style={{fontSize:10,marginBottom:4}}>📧 {CONTACT_EMAIL} • 📞 +{WHATSAPP_PHONE}</div><input value={cName} onChange={e=>setCName(e.target.value)} placeholder="اسمك" style={{width:"100%",padding:"7px",borderRadius:6,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",fontSize:10,marginBottom:5}}/><textarea value={cMsg} onChange={e=>setCMsg(e.target.value)} placeholder="طلبك العقاري..." rows={3} style={{width:"100%",padding:"7px",borderRadius:6,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",fontSize:10}}></textarea><button onClick={()=>window.location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(cName)}&body=${encodeURIComponent(cMsg)}`} style={{width:"100%",marginTop:5,background:C.main,color:"#fff",border:"none",padding:"8px",borderRadius:7,fontWeight:800,fontSize:11}}>إرسال لـ {CONTACT_EMAIL} ✉️</button></div>}
      </div></div>}

      {showDealApp && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",flexDirection:"column"}}>
          <div style={{background:"#0f172a",padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
            <div><div style={{fontWeight:900,fontSize:12}}>🏢 {BROKER} - وسيط عقاري مرخص فال</div><div style={{fontSize:9,color:"#94a3b8"}}>مؤسسة {BROKER} .. جدة • {CONTACT_EMAIL}</div></div>
            <div style={{display:"flex",gap:5}}><a href={dealUrl} target="_blank" style={{background:"#0ea5e9",color:"#fff",textDecoration:"none",padding:"6px 10px",borderRadius:8,fontSize:10,fontWeight:800}}>فتح في DealApp ↗</a><button onClick={()=>setShowDealApp(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",fontWeight:800}}>✕</button></div>
          </div>
          <div style={{background:"#facc15",color:"#000",padding:"6px",textAlign:"center",fontSize:10,fontWeight:800}}>يسعدني استقبال طلباتكم وعروضكم وسنخدمكم في أقرب فرصة - مشاركة المكتب جاهزة</div>
          <iframe src={dealUrl} style={{flex:1,border:"none",width:"100%",background:"#fff"}} title="DealApp Profile" allow="clipboard-write; clipboard-read"/>
          <div style={{background:"#0f172a",padding:"8px",display:"flex",gap:6,justifyContent:"center"}}>
            <button onClick={()=>{navigator.clipboard.writeText(dealUrl); setToast('تم نسخ رابط المكتب 📋');}} style={{background:"rgba(255,255,255,0.12)",color:"#fff",border:"1px solid rgba(255,255,255,0.15)",padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:700}}>نسخ رابط المكتب 📋</button>
            <a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`شفت عقاراتك في متجر حكيم - ${dealUrl}`)}`} target="_blank" style={{background:C.green,color:"#fff",textDecoration:"none",padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:800}}>مشاركة واتساب 💬</a>
            <button onClick={()=>setShowDealApp(false)} style={{background:"#fff",color:"#000",border:"none",padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:800}}>مشاركة رابط المكتب ✅</button>
          </div>
        </div>
      )}

      <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" style={{position:"fixed",bottom:12,left:12,zIndex:20,background:"#25D366",color:"#fff",width:44,height:44,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,textDecoration:"none",boxShadow:"0 3px 10px rgba(0,0,0,0.3)"}}>💬</a>
    </div>
  );
}
