بما أننا اعتمدنا اللون البيج الفاتح (Stone) والذهبي والبنفسجي، سأجعل الخلفية الآن "كريمية فاتحة جداً" (Creamy/Warm Sand) وهي تعطي دفئاً وفخامة أكثر من البيض الصريح أو الرمادي.
هذا التعديل سيجعل التطبيق يبدو أكثر حيوية وراحة للعين:
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  return (
    // الخلفية الآن بلون "Sand/Cream" فاتح جداً ودافئ
    <div dir="rtl" className="min-h-screen bg-[#FDFBF7] text-stone-900">
      
      {/* الهيدر */}
      <nav className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="mx-auto max-w-[480px] px-4 py-3 flex items-center justify-between">
          
          {/* الشعار المزخرف بجانب hkeeem */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 border border-amber-400 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg shadow-inner flex items-center justify-center">
               <span className="text-lg">🧺</span>
            </div>
            <span className="font-black text-violet-950 text-xl tracking-tighter">hkeeem</span>
          </div>
          
          {/* التسجيل والدخول */}
          <div className="flex flex-col gap-0.5">
            <Link href="/register" className="text-[10px] font-bold text-violet-700 hover:text-violet-900">تسجيل</Link>
            <Link href="/login" className="text-[10px] font-bold text-stone-500 hover:text-stone-700">دخول</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[480px] px-4 pb-28 pt-6">
        
        {/* المساعد الاقتصادي AI */}
        <div className="flex justify-center mb-8">
            <div className="px-5 py-2.5 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span className="font-bold text-[13px]">المساعد الاقتصادي AI</span>
            </div>
        </div>

        <h3 className="text-md font-bold text-stone-800 mb-4">قائمة العروض المتاحة</h3>
        {/* منطقة العروض */}
      </main>
    </div>
  );
}

```
### التغييرات الجديدة:
 1. **الخلفية:** استخدمت bg-[#FDFBF7] (وهو لون كريمي هادئ جداً وفاتح) بدلاً من الـ stone-50 السابقة، ليعطي إحساساً بالنظافة والاحترافية.
 2. **التناغم:** الأزرار البنفسجية والزخرفة الذهبية تظهر الآن بشكل أجمل بكثير على هذه الخلفية الكريمية مقارنة بالأبيض الصريح.
هل هذا اللون "الكريمي" هو الدرجة التي كنت تبحث عنها، أم تريدها أكثر دفئاً (مائلة للبرتقالي الفاتح)؟
