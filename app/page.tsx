"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const CONTACT_EMAIL = "Alhkmy11@gmail.com";
const DEALAPP_LINK = "https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile";
const WHATSAPP_PHONE = "966115201661";
const BROKER_NAME = "محسن الحكمي";

const AFFILIATE_CONFIG = { noon:"ALHKMY11", amazon:"alhkmy11-21", jarir:"jarir_ALHKMY", othaim:"othaim_ALHKMY", extra:"extra_ALHKMY", aldakhan:"dkan_ALHKMY", utm_source:"hakeem_store", utm_medium:"affiliate" };
const C = { main:"#7c3aed", dark:"#4c1d95", bg:"#0f0720", card:"rgba(28,16,51,0.92)", cardBorder:"rgba(139,92,246,0.25)", white:"#fff", muted:"#a78bfa", green:"#10b981", gold:"#fbbf24" };

type Offer = { id:string; store:string; product:string; p:number; old:number; coupon:string; img:string; verified:boolean; tabby?:boolean; tamara?:boolean; source:string; trust:number; link:string; commission:number; };
const offersData: Offer[] = [
  {id:"j1", store:"جرير", product:"حامل جوال معدني", p:45, old:90, coupon:"JARIR50", img:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop", verified:true, tabby:true, tamara:true, source:"jarir.com", trust:99, link:"https://www.jarir.com", commission:3.2},
  {id:"o1", store:"العثيم", product:"قهوة مختصة 1KG", p:59, old:119, coupon:"OTH50", img:"https://images.unsplash.com/photo-1447933601403-0ba6f8a3964b?w=500&h=500&fit=crop", verified:true, source:"othaimmarkets.com", trust:94, link:"https://www.othaimmarkets.com", commission:4},
  {id:"n1", store:"نون", product:"ساعة ذكية Ultra", p:299, old:599, coupon:"NOON50", img:"https://images.unsplash.com/photo-1524805444973-bf35e3d893aa?w=500&h=500&fit=crop", verified:true, tabby:true, source:"noon.com", trust:96, link:"https://www.noon.com", commission:7},
  {id:"e1", store:"إكسترا", product:"مكيف 18 وحدة", p:1899, old:2499, coupon:"EXTRA15", img:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=500&fit=crop", verified:true, tabby:true, tamara:true, source:"extra.com", trust:97, link:"https://www.extra.com", commission:2.5},
];

type RealEstate = { id:string; title:string; type:string; price:string; location:string; area:string; img:string; badge:string; status:string; };
const realEstateData: RealEstate[] = [
  {id:"r1", title:"شقة 4 غرف - جدة الحمراء", type:"بيع", price:"850,000 ر.س", location:"جدة - الحمراء", area:"180 م²", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop", badge:"مرخص فال", status:"متاح"},
  {id:"r2", title:"فيلا مودرن - المخواة", type:"بيع", price:"1,250,000 ر.س", location:"المخواة - الباحة", area:"350 م²", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", badge:"عرض حصري", status:"متاح"},
  {id:"r3", title:"أرض سكنية - مخطط معتمد", type:"بيع", price:"420,000 ر.س", location:"الباحة", area:"600 م²", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop", badge:"صك إلكتروني", status:"متاح"},
  {id:"r4", title:"محل تجاري للإيجار", type:"إيجار", price:"45,000 ر.س / سنة", location:"جدة - الروضة", area:"90 م²", img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop", badge:"موقع مميز", status:"قريباً"},
];

function buildAffLink(o:Offer){ const utm=`?utm_source=${AFFILIATE_CONFIG.utm_source}&utm_medium=${AFFILIATE_CONFIG.utm_medium}&utm_campaign=${o.coupon}`; return `${o.link}${utm}&ref=${AFFILIATE_CONFIG.noon}`; }

export default function Page(){
  const [selected,setSelected]=useState("الكل"); const [copied,setCopied]=useState<string|null>(null); const [toast,setToast]=useState<string|null>(null); const [cart,setCart]=useState<Offer[]>([]); const [searchQuery,setSearchQuery]=useState(""); const [showDashboard,setShowDashboard]=useState(false); const [clicks,setClicks]=useState<any[]>([]); const [assistantInput,setAssistantInput]=useState(""); const [messages,setMessages]=useState<{role:'user'|'bot',text:string}[]>([{role:'bot',text:'أهلاً يا حكيم 👑 أنا مساعدك العقاري والاقتصادي.. تبي عقار ولا عروض أوفر؟'}]); const scrollRef=useRef<HTMLDivElement>(null); const [isPaused,setIsPaused]=useState(false); const [currentIndex,setCurrentIndex]=useState(0); const [budget,setBudget]=useState(500); const [activePage,setActivePage]=useState<null|'login'|'privacy'|'usage'|'terms'|'contact'|'realestate'>(null); const [phone,setPhone]=useState(""); const [otpSent,setOtpSent]=useState(false); const [user,setUser]=useState<any>(null); const [contactName,setContactName]=useState(""); const [contactMsg,setContactMsg]=useState("");

  useEffect(()=>{ const sc=localStorage.getItem("hkeem_clicks"); if(sc) setClicks(JSON.parse(sc)); const su=localStorage.getItem("hkeem_user"); if(su) setUser(JSON.parse(su)); const ca=localStorage.getItem("hkeem_cart"); if(ca) setCart(JSON.parse(ca)); },[]);
  const saveClick=(o:any,type:string)=>{ const e={id:Date.now(),store:o.store||o.location,product:o.product||o.title,coupon:o.coupon||o.type,type,price:o.p||0,time:new Date().toISOString()}; const n=[e,...clicks].slice(0,200); setClicks(n); localStorage.setItem("hkeem_clicks",JSON.stringify(n)); };
  useEffect(()=>{ if(isPaused) return; const iv=setInterval(()=>{ if(scrollRef.current){ const {scrollLeft,scrollWidth,clientWidth}=scrollRef.current; if(scrollLeft+clientWidth>=scrollWidth-10){scrollRef.current.scrollTo({left:0,behavior:'smooth'}); setCurrentIndex(0);} else {scrollRef.current.scrollBy({left:310,behavior:'smooth'}); setCurrentIndex(p=>(p+1)%offersData.length);} } },3200); return()=>clearInterval(iv); },[isPaused]);
  const offersWithDisc=useMemo(()=>offersData.map(o=>({...o,disc:Math.round((1-o.p/o.old)*100)})),[]);
  const filtered=useMemo(()=>{ let f:any=offersWithDisc; if(selected!=="الكل") f=f.filter((o:any)=>o.store===selected); if(searchQuery) f=f.filter((o:any)=>o.product.includes(searchQuery)||o.store.includes(searchQuery)); return f.sort((a:any,b:any)=>b.disc-a.disc); },[selected,searchQuery,offersWithDisc]);
  const goToSlide=(i:number)=>{ if(scrollRef.current){scrollRef.current.scrollTo({left:i*310,behavior:'smooth'}); setCurrentIndex(i);} };
  const handleBuy=(o:any)=>{ saveClick(o,'click'); const link=buildAffLink(o); setCart(pr=>{const n=[...pr,o]; localStorage.setItem("hkeem_cart",JSON.stringify(n)); return n;}); setToast(`فتح ${o.store} - كوبون ${o.coupon} مفعل 🎯`); setTimeout(()=>{setToast(null); window.open(link,'_blank');},400); };
  const copyCoupon=(o:any)=>{ navigator.clipboard.writeText(o.coupon); saveClick(o,'copy'); setCopied(o.coupon); setToast(`نسخ ${o.coupon} ✅`); setTimeout(()=>{setCopied(null); setToast(null);},1500); };
  const totalClicks=clicks.filter(c=>c.type==='click').length; const estimated=clicks.filter(c=>c.type==='click').reduce((s,c)=>s+(c.price*0.05*0.03),0); const savedTotal=cart.reduce((a,b)=>a+(b.old-b.p),0);
  const loginWithPhone=()=>{ if(phone.length<10){setToast('رقم غير صحيح'); setTimeout(()=>setToast(null),1200); return;} setOtpSent(true); setTimeout(()=>{ const u={phone, provider:'phone', joined:new Date().toISOString()}; setUser(u); localStorage.setItem("hkeem_user",JSON.stringify(u)); setToast(`أهلاً ${phone} ✅`); setActivePage(null); setOtpSent(false); },800); };

  return(
    <div dir="rtl" style={{fontFamily:"system-ui",background:C.bg,minHeight:"100vh",color:C.white}}>
      <style>{`div::-webkit-scrollbar{display:none} *{scrollbar-width:none}`}</style>
      {toast && <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#fff",padding:"9px 18px",borderRadius:18,zIndex:999,fontWeight:800,fontSize:12}}>{toast}</div>}

      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(15,7,32,0.96)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.cardBorder}`,padding:"9px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{fontWeight:900,fontSize:15}}>👑 حكيم</div><span style={{background:C.gold,color:"#000",fontSize:9,padding:"2px 6px",borderRadius:10,fontWeight:900}}>فال مرخص</span><button onClick={()=>setActivePage('login')} style={{background:user?C.green:"#fff",color:user?"#fff":C.dark,border:"none",padding:"5px 10px",borderRadius:14,fontSize:10,fontWeight:900}}>{user?`✅`:"دخول"}</button></div>
        <div style={{display:"flex",gap:4}}><a href="#realestate" style={{background:"#10b981",color:"#fff",textDecoration:"none",padding:"5px 10px",borderRadius:12,fontSize:10,fontWeight:800}}>عقار 🏠</a><button onClick={()=>setActivePage('contact')} style={{background:"rgba(255,255,255,0.12)",color:"#fff",border:"none",padding:"5px 9px",borderRadius:12,fontSize:10}}>تواصل</button><a href="#offers" style={{color:"#fff",textDecoration:"none",background:"rgba(255,255,255,0.1)",padding:"5px 8px",borderRadius:11,fontSize:10}}>عروضكم</a></div>
      </div>

      <div style={{background:`linear-gradient(135deg,${C.main},${C.dark})`,padding:"18px 12px",textAlign:"center"}}>
        <div style={{display:"inline-flex",gap:6,background:"rgba(255,255,255,0.15)",padding:"4px 10px",borderRadius:20,fontSize:10,marginBottom:8}}><span>✅ وسيط عقاري مرخص فال</span><span>•</span><span>عروض أوفر</span></div>
        <h1 style={{fontSize:17,fontWeight:900,margin:"0 0 6px"}}>متجر حكيم - عقار موثق وعروض أوفر من الكل 💎</h1>
        <p style={{fontSize:11,opacity:.9,margin:"0 0 10px",lineHeight:1.6}}>يسعدني استقبال طلباتكم وعروضكم العقارية<br/>عبر مكتبي المرخص وسنخدمكم في أقرب فرصة - {BROKER_NAME}</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginTop:8}}>
          <a href={DEALAPP_LINK} target="_blank" style={{background:"#fff",color:C.dark,textDecoration:"none",padding:"8px 14px",borderRadius:18,fontSize:11,fontWeight:900}}>شاهد ملفي في DealApp 🏢</a>
          <a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`السلام عليكم ${BROKER_NAME} - جاي من متجر حكيم`)}`} target="_blank" style={{background:C.green,color:"#fff",textDecoration:"none",padding:"8px 14px",borderRadius:18,fontSize:11,fontWeight:900}}>واتساب عقاري 💬</a>
        </div>
      </div>

      {showDashboard && <div style={{margin:8,background:"linear-gradient(135deg,#1a0b2e,#2d1b4e)",border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:10,textAlign:"center",fontSize:11}}>ضغطات: {totalClicks} • ربح متوقع: {estimated.toFixed(1)} ر.س • للشكاوى: {CONTACT_EMAIL}</div>}

      <div id="offers" style={{paddingTop:12}}><div style={{padding:"0 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontSize:13,fontWeight:900,margin:0}}>⚡ عروضكم اليوم</h2><button onClick={()=>setShowDashboard(!showDashboard)} style={{background:C.gold,color:"#000",border:"none",padding:"4px 8px",borderRadius:10,fontSize:9,fontWeight:800}}>💰 أرباحي {totalClicks}</button></div>
        <div style={{display:"flex",gap:5,padding:"8px 10px",overflowX:"auto"}}>{["الكل","جرير","العثيم","نون","إكسترا"].map(s=><button key={s} onClick={()=>setSelected(s)} style={{whiteSpace:"nowrap",padding:"5px 10px",borderRadius:12,border:`1px solid ${selected===s?C.main:C.cardBorder}`,background:selected===s?C.main:C.card,color:"#fff",fontSize:10,fontWeight:700}}>{s}</button>)}</div>
        <div ref={scrollRef} onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)} style={{display:"flex",gap:10,overflowX:"auto",scrollSnapType:"x mandatory",padding:"5px 10px",scrollBehavior:"smooth"}}>
          {filtered.map((o:any)=>(
            <div key={o.id} style={{minWidth:280,scrollSnapAlign:"start",background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{height:140,background:"#120a26"}}><img src={o.img} alt={o.product} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{padding:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,fontWeight:800}}>{o.store}</span><span style={{background:"#22c55e",color:"#fff",fontSize:8,padding:"2px 5px",borderRadius:6,fontWeight:800}}>-{o.disc}%</span></div><div style={{fontSize:12,fontWeight:700,marginTop:4}}>{o.product}</div><div style={{marginTop:4}}><span style={{fontWeight:900,fontSize:13}}>{o.p} ر.س</span> <span style={{fontSize:9,color:"#888",textDecoration:"line-through"}}>{o.old}</span></div><div style={{marginTop:6,background:"rgba(0,0,0,0.3)",border:"1px dashed rgba(139,92,246,.4)",borderRadius:6,padding:"5px 7px",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10}}>كوبون <b>{o.coupon}</b></span><button onClick={()=>copyCoupon(o)} style={{background:copied===o.coupon?C.green:C.main,color:"#fff",border:"none",padding:"3px 7px",borderRadius:5,fontSize:9,fontWeight:800}}>{copied===o.coupon?"نُسخ":"نسخ"}</button></div><button onClick={()=>handleBuy(o)} style={{width:"100%",marginTop:6,background:"#fff",color:C.dark,border:"none",padding:"7px",borderRadius:7,fontWeight:900,fontSize:10}}>أضف للسلة - كوبون مفعل</button></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:4,padding:"6px 0 8px"}}>{filtered.map((_:any,i:number)=><button key={i} onClick={()=>goToSlide(i)} style={{width:currentIndex===i?14:5,height:5,borderRadius:6,border:"none",background:currentIndex===i?C.main:"rgba(255,255,255,0.25)"}}/>)}</div>
      </div>

      <div id="realestate" style={{margin:"12px 8px",background:"linear-gradient(180deg, rgba(16,185,129,0.12), rgba(28,16,51,0.9))",border:`1px solid rgba(16,185,129,0.25)`,borderRadius:16,padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><h2 style={{fontSize:14,fontWeight:900,margin:0}}>🏠 العروض العقارية - مرخص فال</h2><div style={{fontSize:9,color:C.muted,marginTop:2}}>مؤسسة {BROKER_NAME} لخدمات الأعمال • رخصة معتمدة</div></div>
          <a href={DEALAPP_LINK} target="_blank" style={{background:C.green,color:"#fff",textDecoration:"none",padding:"5px 10px",borderRadius:10,fontSize:9,fontWeight:800}}>ملفي الرسمي ↗</a>
        </div>

        <div style={{background:"rgba(0,0,0,0.35)",borderRadius:12,padding:10,marginBottom:10,border:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
          <p style={{fontSize:12,fontWeight:700,margin:0,lineHeight:1.7}}>يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
          <p style={{fontSize:11,color:C.gold,fontWeight:800,margin:"4px 0 0"}}>({BROKER_NAME})</p>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>
            <a href={DEALAPP_LINK} target="_blank" style={{background:"#fff",color:"#000",textDecoration:"none",padding:"6px 12px",borderRadius:16,fontSize:10,fontWeight:900}}>🔗 {DEALAPP_LINK.replace("https://","").slice(0,22)}...</a>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{background:"rgba(255,255,255,0.1)",color:"#fff",textDecoration:"none",padding:"6px 10px",borderRadius:16,fontSize:10}}>{CONTACT_EMAIL}</a>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:8}}>
          {realEstateData.map((r)=>(
            <div key={r.id} style={{background:"rgba(15,7,32,0.85)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,overflow:"hidden"}}>
              <div style={{position:"relative",height:120}}><img src={r.img} alt={r.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",top:6,right:6,display:"flex",gap:4}}><span style={{background:r.type==="بيع"?"#ef4444":C.main,color:"#fff",fontSize:8,padding:"2px 6px",borderRadius:6,fontWeight:800}}>{r.type}</span><span style={{background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:7,padding:"2px 5px",borderRadius:6}}>{r.badge}</span></div><div style={{position:"absolute",bottom:6,left:6,background:C.green,color:"#fff",fontSize:7,padding:"2px 6px",borderRadius:6,fontWeight:800}}>{r.status}</div></div>
              <div style={{padding:8}}><div style={{fontSize:11,fontWeight:800,lineHeight:1.3}}>{r.title}</div><div style={{fontSize:9,color:"#aaa",marginTop:3}}>📍 {r.location} • {r.area}</div><div style={{fontSize:13,fontWeight:900,color:C.gold,marginTop:5}}>{r.price}</div><div style={{display:"flex",gap:4,marginTop:7}}><a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`استفسار عن ${r.title} - ${r.location}`)}`} target="_blank" style={{flex:1,background:C.green,color:"#fff",textDecoration:"none",textAlign:"center",padding:"6px",borderRadius:7,fontSize:9,fontWeight:800}}>واتساب</a><a href={DEALAPP_LINK} target="_blank" style={{flex:1,background:"rgba(255,255,255,0.1)",color:"#fff",textDecoration:"none",textAlign:"center",padding:"6px",borderRadius:7,fontSize:9,fontWeight:800}}>التفاصيل</a></div></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,background:"rgba(0,0,0,0.25)",padding:8,borderRadius:8,fontSize:9,color:"#aaa",textAlign:"center"}}>جميع العروض موثقة برخصة فال • عمولة السعي حسب نظام الهيئة العامة للعقار • للشكاوى العقارية: {CONTACT_EMAIL}</div>
      </div>

      <div id="wafar" style={{margin:"0 8px",background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:9}}><h3 style={{margin:"0 0 5px",fontSize:12,fontWeight:900}}>💰 ووفر</h3><div style={{display:"flex",gap:6}}><div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:8,padding:7}}><div style={{fontSize:9,color:C.muted}}>وفرت</div><div style={{fontSize:14,fontWeight:900,color:C.gold}}>{savedTotal} ر.س</div><input type="range" min={100} max={5000} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} style={{width:"100%"}}/></div><div style={{flex:1,background:"rgba(255,255,255,0.05)",borderRadius:8,padding:7,fontSize:10}}>للتواصل العقاري:<br/><a href={`mailto:${CONTACT_EMAIL}`} style={{color:C.gold,textDecoration:"none",fontWeight:800}}>{CONTACT_EMAIL}</a><br/><a href={`https://wa.me/${WHATSAPP_PHONE}`} style={{color:C.green,textDecoration:"none"}}>{WHATSAPP_PHONE}+</a></div></div></div>

      <div id="assistant" style={{margin:8,background:"#0b0b14",border:`1px solid ${C.cardBorder}`,borderRadius:12,overflow:"hidden"}}><div style={{padding:7,display:"flex",justifyContent:"space-between"}}><div style={{fontSize:11,fontWeight:800}}>🤖 مساعدك العقاري وفر</div><div style={{fontSize:8,background:C.green,color:"#fff",padding:"2px 5px",borderRadius:5}}>مرخص فال</div></div><div style={{height:110,overflowY:"auto",padding:7,display:"flex",flexDirection:"column",gap:5}}>{messages.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start',background:m.role==='user'?C.main:"rgba(255,255,255,0.07)",padding:"5px 9px",borderRadius:9,maxWidth:"85%",fontSize:10}}>{m.text}</div>)}</div><div style={{display:"flex",gap:4,padding:7}}><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} placeholder="اسأل عن عقار أو ميزانية..." style={{flex:1,background:"#1c1033",border:`1px solid ${C.cardBorder}`,color:"#fff",padding:"7px 9px",borderRadius:12,fontSize:10,outline:"none"}}/><button onClick={()=>{ if(!assistantInput.trim()) return; setMessages(m=>[...m,{role:'user',text:assistantInput}]); const q=assistantInput; setAssistantInput(''); setTimeout(()=>{ setMessages(mm=>[...mm,{role:'bot',text:`حياك ${BROKER_NAME} يخدمك 🏠 للعقار تواصل ${CONTACT_EMAIL} أو واتساب، وللعروض أنصحك ${filtered[0]?.product} كوبون ${filtered[0]?.coupon}`}]); },500); }} style={{background:C.main,color:"#fff",border:"none",padding:"0 10px",borderRadius:12,fontWeight:800,fontSize:10}}>أرسل</button></div></div>

      <footer style={{background:"#08010f",borderTop:`1px solid ${C.cardBorder}`,padding:"16px 10px",marginTop:10}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,fontSize:10}}>
          <div><div style={{fontWeight:900,marginBottom:6}}>متجر حكيم 👑</div><div style={{color:"#888",lineHeight:1.6,fontSize:9}}>وسيط عقاري مرخص فال<br/>مؤسسة {BROKER_NAME}<br/>جدة - المخواة - الباحة<br/><a href={DEALAPP_LINK} target="_blank" style={{color:C.green,textDecoration:"none"}}>ملفي في DealApp</a></div></div>
          <div><div style={{fontWeight:900,marginBottom:6}}>للتواصل والشكاوى ✉️</div><div style={{display:"flex",flexDirection:"column",gap:5}}><a href={`mailto:${CONTACT_EMAIL}`} style={{color:C.gold,textDecoration:"none",fontWeight:800,wordBreak:"break-all"}}>{CONTACT_EMAIL}</a><a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" style={{color:C.green,textDecoration:"none"}}>واتساب: +{WHATSAPP_PHONE}</a><button onClick={()=>setActivePage('contact')} style={{background:C.main,color:"#fff",border:"none",padding:"6px 8px",borderRadius:7,fontSize:9,fontWeight:800,cursor:"pointer",textAlign:"right"}}>نموذج الشكاوى والاستفسارات</button></div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginTop:12,fontSize:9}}>
          <button onClick={()=>setActivePage('privacy')} style={{background:"none",border:"none",color:"#888",fontSize:9}}>سياسة الخصوصية</button>
          <button onClick={()=>setActivePage('usage')} style={{background:"none",border:"none",color:"#888",fontSize:9}}>سياسة الاستخدام</button>
          <button onClick={()=>setActivePage('terms')} style={{background:"none",border:"none",color:"#888",fontSize:9}}>الشروط والأحكام</button>
        </div>
        <div style={{textAlign:"center",fontSize:8,color:"#555",marginTop:10,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:8}}>© 2026 {BROKER_NAME} - وسيط عقاري مرخص فال • {CONTACT_EMAIL} • {DEALAPP_LINK}</div>
      </footer>

      {activePage && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.86)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:12}} onClick={()=>setActivePage(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#170a2e",border:`1px solid ${C.cardBorder}`,borderRadius:14,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h3 style={{margin:0,fontSize:12,fontWeight:900}}>{activePage==='login'?'دخول':activePage==='contact'?'تواصل وشكاوى':activePage==='realestate'?'عروضي العقارية':activePage}</h3><button onClick={()=>setActivePage(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",width:24,height:24,borderRadius:"50%",color:"#fff"}}>✕</button></div>
            {activePage==='login' && <div><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xxxxxxxx" style={{width:"100%",padding:"9px",borderRadius:8,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",outline:"none",fontSize:11,marginBottom:6}}/><button onClick={loginWithPhone} style={{width:"100%",background:C.main,color:"#fff",border:"none",padding:"9px",borderRadius:8,fontWeight:800,fontSize:11}}>{otpSent?"جاري...":"دخول 📲"}</button></div>}
            {activePage==='contact' && <div><div style={{background:"rgba(124,58,237,0.15)",padding:9,borderRadius:8,marginBottom:8}}><div style={{fontSize:10,fontWeight:800}}>📧 {CONTACT_EMAIL}</div><div style={{fontSize:9,color:"#aaa",marginTop:2}}>🏢 {DEALAPP_LINK}</div><div style={{fontSize:9,color:C.gold,marginTop:4}}>يسعدني استقبال طلباتكم وعروضكم وسنخدمكم في أقرب فرصة - {BROKER_NAME}</div></div><input value={contactName} onChange={e=>setContactName(e.target.value)} placeholder="اسمك" style={{width:"100%",padding:"8px",borderRadius:7,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",outline:"none",fontSize:10,marginBottom:6}}/><textarea value={contactMsg} onChange={e=>setContactMsg(e.target.value)} placeholder="رسالتك أو طلبك العقاري..." rows={3} style={{width:"100%",padding:"8px",borderRadius:7,border:`1px solid ${C.cardBorder}`,background:"#0f0720",color:"#fff",outline:"none",fontSize:10}}></textarea><button onClick={()=>{const s=encodeURIComponent(`طلب من ${contactName}`); const b=encodeURIComponent(contactMsg); window.location.href=`mailto:${CONTACT_EMAIL}?subject=${s}&body=${b}`;}} style={{width:"100%",marginTop:6,background:C.main,color:"#fff",border:"none",padding:"9px",borderRadius:8,fontWeight:800,fontSize:11}}>إرسال للإيميل ✉️</button><a href={DEALAPP_LINK} target="_blank" style={{display:"block",textAlign:"center",marginTop:6,fontSize:9,color:C.green,textDecoration:"none"}}>أو عبر ملفي في DealApp ↗</a></div>}
            {activePage==='privacy' && <div style={{fontSize:10,lineHeight:1.6,color:"#ccc"}}>خصوصيتك مهمة. بياناتك محفوظة حسب PDPL. للشكاوى: {CONTACT_EMAIL}. العقار: وسيط مرخص فال، العمولة حسب النظام.</div>}
            {activePage==='usage' && <div style={{fontSize:10,lineHeight:1.6,color:"#ccc"}}>العروض من متاجر خارجية والأسعار قد تتغير. العروض العقارية موثقة برخصة فال. للتواصل: {CONTACT_EMAIL}</div>}
            {activePage==='terms' && <div style={{fontSize:10,lineHeight:1.6,color:"#ccc"}}>متجر حكيم وسيط أفلييت وعقاري مرخص فال. نربح عمولة أفلييت بدون زيادة. عمولة العقار حسب نظام الهيئة. للشكاوى: {CONTACT_EMAIL} - {DEALAPP_LINK}</div>}
          </div>
        </div>
      )}
      <a href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`السلام عليكم ${BROKER_NAME}`)}`} target="_blank" style={{position:"fixed",bottom:14,left:14,zIndex:40,background:"#25D366",color:"#fff",width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,textDecoration:"none",boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}>💬</a>
    </div>
  );
}
