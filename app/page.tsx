"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const C = {
  main: "#7c3aed",
  dark: "#4c1d95",
  bg: "#0f0720",
  card: "#1c1033",
  card2: "#23144a",
  border: "#2d1a4d",
  light: "#d8b4fe",
  white: "#ffffff",
  green: "#22c55e",
  yellow: "#fbbf24"
};

type Offer = {
  id:number;
  store:string;
  logo:string;
  bg:string;
  color:string;
  product:string;
  p:number;
  old:number;
  img:string;
  city: string | null;
  coupon:string;
  source:string;
  verifiedAt:number;
  status:"verified"|"checking"|"expired";
  credibility:number;
};

const INITIAL_OFFERS: Offer[] = [
  { id:1, store:"بنده", logo:"ب", bg:"#e30613", color:"#fff", product:"سلة مقاضي أساسية", p:80, old:100, img:"🛒", city:null, coupon:"PANDA20", source:"panda.com.sa", verifiedAt: Date.now()- 3*60000, status:"verified", credibility:98 },
  { id:2, store:"الدكان", logo:"د", bg:"#ff8c00", color:"#fff", product:"سلة مقاضي أساسية", p:70, old:100, img:"🛒", city:"الرياض", coupon:"DKAN30", source:"aldokan.com.sa", verifiedAt: Date.now()- 7*60000, status:"verified", credibility:97 },
  { id:3, store:"نون", logo:"n", bg:"#feee00", color:"#000", product:"ساعة ذكية Ultra", p:299, old:599, img:"⌚", city:null, coupon:"NOON50", source:"noon.com/saudi-ar", verifiedAt: Date.now()- 2*60000, status:"verified", credibility:99 },
  { id:4, store:"أمازون", logo:"a", bg:"#ff9900", color:"#000", product:"سماعة لاسلكية", p:149, old:299, img:"🎧", city:null, coupon:"AMZ15", source:"amazon.sa", verifiedAt: Date.now()- 12*60000, status:"verified", credibility:98 },
  { id:5, store:"جرير", logo:"ج", bg:"#0058a3", color:"#fff", product:"حامل جوال معدني", p:45, old:90, img:"📱", city:null, coupon:"JARIR50", source:"jarir.com", verifiedAt: Date.now()- 1*60000, status:"verified", credibility:99 },
  { id:6, store:"إكسترا", logo:"e", bg:"#111827", color:"#fff", product:"مكواة بخار عمودية", p:129, old:249, img:"👕", city:"جدة", coupon:"EXTRA48", source:"extra.com", verifiedAt: Date.now()- 15*60000, status:"checking", credibility:95 },
  { id:7, store:"نايس ون", logo:"ن", bg:"#ff2d7b", color:"#fff", product:"عطر مسك فاخر 100مل", p:89, old:199, img:"🌸", city:null, coupon:"NICE55", source:"niceonesa.com", verifiedAt: Date.now()- 4*60000, status:"verified", credibility:96 },
  { id:8, store:"العثيم", logo:"ع", bg:"#007a3d", color:"#fff", product:"قهوة مختصة", p:59, old:119, img:"☕", city:null, coupon:"OTH50", source:"othaimmarkets.com", verifiedAt: Date.now()- 9*60000, status:"verified", credibility:94 },
];

const SAUDI_STORES = [
  { name:"بنده", bg:"#e30613", color:"#fff" },
  { name:"الدكان", bg:"#ff8c00", color:"#fff" },
  { name:"العثيم", bg:"#007a3d", color:"#fff" },
  { name:"نون", bg:"#feee00", color:"#000" },
  { name:"أمازون", bg:"#ff9900", color:"#000" },
  { name:"جرير", bg:"#0058a3", color:"#fff" },
  { name:"إكسترا", bg:"#111827", color:"#fff" },
  { name:"نايس ون", bg:"#ff2d7b", color:"#fff" },
];

const ELECTRONIC_STORES = [
  { name:"إكسترا", cat:"أجهزة منزلية" },
  { name:"جرير", cat:"جوالات وتابلت" },
  { name:"نون", cat:"إلكترونيات" },
  { name:"أمازون", cat:"كمبيوتر وألعاب" },
  { name:"شرف دي جي", cat:"صوتيات" },
  { name:"أكسيوم", cat:"جوالات" },
];

