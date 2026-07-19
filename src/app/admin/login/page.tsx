"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Невірний пароль");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm neon-border bg-panel rounded-2xl p-8 space-y-4">
        <h1 className="font-display text-xl font-bold neon-text text-center">Admin Panel</h1>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-panel2 border border-white/15 rounded-lg px-4 py-3 outline-none focus:border-neon-purple"
          autoFocus
        />
        {error && <p className="text-neon-pink text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full py-3 rounded-full font-bold bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-neon transition disabled:opacity-50"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
