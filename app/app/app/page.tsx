'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

export default function Page() {
  const [products, setProducts] = useState<any[]>([])
  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      if (data) setProducts(data)
    })
  }, [])
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Hkeeem Store</h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-400">لا يوجد منتجات حالياً - أضفها من Supabase</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  )
}
