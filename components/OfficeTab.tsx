'use client'
const EMAIL='alhkmy11@gmail.com'
const WA='966565604856'
const DISP='0565604856'
const DEAL='https://dealapp.sa/ar/profile/67c08063ca5bafdb59e3d8d4'
export default function OfficeTab(){
 return(
  <div className="space-y-3">
    <div className="rounded-[28px] bg-black text-white p-5">
      <div className="flex justify-between">
        <div>
          <h2 className="font-black">مؤسسة محسن لخدمات الأعمال</h2>
          <p className="text-xs text-white/60 mt-1">محسن الحكمي • وسيط معتمد ✅</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#C9A86A] grid place-items-center font-black">م</div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-5">
        <a href={`mailto:${EMAIL}`} className="h-11 rounded-full bg-white/10 border grid place-items-center text-sm">ايميل</a>
        <a href={`https://wa.me/${WA}`} target="_blank" className="h-11 rounded-full bg-[#25D366] grid place-items-center text-xs font-black">واتساب<br/>{DISP}</a>
        <a href={DEAL} target="_blank" className="h-11 rounded-full bg-white text-black grid place-items-center text-xs">DealApp</a>
      </div>
    <div className="bg-white rounded-2xl border p-3">
      <h3 className="font-bold text-sm">المساعد العقاري 🤖</h3>
      <p className="text-xs text-zinc-500 mt-1">تواصل {DISP} او {EMAIL}</p>
      <a href={`https://wa.me/${WA}`} target="_blank" className="mt-3 block h-10 rounded-full bg-black text-white grid place-items-center text-sm">فتح واتساب</a>
    </div>
  </div>
 )
   }
