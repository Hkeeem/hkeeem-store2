"use client";
import { useState } from "react";

export default function LoginPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center text-white px-4" style={{ background: "radial-gradient(1200px 600px at 80% -10%, #7C3AED33, transparent), linear-gradient(180deg,#0B0618 0%,#1A1033 100%)" }}>
      <div className="w-full max-w-[400px] bg-[#181233] rounded-[28px] p-6 border border-white/10 shadow-2xl">
        <div className="text-center mb-6">
          <div className="font-black text-[22px] text-[#D4B46A] tracking-widest">hkeeem</div>
          <div className="text-[11px] text-[#D4B46A]">متجر حكيم</div>
        </div>

        <h3 className="font-bold text-[18px]">تسجيل الدخول</h3>
        <p className="text-[12px] text-white/50 mt-1">أهلاً بعودتك</p>

        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="الجوال أو البريد" className="mt-5 w-full h-12 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
        <input type="password" placeholder="كلمة المرور" className="mt-3 w-full h-12 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />

        <div className="mt-3 flex justify-between items-center px-1">
          <label className="flex items-center gap-2 text-[11px] text-white/50 cursor-pointer">
            <input type="checkbox" className="rounded" /> تذكرني
          </label>
          <button onClick={() => setShowForgot(true)} className="text-[12px] text-[#D4B46A] hover:underline">
            نسيت كلمة المرور؟
          </button>
        </div>

        <button onClick={() => showToast("تم تسجيل الدخول ✅")} className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold">
          دخول
        </button>

        <p className="text-center text-[12px] text-white/50 mt-5">
          ليس لديك حساب؟ <a href="/register" className="text-[#D4B46A] font-bold">إنشاء حساب</a>
        </p>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForgot(false)} />
          <div className="relative w-full max-w-[480px] bg-[#181233] rounded-t-[28px] p-6 border-t border-white/10">
            <div className="mx-auto w-10 h-1.5 bg-white/20 rounded-full mb-5" />
            <h3 className="font-bold text-[18px]">استعادة كلمة المرور</h3>
            <p className="text-[12px] text-white/50 mt-2">أدخل بريدك أو جوالك وسنرسل لك رابط</p>
            <input value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="البريد أو الجوال" className="mt-5 w-full h-12 rounded-full bg-[#1F1840] border border-white/10 px-5 outline-none text-[13px]" />
            <button
              onClick={() => {
                if (!forgotEmail.trim()) { showToast("أدخل بريدك أولاً"); return; }
                showToast("تم إرسال رابط الاستعادة ✅");
                setShowForgot(false);
                setForgotEmail("");
              }}
              className="mt-5 w-full h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 font-bold"
            >
              إرسال رابط الاستعادة
            </button>
            <button onClick={() => setShowForgot(false)} className="mt-3 w-full h-10 text-[12px] text-white/60">إلغاء</button>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#1E1342] px-5 py-2.5 rounded-full border border-white/10 text-[13px] shadow-xl">{toast}</div>}
    </div>
  );
}
