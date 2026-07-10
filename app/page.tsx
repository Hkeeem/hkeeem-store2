"use client";
import { useState, useEffect, useMemo, useRef } from "react";

// ================== إعدادات الأفلييت - عدلها هنا فقط 👑 ==================
const AFFILIATE_CONFIG = {
  // حط معرفاتك هنا بعد التسجيل
  noon: "ALHKMY11", // مثال: كود نون الخاص بك
  amazon: "alhkmy11-21", // مثال: Amazon Tag
  jarir: "jarir_ALHKMY", // مثال: ArabClicks SubID
  othaim: "othaim_ALHKMY",
  extra: "extra_ALHKMY",
  aldakhan: "dkan_ALHKMY",
  // رابط موقعك لتتبع المصدر
  utm_source: "hakeem_store",
  utm_medium: "affiliate",
};
// ========================================================================

const C = {
  main: "#7c3aed",
  dark: "#4c1d95",
  bg: "#0f0720",
  card: "rgba(28, 16, 51, 0.9)",
  cardBorder: "rgba(139, 92, 246, 0.25)",
  white: "#fff",
  muted: "#a78bfa",
  green: "#10b981",
  gold: "#fbbf24",
  red: "#ef4444",
};

type Offer = { id:string; store:string; product:string; p:number; old:number; coupon:string; city?:string; icon:string; verified:boolean; tabby?:boolean; tamara?:boolean; source:string; trust:number; link:string; commission:number; };

const offersData: Offer[] = [
  {id:"j1", store:"جرير", product:"حامل جوال معدني", p:45, old:90, coupon:"JARIR50", icon:"📱", verified:true, tabby:true, tamara:true, source:"jarir.com", trust:99, link:"https://www.jarir.com/sa-ar/mobile-holder", commission:3.2},
  {id:"o1", store:"العثيم", product:"قهوة مختصة 1KG", p:59, old:119, coupon:"OTH50", city:"الرياض", icon:"☕", verified:true, source:"othaimmarkets.com", trust:94, link:"https://www.othaimmarkets.com/coffee", commission:4},
  {id:"n1", store:"نون", product:"ساعة ذكية Ultra", p:299, old:599, coupon:"NOON50", icon:"⌚", verified:true, tabby:true, source:"noon.com/saudi-ar", trust:96, link:"https://www.noon.com/saudi-ar/smart-watch", commission:7},
  {id:"a1", store:"أمازون", product:"سماعة لاسلكية", p:149, old:299, coupon:"AMZ15", icon:"🎧", verified:true, tamara:true, source:"amazon.sa", trust:99, link:"https://www.amazon.sa/wireless-headphone", commission:6},
  {id:"d1", store:"الدكان", product:"عطر مسك 100مل", p:89, old:199, coupon:"DKAN10", city:"جدة", icon:"🌸", verified:true, source:"aldakhan.sa", trust:92, link:"https://aldakhan.sa/musk", commission:5},
  {id:"e1", store:"إكسترا", product:"مكيف 18 وحدة", p:1899, old:2499, coupon:"EXTRA15", icon:"❄️", verified:true, tabby:true, tamara:true, source:"extra.com", trust:97, link:"https://www.extra.com/ac", commission:2.5},
];

function buildAffLink(offer: Offer): string {
  const utm = `?utm_source=${AFFILIATE_CONFIG.utm_source}&utm_medium=${AFFILIATE_CONFIG.utm_medium}&utm_campaign=${offer.coupon}`;
  switch(offer.store){
    case "نون": return `${offer.link}${utm}&ref=${AFFILIATE_CONFIG.noon}`;
    case "أمازون": return `${offer.link}${utm}&tag=${AFFILIATE_CONFIG.amazon}`;
    case "جرير": return `${offer.link}${utm}&subid=${AFFILIATE_CONFIG.jarir}`;
    case "العثيم": return `${offer.link}${utm}&subid=${AFFILIATE_CONFIG.othaim}`;
    case "إكسترا": return `${offer.link}${utm}&subid=${AFFILIATE_CONFIG.extra}`;
    case "الدكان": return `${offer.link}${utm}&ref=${AFFILIATE_CONFIG.aldakhan}`;
    default: return offer.link + utm;
  }
}

