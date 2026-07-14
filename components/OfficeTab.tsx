'use client'
const EMAIL='alhkmy11@gmail.com'
const WA='966565604856'
export default function OfficeTab(){
 return(
  <div className="space-y-3">
    <div className="rounded-3xl bg-black text-white p-5">
      <h2 className="font-black">مؤسسة محسن لخدمات الأعمال</h2>
      <p className="text-xs text-white/60">محسن الحكمي • وسيط معتمد</p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <a href={`mailto:${EMAIL}`} className="h-11 rounded-full bg-white/10 border grid place-items-center text-sm">ايميل</a>
        <a href={`https://wa.me/${WA}`} className="h-11 rounded-full bg-[#25D366] grid place-items-center text-sm">واتساب 0565604856</a>
      </div>
    <div className="bg-white rounded-2xl border p-3">
      <p className="text-sm">تواصل على {EMAIL}</p>
    </div>
  </div>
 )
   }
