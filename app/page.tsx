"use client"
import { useState, useEffect } from "react"

const OFFERS = [
  { id:1, store:"نون", title:"عطور فاخرة - خصم حتى 75% + كوبون", price:149, old:599, disc:75, coupon:"ALHKMY75", ship:"توصيل نون السريع", img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600" },
  { id:2, store:"أمازون", title:"سماعة Anker عزل كامل - صفقة اليوم", price:199, old:399, disc:50, coupon:"AMZ50", ship:"توصيل أمازون", img:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600" },
  { id:3, store:"جرير", title:"جوال سامسونج ضمان سنتين جرير", price:2199, old:2999, disc:26, coupon:"JARIR100", ship:"ضمان وتوصيل جرير", img:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600" },
  { id:4, store:"إكسترا", title:"ثلاجة LG تقسيط بدون فوائد", price:2899, old:4299, disc:32, coupon:"EXTRA20", ship:"تركيب منزلي", img:"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600" },
  { id:5, store:"كارفور", title:"سلة مقاضي الشهر توفير كبير", price:89, old:149, disc:40, coupon:"CAR40", ship:"توصيل كارفور", img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=600" },
]

const HARAJ = [
  { t:"سييرا 2026 حرق 169 ألف", pr:"169,000 ر.س", city:"الرياض" },
  { t:"اكسنت 2026 سمارت يا بلاش", pr:"59,900 ر.س", city:"الرياض" },
  { t:"النترا 2026 فل كامل", pr:"78,500 ر.س", city:"الرياض" },
  { t:"فيلا بمسبح طيبة الرحيلي", pr:"1,750,000 ر.س", city:"جدة" },
  { t:"مرسيدس C200 2026", pr:"105,999 ر.س", city:"الرياض" },
  { t:"تظليل 3M -45%", pr:"1,722 ر.س", city:"جدة" },
]

export default function Page(){
  const [cat,setCat]=useState("الكل")
  const [city,setCity]=useState("الكل")
  const [showHaraj,setShowHaraj]=useState(false)
  const [showLogin,setShowLogin]=useState(false)
  const [showPrivacy,setShowPrivacy]=useState(false)
  const [showTerms,setShowTerms]=useState(false)
  const [loginTab,setLoginTab]=useState<"phone"|"email">("phone")
  const [phone,setPhone]=useState("")
  const [email,setEmail]=useState("")
  const [otpSent,setOtpSent]=useState(false)
  const [isLogged,setIsLogged]=useState(false)
  const [cart,setCart]=useState(0)
  const [toast,setToast]=useState("")
  const [saved,setSaved]=useState(1240)

  useEffect(()=>{ const i=setInterval(()=>setSaved(s=>s+Math.floor(Math.random()*2)),7000); return()=>clearInterval(i)},[])
  const filtered = cat==="الكل"? OFFERS : OFFERS.filter(o=>o.store===cat)
  const harajF = city==="الكل"? HARAJ : HARAJ.filter(h=>h.city===city)
  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2200) }

  return (
  <div dir="rtl" className="min-h-screen bg-[#070A18] text-white">
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700;800&display=swap');*{font-family:Tajawal,system-ui}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

    <header className="sticky top-0 z-30 bg-[#070A18]/90 backdrop-blur-xl border-b border-[#161D36] h-[60px] flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <div className="font-black text-[16px]">حكيم<span className="text-violet-400">.</span></div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold">فال مرخص</span>
        {isLogged && <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">تم الدخول</span>}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={()=>setShowHaraj(true)} className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-amber-200 to-amber-600 flex flex-col items-center justify-center relative">
          <span className="absolute -top-1 -right-1 bg-black text-amber-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-400">{harajF.length}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h3l2-3h6l2 3h3a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>
          <span className="text-[7px] font-black text-black">الحراج</span>
        </button>
        <button onClick={()=>setShowLogin(true)} className="h-10 px-4 rounded-full bg-[#12182F] border border-[#1B2547] text-[12px] font-bold">{isLogged?"حسابي":"دخول"}</button>
      </div>
    </header>

    <div className="m-3 rounded-[22px] bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#0f172a] border border-[#2a235a] p-5">
      <h1 className="text-[17px] font-black leading-7">متجر حكيم - عروضكم<br/><span className="text-amber-200">أقوى عروض اليوم في مكان واحد!</span></h1>
      <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5">تصميم ملكي بنفسجي AI</div>
        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5">يجلب العروض كل ساعة</div>
        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5">كوبونات جاهزة بنقرة</div>
        <div className="bg-white/10 border border-white/10 rounded-xl p-2.5">التوصيل حسب سياسة المتجر</div>
      </div>
      <div className="mt-3 inline-flex bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 rounded-full px-3 py-1.5 text-[11px] font-bold">وفرت حتى الآن: {saved.toLocaleString()} ر.س</div>
    </div>

    <div className="px-3 flex gap-2 overflow-auto no-scrollbar pb-1">
      {["الكل","نون","أمازون","جرير","إكسترا","كارفور"].map(s=>(
        <button key={s} onClick={()=>setCat(s)} className={`h-9 px-4 rounded-full text-[12px] font-bold whitespace-nowrap border ${cat===s?"bg-violet-600 border-violet-600 text-white":"bg-[#12182F] border-[#1B2547] text-slate-400"}`}>{s}</button>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2.5 p-3">
      {filtered.map(o=>(
        <div key={o.id} className="bg-[#12182F] border border-[#1B2547] rounded-[18px] overflow-hidden flex flex-col">
          <div className="relative h-[132px] bg-white"><img src={o.img} className="w-full h-full object-cover"/><span className="absolute top-2 left-2 bg-emerald-500 text-white text-[11px] font-black px-2 py-1 rounded-full">-{o.disc}%</span></div>
          <div className="p-2.5 flex flex-col flex-1">
            <div className="text-[12px] font-bold h-[36px] leading-5 overflow-hidden">{o.title}</div>
            <div className="text-[11px] text-slate-400 mt-1">{o.ship}</div>
            <div className="flex gap-2 items-baseline mt-1"><b>{o.price} ر.س</b><s className="text-[11px] text-slate-500 line-through">{o.old}</s></div>
            <div className="mt-2 flex gap-1.5"><div className="flex-1 h-8 bg-[#0A1024] border border-dashed border-[#2A3655] rounded-xl flex items-center justify-center text-[11px] font-mono text-violet-300">{o.coupon}</div><button onClick={()=>{navigator.clipboard.writeText(o.coupon); show("نسخ "+o.coupon)}} className="w-14 h-8 bg-white text-violet-900 rounded-xl text-[11px] font-black">نسخ</button></div>
            <button onClick={()=>{setCart(c=>c+1); show("أضيف للسلة")}} className="mt-2 w-full h-9 bg-violet-600 rounded-xl text-[12px] font-bold">احصل على العرض</button>
          </div>
        </div>
      ))}
    </div>

    <div className="m-3 rounded-[20px] bg-[#10162F] border border-[#1E2A5A] p-4">
      <div className="font-extrabold text-[13px] flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </span>
        مكتبي العقاري - وسيط عقاري مرخص فال
      </div>
      <p className="text-[13px] leading-7 mt-3 text-slate-200">يسعدني استقبال طلباتكم وعروضكم عبر رابط مكتبي العقاري، وسنقوم بخدمتكم في أقرب فرصة</p>
      <p className="font-black text-amber-200 mt-1">(محسن الحكمي)</p>
      <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="mt-3 block bg-[#0A1024] border border-[#1B2547] rounded-xl p-3 text-[11px] text-sky-300 break-all text-center">https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile</a>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <a href="https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4?utm_source=visit_my_profile" target="_blank" className="h-11 bg-white text-slate-900 rounded-full flex items-center justify-center font-bold text-[12px]">فتح الملف في ديل</a>
        <a href="https://wa.me/966500000000" className="h-11 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-[12px]">واتساب</a>
      </div>
    </div>

    <footer className="mt-8 border-t border-[#161D36] pt-6 pb-24 px-4 text-center">
      <div className="flex flex-wrap gap-3 justify-center text-[11px] text-slate-400">
        <button onClick={()=>setShowPrivacy(true)} className="underline decoration-dotted">سياسة الخصوصية</button>
        <span>•</span>
        <button onClick={()=>setShowTerms(true)} className="underline decoration-dotted">الشروط والأحكام</button>
        <span>•</span>
        <button onClick={()=>setShowLogin(true)}>تواصل</button>
      </div>
      <div className="text-[10px] text-[#2A3655] mt-4">جميع الأسعار حسب المتجر • التوصيل حسب سياسة كل متجر • Alhkmy11@gmail.com</div>
    </footer>

    {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-full text-[12px] z-[80]">{toast}</div>}

    {/* Haraj */}
    {showHaraj && <><div onClick={()=>setShowHaraj(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"/><div className="fixed bottom-0 inset-x-0 z-50 bg-[#12182F] border-t border-[#1B2547] rounded-t-[20px] max-h-[82vh] flex flex-col"><div className="w-9 h-1 bg-[#2A3655] rounded-full mx-auto mt-3"/><div className="p-4 flex justify-between border-b border-[#1A2340]"><b>أفضل عروض الحراج</b><button onClick={()=>setShowHaraj(false)} className="w-8 h-8 rounded-xl bg-[#0A1024] border border-[#1B2547]">✕</button></div><div className="flex gap-1.5 p-3 overflow-auto">{["الكل","الرياض","جدة"].map(c=> <button key={c} onClick={()=>setCity(c)} className={`h-8 px-3 rounded-full text-[11px] font-bold border ${city===c?"bg-amber-400 border-amber-400 text-black":"bg-[#0A1024] border-[#1B2547] text-slate-400"}`}>{c}</button>)}</div><div className="overflow-auto p-2.5 flex flex-col gap-2 pb-6">{harajF.map((h,i)=><div key={i} onClick={()=>window.open("https://haraj.com.sa/tags/حرق_اسعار","_blank")} className="p-3 bg-[#0A1024] border border-[#1B2547] rounded-2xl"><div className="text-[12px] font-bold">{h.t}</div><div className="text-amber-300 font-black mt-1">{h.pr} • {h.city}</div></div>)}</div></div></>}

    {/* Login */}
    {showLogin && <><div onClick={()=>setShowLogin(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"/><div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-[92%] max-w-[380px] bg-[#12182F] border border-[#1B2547] rounded-[24px] p-5 shadow-2xl">
      <div className="flex justify-between items-center"><h3 className="font-black text-[16px]">تسجيل الدخول</h3><button onClick={()=>setShowLogin(false)} className="w-8 h-8 rounded-full bg-[#0A1024] border border-[#1B2547]">✕</button></div>
      <div className="flex gap-2 mt-4 bg-[#0A1024] p-1 rounded-full border border-[#1B2547]">
        <button onClick={()=>setLoginTab("phone")} className={`flex-1 h-9 rounded-full text-[12px] font-bold transition ${loginTab==="phone"?"bg-white text-black":"text-slate-400"}`}>رقم الجوال</button>
        <button onClick={()=>setLoginTab("email")} className={`flex-1 h-9 rounded-full text-[12px] font-bold transition ${loginTab==="email"?"bg-white text-black":"text-slate-400"}`}>الإيميل</button>
      </div>
      {loginTab==="phone"?(
        <div className="mt-4">
          {!otpSent?<>
            <label className="text-[11px] text-slate-400">رقم الجوال</label>
            <div className="mt-1 flex gap-2"><span className="h-11 px-3 rounded-xl bg-[#0A1024] border border-[#1B2547] flex items-center text-[12px] text-slate-400">+966</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/[^0-9]/g,""))} placeholder="5x xxx xxxx" className="flex-1 h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 text-[13px] outline-none"/></div>
            <button onClick={()=>{ if(phone.length<9){show("اكتب رقم صحيح");return} setOtpSent(true); show("أرسلنا كود 1234") }} className="mt-3 w-full h-11 bg-violet-600 rounded-full font-bold text-[13px]">إرسال كود التحقق</button>
          </>:<>
            <label className="text-[11px] text-slate-400">كود التحقق - جرب 1234</label>
            <input placeholder="1234" className="mt-1 w-full h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 text-center tracking-[8px] text-[16px] outline-none"/>
            <button onClick={()=>{ setIsLogged(true); setShowLogin(false); setOtpSent(false); show("تم تسجيل الدخول ✓")}} className="mt-3 w-full h-11 bg-emerald-500 rounded-full font-bold">تأكيد الدخول</button>
            <button onClick={()=>setOtpSent(false)} className="mt-2 w-full text-[11px] text-slate-400">تغيير الرقم</button>
          </>}
        </div>
      ):(
        <div className="mt-4">
          <label className="text-[11px] text-slate-400">البريد الإلكتروني</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@gmail.com" className="mt-1 w-full h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 text-[13px] outline-none"/>
          <label className="text-[11px] text-slate-400 mt-3 block">كلمة المرور</label><input type="password" placeholder="••••••••" className="mt-1 w-full h-11 bg-[#0A1024] border border-[#1B2547] rounded-xl px-4 text-[13px] outline-none"/>
          <button onClick={()=>{ if(!email.includes("@")){show("اكتب إيميل صحيح");return} setIsLogged(true); setShowLogin(false); show("تم الدخول ✓")}} className="mt-3 w-full h-11 bg-violet-600 rounded-full font-bold text-[13px]">دخول</button>
        </div>
      )}
      <div className="mt-4 text-[10px] text-slate-500 text-center leading-5">بالمتابعة توافق على <button onClick={()=>{setShowLogin(false);setShowPrivacy(true)}} className="text-violet-400 underline">سياسة الخصوصية</button> و <button onClick={()=>{setShowLogin(false);setShowTerms(true)}} className="text-violet-400 underline">الشروط والأحكام</button></div>
    </div></>}

    {/* Privacy */}
    {showPrivacy && <><div onClick={()=>setShowPrivacy(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"/><div className="fixed inset-0 z-[71] flex items-center justify-center p-3"><div className="w-full max-w-[560px] max-h-[88vh] bg-[#0A1024] border border-[#1B2547] rounded-[20px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#1B2547] flex justify-between items-center bg-[#12182F]"><b>سياسة الخصوصية - متجر حكيم</b><button onClick={()=>setShowPrivacy(false)} className="w-8 h-8 rounded-full bg-[#12182F] border border-[#1B2547]">✕</button></div>
      <div className="overflow-auto p-5 text-[12px] leading-7 text-slate-300 space-y-4">
        <p className="text-[11px] text-slate-500">آخر تحديث: 15 يونيو 2025 - جاهزة لمتطلبات Google Play</p>
        <h4 className="font-black text-white text-[13px]">1. مقدمة</h4><p>نحن في متجر حكيم - عروضكم نحترم خصوصيتك. هذه السياسة توضح كيف نجمع ونستخدم بياناتك.</p>
        <h4 className="font-black text-white">2. البيانات التي نجمعها</h4><ul className="list-disc pr-5 space-y-1"><li>رقم الجوال أو البريد الإلكتروني عند التسجيل</li><li>سجل التصفح والعروض التي شاهدتها لتحسين التوصيات بالذكاء الاصطناعي</li><li>الموقع التقريبي (المدينة فقط) لعرض عروض جدة والرياض القريبة</li><li>معرف الجهاز للإشعارات</li></ul>
        <h4 className="font-black text-white">3. كيف نستخدم البيانات</h4><p>لتقديم العروض، إرسال كوبونات، تحسين المساعد وفر AI، ومنع الاحتيال. لا نبيع بياناتك.</p>
        <h4 className="font-black text-white">4. المشاركة</h4><p>نشارك فقط مع مقدمي الخدمة (Vercel للاستضافة، DealApp للعقار، حراج للروابط) وبما يتوافق مع القانون السعودي.</p>
        <h4 className="font-black text-white">5. التوصيل والأسعار</h4><p><b>التوصيل حسب سياسة كل متجر (نون، أمازون، جرير، إكسترا، كارفور). الأسعار قد تتغير من المتجر الأصلي. لسنا مسؤولين عن اختلاف السعر النهائي.</b></p>
        <h4 className="font-black text-white">6. حقوقك</h4><p>يمكنك طلب حذف حسابك عبر Alhkmy11@gmail.com وسنحذف بياناتك خلال 7 أيام.</p>
        <h4 className="font-black text-white">7. اتصل بنا</h4><p>للاستفسار: Alhkmy11@gmail.com - رابط المكتب: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4</p>
      </div>
    </div></div></>}

    {/* Terms */}
    {showTerms && <><div onClick={()=>setShowTerms(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"/><div className="fixed inset-0 z-[71] flex items-center justify-center p-3"><div className="w-full max-w-[560px] max-h-[88vh] bg-[#0A1024] border border-[#1B2547] rounded-[20px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-[#1B2547] flex justify-between items-center bg-[#12182F]"><b>الشروط والأحكام</b><button onClick={()=>setShowTerms(false)} className="w-8 h-8 rounded-full bg-[#12182F] border border-[#1B2547]">✕</button></div>
      <div className="overflow-auto p-5 text-[12px] leading-7 text-slate-300 space-y-4">
        <p className="text-[11px] text-slate-500">آخر تحديث: 15 يونيو 2025 - متوافق مع نظام التجارة الإلكترونية السعودي</p>
        <h4 className="font-black text-white">1. قبول الشروط</h4><p>باستخدامك متجر حكيم فأنت توافق على هذه الشروط.</p>
        <h4 className="font-black text-white">2. الخدمات</h4><p>نقدم: (أ) عروضكم من متاجر طرف ثالث، (ب) متجر حكيم الخاص، (ج) الوساطة العقارية عبر DealApp برخصة فال، (د) روابط حراج.</p>
        <h4 className="font-black text-white">3. الكوبونات والأسعار</h4><p>الكوبونات منشورة كما هي من المتاجر. قد تنتهي صلاحيتها. السعر النهائي تحدده صفحة المتجر الأصلي.</p>
        <h4 className="font-black text-white">4. التوصيل</h4><p><b>التوصيل ليس مجاني بشكل عام. كل متجر يحدد رسوم ومدة التوصيل حسب سياسته ومدينتك (جدة، الرياض، مكة). نعرض معلومات التوصيل كما يذكرها المتجر فقط.</b></p>
        <h4 className="font-black text-white">5. العقار</h4><p>العروض العقارية موثقة برخصة فال - محسن الحكمي وسيط معتمد. التواصل عبر رابط مكتبي: https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4 - جميع المعاملات عبر منصة DealApp الرسمية.</p>
        <h4 className="font-black text-white">6. إخلاء مسؤولية</h4><p>لسنا المتجر البائع. لسنا مسؤولين عن جودة المنتج أو تأخير الشحن. الشكاوى توجه للمتجر الأصلي.</p>
        <h4 className="font-black text-white">7. القانون</h4><p>تخضع هذه الشروط لأنظمة المملكة العربية السعودية، ومحاكم جدة هي المختصة.</p>
      </div>
    </div></div></>}
  </div>
  )
}
