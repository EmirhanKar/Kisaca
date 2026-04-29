"use client";

import { fetchLinkById, updateLink } from "@/api/links";
import { useToast } from "@/components/providers/ToastProvider";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditLinkPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    original: "",
    short: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchLinkById(Number(id));
        setFormData({
          original: res.original_url,
          short: res.short_url,
        });
      } catch {
        showToast("Link bilgileri alınamadı.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateLink(Number(id), {
        original_url: formData.original,
        short_url: formData.short,
      });

      showToast("Link başarıyla güncellendi!", "success");
      setTimeout(() => router.push("/links"), 1200);
    } catch {
      showToast("Link güncellenemedi. Lütfen tekrar dene.", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-600 dark:text-neutral-300">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Link yükleniyor...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="w-full max-w-lg bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Linki Düzenle
          </h1>
          <Link
            href="/links"
            className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={16} />
            Linklerim
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="original"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Orijinal Bağlantı
            </label>
            <input
              id="original"
              name="original"
              type="url"
              value={formData.original}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 outline-none text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="short"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Kısa Bağlantı
            </label>
            <input
              id="short"
              name="short"
              type="text"
              value={formData.short}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-3 outline-none text-neutral-800 dark:text-neutral-200 focus:ring-2 focus:ring-blue-500"
              placeholder="https://kisaca.app/..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 transition"
          >
            {updating && <Loader2 className="w-5 h-5 animate-spin" />}
            {updating ? "Güncelleniyor..." : "Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}