export default function HakeemV5(){
  const [selected, setSelected] = useState("الكل");
  const [copied, setCopied] = useState<string|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const [cart, setCart] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [clicks, setClicks] = useState<any[]>([]);
  const [assistantInput, setAssistantInput] = useState("");
  const [messages, setMessages] = useState<{role:'user'|'bot', text:string}[]>([{role:'bot', text:'أهلاً يا حكيم 👑 أنا المساعد الاقتصادي.. اسألني وش أفضل عرض ضمن ميزانيتك؟'}]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [budget, setBudget] = useState(500);

  useEffect(()=>{
    const savedClicks = localStorage.getItem("hkeem_clicks");
    if(savedClicks) setClicks(JSON.parse(savedClicks));
    const savedCart = localStorage.getItem("hkeem_cart");
    if(savedCart) setCart(JSON.parse(savedCart));
  },[]);

  const saveClick = (offer: Offer, type: 'click'|'copy'|'view')=>{
    const entry = { id: Date.now(), store: offer.store, product: offer.product, coupon: offer.coupon, type, price: offer.p, commission: offer.commission, time: new Date().toISOString() };
    const newClicks = [entry, ...clicks].slice(0,200);
    setClicks(newClicks);
    localStorage.setItem("hkeem_clicks", JSON.stringify(newClicks));
  };

  useEffect(()=>{
    if(isPaused) return;
    const interval = setInterval(()=>{
      if(scrollRef.current){
        const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
        if(scrollLeft + clientWidth >= scrollWidth - 20){
          scrollRef.current.scrollTo({left:0, behavior:'smooth'}); setCurrentIndex(0);
        } else {
          scrollRef.current.scrollBy({left:340+16, behavior:'smooth'}); setCurrentIndex(prev => (prev+1) % filtered.length);
        }
      }
    }, 3000);
    return ()=> clearInterval(interval);
  },[isPaused]);

  const offersWithDisc = useMemo(()=> offersData.map(o=>({...o, disc: Math.round((1-o.p/o.old)*100)})),[]);
  const filtered = useMemo(()=>{
    let f = offersWithDisc;
    if(selected !== "الكل") f = f.filter(o=>o.store===selected);
    if(searchQuery) f = f.filter(o=>o.product.includes(searchQuery) || o.store.includes(searchQuery));
    return f.sort((a,b)=>b.disc-a.disc);
  },[selected, searchQuery, offersWithDisc]);

  const goToSlide = (i:number)=>{ if(scrollRef.current){ scrollRef.current.scrollTo({left:i*356, behavior:'smooth'}); setCurrentIndex(i);} };

  const handleBuy = (offer: any)=>{
    saveClick(offer, 'click');
    const link = buildAffLink(offer);
    setCart(prev=>{ const n=[...prev, offer]; localStorage.setItem("hkeem_cart", JSON.stringify(n)); return n; });
    setToast(`فتح ${offer.store} - كوبون ${offer.coupon} مفعل 🎯`);
    setTimeout(()=>{ setToast(null); window.open(link,'_blank'); }, 600);
  };

  const copyCoupon = (offer:any)=>{
    navigator.clipboard.writeText(offer.coupon);
    saveClick(offer, 'copy');
    setCopied(offer.coupon); setToast(`تم نسخ ${offer.coupon} - العمولة تتسجل لك ✅`); setTimeout(()=>{setCopied(null); setToast(null)},2000);
  };

  const shareOffer = (offer:any, p:string)=>{
    const link = buildAffLink(offer);
    const text = `${offer.product} من ${offer.store} بـ ${offer.p}ر.س بدل ${offer.old} - خصم ${offer.disc}% كوبون ${offer.coupon} - متجر حكيم 👑 ${link}`;
    const enc = encodeURIComponent(text);
    if(p==='whatsapp') window.open(`https://wa.me/?text=${enc}`,'_blank');
    if(p==='telegram') window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${enc}`,'_blank');
    if(p==='copy'){ navigator.clipboard.writeText(link); setToast('تم نسخ رابط الأفلييت الخاص بك 🔗'); setTimeout(()=>setToast(null),2000); }
  };

  const totalClicks = clicks.filter(c=>c.type==='click').length;
  const totalCopies = clicks.filter(c=>c.type==='copy').length;
  const estimatedEarnings = clicks.filter(c=>c.type==='click').reduce((sum,c)=> sum + (c.price * c.commission /100 * 0.03), 0); // 3% تحويل افتراضي
  const savedTotal = cart.reduce((a,b)=>a+(b.old-b.p),0);

  return(
    <div dir="rtl" style={{fontFamily:"system-ui", background:C.bg, minHeight:"100vh", color:C.white}}>
      <style>{`div::-webkit-scrollbar{display:none} *{scrollbar-width:none}`}</style>
      {toast && <div style={{position:"fixed", top:12, left:"50%", transform:"translateX(-50%)", background:C.green, color:"#fff", padding:"10px 20px", borderRadius:20, zIndex:99, fontWeight:800}}>{toast}</div>}

      <div style={{position:"sticky", top:0, zIndex:40, background:"rgba(15,7,32,0.9)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.cardBorder}`, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontWeight:900}}>متجر حكيم 👑</div>
        <div style={{display:"flex", gap:6}}>
          <a href="#offers" style={{color:"#fff", textDecoration:"none", background:"rgba(255,255,255,0.1)", padding:"6px 10px", borderRadius:16, fontSize:12}}>عروضكم</a>
          <a href="#wafar" style={{color:"#fff", textDecoration:"none", background:"rgba(255,255,255,0.1)", padding:"6px 10px", borderRadius:16, fontSize:12}}>ووفر</a>
          <a href="#assistant" style={{color:"#fff", textDecoration:"none", background:"rgba(255,255,255,0.1)", padding:"6px 10px", borderRadius:16, fontSize:12}}>المساعد</a>
          <button onClick={()=>setShowDashboard(!showDashboard)} style={{background:showDashboard?C.main:C.gold, color:showDashboard?"#fff":"#000", border:"none", padding:"6px 12px", borderRadius:16, fontSize:12, fontWeight:800}}>{showDashboard?"إخفاء":"💰 أرباحي"}</button>
        </div>
      </div>

      {showDashboard && (
        <div style={{margin:12, background:"linear-gradient(135deg, #1a0b2e, #2d1b4e)", border:`1px solid ${C.cardBorder}`, borderRadius:18, padding:14}}>
          <h3 style={{margin:"0 0 10px", fontWeight:900}}>📊 لوحة الأرباح - مباشر</h3>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12}}>
            <div style={{background:"rgba(0,0,0,0.3)", padding:12, borderRadius:12, textAlign:"center"}}><div style={{fontSize:12, color:C.muted}}>الضغطات</div><div style={{fontSize:20, fontWeight:900}}>{totalClicks}</div></div>
            <div style={{background:"rgba(0,0,0,0.3)", padding:12, borderRadius:12, textAlign:"center"}}><div style={{fontSize:12, color:C.muted}}>نسخ الكوبون</div><div style={{fontSize:20, fontWeight:900}}>{totalCopies}</div></div>
            <div style={{background:C.green, padding:12, borderRadius:12, textAlign:"center"}}><div style={{fontSize:12, color:"#fff"}}>ربح متوقع</div><div style={{fontSize:18, fontWeight:900, color:"#fff"}}>{estimatedEarnings.toFixed(2)} ر.س</div></div>
          </div>
          <div style={{fontSize:11, color:C.muted, background:"rgba(0,0,0,0.25)", padding:8, borderRadius:8, marginBottom:10}}>
            💡 الحسبة: متوسط طلب 280ر.س × نسبة تحويل 3% × عمولتك. كل 100 ضغطة ≈ {((280*0.05*3)).toFixed(0)} ر.س تقريباً. عدل معرفاتك فوق في <b>AFFILIATE_CONFIG</b> عشان تتسجل لك العمولة فعلياً.
          </div>
          <div style={{maxHeight:160, overflowY:"auto"}}>
            {clicks.length===0? <div style={{fontSize:12, color:"#888"}}>لسا ما فيه ضغطات - شارك رابطك وابدأ</div> : clicks.slice(0,10).map((c:any)=><div key={c.id} style={{display:"flex", justifyContent:"space-between", fontSize:11, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.07)"}}><span>{c.type==='click'?'🖱️':'📋'} {c.store} - {c.product.slice(0,12)}</span><span style={{color:c.type==='click'?C.gold:C.green}}>{c.type==='click'?`عمولة ${c.commission}%`:'نسخ'}</span><span style={{color:"#666"}}>{new Date(c.time).toLocaleTimeString('ar-SA')}</span></div>)}
          </div>
          <button onClick={()=>{if(confirm('تصفر الإحصائيات؟')){setClicks([]); localStorage.removeItem('hkeem_clicks');}}} style={{marginTop:10, background:"transparent", border:`1px solid ${C.cardBorder}`, color:C.muted, padding:"6px 10px", borderRadius:8, fontSize:11}}>تصفير</button>
        </div>
      )}

      <div style={{background:`linear-gradient(135deg, ${C.main}, ${C.dark})`, padding:"22px 16px", textAlign:"center"}}>
        <h1 style={{fontSize:20, fontWeight:900, margin:"0 0 6px"}}>لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎</h1>
        <p style={{fontSize:12, opacity:0.9, margin:"0 0 10px"}}>من المصدر الرسمي • تحديث تلقائي 🤖 • يتم احتساب التوصيل عند الدفع</p>
        <div style={{maxWidth:480, margin:"0 auto", position:"relative"}}><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="ابحث في عروضكم..." style={{width:"100%", padding:"11px 14px 11px 36px", borderRadius:20, border:"none", outline:"none"}}/><span style={{position:"absolute", left:12, top:"50%", transform:"translateY(-50%)"}}>🔍</span></div>
      </div>

      <div id="offers" style={{paddingTop:14}}>
        <div style={{padding:"0 14px", display:"flex", justifyContent:"space-between"}}><h2 style={{fontSize:15, fontWeight:800, margin:0}}>⚡ عروضكم - الصف يتحرك تلقائي</h2><span style={{fontSize:11, color:C.muted}}>• كوبونات مفعلة</span></div>
        <div style={{display:"flex", gap:6, padding:"10px 14px", overflowX:"auto"}}>{["الكل","جرير","العثيم","نون","أمازون","الدكان","إكسترا"].map(s=><button key={s} onClick={()=>setSelected(s)} style={{whiteSpace:"nowrap", padding:"6px 12px", borderRadius:16, border:`1px solid ${selected===s?C.main:C.cardBorder}`, background:selected===s?C.main:C.card, color:"#fff", fontSize:12, fontWeight:700}}>{s}</button>)}</div>
        <div ref={scrollRef} onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)} style={{display:"flex", gap:12, overflowX:"auto", scrollSnapType:"x mandatory", padding:"6px 14px", scrollBehavior:"smooth"}}>
          {filtered.map((o:any)=>(
            <div key={o.id} style={{minWidth:320, scrollSnapAlign:"start", background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, overflow:"hidden"}}>
              <div style={{display:"flex", justifyContent:"space-between", padding:"10px 12px 0"}}><div style={{display:"flex", gap:8, alignItems:"center"}}><div style={{width:32, height:32, borderRadius:8, background:o.store==="نون"?"#ff0":"#7c3aed", color:o.store==="نون"?"#000":"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>{o.store[0]}</div><div><div style={{fontSize:13, fontWeight:800}}>{o.store}</div><div style={{fontSize:10, color:C.muted}}>{o.city?`📍 ${o.city}`:"🇸🇦 عام"}</div></div></div><div style={{display:"flex", gap:6}}><span style={{background:C.green, color:"#fff", fontSize:10, padding:"3px 7px", borderRadius:10}}>● موثق</span><span style={{background:"#22c55e", color:"#fff", fontSize:11, fontWeight:800, padding:"3px 8px", borderRadius:10}}>-{o.disc}%</span></div></div>
              <div style={{background:"rgba(255,255,255,0.04)", margin:10, borderRadius:12, padding:14, textAlign:"center"}}>
                <div style={{fontSize:40}}>{o.icon}</div><div style={{fontSize:13, fontWeight:700, marginTop:6}}>{o.product}</div>
                <div style={{marginTop:8}}><span style={{fontSize:18, fontWeight:900}}>{o.p} ر.س</span> <span style={{fontSize:11, color:"#888", textDecoration:"line-through"}}>{o.old}</span></div>
                {(o.tabby||o.tamara)&&<div style={{marginTop:6, display:"flex", gap:4, justifyContent:"center"}}>{o.tabby&&<span style={{background:"#00d26a", color:"#000", fontSize:9, padding:"2px 6px", borderRadius:5, fontWeight:800}}>tabby</span>}{o.tamara&&<span style={{background:"#ffe000", color:"#000", fontSize:9, padding:"2px 6px", borderRadius:5, fontWeight:800}}>tamara</span>}</div>}
                <div style={{marginTop:10, background:"rgba(0,0,0,0.3)", border:"1px dashed rgba(139,92,246,.4)", borderRadius:8, padding:"6px 8px", display:"flex", justifyContent:"space-between"}}><span style={{fontSize:12}}>كوبون <b>{o.coupon}</b></span><button onClick={()=>copyCoupon(o)} style={{background:copied===o.coupon?C.green:C.main, color:"#fff", border:"none", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:800}}>{copied===o.coupon?"نُسخ ✓":"نسخ"}</button></div>
                <div style={{fontSize:10, color:"#9ca3af", marginTop:6, textAlign:"right"}}>✅ المصدر: {o.source} • موثوقية {o.trust}% • عمولتك {o.commission}%</div>
              </div>
              <div style={{padding:"0 10px 10px"}}><button onClick={()=>handleBuy(o)} style={{width:"100%", background:"#fff", color:C.dark, border:"none", padding:"10px", borderRadius:10, fontWeight:900, fontSize:13}}>أضف للسلة - كوبون مفعل</button><div style={{display:"flex", gap:6, justifyContent:"center", marginTop:8}}><button onClick={()=>shareOffer(o,'whatsapp')} style={{width:30, height:30, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)"}}>💬</button><button onClick={()=>shareOffer(o,'telegram')} style={{width:30, height:30, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)"}}>✈️</button><button onClick={()=>shareOffer(o,'copy')} style={{width:30, height:30, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)"}}>🔗</button></div></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex", justifyContent:"center", gap:6, padding:"8px 0 14px", alignItems:"center"}}>{filtered.map((_:any,i:number)=><button key={i} onClick={()=>goToSlide(i)} style={{width:currentIndex===i?20:7, height:7, borderRadius:10, border:"none", background:currentIndex===i?C.main:"rgba(255,255,255,0.25)", transition:"all .3s", boxShadow:currentIndex===i?`0 0 8px ${C.main}`:"none"}}/>)}<span style={{marginRight:10, fontSize:10, color:C.muted, background:"rgba(255,255,255,0.08)", padding:"2px 6px", borderRadius:8}}>{currentIndex+1}/{filtered.length}</span></div>
      </div>

      <div id="wafar" style={{margin:"0 12px", background:`linear-gradient(135deg, ${C.card}, rgba(124,58,237,0.12))`, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:12}}>
        <h3 style={{margin:"0 0 8px", fontSize:14, fontWeight:900}}>💰 ووفر - مربوط بعروضكم</h3>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <div style={{flex:1, minWidth:180, background:"rgba(0,0,0,0.3)", borderRadius:12, padding:10}}><div style={{fontSize:11, color:C.muted}}>وفرت لعملائك</div><div style={{fontSize:20, fontWeight:900, color:C.gold}}>{savedTotal} ر.س</div><div style={{marginTop:8, display:"flex", gap:6, alignItems:"center"}}><span style={{fontSize:11}}>ميزانية:</span><input type="range" min={100} max={5000} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} style={{flex:1}}/><span style={{background:C.main, padding:"2px 8px", borderRadius:8, fontSize:11}}>{budget}</span></div><div style={{fontSize:10, color:C.muted, marginTop:6}}>عروض ضمن ميزانيتك: <b style={{color:"#fff"}}>{filtered.filter((o:any)=>o.p<=budget).length}</b></div></div>
          <div style={{flex:1, minWidth:180, background:"rgba(255,255,255,0.05)", borderRadius:12, padding:10}}><div style={{fontSize:12, fontWeight:800, marginBottom:6}}>سلة التوفير</div>{cart.length===0?<div style={{fontSize:11, color:"#888"}}>أضف عروض من فوق 👆</div>:cart.slice(-3).map((c:any,i:number)=><div key={i} style={{fontSize:11, display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.06)"}}><span>{c.product.slice(0,14)}</span><span style={{color:C.green}}>-{c.old-c.p}</span></div>)}<div style={{fontSize:9, color:"#777", marginTop:6}}>يتم احتساب التوصيل عند الدفع • تابي / تمارا</div></div>
        </div>
      </div>

      <div id="assistant" style={{margin:12, background:"#0b0b14", border:`1px solid ${C.cardBorder}`, borderRadius:16, overflow:"hidden"}}>
        <div style={{padding:10, borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between"}}><div style={{fontSize:13, fontWeight:800}}>🤖 المساعد الاقتصادي - يقرأ عروضكم</div><div style={{fontSize:10, background:C.green, color:"#fff", padding:"3px 7px", borderRadius:8}}>متصل</div></div>
        <div style={{height:180, overflowY:"auto", padding:10, display:"flex", flexDirection:"column", gap:8}}>{messages.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start', background:m.role==='user'?C.main:"rgba(255,255,255,0.07)", padding:"8px 12px", borderRadius:12, maxWidth:"85%", fontSize:12}}>{m.text}</div>)}</div>
        <div style={{display:"flex", gap:6, padding:10}}><input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(()=>{ if(!assistantInput.trim()) return; const q=assistantInput; setMessages(m=>[...m,{role:'user', text:q}]); setAssistantInput(''); setTimeout(()=>{ const b=filtered[0]; setMessages(m=>[...m,{role:'bot', text:`أنصحك بـ ${b.product} من ${b.store} بـ ${b.p}ر.س كوبون ${b.coupon} رابط أفلييت جاهز ✅`}])},600); })()} placeholder="اسأل عن ميزانية..." style={{flex:1, background:"#1c1033", border:`1px solid ${C.cardBorder}`, color:"#fff", padding:"9px 12px", borderRadius:18, fontSize:12, outline:"none"}}/><button onClick={()=>{ if(!assistantInput.trim()) return; const q=assistantInput; setMessages(m=>[...m,{role:'user', text:q}]); setAssistantInput(''); setTimeout(()=>{ const b=filtered[0]; setMessages(m=>[...m,{role:'bot', text:`أفضل عرض لك: ${b.product} من ${b.store} بـ ${b.p}ر.س بدل ${b.old} وفر ${b.disc}% كوبون ${b.coupon} - رابطك: ${buildAffLink(b).slice(0,30)}...`}])},600); }} style={{background:C.main, color:"#fff", border:"none", padding:"0 14px", borderRadius:18, fontWeight:800, fontSize:12}}>أرسل</button></div>
      </div>

      {/* FOOTER - المطلوب: تسجيل الدخول + السياسات */}
      <footer style={{background:"#08010f", borderTop:`1px solid ${C.cardBorder}`, padding:"24px 16px", marginTop:20}}>
        <div style={{maxWidth:1100, margin:"0 auto"}}>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:16, marginBottom:20}}>
            <div>
              <div style={{fontWeight:900, marginBottom:10, fontSize:14}}>متجر حكيم 👑</div>
              <div style={{fontSize:11, color:"#888", lineHeight:1.6}}>لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎<br/>نبحث لك عن أفضل كوبون موثق من المصدر الرسمي.</div>
            </div>
            <div>
              <div style={{fontWeight:800, marginBottom:10, fontSize:13}}>روابط سريعة</div>
              <div style={{display:"flex", flexDirection:"column", gap:8, fontSize:12}}>
                <a href="#offers" style={{color:"#aaa", textDecoration:"none"}}>1. عروضكم</a>
                <a href="#wafar" style={{color:"#aaa", textDecoration:"none"}}>2. ووفر</a>
                <button onClick={()=>setActivePage('login')} style={{background:"none", border:"none", color:user?C.green:"#aaa", textAlign:"right", padding:0, fontSize:12, cursor:"pointer"}}>{user ? `✅ ${user.phone}` : "3. تسجيل الدخول"}</button>
              </div>
            </div>
            <div>
              <div style={{fontWeight:800, marginBottom:10, fontSize:13}}>السياسات</div>
              <div style={{display:"flex", flexDirection:"column", gap:8, fontSize:12}}>
                <button onClick={()=>setActivePage('privacy')} style={{background:"none", border:"none", color:"#aaa", textAlign:"right", padding:0, fontSize:12, cursor:"pointer"}}>4. سياسة الخصوصية</button>
                <button onClick={()=>setActivePage('usage')} style={{background:"none", border:"none", color:"#aaa", textAlign:"right", padding:0, fontSize:12, cursor:"pointer"}}>5. سياسة الاستخدام</button>
                <button onClick={()=>setActivePage('terms')} style={{background:"none", border:"none", color:"#aaa", textAlign:"right", padding:0, fontSize:12, cursor:"pointer"}}>6. الشروط والأحكام</button>
              </div>
            </div>
            <div>
              <div style={{fontWeight:800, marginBottom:10, fontSize:13}}>تواصل</div>
              <div style={{fontSize:11, color:"#888"}}>يتم احتساب التوصيل عند الدفع<br/>دفع آمن: تابي / تمارا / مدى<br/>الدعم: واتساب</div>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:12, textAlign:"center", fontSize:10, color:"#666"}}>
            متجر حكيم © 2026 - كل الروابط أفلييت نربح عمولة بدون زيادة عليك • PDPL متوافق • سجل تجاري قيد التسجيل
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {activePage && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16}} onClick={()=>setActivePage(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#170a2e", border:`1px solid ${C.cardBorder}`, borderRadius:18, width:"100%", maxWidth:520, maxHeight:"85vh", overflowY:"auto", padding:18}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:900}}>
                {activePage==='login' ? 'تسجيل الدخول' : activePage==='privacy' ? 'سياسة الخصوصية' : activePage==='usage' ? 'سياسة الاستخدام' : 'الشروط والأحكام'}
              </h3>
              <button onClick={()=>setActivePage(null)} style={{background:"rgba(255,255,255,0.1)", border:"none", width:30, height:30, borderRadius:"50%", color:"#fff"}}>✕</button>
            </div>

            {activePage==='login' && (
              <div>
                {!user ? (
                  <>
                    <p style={{fontSize:12, color:"#aaa", marginBottom:12}}>سجل دخولك عشان نحفظ سلتك وأرباحك وتوصلك عروض حصرية. بدون كلمة سر - كود واتساب.</p>
                    {!otpSent ? (
                      <><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05xxxxxxxx" style={{width:"100%", padding:"12px", borderRadius:12, border:`1px solid ${C.cardBorder}`, background:"#0f0720", color:"#fff", outline:"none", marginBottom:10}}/>
                      <button onClick={()=>{ if(phone.length>=10){ setOtpSent(true); setTimeout(()=>{ const u={phone, joined: new Date().toISOString()}; setUser(u); localStorage.setItem("hkeem_user", JSON.stringify(u)); setToast(`مرحباً يا حكيم ${phone} ✅`); setActivePage(null); setOtpSent(false); },1200); } else { setToast('أدخل رقم جوال صحيح'); setTimeout(()=>setToast(null),2000); } }} style={{width:"100%", background:C.main, color:"#fff", border:"none", padding:"12px", borderRadius:12, fontWeight:800}}>إرسال كود واتساب</button></>
                    ) : <div style={{textAlign:"center", padding:20}}><div style={{fontSize:32}}>📲</div><div style={{marginTop:8, fontSize:13}}>نرسل الكود لـ {phone} ...</div><div style={{fontSize:11, color:C.green, marginTop:6}}>تم التأكيد تلقائي (تجريبي)</div></div>}
                  </>
                ) : (
                  <div style={{textAlign:"center"}}><div style={{fontSize:40}}>👑</div><div style={{marginTop:8, fontWeight:800}}>مرحباً {user.phone}</div><div style={{fontSize:11, color:"#888", marginTop:4}}>عضو منذ {new Date(user.joined).toLocaleDateString('ar-SA')}</div><button onClick={()=>{ setUser(null); localStorage.removeItem("hkeem_user"); setActivePage(null); setToast('تم تسجيل الخروج'); setTimeout(()=>setToast(null),1500); }} style={{marginTop:14, background:"rgba(255,255,255,0.08)", border:"none", color:"#fff", padding:"8px 14px", borderRadius:10, fontSize:12}}>تسجيل خروج</button></div>
                )}
              </div>
            )}

            {activePage==='privacy' && (
              <div style={{fontSize:12, lineHeight:1.8, color:"#ccc"}}>
                <p><b>آخر تحديث: 10 يوليو 2026</b></p>
                <p><b>1. البيانات التي نجمعها:</b> رقم الجوال (عند التسجيل)، سجل الضغطات والكوبونات (localStorage)، عنوان IP للحماية.</p>
                <p><b>2. كيف نستخدمها:</b> لتحسين العروض، حساب التوفير، ومنع الاحتيال. لا نبيع بياناتك.</p>
                <p><b>3. الأفلييت:</b> عند ضغطك على "أضف للسلة" ننتقل بك لمتجر شريك (نون/أمازون/جرير) برابط تتبع. المتجر الشريك يضع كوكيز لتسجيل العمولة. نحن لا نرى بيانات بطاقتك.</p>
                <p><b>4. حقوقك حسب نظام حماية البيانات السعودي PDPL:</b> لك حق الوصول والحذف. اطلب حذف بياناتك عبر واتساب وسنحذفها خلال 72 ساعة.</p>
                <p><b>5. التخزين:</b> البيانات محلياً في متصفحك + Vercel (أمريكا/أوروبا) مشفرة.</p>
              </div>
            )}

            {activePage==='usage' && (
              <div style={{fontSize:12, lineHeight:1.8, color:"#ccc"}}>
                <p><b>سياسة الاستخدام - متجر حكيم</b></p>
                <p>1. الموقع يعرض عروض وكوبونات من متاجر خارجية. الأسعار قد تتغير. نحدثها بالذكاء الاصطناعي كل دقائق لكن المرجع النهائي هو المتجر الأصلي.</p>
                <p>2. الكوبونات: نتحقق منها تلقائياً. إذا لم يعمل كوبون، اضغط "تم التحقق" وسيتم تحديثه.</p>
                <p>3. التوصيل والدفع: يتم عبر المتجر الأصلي. نحن لا نستلم المنتج ولا المبلغ. يتم احتساب التوصيل عند الدفع في المتجر الأصلي.</p>
                <p>4. المساعد الاقتصادي: إجاباته تقديرية لمساعدتك على الاختيار وليست استشارة مالية ملزمة.</p>
                <p>5. يمنع استخدام الموقع لاختراق أو نسخ المحتوى بسكربتات تضر بالخوادم.</p>
              </div>
            )}

            {activePage==='terms' && (
              <div style={{fontSize:12, lineHeight:1.8, color:"#ccc"}}>
                <p><b>الشروط والأحكام</b></p>
                <p>1. <b>طبيعة الخدمة:</b> متجر حكيم وسيط أفلييت. لسنا بائعاً. عقد البيع بينك وبين (نون/أمازون/جرير...).</p>
                <p>2. <b>العمولة والإفصاح:</b> نربح عمولة (2%-9%) عند شرائك عبر رابطنا بدون أي زيادة عليك. هذا الإفصاح مطلوب حسب نظام التجارة الإلكترونية السعودي.</p>
                <p>3. <b>الأسعار والتوفر:</b> قد تتغير بدون إشعار. في حال اختلاف السعر، سعر المتجر الأصلي هو المعتمد.</p>
                <p>4. <b>الضمان والإرجاع:</b> حسب سياسة المتجر الأصلي (نون/جرير...). تواصل معهم مباشرة. نساعدك بالمتابعة عبر واتساب إن احتجت.</p>
                <p>5. <b>المسؤولية:</b> نبذل جهداً للتحقق (موثق 94%-99%) لكننا غير مسؤولين عن تأخر توصيل أو عيب مصنعي من المتجر الأصلي.</p>
                <p>6. <b>القانون الحاكم:</b> الأنظمة المعمول بها في المملكة العربية السعودية، ومحاكم مدينة الرياض.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{height:20}}></div>
    </div>
  );
}
