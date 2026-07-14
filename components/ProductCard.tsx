'use client'

import Image from 'next/image'

type Product = {
  name?: string
  price?: string
  image?: string
}

export default function ProductCard({ p }: { p?: Product }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-40 bg-[#F5F1E8]">
        {p?.image ? (
          <Image
            src={p.image}
            alt={p.name || 'منتج'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full grid place-items-center text-5xl">
            🛍️
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm line-clamp-2">
          {p?.name || 'عطر فاخر'}
        </h3>

        <p className="mt-1 text-lg font-black text-[#7A5A16]">
          {p?.price || '250 ر.س'}
        </p>

        <button className="mt-3 w-full h-10 rounded-xl bg-black text-white text-sm font-bold">
          عرض التفاصيل
        </button>
      </div>
    </div>
  )
}
