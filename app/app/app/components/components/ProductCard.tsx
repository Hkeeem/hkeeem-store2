export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
      <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
      <p className="font-bold text-lg">{product.price} ر.س</p>
      <button className="bg-white text-black py-2 rounded-lg font-bold mt-2">أضف للسلة</button>
    </div>
  )
}
