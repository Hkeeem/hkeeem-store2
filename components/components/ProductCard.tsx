'use client'
export default function ProductCard({p}:{p?:any}){
 return (
  <div className="bg-white rounded-2xl border border-[#EADFC9] p-3">
    <div className="h-32 bg-[#F5F1E8] rounded-xl grid place-items-center text-2xl">🛍️</div>
    <h3 className="font-bold text-sm mt-2">{p?.name || 'عطر فاخر'}</h3>
    <p className="text-xs text-zinc-500 mt-1">{p?.price || '250 ر.س'}</p>
  </div>
 )
}
