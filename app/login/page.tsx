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

  async function login() {
    setError("");

    if (!email || !password) {
      setError("فضلاً أدخل البريد وكلمة المرور");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("بيانات الدخول غير صحيحة");
        return;
      }

      router.push("/");
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen flex justify-center items-start pt-5 bg-purple-100"
    >
      <div
        className="
        w-[90%] max-w-xl bg-white rounded-3xl p-5
        shadow-lg animate-fadeIn
        "
      >

        <header className="flex justify-between items-center mb-8">

          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-gray-800">
              تسجيل دخول
            </h1>

            <button
              className="
              text-xs text-purple-700
              hover:text-purple-500
              text-right
              "
            >
              نسيت كلمة المرور؟
            </button>
          </div>


          <div
            className="
            bg-gradient-to-r from-purple-800 to-purple-400
            text-white px-5 py-2 rounded-full
            font-bold flex items-center gap-2
            "
          >
            ✨ AI المساعد الاقتصادي
          </div>


          <div
            className="
            text-purple-700
            font-black text-xl
            "
          >
            hkeeem
          </div>

        </header>


        <h2 className="text-right text-xl font-bold text-gray-700 mb-6">
          قائمة العروض المتاحة
        </h2>