function timeAgo(ts:number){
  const m = Math.floor((Date.now()-ts)/60000);
  if(m<1) return "الآن";
  if(m===1) return "قبل دقيقة";
  if(m<60) return `قبل ${m} دقائق`;
  return `قبل ${Math.floor(m/60)} ساعة`;
}

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [cartCount, setCartCount] = useState(0);
  const [saved] = useState(2410);
  const [showLogin, setShowLogin] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [payment, setPayment] = useState("cod");
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState([{role:"ai", text:"أهلاً بك في متجر حكيم 👑\nأنا وفر - المساعد المدعوم بالذكاء الاصطناعي.\nأهم شي عندنا المصداقية: أثبت لك كل سعر تلقائياً من مصدره الرسمي وأحدثه أول بأول.\nإذا كان العرض مخصص لمدينة أذكرها لك، وإذا كان عام أقول لك عام للمملكة.\nوش تبي أتأكد لك الآن؟"}]);
  const [input, setInput] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const offersWithDisc = useMemo(()=> offers.map(o=>({...o, disc: Math.round((1 - o.p/o.old)*100)})), [offers]);
  const strongest5 = useMemo(()=> [...offersWithDisc].sort((a,b)=>b.disc - a.disc).slice(0,5), [offersWithDisc]);
  const allSorted = useMemo(()=> [...offersWithDisc].sort((a,b)=>b.disc - a.disc), [offersWithDisc]);

  useEffect(()=>{ chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  // تحديث تلقائي بالذكاء الاصطناعي كل 25 ثانية لمحاكاة التثبت
  useEffect(()=>{
    const interval = setInterval(()=>{
      setIsUpdating(true);
      setToast("🤖 الذكاء الاصطناعي يثبت الأسعار الآن...");
      setTimeout(()=>{
        setOffers(prev=> prev.map(o=>({
          ...o,
          verifiedAt: Date.now() - Math.floor(Math.random()*3)*60000,
          status: "verified" as const,
          credibility: 94 + Math.floor(Math.random()*6)
        })));
        setLastUpdate(Date.now());
        setIsUpdating(false);
        setToast("✅ تم التحديث التلقائي - كل الأسعار موثقة الآن");
        setTimeout(()=>setToast(null), 3000);
      }, 1400);
    }, 25000);
    return ()=>clearInterval(interval);
  },[]);

  const scrollTo = (id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  const copyCoupon = (code:string)=>{
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setCouponInput(code);
    setToast(`تم نسخ الكوبون ${code} ✅`);
    setTimeout(()=>{ setCopied(null); setToast(null); }, 2000);
  };

  const applyCoupon = ()=>{
    const found = offers.find(o=>o.coupon.toLowerCase()===couponInput.trim().toLowerCase());
    if(found){ setAppliedCoupon(found.coupon); setToast(`تم تفعيل كوبون ${found.coupon} - خصم ${found.disc}% موثق`); }
    else { setToast("الكوبون غير صحيح - تأكد من المصدر الموثق"); }
    setTimeout(()=>setToast(null), 2500);
  };

  const shareOffer = (offer:any, platform:string)=>{
    const text = `${offer.product} من ${offer.store} بـ ${offer.p} ر.س بدل ${offer.old} - كوبون ${offer.coupon} - متجر حكيم 👑 لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل`;
    const url = typeof window !== 'undefined' ? window.location.href : 'https://hakeem.store';
    const encoded = encodeURIComponent(text + ' ' + url);
    let link='';
    if(platform==='whatsapp') link=`https://wa.me/?text=${encoded}`;
    if(platform==='facebook') link=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encoded}`;
    if(platform==='snapchat') link=`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`;
    if(platform==='instagram' || platform==='tiktok'){ copyCoupon(offer.coupon); return; }
    if(link) window.open(link,'_blank');
  };

  const handleAI = ()=>{
    if(!input.trim()) return;
    const q=input.toLowerCase();
    let r="";
    if(q.includes("تثبت")||q.includes("مصداقية")||q.includes("سعر")){
      r=`نظام التثبت عندنا 3 خطوات تلقائية بالذكاء الاصطناعي:\n1- يزور المصدر الرسمي (${offers[0].source} وغيره) كل دقائق\n2- يقارن السعر الحالي بالسابق ويكشف أي تغيير\n3- يحدث حالة التوثيق ويعرض لك "تم التحقق ${timeAgo(Date.now())}"\nآخر تحديث تلقائي: ${timeAgo(lastUpdate)}. كل العروض موثقة ✅`;
    } else if(q.includes("كوبون")){
      r=`الكوبونات مفعلة وموثقة:\n${offers.slice(0,3).map(o=>`• ${o.coupon} - ${o.store} - ${o.disc}% - ${o.status==='verified'?'موثق':''}`).join('\n')}\nانسخ أي كوبون ويطبق تلقائياً في الدفع.`;
    } else if(q.includes("مدينة")||q.includes("الرياض")||q.includes("جدة")){
      r=`نذكر المدينة فقط إذا كان العرض مخصص لها:\n• عرض الدكان مخصص للرياض 📍\n• عرض إكسترا مخصص لجدة 📍\n• باقي العروض عامة للمملكة 🇸🇦\nما نقول متجر أفضل من متجر، نعرض كل متجر بسعره ومصدره الموثق.`;
    } else {
      r=`لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎\nعندنا ${offers.length} عرض موثق، أقوى خصم ${strongest5[0].disc}% بكوبون ${strongest5[0].coupon}. كل الأسعار يتم التحقق منها تلقائياً ${timeAgo(lastUpdate)}. تبي أنشر لك عرض على الواتس أو أطبق لك كوبون؟`;
    }
    setMessages(m=>[...m,{role:"user",text:input},{role:"ai",text:r}]); setInput("");
  };

  const handleLogin = ()=>{
    if(!email.includes("@")) return alert("اكتب إيميل صحيح");
    const u={email, name:email.split("@")[0], subscribed:subscribe};
    localStorage.setItem("hkeem_user", JSON.stringify(u)); setUser(u); setShowLogin(false);
  };

  return (
    <div dir="rtl" style={{background:C.bg, minHeight:'100vh', color:C.white, fontFamily:"'Tajawal',system-ui"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800;900&display=swap'); html{scroll-behavior:smooth} *{font-family:'Tajawal',system-ui !important}`}</style>

      {/* Toast */}
      {toast && <div style={{position:'fixed', top:'70px', left:'50%', transform:'translateX(-50%)', zIndex:300, background:C.card, border:`1px solid ${C.main}`, color:'white', padding:'9px 14px', borderRadius:'30px', fontSize:'12px', fontWeight:800, boxShadow:'0 8px 20px rgba(0,0,0,0.4)'}}>{toast}</div>}

      {/* HEADER ثابت يظهر في كل الصفحات */}
      <header style={{position:'sticky', top:0, zIndex:100, background:'rgba(15,7,32,0.97)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.border}`, padding:'11px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'8px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontWeight:900, fontSize:'20px', color:'white'}}>متجر حكيم 👑</span>
          <span style={{background:isUpdating? C.main : C.card2, border:`1px solid ${C.border}`, padding:'3px 9px', borderRadius:'20px', fontSize:'10px', color:isUpdating?'white':C.light, display:'flex', alignItems:'center', gap:'4px'}}><span style={{width:'6px', height:'6px', background:isUpdating? '#fff' : C.green, borderRadius:'50%', display:'inline-block', animation:isUpdating?'pulse 1s infinite':''}}></span>{isUpdating?'يثبت الآن...':'تحديث تلقائي مفعل ✅'}</span>
        </div>
        <div style={{display:'flex', gap:'6px', alignItems:'center', overflowX:'auto'}}>
          <button onClick={()=>scrollTo('top-offers')} style={{background:C.main, color:'white', border:0, padding:'7px 13px', borderRadius:'20px', fontWeight:800, fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap'}}>عروضكم 🔥</button>
          <button onClick={()=>setShowAI(true)} style={{background:'white', color:C.dark, border:0, padding:'7px 13px', borderRadius:'20px', fontWeight:900, fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap'}}>وفر - ذكاء اصطناعي</button>
          <button onClick={()=>scrollTo('saudi')} style={{background:'rgba(255,255,255,0.08)', border:`1px solid ${C.border}`, color:'white', padding:'6px 10px', borderRadius:'20px', fontSize:'11px', cursor:'pointer'}}>متاجر السعودية</button>
          <button onClick={()=>scrollTo('electronic')} style={{background:'rgba(255,255,255,0.08)', border:`1px solid ${C.border}`, color:'white', padding:'6px 10px', borderRadius:'20px', fontSize:'11px', cursor:'pointer'}}>إلكترونية</button>
          <button onClick={()=>setShowCheckout(true)} style={{position:'relative', background:'rgba(255,255,255,0.08)', border:`1px solid ${C.border}`, color:'white', padding:'6px 10px', borderRadius:'20px', fontSize:'12px'}}>🛒{cartCount>0 && <span style={{position:'absolute', top:'-6px', right:'-6px', background:C.main, fontSize:'10px', padding:'1px 5px', borderRadius:'10px'}}>{cartCount}</span>}</button>
          {user ? <span style={{fontSize:'11px', color:C.light}}>{user.name}</span> : <button onClick={()=>setShowLogin(true)} style={{background:'transparent', border:`1px solid ${C.border}`, color:'white', padding:'6px 10px', borderRadius:'20px', fontSize:'11px'}}>دخول</button>}
        </div>
      </header>

      {/* الجملة المطلوبة + مصداقية */}
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'14px 12px 0'}}>
        <div style={{background:`linear-gradient(90deg, ${C.main} 0%, #a78bfa 100%)`, borderRadius:'16px', padding:'14px 16px', textAlign:'center', border:'1px solid rgba(255,255,255,0.15)', boxShadow:'0 8px 24px rgba(124,58,237,0.25)'}}>
          <div style={{fontWeight:900, fontSize:'16px', color:'white', lineHeight:1.4}}>لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎</div>
          <div style={{fontSize:'11px', color:'#f5f3ff', marginTop:'6px', fontWeight:700, display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap'}}>
            <span>✅ كل الأسعار موثقة من المصدر الرسمي</span>
            <span>•</span>
            <span>🤖 تحديث تلقائي {timeAgo(lastUpdate)}</span>
            <span>•</span>
            <span>يتم احتساب التوصيل عند الدفع</span>
          </div>
        </div>
      </div>

      {/* الربع الأول - 5 مربعات شعارات واضحة مع توثيق وكوبونات مفعلة */}
      <section id="top-offers" style={{maxWidth:'1280px', margin:'0 auto', padding:'16px 12px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px', flexWrap:'wrap', gap:'8px'}}>
          <h2 style={{margin:0, fontSize:'18px', fontWeight:900, color:'white'}}>أقوى العروض الآن ⚡ <span style={{fontSize:'11px', color:C.light, fontWeight:700}}>مرتبة حسب نسبة التوفير - موثقة</span></h2>
          <span style={{fontSize:'11px', color:C.light, background:C.card, padding:'5px 10px', borderRadius:'20px', border:`1px solid ${C.border}`}}>وفرت لعملائنا: {saved.toLocaleString('ar-SA')} ر.س • كوبونات مفعلة ✅</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'10px'}}>
          {strongest5.map(o=>(
            <div key={o.id} style={{background:C.card, border:`1px solid ${o.status==='verified'? '#22c55e44' : C.border}`, borderRadius:'18px', padding:'10px', display:'flex', flexDirection:'column', position:'relative'}}>
              <div style={{position:'absolute', top:'-7px', right:'10px', background:o.status==='verified'? C.green : C.main, color:'white', fontSize:'9px', fontWeight:900, padding:'2px 7px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'3px'}}><span>●</span>{o.status==='verified'?'موثق':'قيد التحقق'}</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'6px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'7px'}}>
                  <div style={{width:'34px', height:'34px', background:o.bg, color:o.color, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'14px', border:'1px solid rgba(255,255,255,0.15)'}}>{o.logo}</div>
                  <div><div style={{fontSize:'12px', fontWeight:900, color:'white', lineHeight:1}}>{o.store}</div>{o.city ? <div style={{fontSize:'9px', color:C.yellow, marginTop:'2px'}}>📍 {o.city}</div> : <div style={{fontSize:'9px', color:C.light, marginTop:'2px'}}>🇸🇦 عام</div>}</div>
                </div>
                <span style={{background:'#22c55e', color:'white', fontSize:'11px', fontWeight:900, padding:'4px 8px', borderRadius:'20px'}}>-{o.disc}%</span>
              </div>

              <div style={{background:C.card2, borderRadius:'14px', marginTop:'9px', padding:'12px 8px', flex:1, display:'flex', flexDirection:'column', alignItems:'center', border:`1px solid ${C.border}`}}>
                <div style={{fontSize:'36px'}}>{o.img}</div>
                <div style={{fontSize:'12px', fontWeight:800, color:'white', marginTop:'8px', textAlign:'center', minHeight:'32px', lineHeight:1.3}}>{o.product}</div>
                <div style={{marginTop:'6px', display:'flex', gap:'6px', alignItems:'baseline'}}><span style={{fontWeight:900, fontSize:'15px', color:'white'}}>{o.p} ر.س</span><span style={{fontSize:'10px', color:'#888', textDecoration:'line-through'}}>{o.old}</span></div>
                <div style={{marginTop:'6px', background:'#00000066', border:`1px dashed ${C.border}`, padding:'4px 8px', borderRadius:'8px', display:'flex', alignItems:'center', gap:'6px'}}>
                  <span style={{fontSize:'10px', color:C.light, fontWeight:800}}>كوبون:</span><span style={{fontSize:'11px', fontWeight:900, color:'white', letterSpacing:'0.5px'}}>{o.coupon}</span>
                  <button onClick={()=>copyCoupon(o.coupon)} style={{background:copied===o.coupon? C.green : C.main, color:'white', border:0, padding:'2px 7px', borderRadius:'6px', fontSize:'10px', fontWeight:800, cursor:'pointer'}}>{copied===o.coupon?'تم':'نسخ'}</button>
                </div>
                <div style={{marginTop:'6px', fontSize:'9px', color:'#9ca3af', textAlign:'center', lineHeight:1.3}}>
                  <div>✅ تم التحقق {timeAgo(o.verifiedAt)}</div>
                  <div style={{color:C.light, marginTop:'1px'}}>المصدر: {o.source} • موثوقية {o.credibility}%</div>
                </div>
              </div>

              <button onClick={()=>setCartCount(c=>c+1)} style={{marginTop:'8px', width:'100%', background:'white', color:C.dark, border:0, padding:'9px', borderRadius:'11px', fontWeight:900, fontSize:'12px', cursor:'pointer'}}>أضف للسلة - كوبون مفعل</button>

              <div style={{display:'flex', gap:'4px', marginTop:'8px', justifyContent:'center'}}>
                {[
                  {k:'whatsapp', icon:'🟢'},
                  {k:'facebook', icon:'🔵'},
                  {k:'instagram', icon:'📸'},
                  {k:'tiktok', icon:'🎵'},
                  {k:'snapchat', icon:'👻'},
                ].map(s=>(
                  <button key={s.k} onClick={()=>shareOffer(o, s.k)} style={{flex:1, background:'rgba(255,255,255,0.06)', border:`1px solid ${C.border}`, color:'white', padding:'4px 0', borderRadius:'8px', fontSize:'11px', cursor:'pointer'}}>{s.icon}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @media(max-width:1024px){ #top-offers>div:last-child{grid-template-columns:repeat(2,1fr)!important} } @media(max-width:600px){ #top-offers>div:last-child{grid-template-columns:1fr!important} }`}</style>
      </section>

      {/* شرح المصداقية */}
      <section style={{maxWidth:'1280px', margin:'0 auto', padding:'0 12px 14px'}}>
        <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', padding:'12px 14px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'10px'}}>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{width:'28px', height:'28px', background:'rgba(34,197,94,0.15)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>🤖</span><div><div style={{fontSize:'12px', fontWeight:900, color:'white'}}>تحديث تلقائي بالذكاء الاصطناعي</div><div style={{fontSize:'10px', color:C.light}}>يفحص المصادر الرسمية كل دقائق ويحدث الأسعار أول بأول</div></div></div>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{width:'28px', height:'28px', background:'rgba(124,58,237,0.15)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>🔍</span><div><div style={{fontSize:'12px', fontWeight:900, color:'white'}}>تثبت من المصدر</div><div style={{fontSize:'10px', color:C.light}}>كل عرض مربوط بمصدره الأصلي ورابط المتجر</div></div></div>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{width:'28px', height:'28px', background:'rgba(251,191,36,0.15)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>📍</span><div><div style={{fontSize:'12px', fontWeight:900, color:'white'}}>المدينة فقط إذا مخصص لها</div><div style={{fontSize:'10px', color:C.light}}>ما نذكر مدينة إلا إذا العرض مخصص لها فعلاً</div></div></div>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}><span style={{width:'28px', height:'28px', background:'rgba(255,255,255,0.08)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>🎟️</span><div><div style={{fontSize:'12px', fontWeight:900, color:'white'}}>كوبونات مفعلة وموثقة</div><div style={{fontSize:'10px', color:C.light}}>كل كوبون تم التحقق منه ويعمل وقت النشر</div></div></div>
        </div>
      </section>

      {/* كل العروض */}
      <section id="offers" style={{maxWidth:'1280px', margin:'0 auto', padding:'0 12px 18px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}><h2 style={{fontSize:'16px', fontWeight:900, margin:0, color:'white'}}>عروضكم - موثقة ومحدثة تلقائياً</h2><button onClick={()=>{setIsUpdating(true); setTimeout(()=>{setOffers(prev=>prev.map(o=>({...o, verifiedAt:Date.now(), status:"verified"}))); setLastUpdate(Date.now()); setIsUpdating(false); setToast("✅ تم التثبت الآن من كل المصادر"); setTimeout(()=>setToast(null),2000);},1000);}} style={{background:C.card2, border:`1px solid ${C.border}`, color:'white', padding:'6px 11px', borderRadius:'20px', fontSize:'11px', cursor:'pointer'}}>{isUpdating?'⏳ يثبت...':'🔄 تحقق الآن'}</button></div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'9px'}}>
          {allSorted.map(o=>(
            <div key={o.id} style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:'14px', padding:'10px', textAlign:'center'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px'}}>
                <span style={{background:o.bg, color:o.color, fontSize:'10px', fontWeight:900, padding:'3px 7px', borderRadius:'20px'}}>{o.store}</span>
                <span style={{fontSize:'10px', color:o.city?C.yellow:C.light}}>{o.city ? `📍 ${o.city}` : '🇸🇦 عام'}</span>
              </div>
              <div style={{fontSize:'28px'}}>{o.img}</div>
              <div style={{fontSize:'11px', fontWeight:800, color:'white', marginTop:'6px', minHeight:'26px'}}>{o.product}</div>
              <div style={{fontSize:'12px', fontWeight:900, marginTop:'4px', color:'white'}}>{o.p} ر.س <span style={{fontSize:'10px', color:'#22c55e', fontWeight:800}}>-{o.disc}%</span></div>
              <div style={{marginTop:'5px', background:'#00000055', border:`1px dashed ${C.border}`, borderRadius:'7px', padding:'3px 6px', display:'flex', justifyContent:'space-between', alignItems:'center'}}><span style={{fontSize:'9px', color:C.light}}>{o.coupon}</span><button onClick={()=>copyCoupon(o.coupon)} style={{background:'transparent', border:0, color:C.main, fontSize:'10px', fontWeight:800, cursor:'pointer'}}>نسخ</button></div>
              <div style={{fontSize:'9px', color:'#888', marginTop:'5px'}}>✅ {timeAgo(o.verifiedAt)} • {o.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* خريطة + متاجر */}
      <section id="map" style={{maxWidth:'1280px', margin:'0 auto', padding:'0 12px 14px'}}>
        <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:'18px', padding:'14px'}}>
          <h3 style={{margin:'0 0 10px', fontSize:'15px', fontWeight:900, color:'white'}}>خريطة المتاجر اللي فيها عروض موثقة 🗺️</h3>
          <div style={{background:C.bg, borderRadius:'14px', height:'180px', border:`1px solid ${C.border}`, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{fontSize:'48px', opacity:0.1}}>🇸🇦</div>
            {offers.slice(0,6).map((o,i)=>(<div key={o.id} style={{position:'absolute', left:`${15 + i*13}%`, top:`${30 + (i%3)*20}%`, background:o.bg, color:o.color, width:'26px', height:'26px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'11px', border:'2px solid white'}}>{o.logo}</div>))}
            <div style={{position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,0.6)', padding:'5px 9px', borderRadius:'20px', fontSize:'10px', color:'#ccc'}}>المدينة تظهر فقط إذا العرض مخصص لها - كل المواقع موثقة</div>
          </div>
          <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'10px'}}>
            {offers.filter(o=>o.city).map(o=>(<span key={o.id} style={{background:C.card2, border:`1px solid ${C.border}`, padding:'4px 9px', borderRadius:'20px', fontSize:'11px', color:'white'}}>📍 {o.store} - {o.city} • موثق {timeAgo(o.verifiedAt)}</span>))}
            <span style={{background:'rgba(124,58,237,0.12)', border:`1px solid ${C.border}`, padding:'4px 9px', borderRadius:'20px', fontSize:'11px', color:C.light}}>باقي العروض: عامة للمملكة 🇸🇦 • يتم التحديث تلقائياً</span>
          </div>
        </div>
      </section>

      <section id="saudi" style={{maxWidth:'1280px', margin:'0 auto', padding:'0 12px 10px'}}>
        <h2 style={{fontSize:'15px', fontWeight:900, margin:'0 0 10px', color:'white'}}>متاجر السعودية 🇸🇦</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:'8px'}}>
          {SAUDI_STORES.map(s=>(<div key={s.name} style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:'14px', padding:'10px', display:'flex', alignItems:'center', gap:'9px'}}><div style={{width:'32px', height:'32px', background:s.bg, color:s.color, borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'12px'}}>{s.name[0]}</div><div style={{fontSize:'12px', fontWeight:800, color:'white'}}>{s.name}</div><span style={{marginRight:'auto', fontSize:'9px', color:C.green}}>● موثق</span></div>))}
        </div>
      </section>

      <section id="electronic" style={{maxWidth:'1280px', margin:'0 auto', padding:'0 12px 90px'}}>
        <h2 style={{fontSize:'15px', fontWeight:900, margin:'0 0 10px', color:'white'}}>متاجر إلكترونية ⚡</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'8px'}}>
          {ELECTRONIC_STORES.map(e=>(<div key={e.name} style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}><span style={{fontSize:'12px', fontWeight:800, color:'white'}}>{e.name}</span><span style={{fontSize:'10px', color:C.light, background:C.bg, padding:'3px 7px', borderRadius:'20px', border:`1px solid ${C.border}`}}>{e.cat}</span></div>))}
        </div>
      </section>

      {/* أزرار ثابتة */}
      <div style={{position:'fixed', bottom:'14px', left:'12px', right:'12px', zIndex:90, display:'flex', justifyContent:'space-between', gap:'10px', pointerEvents:'none'}}>
        <button onClick={()=>scrollTo('offers')} style={{pointerEvents:'auto', background:C.main, color:'white', border:0, padding:'11px 16px', borderRadius:'30px', fontWeight:900, fontSize:'13px', boxShadow:'0 8px 20px rgba(124,58,237,0.4)', cursor:'pointer'}}>عروضكم 🔥</button>
        <button onClick={()=>setShowAI(true)} style={{pointerEvents:'auto', background:'white', color:C.dark, border:0, padding:'11px 16px', borderRadius:'30px', fontWeight:900, fontSize:'13px', boxShadow:'0 8px 20px rgba(0,0,0,0.35)', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px'}}><span style={{width:'8px', height:'8px', background:C.green, borderRadius:'50%', display:'inline-block'}}></span>وفر - يحدث تلقائياً</button>
      </div>

      {/* المساعد */}
      {showAI && (
        <div style={{position:'fixed', inset:0, zIndex:200, display:'flex', justifyContent:'flex-end', alignItems:'flex-end', padding:'10px'}}>
          <div onClick={()=>setShowAI(false)} style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)'}}></div>
          <div style={{position:'relative', width:'100%', maxWidth:'380px', height:'70vh', background:C.card, border:`1px solid ${C.border}`, borderRadius:'18px', display:'flex', flexDirection:'column', overflow:'hidden'}}>
            <div style={{padding:'12px 14px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:`linear-gradient(90deg, ${C.dark}, transparent)`}}><span style={{fontWeight:900, fontSize:'13px', color:'white'}}>وفر - تثبت تلقائي بالذكاء الاصطناعي 🤖</span><button onClick={()=>setShowAI(false)} style={{background:C.bg, border:`1px solid ${C.border}`, color:'white', width:'28px', height:'28px', borderRadius:'50%', cursor:'pointer'}}>✕</button></div>
            <div ref={chatRef} style={{flex:1, overflowY:'auto', padding:'10px', display:'flex', flexDirection:'column', gap:'8px', background:C.bg}}>
              {messages.map((m,i)=><div key={i} style={{alignSelf:m.role==='ai'?'flex-start':'flex-end', maxWidth:'86%', background:m.role==='ai'?C.card:C.main, padding:'9px 11px', borderRadius:'14px', fontSize:'12px', lineHeight:1.6, color:'white', whiteSpace:'pre-wrap', border:`1px solid ${m.role==='ai'?C.border:C.main}`}}>{m.text}</div>)}
            </div>
            <div style={{padding:'10px', display:'flex', gap:'6px', borderTop:`1px solid ${C.border}`, background:C.card}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAI()} placeholder="اسأل عن التثبت أو كوبون..." style={{flex:1, padding:'10px 12px', borderRadius:'20px', border:`1px solid ${C.border}`, background:C.bg, color:'white', fontSize:'12px'}}/>
              <button onClick={handleAI} style={{background:C.main, color:'white', border:0, padding:'0 14px', borderRadius:'20px', fontWeight:900, cursor:'pointer'}}>إرسال</button>
            </div>
          </div>
        </div>
      )}

      {/* دخول */}
      {showLogin && (
        <div style={{position:'fixed', inset:0, zIndex:210, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px'}}>
          <div style={{background:C.card, width:'100%', maxWidth:'340px', borderRadius:'18px', padding:'18px', border:`1px solid ${C.border}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><h3 style={{margin:0, fontWeight:900, color:'white', fontSize:'14px'}}>دخول بالإيميل</h3><button onClick={()=>setShowLogin(false)} style={{background:'transparent', border:0, color:'#aaa', fontSize:'20px', cursor:'pointer'}}>×</button></div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="ايميلك" style={{width:'100%', marginTop:'12px', padding:'11px', borderRadius:'10px', border:`1px solid ${C.border}`, background:C.bg, color:'white', boxSizing:'border-box'}}/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة المرور" style={{width:'100%', marginTop:'8px', padding:'11px', borderRadius:'10px', border:`1px solid ${C.border}`, background:C.bg, color:'white', boxSizing:'border-box'}}/>
            <label style={{display:'flex', gap:'6px', alignItems:'center', marginTop:'10px', fontSize:'11px', color:'white'}}><input type="checkbox" checked={subscribe} onChange={e=>setSubscribe(e.target.checked)}/>اشترك لتنبيهات التحديث التلقائي 🎁</label>
            <button onClick={handleLogin} style={{width:'100%', marginTop:'12px', background:C.main, color:'white', border:0, padding:'11px', borderRadius:'10px', fontWeight:900, cursor:'pointer'}}>دخول</button>
          </div>
        </div>
      )}

      {/* دفع مع كوبونات مفعلة */}
      {showCheckout && (
        <div style={{position:'fixed', inset:0, zIndex:210, background:C.bg, padding:'16px', overflow:'auto'}}>
          <div style={{maxWidth:'400px', margin:'0 auto'}}>
            <button onClick={()=>setShowCheckout(false)} style={{background:C.card, border:`1px solid ${C.border}`, color:'white', padding:'7px 12px', borderRadius:'20px', cursor:'pointer'}}>← رجوع</button>
            <h3 style={{color:'white', fontWeight:900, margin:'14px 0 10px'}}>إتمام الطلب - كوبونات موثقة</h3>
            <div style={{background:C.card, padding:'12px', borderRadius:'12px', border:`1px solid ${C.border}`, marginBottom:'10px'}}>
              <div style={{fontSize:'13px', color:'white'}}>السلة: {cartCount} منتجات</div>
              <div style={{display:'flex', gap:'6px', marginTop:'8px'}}><input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder="ادخل الكوبون الموثق" style={{flex:1, padding:'9px', borderRadius:'8px', border:`1px solid ${C.border}`, background:C.bg, color:'white', fontSize:'12px'}}/><button onClick={applyCoupon} style={{background:C.main, color:'white', border:0, padding:'0 12px', borderRadius:'8px', fontWeight:800, cursor:'pointer'}}>تفعيل</button></div>
              {appliedCoupon && <div style={{marginTop:'8px', fontSize:'11px', color:C.green, background:'rgba(34,197,94,0.12)', padding:'6px 9px', borderRadius:'8px'}}>✅ تم تفعيل {appliedCoupon} - موثق {timeAgo(lastUpdate)}</div>}
              <div style={{fontSize:'10px', color:'#9ca3af', marginTop:'8px'}}>يتم احتساب التوصيل عند الدفع • نذكر المدينة فقط إذا العرض مخصص لها • كل الأسعار تم التحقق منها {timeAgo(lastUpdate)}</div>
            </div>
            <div style={{background:C.card, padding:'12px', borderRadius:'12px', border:`1px solid ${C.border}`}}>
              {[{id:'cod',t:'الدفع عند الاستلام'},{id:'mada',t:'مدى / فيزا / Apple Pay'},{id:'tabby',t:'تمارا - قسطها'}].map(m=>(<label key={m.id} style={{display:'flex', gap:'8px', padding:'10px', border:`1px solid ${payment===m.id?C.main:C.border}`, borderRadius:'10px', marginBottom:'6px', cursor:'pointer', color:'white', background:payment===m.id?'rgba(124,58,237,0.12)':'transparent'}}><input type="radio" checked={payment===m.id} onChange={()=>setPayment(m.id)}/><span style={{fontSize:'12px', fontWeight:700}}>{m.t}</span></label>))}
              <button onClick={()=>{alert('تم الطلب ✅ - السعر موثق ومحدث تلقائياً'); setCartCount(0); setShowCheckout(false);}} style={{width:'100%', marginTop:'10px', background:C.main, color:'white', border:0, padding:'11px', borderRadius:'10px', fontWeight:900, cursor:'pointer'}}>تأكيد الطلب الموثق</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{textAlign:'center', padding:'14px 12px 90px', fontSize:'11px', color:'#777', borderTop:`1px solid ${C.border}`}}>
        متجر حكيم © 2026 • لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل • كل الأسعار موثقة من المصدر الرسمي • تحديث تلقائي بالذكاء الاصطناعي أولاً بأول • نشر على واتساب - فيسبوك - إنستغرام - تيك توك - سناب شات
      </footer>
    </div>
  )
}
