"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // عدّل المسار إذا لزم

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("تم إنشاء الحساب بنجاح");
    router.push("/login");
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto", padding: 20 }}>
      <h1>إنشاء حساب</h1>

      <input
        placeholder="الاسم"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10 }}
      />

      <input
        placeholder="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10 }}
      />

      <input
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 10 }}
      />

      <button
        onClick={register}
        disabled={loading}
        style={{ width: "100%", padding: 12 }}
      >
        {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
      </button>
    </main>
  );
}
