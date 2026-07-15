"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        // يجب أن يكون هذا هو رابط موقعك على Vercel بعد التفعيل
        emailRedirectTo: `${window.location.origin}/login`, 
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#0B0618] p-4">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white/[0.06] border border-white/10 p-8 rounded-[22px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">إنشاء حساب</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-4 rounded-lg mb-4 text-sm text-center">
            تم إنشاء الحساب بنجاح!<br />
            يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.
          </div>
        )}

        <div className="mb-4">
          <label className="block text-white/70 text-sm mb-2">الاسم الكامل</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white/70 text-sm mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-white/70 text-sm mb-2">كلمة المرور (6 أحرف على الأقل)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition disabled:opacity-50"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>

        <p className="text-center text-white/50 text-sm mt-4">
          لديك حساب بالفعل؟{' '}
          <a href="/login" className="text-violet-400 hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </form>
    </div>
  );
}
