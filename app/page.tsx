export default function Page() {
  return (
    <div className="min-h-screen bg-purple-50 flex justify-center p-5">
      <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-lg animate-in fade-in duration-1000">
        
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-medium text-gray-600 cursor-pointer">تسجيل دخول</span>
          
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-5 py-2 rounded-full font-bold shadow-md hover:scale-105 transition-transform">
            <span>✨</span> AI المساعد الاقتصادي
          </button>
          
          <span className="font-bold text-purple-900">hkeeem</span>
        </div>
        
        {/* العنوان */}
        <h2 className="text-right text-2xl font-bold text-gray-800">
          قائمة العروض المتاحة
        </h2>
        
      </div>
    </div>
  );
}
