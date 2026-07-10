"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [saved, setSaved] = useState(1240);
  const lightPurple = "#8b5cf6"; // كان #7c3aed - الآن أفتح
  const lighterPurple = "#a78bfa";
  const jeddahPos: [number, number] = [21.5433, 39.1728];

  useEffect(() => {
    const s = localStorage.getItem("hkeem_saved");
    if(s) setSaved(parseInt(s));
  }, []);

  return (
    <div dir="rtl" style={{fontFamily:'system-ui', background:'#faf8ff', minHeight:'100vh'}}>
      {/* TOP BAR - أفتح */}
      <div style={{background:lightPurple, color:'white', padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:50}}>
        <div style={{display:'flex', gap:'16px', alignItems:'center', fontWeight:'800'}}>
          <span style={{fontSize:'18px'}}>متجر حكيم 👑</span>
          <span style={{background:'rgba(255,255,255,0.25)', padding:'4px 10px', borderRadius:'20px', fontSize:'12px'}}>جدة 📍</span>
        </div>
        <div style={{display:'flex', gap:'12px', fontSize:'13px'}}>
          <a href="#offers" style={{color:'white', textDecoration:'none', background:'rgba(255,255,255,0.2)', padding:'6px 12px', borderRadius:'20px'}}>وفر أكثر</a>
          <a href="#assistant" style={{color:lightPurple, textDecoration:'none', background:'white', padding:'6px 12px', borderRadius:'20px', fontWeight:'800'}}>المساعد وفر</a>
        </div>
      </div>

      {/* BANNER - تدرج أفتح */}
      <div style={{background:`linear-gradient(135deg,${lightPurple},${lighterPurple})`, color:'white', padding:'26px 16px', textAlign:'center'}}>
        <h1 style={{fontSize:'26px', fontWeight:'900', margin:0}}>توصيل مجاني اليوم داخل جدة 🚚</h1>
        <p style={{margin:'8px 0 0', opacity:0.95}}>أصلي 100% + دفع عند الاستلام + وفر حتى 55%</p>
        <div style={{marginTop:'14px', display:'inline-block', background:'white', color:lightPurple, padding:'8px 18px', borderRadius:'30px', fontWeight:'800', fontSize:'14px', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>وفرت لعملائنا: {saved.toLocaleString('ar-SA')} ر.س</div>
      </div>

      {/* OFFERS */}
      <div id="offers" style={{padding:'20px 16px', maxWidth:'1000px', margin:'0 auto'}}>
        <h2 style={{fontSize:'20px', fontWeight:'800', marginBottom:'12px'}}>عروض اليوم في جدة</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'12px'}}>
          {[
            {n:'ساعة فاخرة + محفظة', p:299, old:520, img:'⌚'},
            {n:'عطر مسك جدة', p:149, old:280, img:'🌸'},
            {n:'باقة هدية VIP', p:399, old:750, img:'🎁'},
            {n:'نظارة كلاسيك', p:129, old:250, img:'🕶️'},
          ].map((it,i)=>(
            <div key={i} style={{background:'white', borderRadius:'18px', padding:'14px', border:'1px solid #f0eaff', textAlign:'center'}}>
              <div style={{fontSize:'36px'}}>{it.img}</div>
              <div style={{fontWeight:'700', marginTop:'8px', fontSize:'14px'}}>{it.n}</div>
              <div style={{marginTop:'6px'}}><span style={{fontWeight:'900', color:lightPurple}}>{it.p} ر.س</span> <span style={{textDecoration:'line-through', color:'#999', fontSize:'12px'}}>{it.old}</span></div>
              <div style={{marginTop:'6px', fontSize:'11px', background:'#f5f3ff', color:lightPurple, padding:'4px 8px', borderRadius:'10px', display:'inline-block', fontWeight:'700'}}>وفر {it.old-it.p} ر.س</div>
              <button style={{marginTop:'10px', width:'100%', background:lightPurple, color:'white', border:0, padding:'9px', borderRadius:'12px', fontWeight:'800'}}>أضف للسلة</button>
            </div>
          ))}
        </div>
      </div>

      {/* MAP JEDDAH */}
      <div style={{padding:'0 16px 20px', maxWidth:'1000px', margin:'0 auto'}}>
        <div style={{background:'white', borderRadius:'18px', padding:'12px', border:'1px solid #f0eaff'}}>
          <h3 style={{fontWeight:'800', margin:'0 0 10px'}}>فروعنا وتوصيل جدة</h3>
          <div style={{background:'#f5f3ff', borderRadius:'12px', height:'200px', display:'flex', alignItems:'center', justifyContent:'center', color:lightPurple, fontWeight:'700'}}>
            📍 جدة - توصيل خلال ساعات {jeddahPos[0].toFixed(2)}, {jeddahPos[1].toFixed(2)}
          </div>
          <p style={{fontSize:'12px', color:'#666', marginTop:'8px'}}>نغطي: الحمراء، الروضة، السلامة، جدة مول، البحر، وجميع أحياء جدة.</p>
        </div>
      </div>

      {/* ASSISTANT */}
      <div id="assistant" style={{padding:'0 16px 30px', maxWidth:'1000px', margin:'0 auto'}}>
        <div style={{background:'#1a1a1a', color:'white', borderRadius:'20px', padding:'18px'}}>
          <h3 style={{margin:0, fontWeight:'900'}}>المساعد الاقتصادي وفر 🤖</h3>
          <p style={{fontSize:'13px', opacity:0.8, marginTop:'6px'}}>اسألني: وش أفضل هدية بـ 300؟</p>
          <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
            <input placeholder="اكتب سؤالك..." style={{flex:1, padding:'10px 14px', borderRadius:'20px', border:0}}/>
            <button style={{background:lightPurple, color:'white', border:0, padding:'10px 16px', borderRadius:'20px', fontWeight:'800'}}>أرسل</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{background:'white', borderTop:'1px solid #f0eaff', padding:'20px 16px', textAlign:'center', fontSize:'12px', color:'#666'}}>
        <div style={{display:'flex', justifyContent:'center', gap:'16px', marginBottom:'10px', fontWeight:'700'}}>
          <a href="/privacy" style={{color:lightPurple, textDecoration:'none'}}>الخصوصية</a>
          <a href="/terms" style={{color:lightPurple, textDecoration:'none'}}>الشروط والأحكام</a>
        </div>
        <div>متجر حكيم - جدة © 2026</div>
      </div>
    </div>
  )
}
