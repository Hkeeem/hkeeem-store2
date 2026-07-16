export default function Page() {
  return (
    <div className="min-h-screen bg-purple-50 flex justify-center p-5">
      <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-lg animate-in fade-in duration-1000">
        
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-8">
          {/* عنصر على اليسار (فارغ للموازنة، أو يمكن وضع شعار آخر هنا) */}
          <div className="w-20"></div> 
          
          {/* تم استبدال الزر بالصورة فقط */}
          <div className="flex justify-center">
            <img 
              src="https://img.icons8.com/?size=100&id=86527&format=png&color=000000" 
              alt="أيقونة السلة" 
              className="h-16 w-16 object-contain"
            />
          </div>
          
          {/* الشعار النصي على اليمين */}
          <span className="font-bold text-xl text-purple-900 w-20 text-left">hkeeem</span>
        </div>
        
        {/* العنوان */}
        <h2 className="text-right text-2xl font-bold text-gray-800">
          قائمة العروض المتاحة
        </h2>
        
      </div>
    </div>
  );
}
