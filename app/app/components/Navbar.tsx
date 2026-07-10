export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b border-gray-800 bg-zinc-900">
      <h2 className="text-xl font-bold">Hkeeem Store</h2>
      <div className="flex gap-4">
        <a href="#" className="text-gray-300 hover:text-white">الرئيسية</a>
        <a href="#" className="text-gray-300 hover:text-white">السلة</a>
      </div>
    </nav>
  )
}
