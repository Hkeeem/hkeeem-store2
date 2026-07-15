"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const placeholders = [
  "أبغى غسالة أقل من 1500 ريال",
  "وين أرخص آيفون اليوم؟",
  "كوّن لي سلة مقاضي تكفي أسبوع بـ300 ريال",
];

const categories = [
  { id: "all", name: "الكل", emoji: "✨" },
  { id: "electronics", name: "الإلكترونيات", emoji: "💻" },
  { id: "grocery", name: "السوبرماركت", emoji: "🛒" },
  { id: "fashion", name: "الأزياء", emoji: "👗" },
  { id: "perfume", name: "العطور", emoji: "🌸" },
  { id: "home", name: "المنزل", emoji: "🏠" },
];

type Offer = {
  id: string; store: string; product: string;
  price: number; old: number; saving: number;
  coupon: string; rating: number; uses: number;
  dist: number; time: string; img: string; cat: string; isDrop: boolean;
};

const offers: Offer[] = [
  {
    id: "1", store: "أمازون", product: "iPhone 15 Pro 256GB تيتانيوم أزرق",
    price: 4199, old: 4619, saving: 420, coupon: "HKEEM50", rating: 4.8, uses: 1243, dist: 0.8, time: "قبل ساعتين",
    img: "https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80", cat: "electronics", isDrop: true,
  },
  {
    id: "2", store: "إكسترا", product: "غسالة LG 7 كيلو أوتوماتيك أقل من 1500",
    price: 1449, old: 1799, saving: 350, coupon: "EXTRA30", rating: 4.6, uses: 890, dist: 1.2, time: "قبل 45 دقيقة",
    img: "https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80", cat: "home", isDrop: true,
  },
];

