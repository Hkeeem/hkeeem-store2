"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// تأكد من أن هذا المسار صحيح بناءً على هيكل مشروعك
import { supabase } from "@/lib/supabase"; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // إذا نجح الدخول، انتقل للصفحة الرئيسية
    router.push("/");
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#0B0618] p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white/[0.06] border border-white/10 p-8 rounded-[22px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">تسجيل الدخول</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

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
          <label className="block text-white/70 text-sm mb-2">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <p className="text-center text-white/50 text-sm mt-4">
          ليس لديك حساب؟{' '}
          <a href="/register" className="text-violet-400 hover:underline">
            إنشاء حساب جديد
          </a>
        </p>
      </form>
    </div>
  );
}
