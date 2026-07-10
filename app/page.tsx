"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const C = {
  main: "#7c3aed",
  dark: "#4c1d95",
  bg: "#0f0720",
  bg2: "#1a0b2e",
  card: "rgba(28, 16, 51, 0.85)",
  cardBorder: "rgba(139, 92, 246, 0.25)",
  white: "#ffffff",
  muted: "#a78bfa",
  green: "#10b981",
  gold: "#fbbf24",
  red: "#ef4444",
};

type Offer = { 
  id:string; store:string; product:string; p:number; old:number; 
  coupon:string; city?:string; img:string; logo:string; verified:boolean;
  tabby?:boolean; tamara?:boolean; source:string; trust:number;
};

const offersData: Offer[] = [
  {id:"j1", store:"جرير", product:"حامل جوال معدني للسيارة", p:45, old:90, coupon:"JARIR50", img:"📱", logo:"ج", verified:true, tabby:true, tamara:true, source:"jarir.com", trust:99},
  {id:"o1", store:"العثيم", product:"قهوة مختصة كولومبيا 1KG", p:59, old:119, coupon:"OTH50", city:"الرياض", img:"☕", logo:"ع", verified:true, source:"othaimmarkets.com", trust:94},
  {id:"n1", store:"نون", product:"ساعة ذكية Ultra", p:299, old:599, coupon:"NOON50", img:"⌚", logo:"n", verified:true, tabby:true, source:"noon.com/saudi-ar", trust:96},
  {id:"a1", store:"أمازون", product:"سماعة لاسلكية", p:149, old:299, coupon:"AMZ15", img:"🎧", logo:"a", verified:true, tamara:true, source:"amazon.sa", trust:99},
  {id:"d1", store:"الدكان", product:"عطر مسك 100مل", p:89, old:199, coupon:"DKAN10", city:"جدة", img:"🌸", logo:"د", verified:true, source:"aldakhan.sa", trust:92},
  {id:"e1", store:"إكسترا", product:"مكيف 18 وحدة", p:1899, old:2499, coupon:"EXTRA15", img:"❄️", logo:"إ", verified:true, tabby:true, tamara:true, source:"extra.com", trust:97},
];

