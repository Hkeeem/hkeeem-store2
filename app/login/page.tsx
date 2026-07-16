"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("فضلاً أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/");

    } catch {
      setError("حدث خطأ غير متوقع، حاول مرة أخرى");

    } finally {
      setLoading(false);
    }
  }


  async function resetPassword() {
    if (!email) {
      setError("اكتب البريد الإلكتروني أولاً");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email
    );

    if (error) {
      setError("تعذر إرسال رابط استعادة كلمة المرور");
      return;
    }

    setError("تم إرسال رابط استعادة كلمة المرور للبريد");
  }


  return (
    <main
      dir="rtl"
      className="
      min-h-screen
      flex
      justify-center
      items-start
      pt-6
      bg-gradient-to-br
      from-purple-100
      via-white
      to-purple-200
      "
    >

      <div
        className="
        w-[92%]
        max-w-md
        bg-white
        rounded-3xl
        shadow-xl
        p-6
        "
      >

        <div
          className="
          flex
          justify-between
          items-center
          mb-8
          "
        >

          <div>
            <h1 className="font-bold text-gray-800">
              تسجيل دخول
            </h1>

            <button
              onClick={resetPassword}
              className="
              text-xs
              text-purple-700
              mt-2
              "
            >
              🔑 نسيت كلمة المرور؟
            </button>
          </div>


          <div
            className="
            bg-gradient-to-r
            from-purple-800
            to-purple-500
            text-white
            px-4
            py-2
            rounded-full
            text-sm
            font-bold
            "
          >
            ✨ AI حكيم
          </div>


          <div
            className="
            text-purple-700
            font-black
            text-xl
            "
          >
            hkeeem
          </div>

        </div>
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              البريد الإلكتروني
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="
              w-full
              border
              border-purple-200
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-purple-500
              "
            />
          </div>


          <div>
            <label className="block text-sm text-gray-700 mb-1">
              كلمة المرور
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
              w-full
              border
              border-purple-200
              rounded-xl
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-purple-500
              "
            />
          </div>


          {error && (
            <div
              className="
              bg-purple-50
              border
              border-purple-200
              text-purple-700
              text-sm
              rounded-xl
              p-3
              "
            >
              ⚠️ {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-gradient-to-r
            from-purple-800
            to-purple-500
            text-white
            font-bold
            rounded-xl
            py-3
            transition
            hover:scale-[1.02]
            disabled:opacity-60
            "
          >
            {loading ? (
              <span>
                ⏳ جاري تسجيل الدخول...
              </span>
            ) : (
              <span>
                🔐 دخول
              </span>
            )}
          </button>


        </form>


        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600">
            ليس لديك حساب؟
          </p>

          <button
            onClick={() => router.push("/register")}
            className="
            mt-2
            text-purple-700
            font-bold
            "
          >
            👤 إنشاء حساب جديد
          </button>

        </div>
        id="7p4v3s"
        <div
          className="
          mt-8
          text-center
          text-xs
          text-gray-400
          "
        >
          <p>
            عروضكم - أقرب العروض حولك 🔥
          </p>

          <p className="mt-1">
            © {new Date().getFullYear()} hkeeem
          </p>
        </div>


      </div>


      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        main > div {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>


    </main>
  );
}