export default function Page() {
  const [phIndex, setPhIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [radius, setRadius] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // الجديد
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [location, setLocation] = useState("جدة");
  const [locActive, setLocActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setPhIndex((i) => (i + 1) % placeholders.length), 2500);
    return () => clearInterval(timer);
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  // تفعيل الموقع ورفعه فوق
  function handleLocation() {
    if (!navigator.geolocation) {
      showToast("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    showToast("جاري تحديد موقعك...");
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("جدة - تم تحديد موقعك");
        setLocActive(true);
        showToast("تم تفعيل الموقع ✅");
      },
      () => {
        showToast("فشل تحديد الموقع، تأكد من تفعيل الـ GPS");
      }
    );
  }

  function handleAsk() {
    const q = query || placeholders[phIndex];
    if (q.includes("غسالة")) {
      setResult("وجدنا 3 غسالات أقل من 1500 ريال - أفضل عرض LG بسعر 1399 ريال");
    } else if (q.includes("آيفون") || q.includes("ايفون")) {
      setResult("أرخص iPhone 15 Pro اليوم بسعر 4199 ريال مع كوبون HKEEM50");
    } else {
      setResult(`تم العثور على عروض مناسبة لطلبك: "${q}"`);
    }
  }

  async function copyCoupon(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      showToast("تم نسخ الكوبون ✅");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      showToast("تعذر نسخ الكوبون");
    }
  }

  const filtered = offers.filter((o) => {
    const search = query.trim().toLowerCase();
    if (activeCat!== "all" && o.cat!== activeCat) return false;
    if (radius!== null && o.dist > radius) return false;
    if (search &&!o.product.toLowerCase().includes(search) &&!o.store.toLowerCase().includes(search)) return false;
    return true;
  });

  return (
    <div dir="rtl" className="min-h-screen text-white" style={{ background: "radial-gradient(1200px 600px at 80% -10%, #7C3AED33, transparent), linear-gradient(180deg,#0B0618 0%,#1A1033 100%)" }}>

      {/* Nav الجديد بدون AI */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0618]/90 border-b border-white/10">
        <div className="mx-auto max-w-[480px] px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-full bg-white/10 grid place-items-center">☰</button>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[18px] text-[#D4B46A] tracking-widest">hkeeem</span>
              <span className="text-[11px] text-[#D4B46A]">متجر حكيم</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-full bg-black border border-white/10 text-[13px]">السلة 🛒</button>
            <button onClick={() => isLogged? setIsLogged(false) : setShowLogin(true)} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4B46A] to-[#A67C3B] text-black font-bold grid place-items-center">{isLogged? "ح" : "👤"}</button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-3 pb-28">

        {/* الموقع مفعل ومرفوع فوق */}
        <div className="flex justify-center mt-4">
          <button onClick={handleLocation} className={`flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-bold shadow-lg transition-all ${locActive? "bg-white text-black" : "bg-white/10 text-white border border-white/15"}`}>
            <span className={`w-2 h-2 rounded-full ${locActive? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.3)]" : "bg-white/40"}`}></span>
            📍 {location}
            {locActive && <span className="text-emerald-600 text-[10px]">● مفعل</span>}
          </button>
        </div>

        {/* البحث بدون AI */}
        <div className="mt-4 h-[56px] flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/15">
          <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center">🔍</div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholders[phIndex]} className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40" />
          <button onClick={() => showToast("🎙️ قريباً")} className="w-10 h-10 rounded-full bg-white/10">🎙️</button>
          <button onClick={() => showToast("📷 قريباً")} className="w-10 h-10 rounded-full bg-white/10">📷</button>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={handleAsk} className="flex-1 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold">بحث</button>
          <button onClick={() => { setQuery(""); setResult(null); }} className="h-10 px-4 rounded-full bg-white/10">مسح</button>
        </div>

        {result && <div className="mt-3 p-3 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-sm">{result}</div>}

        {/* فئات */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className={`h-9 px-4 rounded-full whitespace-nowrap text-[13px] border ${activeCat === c.id? "bg-white text-black border-white" : "bg-white/10 border-white/10"}`}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* مسافات */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          <button onClick={() => setRadius(null)} className={`h-9 px-4 rounded-full whitespace-nowrap text-[13px] ${radius === null? "bg-white text-black" : "bg-white/10"}`}>كل المناطق</button>
          {[1, 3, 5, 10].map((k) => (
            <button key={k} onClick={() => setRadius(k)} className={`h-9 px-4 rounded-full whitespace-nowrap text-[13px] ${radius === k? "bg-white text-black" : "bg-white/10"}`}>داخل {k} كم</button>
          ))}
        </div>

        {/* عروض */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {filtered.map((o) => {
            const isFav = favorites.includes(o.id);
            return (
              <div key={o.id} className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.06]">
                <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-black/30">
                  <Image src={o.img} alt={o.product} fill sizes="50vw" className="object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold">وفر {o.saving} ر.س</span>
                  <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-[11px]">📍 {o.dist} كم</span>
                  <button onClick={() => setFavorites((prev) => isFav? prev.filter(x => x!== o.id) : [...prev, o.id])} className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/60"> {isFav? "❤️" : "🤍"} </button>
                  {o.isDrop && <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-xs">نزل اليوم</span>}
                </div>
                <div className="px-3 pb-3">
                  <div className="text-[11px] text-white/50">{o.store} • {o.time}</div>
                  <div className="mt-1 text-[13px] font-bold line-clamp-2 min-h-[36px]">{o.product}</div>
                  <div className="mt-2 flex items-center gap-2"><span className="text-amber-300 font-black">{o.price} ر.س</span><span className="text-xs text-white/30 line-through">{o.old}</span></div>
                  <div className="mt-2 flex justify-between text-xs"><span>⭐ {o.rating}</span><span>🔥 {o.uses}</span></div>
                  <button onClick={() => copyCoupon(o.coupon)} className="mt-3 w-full h-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs font-bold">🎟️ {copied === o.coupon? "تم النسخ ✓" : `كوبون: ${o.coupon}`}</button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {toast && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1E1342] px-4 py-2 rounded-full border border-white/10 text-sm">{toast}</div>}

      {/* القائمة الجانبية */}
      {drawerOpen && <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setDrawerOpen(false)} />}
      <div className={`fixed top-0 bottom-0 right-0 z-50 w-[300px] bg-[#0F0B1F] border-l border-white/10 flex flex-col transition-transform duration-300 ${drawerOpen? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 flex justify-between items-center border-b border-white/5">
          <span className="font-black text-[#D4B46A]">hkeeem</span>
          <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center">✕</button>
        </div>
        <div className="p-4">
          <div className="rounded-[20px] bg-[#1A1433] border border-white/5 p-4">
            {!isLogged? (
              <>
                <p className="font-bold">أهلا بك في حكيم</p>
                <p className="text-[12px] text-white/50 mt-1">سجل دخولك للاستمتاع بالعروض القريبة</p>
                <button onClick={() => { setDrawerOpen(false); setShowLogin(true); }} className="mt-4 w-full h-11 rounded-full bg-[#7C3AED] font-bold">تسجيل الدخول</button>
                <button onClick={() => { setDrawerOpen(false); setShowRegister(true); }} className="mt-2 w-full h-11 rounded-full border border-white/15 font-bold">إنشاء حساب جديد</button>
              </>
            ) : (
              <>
                <p className="font-bold">مرحبا، محسن 👋</p>
                <p className="text-[12px] text-white/50">jده • {location}</p>
                <button onClick={() => setIsLogged(false)} className="mt-4 w-full h-10 rounded-full bg-white/10">تسجيل خروج</button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {[
            ["الرئيسية", "🏠"], ["قريبة مني", "📍"], ["البحث", "🔍"], ["السلة", "🛒"], ["مفضلتي", "❤️"], ["طلباتي", "📦"], ["الإشعارات", "🔔"], ["الإعدادات", "⚙️"], ["المساعدة", "💬"],
          ].map(([label, icon]) => (
            <button key={label} className="w-full h-12 flex items-center gap-3 px-4 hover:bg-white/5 rounded-xl text-[13.5px]"><span>{icon}</span> {label}</button>
          ))}
        </div>
      </div>

      {/* تسجيل دخول */}
      {showLogin && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative w-full max-w-[480px] bg-[#181233] rounded-t-[28px] p-6 border-t border-white/10">
            <div className="mx-auto w-10 h-1.5 bg-white/20 rounded-full mb-5" />
            <h3 className="font-bold text-[18px]">تسجيل الدخول</h3>
            <input placeholder="الجوال أو البريد" className="mt-5 w-full h-12 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none" />
            <input type="password" placeholder="كلمة المرور" className="mt-3 w-full h-12 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none" />
            <button onClick={() => { setIsLogged(true); setShowLogin(false); showToast("تم تسجيل الدخول ✅"); }} className="mt-5 w-full h-12 rounded-full bg-[#7C3AED] font-bold">دخول</button>
            <p className="text-center text-[12px] text-white/50 mt-4">ليس لديك حساب؟ <button onClick={() => { setShowLogin(false); setTimeout(() => setShowRegister(true), 200); }} className="text-[#D4B46A] font-bold">إنشاء حساب</button></p>
          </div>
        </div>
      )}

      {/* تسجيل جديد */}
      {showRegister && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowRegister(false)} />
          <div className="relative w-full max-w-[480px] bg-[#181233] rounded-t-[28px] p-6 border-t border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="mx-auto w-10 h-1.5 bg-white/20 rounded-full mb-5" />
            <h3 className="font-bold text-[18px]">إنشاء حساب جديد</h3>
            <input placeholder="الاسم الكامل" className="mt-5 w-full h-11 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
            <input placeholder="رقم الجوال" className="mt-2 w-full h-11 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
            <input placeholder="البريد الإلكتروني" className="mt-2 w-full h-11 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
            <input type="password" placeholder="كلمة المرور" className="mt-2 w-full h-11 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
            <button onClick={() => { setIsLogged(true); setShowRegister(false); showToast("تم إنشاء الحساب ✅"); }} className="mt-4 w-full h-12 rounded-full bg-[#7C3AED] font-bold">إنشاء حساب</button>
            <p className="text-center text-[12px] text-white/50 mt-3">لديك حساب؟ <button onClick={() => { setShowRegister(false); setTimeout(() => setShowLogin(true), 200); }} className="text-[#D4B46A] font-bold">دخول</button></p>
          </div>
        </div>
      )}
    </div>
  );
          }
