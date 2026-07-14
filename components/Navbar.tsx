'use client'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="h-14 px-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-black">
            🔥
          </div>

          <div>
            <h1 className="font-black leading-none">عروضكم</h1>
            <p className="text-[10px] text-zinc-500">
              أقرب العروض حولك
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 transition">
            🔔
          </button>

          <button className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 transition">
            👤
          </button>
        </div>

      </div>
    </header>
  )
}
