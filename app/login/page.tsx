"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login() {
    if (!email || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        تسجيل الدخول
      </h1>

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      {errorMessage && (
        <p
          style={{
            color: "red",
            marginBottom: 10,
          }}
        >
          {errorMessage}
        </p>
      )}

      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>

      <p
        style={{
          marginTop: 20,
          textAlign: "center",
        }}
      >
        ليس لديك حساب؟{" "}
        <Link href="/register">
          إنشاء حساب
        </Link>
      </p>
    </main>
  );
}
