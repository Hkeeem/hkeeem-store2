"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const placeholders = [
  "أبغى غسالة أقل من 1500 ريال",
  "وين أرخص آيفون اليوم؟",
  "كوّن لي سلة مقاضي تكفي أسبوع بـ300 ريال",
];

const categories = [
  { id: "electronics", name: "الإلكترونيات", emoji: "💻" },
  { id: "grocery", name: "السوبرماركت", emoji: "🛒" },
  { id: "fashion", name: "الأزياء", emoji: "👗" },
  { id: "perfume", name: "العطور", emoji: "🌸" },
  { id: "pharmacy", name: "الصيدليات", emoji: "💊" },
  { id: "travel", name: "السفر", emoji: "✈️" },
  { id: "restaurants", name: "المطاعم", emoji: "🍔" },
  { id: "cars", name: "السيارات", emoji: "🚗" },
  { id: "home", name: "المنزل", emoji: "🏠" },
  { id: "kids", name: "الأطفال", emoji: "🧸" },
];

type Offer = {
  id: string;
  store: string;
  product: string;
  price: number;
  old: number;
  saving: number;
  coupon: string;
  rating: number;
  uses: number;
  dist: number;
  time: string;
  img: string;
  cat: string;
  isDrop: boolean;
};

const offers: Offer[] = [
  {
    id: "1",
    store: "أمازون",
    product: "iPhone 15 Pro 256GB تيتانيوم أزرق",
    price: 4199,
    old: 4619,
    saving: 420,
    coupon: "HKEEM50",
    rating: 4.8,
    uses: 1243,
    dist: 0.8,
    time: "قبل ساعتين",
    img: "https://images.unsplash.com/photo-1592899677977-9bb10ba128a0?w=700&q=80",
    cat: "electronics",
    isDrop: true,
  },

  {
    id: "2",
    store: "إكسترا",
    product: "غسالة LG 7 كيلو أوتوماتيك أقل من 1500",
    price: 1449,
    old: 1799,
    saving: 350,
    coupon: "EXTRA30",
    rating: 4.6,
    uses: 890,
    dist: 1.2,
    time: "قبل 45 دقيقة",
    img: "https://images.unsplash.com/photo-1585237672818-80a90c05d9a6?w=700&q=80",
    cat: "home",
    isDrop: true,
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
  const [showMap, setShowMap] = useState(false);
  const [result, setResult] = useState<string | null>(null);


  useEffect(() => {
    const timer = setInterval(() => {
      setPhIndex((i) => (i + 1) % placeholders.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);


  function showToast(message: string) {
    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2200);
  }


  function handleAsk() {

    const q = query || placeholders[phIndex];

    if (
      q.includes("غسالة")
    ) {

      setResult(
        "وجدنا 3 غسالات أقل من 1500 ريال - أفضل عرض LG بسعر 1399 ريال"
      );

    } else if (
      q.includes("آيفون") ||
      q.includes("ايفون")
    ) {

      setResult(
        "أرخص iPhone 15 Pro اليوم بسعر 4199 ريال مع كوبون HKEEM50"
      );

    } else {

      setResult(
        `حكيم AI يحلل طلبك: "${q}" وتم العثور على عروض مناسبة`
      );

    }

  }



  async function copyCoupon(code: string) {

    try {

      await navigator.clipboard.writeText(code);

      setCopied(code);

      showToast("تم نسخ الكوبون ✅");

      setTimeout(() => {
        setCopied(null);
      }, 1500);


    } catch {

      showToast("تعذر نسخ الكوبون");

    }

  }



  const filtered = offers.filter((o) => {

    const search =
      query.trim().toLowerCase();


    if (
      activeCat !== "all" &&
      o.cat !== activeCat
    ) {
      return false;
    }


    if (
      radius !== null &&
      o.dist > radius
    ) {
      return false;
    }


    if (
      search &&
      !o.product.toLowerCase().includes(search) &&
      !o.store.toLowerCase().includes(search)
    ) {
      return false;
    }


    return true;

  });
return (
  <div
    dir="rtl"
    className="min-h-screen text-white"
    style={{
      background:
        "radial-gradient(1200px 600px at 80% -10%, #7C3AED33, transparent), linear-gradient(180deg,#0B0618 0%,#1A1033 100%)",
    }}
  >

    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B0618]/80 border-b border-white/10">
      <div className="mx-auto max-w-[480px] px-4 h-[60px] flex items-center justify-between">

        <div className="flex items-center gap-2.5">

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center font-black">
            ح
          </div>

          <span className="font-black text-[18px]">
            حكيم <b className="text-violet-300">AI</b>
          </span>

        </div>


        <button className="h-9 px-4 rounded-full bg-white text-black text-[13px] font-bold">
          📍 جدة
        </button>

      </div>
    </nav>



    <main className="mx-auto max-w-[480px] px-3 pb-28">


      <div className="mt-4 h-[56px] flex items-center gap-2 p-1.5 rounded-full bg-white/10 border border-white/15">

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center">
          🤖
        </div>


        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder={placeholders[phIndex]}
          className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-white/40"
        />


        <button
          onClick={()=>showToast("🎙️ البحث الصوتي قريباً")}
          className="w-10 h-10 rounded-full bg-white/10"
        >
          🎙️
        </button>


        <button
          onClick={()=>showToast("📷 البحث بالصورة قريباً")}
          className="w-10 h-10 rounded-full bg-white/10"
        >
          📷
        </button>


      </div>



      <div className="mt-3 flex gap-2">

        <button
          onClick={handleAsk}
          className="flex-1 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold"
        >
          اسأل حكيم
        </button>


        <button
          onClick={()=>{
            setQuery("");
            setResult(null);
          }}
          className="h-10 px-4 rounded-full bg-white/10"
        >
          مسح
        </button>

      </div>



      {result && (

        <div className="mt-3 p-3 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-sm">
          {result}
        </div>

      )}



      {toast && (

        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1E1342] px-4 py-2 rounded-full">
          {toast}
        </div>

      )}



      <div className="mt-4 flex gap-2 overflow-x-auto">

        <button
          onClick={()=>setRadius(null)}
          className="h-9 px-4 rounded-full bg-white text-black whitespace-nowrap"
        >
          كل المناطق
        </button>


        {[1,3,5,10].map(k=>(

          <button
            key={k}
            onClick={()=>setRadius(k)}
            className="h-9 px-4 rounded-full bg-white/10 whitespace-nowrap"
          >
            داخل {k} كم
          </button>

        ))}

      </div>
<div className="mt-5 grid grid-cols-2 gap-3">

        {filtered.map((o)=>{

          const isFav = favorites.includes(o.id);

          return (

            <div
              key={o.id}
              className="rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.06]"
            >

              <div className="relative aspect-[4/3] m-1.5 rounded-[16px] overflow-hidden bg-black/30">

                <Image
                  src={o.img}
                  alt={o.product}
                  fill
                  sizes="(max-width:480px) 50vw"
                  className="object-cover"
                />


                <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold">
                  وفر {o.saving} ر.س
                </span>


                <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/70 text-[11px]">
                  📍 {o.dist} كم
                </span>



                <button
                  onClick={() =>
                    setFavorites((prev)=>
                      isFav
                      ? prev.filter(x=>x!==o.id)
                      : [...prev,o.id]
                    )
                  }
                  className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/60"
                >
                  {isFav ? "❤️" : "🤍"}
                </button>



                {o.isDrop && (

                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-violet-600 text-xs">
                    نزل اليوم
                  </span>

                )}

              </div>




              <div className="px-3 pb-3">

                <div className="text-[11px] text-white/50">
                  {o.store} • {o.time}
                </div>



                <div className="mt-1 text-[13px] font-bold line-clamp-2 min-h-[36px]">
                  {o.product}
                </div>



                <div className="mt-2 flex items-center gap-2">

                  <span className="text-amber-300 font-black">
                    {o.price} ر.س
                  </span>

                  <span className="text-xs text-white/30 line-through">
                    {o.old}
                  </span>

                </div>




                <div className="mt-2 flex justify-between text-xs">

                  <span>
                    ⭐ {o.rating}
                  </span>

                  <span>
                    🔥 {o.uses}
                  </span>

                </div>




                <button
                  onClick={()=>copyCoupon(o.coupon)}
                  className="mt-3 w-full h-8 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs font-bold"
                >

                  🎟️ {
                    copied === o.coupon
                    ? "تم النسخ ✓"
                    : `كوبون: ${o.coupon}`
                  }

                </button>


              </div>


            </div>

          );

        })}

      </div>