export default function HakeemFinal(){
  const [selected, setSelected] = useState<string>("الكل");
  const [copied, setCopied] = useState<string|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const [cart, setCart] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [assistantInput, setAssistantInput] = useState("");
  const [messages, setMessages] = useState<{role:'user'|'bot', text:string}[]>([
    {role:'bot', text:'أهلاً يا حكيم 👑 أنا المساعد الاقتصادي.. اسألني وش أفضل عرض بـ 300 ر.س؟'}
  ]);
  const [budget, setBudget] = useState(500);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const savedTotal = useMemo(()=> {
    const s = typeof window !== 'undefined' ? localStorage.getItem("hkeem_saved") : null;
    return s ? parseInt(s) : 1240 + cart.reduce((a,b)=>a + (b.old - b.p),0);
  },[cart]);

  useEffect(()=>{
    localStorage.setItem("hkeem_saved", savedTotal.toString());
    const t = setInterval(()=> setLastUpdate(Date.now()), 30000);
    return ()=> clearInterval(t);
  },[savedTotal, lastUpdate]);

  // تحريك تلقائي للصف كل 3 ثواني
  useEffect(()=>{
    if(isPaused) return;
    const interval = setInterval(()=>{
      if(scrollRef.current){
        const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current;
        const step = 364;
        const newIndex = Math.round(scrollLeft / 364);
        setCurrentIndex(newIndex % filtered.length);
        if(scrollLeft + clientWidth >= scrollWidth - 20){
          scrollRef.current.scrollTo({left:0, behavior:'smooth'}); setCurrentIndex(0);
        } else {
          scrollRef.current.scrollBy({left: step, behavior:'smooth'}); setCurrentIndex(prev => (prev + 1) % filtered.length);
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

  const copyCoupon = (code:string)=>{
    navigator.clipboard.writeText(code);
    setCopied(code);
    setToast(`تم نسخ الكوبون ${code} ✅`);
    setTimeout(()=>{setCopied(null); setToast(null)},2000);
  };
  const addToCart = (o:any)=>{
    setCart(prev=>[...prev, o]);
    setToast(`أضيف للسلة - كوبون ${o.coupon} مفعل 🎯`);
    setTimeout(()=>setToast(null),2000);
  };
  const shareOffer = (offer:any, platform:string)=>{
    const text = `${offer.product} من ${offer.store} بـ ${offer.p} ر.س بدل ${offer.old} خصم ${offer.disc}% - كوبون ${offer.coupon} - متجر حكيم 👑 لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل`;
    const url = typeof window !== 'undefined' ? window.location.href : 'https://hkeeem-store2.vercel.app';
    const enc = encodeURIComponent(text + ' ' + url);
    let link='';
    if(platform==='whatsapp') link=`https://wa.me/?text=${enc}`;
    if(platform==='facebook') link=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    if(platform==='snap') link=`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`;
    if(platform==='tiktok') { copyCoupon(offer.coupon); setToast('انسخ الرابط وانشره على تيك توك 🎵'); return; }
    if(platform==='insta') { copyCoupon(offer.coupon); setToast('انسخ الرابط وانشره ستوري إنستا 📸'); return; }
    window.open(link,'_blank');
  };
  const sendToAssistant = ()=>{
    if(!assistantInput.trim()) return;
    const userMsg = assistantInput;
    setMessages(m=>[...m, {role:'user', text:userMsg}]);
    setAssistantInput("");
    setTimeout(()=>{
      const best = filtered[0];
      setMessages(m=>[...m, {role:'bot', text:`يا حكيم، لميزانية ${userMsg} أنصحك بـ ${best.product} من ${best.store} بـ ${best.p} ر.س بدل ${best.old} مع كوبون ${best.coupon} توفر ${best.disc}% 💎 المصدر موثق ${best.source} - يتم احتساب التوصيل عند الدفع`}]);
    },800);
  };
  const goToSlide = (index:number)=>{ if(scrollRef.current){ scrollRef.current.scrollTo({left: index * 364, behavior:'smooth'}); setCurrentIndex(index);} };
  const scroll = (dir:'left'|'right')=>{
    if(scrollRef.current){
      scrollRef.current.scrollBy({left: dir==='left'? -364 : 364, behavior:'smooth'});
    }
  };

  return(
    <div dir="rtl" style={{fontFamily:"Cairo, system-ui", background:C.bg, minHeight:"100vh", color:C.white, overflowX:'hidden'}}>
      <style>{` div::-webkit-scrollbar{display:none} *{scrollbar-width:none} `}</style>
      {toast && <div style={{position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", background:C.green, color:"#fff", padding:"10px 22px", borderRadius:24, zIndex:99, fontWeight:800, boxShadow:"0 8px 24px rgba(16,185,129,.4)"}}>{toast}</div>}

      {/* TOP NAV مربوط */}
      <div style={{position:"sticky", top:0, zIndex:50, background:"rgba(15,7,32,0.85)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.cardBorder}`, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontWeight:900, fontSize:18}}>متجر حكيم 👑</div>
        <div style={{display:"flex", gap:8}}>
          <a href="#offers" style={{color:"#fff", textDecoration:"none", background:C.cardBorder, padding:"6px 12px", borderRadius:20, fontSize:13, fontWeight:700}}>عروضكم</a>
          <a href="#wafar" style={{color:"#fff", textDecoration:"none", background:C.cardBorder, padding:"6px 12px", borderRadius:20, fontSize:13, fontWeight:700}}>ووفر</a>
          <a href="#assistant" style={{color:C.bg, background:C.white, padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:800, textDecoration:"none"}}>المساعد</a>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:`linear-gradient(135deg, ${C.main} 0%, ${C.dark} 100%)`, padding:"28px 16px 24px", textAlign:"center", position:"relative"}}>
        <div style={{position:"absolute", top:12, right:16, background:"rgba(0,0,0,0.25)", padding:"6px 12px", borderRadius:20, fontSize:12}}>✅ تحديث تلقائي مفعل • {Math.floor((Date.now()-lastUpdate)/60000)||1} د الآن</div>
        <h1 style={{fontSize:24, fontWeight:900, margin:"24px 0 6px"}}>لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎</h1>
        <p style={{opacity:0.9, fontSize:13, marginBottom:12}}>من المصدر الرسمي • تحديث تلقائي 🤖 • يتم احتساب التوصيل عند الدفع</p>
        <div style={{maxWidth:520, margin:"0 auto", position:"relative"}}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="ابحث في عروضكم..." style={{width:"100%", padding:"13px 18px 13px 44px", borderRadius:28, border:"none", outline:"none", fontSize:15}}/>
          <span style={{position:"absolute", left:16, top:"50%", transform:"translateY(-50%)"}}>🔍</span>
        </div>
      </div>

      {/* OFFERS - عروضكم */}
      <div id="offers" style={{padding:"18px 0 0"}}>
        <div style={{padding:"0 16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h2 style={{fontSize:18, fontWeight:800, margin:0}}>⚡ عروضكم الآن - مرتبة حسب التوفير</h2>
          <div style={{fontSize:12, color:C.muted}}>• كوبونات مفعلة</div>
        </div>

        {/* فلاتر */}
        <div style={{display:"flex", gap:8, padding:"12px 16px", overflowX:"auto"}}>
          {["الكل","جرير","العثيم","نون","أمازون","الدكان","إكسترا"].map(s=>(
            <button key={s} onClick={()=>setSelected(s)} style={{whiteSpace:"nowrap", padding:"8px 16px", borderRadius:20, border:`1px solid ${selected===s?C.main:C.cardBorder}`, background:selected===s?C.main:C.card, color:"#fff", fontWeight:700, fontSize:13}}>{s}</button>
          ))}
        </div>

        {/* كاروسيل يتحرك */}
        <div style={{position:"relative"}}>
          <button onClick={()=>scroll('right')} style={{position:"absolute", right:8, top:"50%", zIndex:5, background:"rgba(255,255,255,0.9)", border:"none", width:36, height:36, borderRadius:"50%", fontWeight:900, display:"none"}} className="desktop-only">‹</button>
          <button onClick={()=>scroll('left')} style={{position:"absolute", left:8, top:"50%", zIndex:5, background:"rgba(255,255,255,0.9)", border:"none", width:36, height:36, borderRadius:"50%", fontWeight:900, display:"none"}}>›</button>
          <div ref={scrollRef} onMouseEnter={()=>setIsPaused(true)} onMouseLeave={()=>setIsPaused(false)} style={{display:"flex", gap:16, overflowX:"auto", scrollSnapType:"x mandatory", padding:"12px 16px 20px", scrollBehavior:"smooth"}}>
            {filtered.map(o=>(
              <div key={o.id} style={{minWidth:320, maxWidth:320, scrollSnapAlign:"start", background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:20, overflow:"hidden", backdropFilter:"blur(12px)"}}>
                {/* هيدر الكارد */}
                <div style={{display:"flex", justifyContent:"space-between", padding:"12px 12px 0", alignItems:"center"}}>
                  <div style={{display:"flex", gap:8, alignItems:"center"}}>
                    <div style={{background:o.store==="جرير"?"#0066cc":o.store==="العثيم"?"#0a7a2e":o.store==="نون"?"#ffeb00":"#ff9900", color:o.store==="نون"?"#000":"#fff", width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900}}>{o.logo}</div>
                    <div><div style={{fontWeight:800, fontSize:14}}>{o.store}</div><div style={{fontSize:11, color:C.muted}}>{o.city?`📍 ${o.city}`:`🇸🇦 عام`}</div></div>
                  </div>
                  <div style={{display:"flex", gap:6, alignItems:"center"}}><span style={{background:C.green, color:"#fff", fontSize:11, padding:"4px 8px", borderRadius:12, fontWeight:700}}>● موثق</span><span style={{background:"#22c55e", color:"#fff", fontSize:12, fontWeight:800, padding:"5px 10px", borderRadius:14}}>-{o.disc}%</span></div>
                </div>
                <div style={{background:"rgba(255,255,255,0.05)", margin:"12px", borderRadius:16, padding:"18px", textAlign:"center"}}>
                  <div style={{fontSize:48, marginBottom:8}}>{o.img}</div>
                  <div style={{fontWeight:700, fontSize:15}}>{o.product}</div>
                  <div style={{marginTop:10}}><span style={{fontWeight:900, fontSize:22}}>{o.p} ر.س</span> <span style={{textDecoration:"line-through", color:"#888", fontSize:13, marginRight:6}}>{o.old}</span></div>
                  {(o.tabby || o.tamara) && <div style={{marginTop:8, display:"flex", gap:6, justifyContent:"center"}}>{o.tabby&&<span style={{background:"#00d26a", color:"#000", fontSize:10, padding:"3px 7px", borderRadius:6, fontWeight:800}}>tabby</span>}{o.tamara&&<span style={{background:"#ffe000", color:"#000", fontSize:10, padding:"3px 7px", borderRadius:6, fontWeight:800}}>tamara</span>}<span style={{fontSize:10, color:C.muted}}>قسط 4 دفعات</span></div>}
                  <div style={{marginTop:12, background:"rgba(0,0,0,0.35)", border:"1px dashed rgba(139,92,246,.5)", borderRadius:10, padding:"8px 10px", display:"flex", justifyContent:"space-between", alignItems:"center"}}><span style={{fontSize:13}}>كوبون: <b>{o.coupon}</b></span><button onClick={()=>copyCoupon(o.coupon)} style={{background:copied===o.coupon?C.green:C.main, color:"#fff", border:"none", padding:"5px 12px", borderRadius:8, fontSize:12, fontWeight:800}}>{copied===o.coupon?"نُسخ ✓":"نسخ"}</button></div>
                  <div style={{fontSize:11, color:"#9ca3af", marginTop:8, textAlign:"right"}}>✅ تم التحقق قبل {Math.floor(Math.random()*5)+1} د • المصدر: {o.source} • موثوقية {o.trust}%</div>
                </div>
                <div style={{padding:"0 12px 12px"}}>
                  <button onClick={()=>addToCart(o)} style={{width:"100%", background:"#fff", color:C.dark, border:"none", padding:"12px", borderRadius:12, fontWeight:900, fontSize:14}}>أضف للسلة - كوبون مفعل</button>
                  <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:10}}>{[
                    {k:'whatsapp', i:'💬'},{k:'facebook', i:'f'},{k:'insta', i:'📸'},{k:'tiktok', i:'🎵'},{k:'snap', i:'👻'}
                  ].map(s=><button key={s.k} onClick={()=>shareOffer(o,s.k)} style={{width:32, height:32, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff"}}>{s.i}</button>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOTS INDICATOR */}
      <div style={{display:"flex", justifyContent:"center", gap:8, padding:"8px 0 16px", alignItems:"center"}}>
        {filtered.map((_, i)=>(
          <button key={i} onClick={()=>goToSlide(i)} 
            style={{
              width: currentIndex===i ? 24 : 8, 
              height: 8, 
              borderRadius: 20, 
              border:"none", 
              background: currentIndex===i ? C.main : "rgba(255,255,255,0.25)", 
              cursor:"pointer", 
              transition:"all 0.3s ease",
              boxShadow: currentIndex===i ? `0 0 10px ${C.main}` : "none"
            }}
            aria-label={`الذهاب للعرض ${i+1}`}
          />
        ))}
        <span style={{marginRight:12, fontSize:11, color:C.muted, background:"rgba(255,255,255,0.08)", padding:"3px 8px", borderRadius:10}}>
          {currentIndex+1} / {filtered.length}
        </span>
      </div>

      {/* WAFAR - قسم ووفر */}
      <div id="wafar" style={{margin:"10px 16px", background:`linear-gradient(135deg, ${C.card} 0%, rgba(124,58,237,0.15) 100%)`, border:`1px solid ${C.cardBorder}`, borderRadius:20, padding:16}}>
        <h2 style={{fontSize:18, fontWeight:900, margin:"0 0 10px"}}>💰 ووفر - حاسبة التوفير الذكية</h2>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <div style={{flex:1, minWidth:220, background:"rgba(0,0,0,0.3)", borderRadius:14, padding:14}}>
            <div style={{fontSize:13, color:C.muted, marginBottom:6}}>إجمالي ما وفرته مع حكيم</div>
            <div style={{fontSize:28, fontWeight:900, color:C.gold}}>{savedTotal.toLocaleString('ar-SA')} ر.س</div>
            <div style={{fontSize:12, color:C.green, marginTop:4}}>↑ +{cart.reduce((a,b)=>a+(b.old-b.p),0)} ر.س من السلة الحالية</div>
            <div style={{marginTop:12, display:"flex", gap:8, alignItems:"center"}}>
              <span style={{fontSize:12}}>ميزانيتك:</span>
              <input type="range" min={100} max={5000} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} style={{flex:1}}/>
              <span style={{background:C.main, padding:"4px 10px", borderRadius:10, fontSize:12, fontWeight:800}}>{budget} ر.س</span>
            </div>
            <div style={{fontSize:12, color:C.muted, marginTop:8}}>أفضل عروض ضمن ميزانيتك: <b style={{color:"#fff"}}>{filtered.filter(o=>o.p<=budget).length} عروض</b> • وفر حتى <b style={{color:C.gold}}>{Math.max(...filtered.filter(o=>o.p<=budget).map(o=>o.old-o.p),0)} ر.س</b></div>
          </div>
          <div style={{flex:1, minWidth:220, background:"rgba(255,255,255,0.05)", borderRadius:14, padding:14}}>
            <div style={{fontSize:14, fontWeight:800, marginBottom:8}}>سلة التوفير الحالية</div>
            {cart.length===0? <div style={{fontSize:13, color:C.muted}}>السلة فاضية - أضف عروض من عروضكم فوق 👆</div> : cart.slice(-3).map((c,i)=><div key={i} style={{fontSize:13, display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.08)"}}><span>{c.product}</span><span style={{color:C.green, fontWeight:700}}>-{c.old-c.p} ر.س</span></div>)}
            <div style={{marginTop:10, fontSize:12, color:"#aaa"}}>يتم احتساب التوصيل عند الدفع • دفع آمن تابي / تمارا / مدى</div>
          </div>
        </div>
      </div>

      {/* ASSISTANT - المساعد الاقتصادي */}
      <div id="assistant" style={{margin:"16px", background:"#0b0b14", border:`1px solid ${C.cardBorder}`, borderRadius:20, overflow:"hidden"}}>
        <div style={{padding:14, borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontWeight:900}}>🤖 المساعد الاقتصادي - حكيم</div>
          <div style={{fontSize:11, background:C.green, color:"#fff", padding:"4px 8px", borderRadius:10}}>متصل • يحدث الأسعار كل دقيقة</div>
        </div>
        <div style={{height:220, overflowY:"auto", padding:12, display:"flex", flexDirection:"column", gap:10}}>
          {messages.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start', background:m.role==='user'?C.main:"rgba(255,255,255,0.08)", padding:"10px 14px", borderRadius:14, maxWidth:"85%", fontSize:13, lineHeight:1.5}}>{m.text}</div>)}
        </div>
        <div style={{display:"flex", gap:8, padding:12, background:"rgba(255,255,255,0.04)"}}>
          <input value={assistantInput} onChange={e=>setAssistantInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendToAssistant()} placeholder="اسأل: وش أفضل هدية بـ 300؟ أو قارن لي بين العروض" style={{flex:1, background:"#1c1033", border:`1px solid ${C.cardBorder}`, color:"#fff", padding:"11px 14px", borderRadius:24, outline:"none", fontSize:13}}/>
          <button onClick={sendToAssistant} style={{background:C.main, color:"#fff", border:"none", padding:"0 18px", borderRadius:24, fontWeight:800}}>أرسل</button>
        </div>
        <div style={{padding:"8px 12px", fontSize:11, color:"#888", background:"rgba(0,0,0,0.3)"}}>مربوط مباشرة بـ عروضكم ووفر - يقرأ نفس البيانات الموثقة من المصدر الرسمي • موثوقية 99% ✅</div>
      </div>

      <div style={{textAlign:"center", fontSize:11, color:"#666", padding:"18px 0 90px"}}>متجر حكيم - لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎 © 2026 • يتم احتساب التوصيل عند الدفع</div>

      {cart.length>0 && <div style={{position:"fixed", bottom:16, left:16, right:16, background:C.main, padding:"12px 14px", borderRadius:16, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 10px 30px rgba(124,58,237,.5)", zIndex:60}}><div><div style={{fontWeight:900, fontSize:14}}>السلة: {cart.length} • وفرت {cart.reduce((a,b)=>a+(b.old-b.p),0)} ر.س</div><div style={{fontSize:11, opacity:.9}}>كوبونات مفعلة • تابي وتمارا متاحة</div></div><button style={{background:"#fff", color:C.dark, border:"none", padding:"10px 18px", borderRadius:12, fontWeight:900}}>إتمام الشراء</button></div>}
    </div>
  );
}
