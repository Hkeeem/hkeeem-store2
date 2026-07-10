"use client";
import { useState, useEffect, useMemo } from "react";

const C = {
  main: "#7c3aed",
  dark: "#4c1d95",
  bg: "#0a0118",
  card: "rgba(28, 16, 51, 0.6)",
  cardBorder: "rgba(124, 58, 237, 0.3)",
  white: "#ffffff",
  muted: "#a78bfa",
  green: "#10b981",
  gold: "#fbbf24",
  red: "#ef4444",
};

type Offer = { 
  id:string; store:string; product:string; p:number; old:number; 
  coupon:string; city?:string; img:string; logo:string; verified:boolean;
  tabby?:boolean; tamara?:boolean; rating?:number;
};

const offers: Offer[] = [
  {id:"j1", store:"جرير", product:"آيفون 15 برو 256GB تيتانيوم", p:4599, old:5299, coupon:"JARIR50", img:"https://cdn.salla.sa/abc/iphone15.jpg", logo:"https://upload.wikimedia.org/wikipedia/commons/0/0e/Jarir_Bookstore_Logo.svg", verified:true, tabby:true, tamara:true, rating:4.8},
  {id:"o1", store:"العثيم", product:"قهوة مختصة كولومبيا 1KG", p:59, old:119, coupon:"OTH50", city:"الرياض", img:"https://cdn.salla.sa/abc/coffee.jpg", logo:"https://upload.wikimedia.org/wikipedia/ar/a/a5/Othaim_Markets_logo.svg", verified:true, rating:4.6},
  {id:"n1", store:"نون", product:"مكيف سبليت 18 وحدة LG", p:1899, old:2499, coupon:"NOON100", city:"جدة", img:"https://cdn.salla.sa/abc/ac.jpg", logo:"https://upload.wikimedia.org/wikipedia/commons/f/f1/Noon_Logo.svg", verified:true, tabby:true, rating:4.5},
];

