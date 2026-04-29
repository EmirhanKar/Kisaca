"use client";

import { register } from "@/api/auth";
import { useToast } from "@/components/providers/ToastProvider";
import { motion } from "framer-motion";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      showToast("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsun.", "success");
      setTimeout(() => router.push("/login"), 50);
    } catch (err: any) {
      showToast(
        err.response?.data?.detail || "Kayıt başarısız. Lütfen tekrar dene.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full h-full px-6 overflow-hidden">
      {/* 🌀 Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatedBackground />
      </div>

      {/* 🧩 Form Card */}
      <div className="w-full max-w-md bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-5">
            Kayıt Ol
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Hesabını oluştur ve bağlantılarını kolayca yönet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              İsim
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 outline-none text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              E-posta adresi
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 outline-none text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500"
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 outline-none text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 transition cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400 mt-6">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

/* 🌈 Animated Background Component */
function AnimatedBackground() {
  const circles = [
    { color: "bg-blue-500/30", size: 240, duration: 18 },
    { color: "bg-blue-400/25", size: 320, duration: 22 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {circles.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${c.color}`}
          style={{
            width: c.size,
            height: c.size,
            top: `${30 + i * 10}%`,
            left: `${20 + i * 25}%`,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
