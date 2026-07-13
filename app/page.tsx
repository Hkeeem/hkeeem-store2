const bg = dark? 'bg-zinc-950 text-zinc-100' : 'bg-[#FBF7F0] text-zinc-900'
const card = dark? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
const muted = dark? 'text-zinc-400' : 'text-zinc-600' // بدل opacity-60

// في الهيدر
<header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${dark?'bg-zinc-900/90 border-zinc-800':'bg-[#FBF7F0]/90 border-zinc-200'}`}>
  <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-full bg-white border border-zinc-200 shadow-sm grid place-items-center overflow-hidden">
        <img src="/hkeeem-logo.png" alt="Hkeeem" className="w-8 h-8 object-contain" />
      </div>
      <h1 className="font-black text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
        عروض<span className="text-[#C9A227]">كم</span>
      </h1>
    </div>
    {/* باقي الأزرار */}
  </div>
</header>

// الزر الذهبي الوسطي في الشريط السفلي
<button className="flex flex-col items-center -translate-y-3">
  <span className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C765] shadow-lg grid place-items-center border-2 border-white">
    <img src="/hkeeem-logo.png" className="w-9 h-9 object-contain" alt="حكيم" />
  </span>
  <span className="text-[11px] font-black text-[#8B5A00] mt-1">حكيم</span>
</button>