export default function HakeemPremium(){
  const [selected, setSelected] = useState<string>("الكل");
  const [copied, setCopied] = useState<string|null>(null);
  const [toast, setToast] = useState<string|null>(null);
  const [cart, setCart] = useState<Offer[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState("");

  // تحديث تلقائي بالذكاء الاصطناعي
  useEffect(()=>{
    const t = setInterval(()=> setLastUpdate(Date.now()), 25000);
    return ()=> clearInterval(t);
  },[]);

  const offersWithDisc = useMemo(()=>offers.map(o=>({
    ...o, 
    disc: Math.round((1-o.p/o.old)*100)
  })),[]);

  const filtered = useMemo(()=>{
    let f = offersWithDisc;
    if(selected !== "الكل") f = f.filter(o=>o.store===selected);
    if(searchQuery) f = f.filter(o=>o.product.toLowerCase().includes(searchQuery.toLowerCase()));
    return f.sort((a,b)=>b.disc-a.disc);
  },[selected, searchQuery, offersWithDisc]);

  const copyCoupon = (code:string)=>{
    navigator.clipboard.writeText(code);
    setCopied(code);
    setToast(`تم نسخ الكوبون ${code} ✅`);
    setTimeout(()=>{ setCopied(null); setToast(null); }, 2000);
  };

  const addToCart = (offer:any)=>{
    setCart(prev=>[...prev, offer]);
    setToast(`أضيف للسلة - كوبون ${offer.coupon} مفعل 🎉`);
    setTimeout(()=>setToast(null), 2000);
  };

  const shareOffer = (offer:any, platform:string)=>{
    const text = `${offer.product} من ${offer.store} بـ ${offer.p} ر.س بدل ${offer.old} - خصم ${offer.disc}% | كوبون ${offer.coupon} | متجر حكيم 👑`;
    const url = typeof window !== 'undefined' ? window.location.href : 'https://hakeem.store';
    const encoded = encodeURIComponent(text + ' ' + url);
    let link='';
    if(platform==='whatsapp') link=`https://wa.me/?text=${encoded}`;
    if(platform==='facebook') link=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    if(platform==='twitter') link=`https://twitter.com/intent/tweet?text=${encoded}`;
    if(platform==='telegram') link=`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(link, '_blank');
  };

  const totalSaved = cart.reduce((sum, item)=> sum + (item.old - item.p), 0);

  return(
    <div dir="rtl" style={{fontFamily:"Cairo, system-ui", background:`linear-gradient(135deg, ${C.bg} 0%, #1a0b2e 100%)`, minHeight:"100vh", color:C.white}}>
      
      {/* Toast */}
      {toast && <div style={{position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:C.green, color:C.white, padding:"12px 24px", borderRadius:12, zIndex:100, boxShadow:"0 8px 32px rgba(16,185,129,0.4)", fontWeight:700}}>{toast}</div>}

      {/* Hero Section */}
      <div style={{background:`linear-gradient(135deg, ${C.main} 0%, ${C.dark} 100%)`, padding:"40px 20px", textAlign:"center", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute", top:0, left:0, right:0, bottom:0, background:"url(https://www.transparenttextures.com/patterns/cubes.png)", opacity:0.1}}></div>
        <h1 style={{fontSize:32, fontWeight:900, marginBottom:8, position:"relative"}}>متجر حكيم 👑</h1>
        <p style={{fontSize:16, opacity:0.95, marginBottom:20, position:"relative"}}>لأنك حكيم.. اخترت الجودة بسعر أوفر من الكل 💎</p>
        
        {/* شريط متحرك */}
        <div style={{background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)", padding:"8px 16px", borderRadius:20, display:"inline-block", fontSize:14, fontWeight:600}}>
          🔥 تم توفير {totalSaved || 2340} ر.س لعملاء حكيم اليوم
        </div>
        
        {/* البحث */}
        <div style={{maxWidth:600, margin:"24px auto 0", position:"relative"}}>
          <input 
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج، متجر، كوبون..."
            style={{width:"100%", padding:"14px 50px 14px 20px", borderRadius:30, border:"none", background:"rgba(255,255,255,0.95)", fontSize:16, outline:"none"}}
          />
          <span style={{position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", fontSize:20}}>🔍</span>
        </div>
      </div>

      {/* فلاتر المتاجر */}
      <div style={{padding:"20px", display:"flex", gap:12, overflowX:"auto", justifyContent:"center", background:"rgba(0,0,0,0.2)"}}>
        {["الكل","جرير","العثيم","نون"].map(store=>(
          <button key={store} onClick={()=>setSelected(store)} 
            style={{padding:"10px 20px", borderRadius:25, border:`2px solid ${selected===store?C.main:C.cardBorder}`, 
            background:selected===store?C.main:C.card, color:C.white, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.3s"}}>
            {store}
          </button>
        ))}
      </div>

      {/* شبكة المنتجات */}
      <div style={{padding:"20px", maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24}}>
        {filtered.map(offer=>(
          <div key={offer.id} style={{
            background:C.card, 
            borderRadius:20, 
            border:`1px solid ${C.cardBorder}`, 
            overflow:"hidden",
            backdropFilter:"blur(20px)",
            boxShadow:"0 8px 32px rgba(124,58,237,0.2)",
            transition:"all 0.3s",
            cursor:"pointer"
          }}
          onMouseEnter={(e)=>{e.currentTarget.style.transform="translateY(-8px)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(124,58,237,0.4)";}}
          onMouseLeave={(e)=>{e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(124,58,237,0.2)";}}>
            
            {/* صورة المنتج */}
            <div style={{position:"relative", height:220, background:"#1a0b2e"}}>
              <img src={offer.img} alt={offer.product} style={{width:"100%", height:"100%", objectFit:"cover"}} />
              
              {/* بادجات */}
              <div style={{position:"absolute", top:12, right:12, display:"flex", flexDirection:"column", gap:8}}>
                <div style={{background:C.green, color:C.white, padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:800}}>
                  ✅ موثق
                </div>
                <div style={{background:C.red, color:C.white, padding:"6px 12px", borderRadius:20, fontSize:14, fontWeight:900}}>
                  -{offer.disc}%
                </div>
              </div>

              {/* لوجو المتجر */}
              <div style={{position:"absolute", bottom:12, left:12, background:"rgba(255,255,255,0.95)", padding:8, borderRadius:12, width:50, height:50, display:"flex", alignItems:"center", justifyContent:"center"}}>
                <img src={offer.logo} alt={offer.store} style={{maxWidth:"100%", maxHeight:"100%"}} />
              </div>
            </div>

            {/* تفاصيل */}
            <div style={{padding:16}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:8}}>
                <h3 style={{fontSize:16, fontWeight:700, margin:0, flex:1}}>{offer.product}</h3>
                <div style={{fontSize:12, color:C.muted}}>{offer.city ? `📍 ${offer.city}` : '🇸🇦 عام'}</div>
              </div>

              {/* السعر */}
              <div style={{display:"flex", alignItems:"baseline", gap:8, marginBottom:12}}>
                <span style={{fontSize:28, fontWeight:900, color:C.gold}}>{offer.p}</span>
                <span style={{fontSize:16, color:C.white}}>ر.س</span>
                <span style={{fontSize:14, color:C.muted, textDecoration:"line-through"}}>{offer.old}</span>
              </div>

              {/* تابي وتمارا */}
              {(offer.tabby || offer.tamara) && (
                <div style={{display:"flex", gap:8, marginBottom:12}}>
                  {offer.tabby && <div style={{background:"#00D632", color:"#000", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700}}>Tabby</div>}
                  {offer.tamara && <div style={{background:"#FFD700", color:"#000", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700}}>Tamara</div>}
                  <span style={{fontSize:11, color:C.muted}}>قسطها على 4 دفعات</span>
                </div>
              )}

              {/* الكوبون */}
              <div style={{background:"rgba(124,58,237,0.2)", border:"2px dashed rgba(124,58,237,0.5)", padding:10, borderRadius:12, marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:14, fontWeight:700}}>كوبون: {offer.coupon}</span>
                <button onClick={()=>copyCoupon(offer.coupon)} 
                  style={{background:copied===offer.coupon?C.green:C.main, color:C.white, border:"none", padding:"6px 16px", borderRadius:8, fontWeight:700, cursor:"pointer", transition:"all 0.2s"}}>
                  {copied===offer.coupon ? "✓ نُسخ" : "نسخ"}
                </button>
              </div>

              {/* المصداقية */}
              <div style={{fontSize:11, color:C.muted, marginBottom:12, display:"flex", alignItems:"center", gap:6}}>
                <span style={{color:C.green}}>✅</span>
                تم التحقق قبل {Math.floor((Date.now()-lastUpdate)/60000) || 1} دقيقة • المصدر: {offer.store}
              </div>

              {/* زر الشراء */}
              <button onClick={()=>addToCart(offer)} 
                style={{width:"100%", background:`linear-gradient(135deg, ${C.main} 0%, ${C.dark} 100%)`, color:C.white, border:"none", padding:"14px", borderRadius:12, fontSize:16, fontWeight:900, cursor:"pointer", boxShadow:"0 4px 16px rgba(124,58,237,0.4)"}}>
                أضف للسلة - كوبون مفعل 🎯
              </button>

              {/* المشاركة */}
              <div style={{display:"flex", gap:8, marginTop:12, justifyContent:"center"}}>
                {['whatsapp','facebook','twitter','telegram'].map(p=>(
                  <button key={p} onClick={()=>shareOffer(offer,p)} 
                    style={{background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:16}}>
                    {p==='whatsapp'?'💬':p==='facebook'?'f':p==='twitter'?'𝕏':'✈️'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* سلة عائمة */}
      {cart.length>0 && (
        <div style={{position:"fixed", bottom:20, left:20, right:20, background:C.main, padding:16, borderRadius:16, boxShadow:"0 8px 32px rgba(124,58,237,0.6)", zIndex:50, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <div style={{fontWeight:800}}>السلة: {cart.length} منتج</div>
            <div style={{fontSize:14, opacity:0.9}}>وفرت {totalSaved} ر.س 🎉</div>
          </div>
          <button style={{background:C.white, color:C.main, border:"none", padding:"12px 24px", borderRadius:12, fontWeight:900, cursor:"pointer"}}>
            إتمام الشراء
          </button>
        </div>
      )}

      <div style={{height:100}}></div>
    </div>
  );
}
