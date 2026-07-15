"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // تأكد من وجود index.ts يصدّر supabase

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) alert(error.message);
    else {
      alert("تم التسجيل! تحقق من بريدك الإلكتروني.");
      router.push("/login");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto" dir="rtl">
      <h1 className="text-2xl mb-4">إنشاء حساب جديد</h1>
      <input className="border p-2 w-full mb-2" placeholder="الاسم" onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="email" placeholder="البريد" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-4" type="password" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white p-2 w-full" onClick={handleRegister}>تسجيل</button>
    </div>
  );
}
