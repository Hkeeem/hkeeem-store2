"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// تم تعديل هذا السطر ليتوافق مع مسار مجلد supabase في مشروعك
import { supabase } from "@/lib/supabase"; 

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!name || !email || !password) {
      alert("يرجى تعبئة جميع الحقول");
      return;
    }

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
    <main
      dir="rtl"
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1>إنشاء حساب</h1>

      <input
        placeholder="الاسم"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10, color: "black" }}
      />

      <input
        placeholder="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10, color: "black" }}
      />

      <input
        placeholder="كلمة المرور"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 20, padding: 10, color: "black" }}
      />

      <button
        onClick={register}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: "8px"
        }}
      >
        {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
      </button>
    </main>
  );
}
