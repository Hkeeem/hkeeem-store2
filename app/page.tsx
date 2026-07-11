"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const C = { main:"#8b5cf6", light:"#a78bfa", bg:"#faf8ff", dark:"#0b0b14", card:"#fff", border:"#f0eaff", gold:"#f59e0b", green:"#10b981", red:"#ef4444", yellow:"#facc15" };

type Offer = { id:string; store:string; name:string; p:number; old:number; coupon:string; img:string; badge:string; cat:string; };
const offersData: Offer[] = [
  {id:"o1", store:"نون", name:"ساعة فاخرة + محفظة جلد أصلي", p:299, old:520, coupon:"ALHKMY55", img:"https://images.unsplash.com/photo-1524805444973-bf35e3d893aa?w=500&h=500&fit=crop", badge:"الأكثر مبيعاً", cat:"موضة"},
  {id:"o2", store:"جرير", name:"حامل جوال مغناطيسي للسيارة", p:45, old:90, coupon:"JARIR50", img:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop", badge:"وفر 50%", cat:"تقنية"},
  {id:"o3", store:"أمازون", name:"عطر مسك جدة 100مل - فاخر", p:149, old:280, coupon:"AMZ15", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&h=500&fit=crop", badge:"عطر فاخر", cat:"عطور"},
  {id:"o4", store:"إكسترا", name:"باقة هدية VIP + تغليف مجاني", p:399, old:750, coupon:"EXTRA20", img:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop", badge:"هدية جاهزة", cat:"هدايا"},
  {id:"o5", store:"نون", name:"نظارة شمسية كلاسيك UV", p:129, old:250, coupon:"NOON30", img:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop", badge:"موضة 2026", cat:"موضة"},
  {id:"o6", store:"أمازون", name:"سماعة بلوتوث ANC عزل", p:199, old:399, coupon:"AMZ20", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop", badge:"عزل ضوضاء", cat:"تقنية"},
  {id:"o7", store:"جرير", name:"كيبورد ميكانيكي RGB", p:249, old:450, coupon:"JARIR25", img:"https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=500&h=500&fit=crop", badge:"للجيمرز", cat:"تقنية"},
  {id:"o8", store:"أمازون", name:"مبخرة كهربائية + بخور", p:119, old:220, coupon:"BAKHOOR", img:"https://images.unsplash.com/photo-1608571423902-eed4a94d8108?w=500&h=500&fit=crop", badge:"الأكثر طلباً", cat:"منزل"},
];

type Estate = { id:string; title:string; loc:string; area:string; price:string; type:"بيع"|"إيجار"; tag:string; img:string; };
const estates: Estate[] = [
  {id:"e1", title:"شقة 4 غرف - جدة الحمراء", loc:"جدة - الحمراء", area:"180م²", price:"850,000 ر.س", type:"بيع", tag:"مرخص فال ✅", img:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"},
  {id:"e2", title:"فيلا مودرن - المخواة", loc:"المخواة - الباحة", area:"350م²", price:"1,250,000 ر.س", type:"بيع", tag:"عرض حصري", img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"},
  {id:"e3", title:"أرض سكنية - مخطط معتمد", loc:"الباحة - المخواة", area:"600م²", price:"420,000 ر.س", type:"بيع", tag:"صك إلكتروني", img:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"},
  {id:"e4", title:"محل تجاري للإيجار", loc:"جدة - الروضة", area:"90م²", price:"45,000 ر.س/سنة", type:"إيجار", tag:"موقع مميز", img:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"},
];

type Msg = { role:"user"|"bot"; text:string; offers?:Offer[] };

export default function Home(){
  const [saved,setSaved]=useState(1240);
  const [selected,setSelected]=useState("الكل");
  const [search,setSearch]=useState("");
  const [cart,setCart]=useState<Offer[]>([]);
  const [toast,setToast]=useState<string|null>(null);
  const [copied,setCopied]=useState<string|null>(null);
  const [query,setQuery]=useState("");
  const [showRealEstate,setShowRealEstate]=useState(true);
  const [msgs,setMsgs]=useState<Msg[]>([{role:"bot", text:"هلا يا محسن! أنا وفر - المساعد الاقتصادي الذكي 🤖💰\n\nأنا أجمع لك 3 خدمات في مكان واحد:\n• عروضكم: أوفر لك حتى 55%\n• الوسيط العقاري: عقارات مرخصة فال\n• متجر حكيم: منتجات أصلية\n\nقل لي: 'عندي 200 ريال' أو 'أبغى شقة بجدة' وأنا أختار لك!"}]);
  const chatRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{ const s=localStorage.getItem("hkeem_saved"); if(s) setSaved(parseInt(s)); },[]);
  useEffect(()=>{ chatRef.current?.scrollTo({top:chatRef.current.scrollHeight, behavior:'smooth'}) },[msgs]);

  const cats=["الكل","موضة","تقنية","عطور","هدايا","منزل"];
  const filtered=useMemo(()=>offersData.filter(o=> (selected==="الكل"||o.cat===selected) && (search===""||o.name.includes(search)||o.store.includes(search))),[selected,search]);

  const showToast=(m:string)=>{ setToast(m); setTimeout(()=>setToast(null),2200); };
  const copyCoupon=(c:string)=>{ navigator.clipboard?.writeText(c); setCopied(c); showToast(`تم نسخ الكوبون ${c} ✅`); setTimeout(()=>setCopied(null),1800); };
  const addCart=(o:Offer)=>{ setCart(v=>[...v,o]); const ns=saved+(o.old-o.p); setSaved(ns); localStorage.setItem("hkeem_saved",ns.toString()); showToast(`أضيف ${o.name} 🛒 وفرت ${o.old-o.p} ر.س`); };
  const shareOffice=()=>{ navigator.clipboard?.writeText("https://alhkmy.store"); showToast("تم نسخ رابط المكتب 📋 - متجر حكيم + عروضكم + الوسيط العقاري"); };

  const smart=(q:string)=>{
    const nums=q.match(/\d+/g)?.map(n=>parseInt(n))||[]; const budget=nums.length?Math.max(...nums):0;
    if(q.includes("شقة")||q.includes("فيلا")||q.includes("أرض")||q.includes("محل")||q.includes("عقار")){
      const topE = estates.filter(e=> budget? parseInt(e.price.replace(/[^0-9]/g,""))<=budget*1000+200000 : true).slice(0,2);
      return {text: `🏠 الوسيط العقاري - مرخص فال:\nلقيت لك ${topE.length} عقارات تناسب "${q}"\nمحسن الحكمي - وسيط معتمد\nتواصل: 0565604856`, offers:[], estates:topE};
    }
    let pool=[...offersData]; 
    if(q.includes("عطر")) pool=pool.filter(o=>o.cat==="عطور");
    else if(q.includes("ساعة")||q.includes("نظارة")) pool=pool.filter(o=>o.cat==="موضة");
    else if(q.includes("تقنية")||q.includes("سماعة")||q.includes("كيبورد")||q.includes("جوال")) pool=pool.filter(o=>o.cat==="تقنية");
    if(budget) pool=pool.filter(o=>o.p<=budget);
    pool.sort((a,b)=>(b.old-b.p)-(a.old-a.p)); const top=pool.slice(0,3);
    return {text: budget? `💰 ميزانيتك ${budget} ر.س - عروضكم توفر لك ${top.reduce((s,o)=>s+(o.old-o.p),0)} ر.س 🔥` : `🔥 عروضكم - اخترت لك أفضل ${top.length} عروض`, offers:top, estates:[]};
  };

  const send=()=>{
    if(!query.trim()) return;
    const {text, offers, estates:est} = smart(query) as any;
    setMsgs(m=>[...m, {role:"user", text:query}, {role:"bot", text, offers, estates:est}]);
    setQuery("");
  };

  return (
    <div dir="rtl" style={{fontFamily:'system-ui', background:C.bg, minHeight:'100vh'}}>
      {/* HEADER مثل صورتك */}
      <div style={{background:"#0b0b14", color:'#fff', padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:50, borderBottom:'1px solid #1f1f2f'}}>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          <span style={{fontWeight:900, fontSize:'18px'}}>👑 حكيم</span>
          <span style={{background:'#f59e0b', color:'#000', padding:'3px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:800}}>فال مرخص</span>
          <span style={{background:'#fff', color:'#000', padding:'5px 10px', borderRadius:'16px', fontSize:'12px', fontWeight:700}}>دخول</span>
        </div>
        <div style={{display:'flex', gap:'6px'}}>
          <a href="#realestate" style={{background:'#0ea5e9', color:'#fff', padding:'6px 10px', borderRadius:'16px', fontSize:'12px', fontWeight:800, textDecoration:'none'}}>🔗 ديل DealApp</a>
          <a href="#realestate" style={{background:'#10b981', color:'#fff', padding:'6px 10px', borderRadius:'16px', fontSize:'12px', fontWeight:800, textDecoration:'none'}}>🏠 عقار</a>
          <a href="#offers" style={{background:'#1f1f2f', color:'#fff', padding:'6px 10px', borderRadius:'16px', fontSize:'12px', textDecoration:'none', border:'1px solid #333'}}>عروض</a>
        </div>
      </div>

      {/* زر مشاركة رابط المكتب - أصفر مثل صورتك */}
      <div style={{padding:'12px', background:'#0b0b14'}}>
        <button onClick={shareOffice} style={{width:'100%', background:`linear-gradient(90deg,${C.yellow},#eab308)`, color:'#000', border:0, padding:'14px', borderRadius:'14px', fontWeight:900, fontSize:'15px', boxShadow:'0 4px 12px rgba(250,204,21,0.3)'}}>📤 مشاركة رابط المكتب</button>
      </div>

      {/* مربع مكتبي - 4 أقسام في أيقونات مربعة */}
      <div style={{padding:'0 12px 12px', background:'#0b0b14'}}>
        <div style={{background:'#11111f', border:'1px solid #1f1f2f', borderRadius:'20px', padding:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
            <h3 style={{margin:0, color:'#fff', fontWeight:900, fontSize:'14px'}}>🖥️ مكتبي - 4 خدمات في مكان واحد</h3>
            <span style={{color:'#10b981', fontSize:'11px', background:'#102a1f', padding:'3px 8px', borderRadius:'10px'}}>متصل ✅</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px'}}>
            {/* أيقونة 1: مكتبي العقاري - مربعة */}
            <button onClick={()=>{setShowRealEstate(true); document.getElementById('realestate')?.scrollIntoView({behavior:'smooth'})}} style={{aspectRatio:'1', background:`linear-gradient(135deg,#10b981,#059669)`, borderRadius:'16px', border:0, padding:'8px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', position:'relative'}}>
              <span style={{fontSize:'26px'}}>🏠</span><span style={{color:'#fff', fontWeight:900, fontSize:'11px', lineHeight:1.1}}>مكتبي<br/>العقاري</span><span style={{position:'absolute', top:'6px', right:'6px', background:'#fff', color:'#059669', fontSize:'9px', fontWeight:900, padding:'2px 5px', borderRadius:'6px'}}>فال</span>
            </button>
            {/* أيقونة 2: عروضكم */}
            <a href="#offers" style={{aspectRatio:'1', background:`linear-gradient(135deg,${C.main},#6d28d9)`, borderRadius:'16px', padding:'8px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', textDecoration:'none'}}>
              <span style={{fontSize:'26px'}}>🔥</span><span style={{color:'#fff', fontWeight:900, fontSize:'11px'}}>عروضكم</span><span style={{color:'rgba(255,255,255,0.8)', fontSize:'9px'}}>حتى 55%</span>
            </a>
            {/* أيقونة 3: المساعد وفر */}
            <a href="#assistant" style={{aspectRatio:'1', background:`linear-gradient(135deg,#1f1f2f,#2a2a3a)`, borderRadius:'16px', padding:'8px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', textDecoration:'none', border:'1px solid #333'}}>
              <span style={{fontSize:'24px'}}>🤖</span><span style={{color:'#fff', fontWeight:900, fontSize:'10px'}}>المساعد</span><span style={{color:C.yellow, fontSize:'10px', fontWeight:800}}>وفر</span>
            </a>
            {/* أيقونة 4: متجر حكيم */}
            <a href="#offers" style={{aspectRatio:'1', background:`linear-gradient(135deg,#f59e0b,#d97706)`, borderRadius:'16px', padding:'8px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', textDecoration:'none'}}>
              <span style={{fontSize:'26px'}}>👑</span><span style={{color:'#fff', fontWeight:900, fontSize:'11px'}}>متجر حكيم</span><span style={{color:'#fff', fontSize:'9px', opacity:.9}}>أصلي 100%</span>
            </a>
          </div>
          <div style={{marginTop:'10px', background:'#0b0b14', borderRadius:'12px', padding:'8px 10px', display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#aaa'}}>
            <span>💰 وفرت: {saved.toLocaleString('ar-SA')} ر.س</span><span>•</span><span>🛒 السلة: {cart.length}</span><span>•</span><span>🏠 4 عقارات</span>
          </div>
        </div>
      </div>

      {/* عروضكم - القسم الأول */}
      <div id="offers" style={{padding:'16px 12px', maxWidth:'1100px', margin:'0 auto'}}>
        <div style={{background:`linear-gradient(135deg,${C.main},${C.light})`, borderRadius:'18px', padding:'16px', color:'#fff', textAlign:'center', marginBottom:'14px'}}>
          <h2 style={{margin:0, fontWeight:900, fontSize:'20px'}}>عروضكم 🔥 - متجر حكيم</h2><p style={{margin:'6px 0 0', fontSize:'13px', opacity:.9}}>12 عرض حصري + كوبونات + شحن مجاني داخل جدة</p>
        </div>
        <div style={{display:'flex', gap:'8px', marginBottom:'12px', overflowX:'auto'}}>
          {cats.map(c=><button key={c} onClick={()=>setSelected(c)} style={{whiteSpace:'nowrap', padding:'7px 14px', borderRadius:'20px', border:selected===c?`2px solid ${C.main}`:`1px solid ${C.border}`, background:selected===c?C.main:'#fff', color:selected===c?'#fff':'#333', fontWeight:800, fontSize:'12px'}}>{c}</button>)}
          <div style={{flex:1, position:'relative', minWidth:'140px'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ابحث عروضكم..." style={{width:'100%', padding:'7px 28px 7px 10px', borderRadius:'20px', border:`1px solid ${C.border}`}}/><span style={{position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', fontSize:'12px'}}>🔍</span></div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:'10px'}}>
          {filtered.map(o=>{
            const disc=Math.round((o.old-o.p)/o.old*100);
            return <div key={o.id} style={{background:'#fff', borderRadius:'16px', overflow:'hidden', border:`1px solid ${C.border}`}}>
              <div style={{position:'relative'}}><img src={o.img} style={{width:'100%', aspectRatio:'1', objectFit:'cover'}}/><span style={{position:'absolute', top:'6px', right:'6px', background:C.red, color:'#fff', padding:'2px 6px', borderRadius:'8px', fontSize:'10px', fontWeight:900}}>-{disc}%</span><span style={{position:'absolute', bottom:'6px', right:'6px', background:'rgba(0,0,0,0.7)', color:'#fff', padding:'2px 6px', borderRadius:'6px', fontSize:'9px'}}>{o.store}</span></div>
              <div style={{padding:'9px'}}><div style={{fontWeight:800, fontSize:'12px', height:'32px', overflow:'hidden'}}>{o.name}</div><div style={{marginTop:'4px'}}><b style={{color:C.main}}>{o.p} ر.س</b> <s style={{color:'#999', fontSize:'10px'}}>{o.old}</s></div>
              <div style={{marginTop:'6px', background:'#f5f3ff', border:`1px dashed ${C.light}`, borderRadius:'8px', padding:'4px 6px', display:'flex', justifyContent:'space-between'}}><span style={{fontSize:'10px', fontWeight:800}}>{o.coupon}</span><button onClick={()=>copyCoupon(o.coupon)} style={{background:copied===o.coupon?C.green:C.main, color:'#fff', border:0, padding:'2px 7px', borderRadius:'6px', fontSize:'10px'}}>{copied===o.coupon?'✅':'نسخ'}</button></div>
              <button onClick={()=>addCart(o)} style={{marginTop:'6px', width:'100%', background:C.main, color:'#fff', border:0, padding:'8px', borderRadius:'8px', fontWeight:900, fontSize:'11px'}}>أضف للسلة 🛒</button></div>
            </div>
          })}
        </div>
      </div>

      {/* المساعد الاقتصادي وفر - القسم الثاني */}
      <div id="assistant" style={{padding:'0 12px 16px', maxWidth:'1000px', margin:'0 auto'}}>
        <div style={{background:'#111', borderRadius:'20px', overflow:'hidden', border:'1px solid #222'}}>
          <div style={{padding:'12px 14px', background:`linear-gradient(90deg,${C.main},#4f46e5)`, display:'flex', justifyContent:'space-between'}}><div><div style={{color:'#fff', fontWeight:900}}>المساعد الاقتصادي الذكي وفر 🤖💰</div><div style={{color:'rgba(255,255,255,0.8)', fontSize:'11px', marginTop:'2px'}}>يجمع: عروضكم + الوسيط العقاري + متجر حكيم</div></div><span style={{background:'rgba(255,255,255,0.2)', color:'#fff', padding:'4px 8px', borderRadius:'10px', fontSize:'10px', height:'fit-content'}}>متصل ✅</span></div>
          <div ref={chatRef} style={{height:'280px', overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:'8px', background:'#0f0f10'}}>
            {msgs.map((m,i)=><div key={i} style={{alignSelf:m.role==='user'?'flex-end':'flex-start', maxWidth:'88%'}}><div style={{background:m.role==='user'?C.main:'#1e1e1e', color:'#fff', padding:'9px 11px', borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px', fontSize:'12px', whiteSpace:'pre-wrap'}}>{m.text}</div>
              {m.offers && m.offers.length>0 && <div style={{marginTop:'6px', display:'grid', gap:'6px'}}>{m.offers.map(o=><div key={o.id} style={{background:'#fff', color:'#111', borderRadius:'10px', padding:'6px', display:'flex', gap:'8px', alignItems:'center'}}><img src={o.img} style={{width:'40px', height:'40px', borderRadius:'6px', objectFit:'cover'}}/><div style={{flex:1}}><div style={{fontWeight:800, fontSize:'11px'}}>{o.name}</div><div style={{fontSize:'10px', color:C.main}}>{o.p} ر.س وفر {o.old-o.p}</div></div><button onClick={()=>addCart(o)} style={{background:C.main, color:'#fff', border:0, padding:'5px 8px', borderRadius:'6px', fontSize:'10px'}}>أضف</button></div>)}</div>}
              {(m as any).estates && (m as any).estates.length>0 && <div style={{marginTop:'6px', display:'grid', gap:'6px'}}>{(m as any).estates.map((e: Estate)=><div key={e.id} style={{background:'#fff', color:'#111', borderRadius:'10px', padding:'8px'}}><div style={{fontWeight:800, fontSize:'11px'}}>{e.title}</div><div style={{fontSize:'10px', color:'#666'}}>{e.loc} • {e.area}</div><div style={{fontSize:'11px', color:C.green, fontWeight:900}}>{e.price}</div></div>)}</div>}
            </div>)}
          </div>
          <div style={{padding:'8px', background:'#1a1a1a', display:'flex', gap:'6px', flexWrap:'wrap'}}>{["عندي 150 ريال","أبغى هدية بـ 300","عقار بجدة","أفضل عرض تقنية"].map(q=><button key={q} onClick={()=>{const r=smart(q) as any; setMsgs(m=>[...m,{role:"user",text:q},{role:"bot",text:r.text,offers:r.offers,estates:r.estates}])}} style={{background:'#2a2a2a', color:'#ccc', border:'1px solid #333', padding:'5px 9px', borderRadius:'16px', fontSize:'10px'}}>{q}</button>)}</div>
          <div style={{padding:'10px', display:'flex', gap:'8px', background:'#161616'}}><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="اكتب: عندي 200 أو أبغى شقة..." style={{flex:1, padding:'10px 12px', borderRadius:'10px', border:'1px solid #2a2a2a', background:'#0f0f0f', color:'#fff', fontSize:'12px'}}/><button onClick={send} style={{background:C.main, color:'#fff', border:0, padding:'0 14px', borderRadius:'10px', fontWeight:900, fontSize:'12px'}}>إرسال</button></div>
        </div>
      </div>

      {/* الوسيط العقاري - القسم الثالث - نفس تصميم صورتك */}
      {showRealEstate && <div id="realestate" style={{padding:'0 12px 16px', maxWidth:'1100px', margin:'0 auto'}}>
        <div style={{background:'#11111f', border:'1px solid #1f1f2f', borderRadius:'20px', padding:'14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}><h3 style={{margin:0, color:'#fff', fontWeight:900, fontSize:'15px'}}>🏠 عروضي العقارية المعروضة حالياً - مرخص فال</h3><div style={{display:'flex', gap:'6px'}}><span style={{background:'#10b981', color:'#fff', padding:'4px 8px', borderRadius:'10px', fontSize:'10px', fontWeight:800}}>عرض في ديل 4</span><button onClick={()=>setShowRealEstate(false)} style={{background:'#222', color:'#fff', border:0, padding:'4px 8px', borderRadius:'10px', fontSize:'10px'}}>إخفاء</button></div></div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:'10px'}}>
            {estates.map(es=><div key={es.id} style={{background:'#1a1a2a', borderRadius:'14px', overflow:'hidden', border:'1px solid #222'}}>
              <div style={{position:'relative'}}><img src={es.img} style={{width:'100%', height:'120px', objectFit:'cover'}}/><span style={{position:'absolute', top:'6px', right:'6px', background:'rgba(0,0,0,0.7)', color:'#fff', padding:'2px 6px', borderRadius:'6px', fontSize:'9px'}}>{es.tag}</span><span style={{position:'absolute', top:'6px', left:'6px', background:es.type==="بيع"?C.red:C.main, color:'#fff', padding:'2px 6px', borderRadius:'6px', fontSize:'9px', fontWeight:900}}>{es.type}</span></div>
              <div style={{padding:'9px'}}><div style={{color:'#fff', fontWeight:800, fontSize:'12px'}}>{es.title}</div><div style={{color:'#999', fontSize:'10px', marginTop:'2px'}}>📍 {es.loc} • {es.area}</div><div style={{color:C.gold, fontWeight:900, fontSize:'13px', marginTop:'6px'}}>{es.price}</div><div style={{display:'flex', gap:'6px', marginTop:'8px'}}><a href="https://wa.me/966565604856" style={{flex:1, background:'#10b981', color:'#fff', textAlign:'center', padding:'6px', borderRadius:'8px', fontSize:'10px', fontWeight:800, textDecoration:'none'}}>واتساب</a><a href="https://alhkmy.store" style={{flex:1, background:'#0ea5e9', color:'#fff', textAlign:'center', padding:'6px', borderRadius:'8px', fontSize:'10px', fontWeight:800, textDecoration:'none'}}>عرض في ديل</a></div></div>
            </div>)}
          </div>
          <a href="https://alhkmy.store" style={{display:'block', marginTop:'12px', background:'#fff', color:'#000', textAlign:'center', padding:'10px', borderRadius:'12px', fontWeight:900, fontSize:'12px', textDecoration:'none'}}>🏠 شاهد كل ما أعرضه حالياً في DealApp</a>
          <div style={{textAlign:'center', color:'#666', fontSize:'10px', marginTop:'8px'}}>جميع العروض موثقة برخصة فال • للشكاوى: Alhkmy11@gmail.com</div>
        </div>
      </div>}

      {!showRealEstate && <div style={{textAlign:'center', paddingBottom:'12px'}}><button onClick={()=>setShowRealEstate(true)} style={{background:'#10b981', color:'#fff', border:0, padding:'8px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:800}}>إظهار مكتبي العقاري 🏠 4 عروض</button></div>}

      {/* FOOTER */}
      <div style={{background:'#0b0b14', borderTop:'1px solid #1f1f2f', padding:'18px 12px', textAlign:'center'}}>
        <div style={{color:'#fff', fontWeight:900, fontSize:'13px'}}>متجر حكيم 👑 - عروضكم - المساعد وفر - الوسيط العقاري</div>
        <div style={{color:'#999', fontSize:'11px', marginTop:'6px'}}>محسن الحكمي - وسيط عقاري مرخص فال - مؤسسة محسن - جدة</div>
        <div style={{marginTop:'10px', display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap'}}><a href="mailto:Alhkmy11@gmail.com" style={{color:C.gold, fontSize:'11px', textDecoration:'none'}}>Alhkmy11@gmail.com ✉️</a><a href="https://wa.me/966565604856" style={{color:C.green, fontSize:'11px', textDecoration:'none', fontWeight:800}}>+966115201661 واتساب 💬</a></div>
        <div style={{color:'#555', fontSize:'10px', marginTop:'10px'}}>© 2026 محسن الحكمي - ديل DealApp • عروضكم</div>
      </div>

      {toast && <div style={{position:'fixed', bottom:'16px', left:'50%', transform:'translateX(-50%)', background:'#111', color:'#fff', padding:'9px 16px', borderRadius:'20px', fontSize:'11px', fontWeight:800, zIndex:999}}>{toast}</div>}
    </div>
  )
}
