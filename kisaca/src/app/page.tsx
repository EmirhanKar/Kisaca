"use client";

import { createLink } from "@/api/links";
import { useToast } from "@/components/providers/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [icons, setIcons] = useState<{ x: number; y: number; scale: number }[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const generated = Array.from({ length: 10 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      scale: Math.random() * 1.5 + 0.4,
    }));
    setIcons(generated);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      const res = await createLink({ target_url: url });
      setShortUrl(res.short_url);
      showToast("Bağlantı başarıyla oluşturuldu!", "success");
    } catch {
      showToast("Bağlantı oluşturulamadı. Lütfen tekrar dene.", "error");
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    showToast("Bağlantı kopyalandı!", "success");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-neutral-950 relative overflow-hidden px-6">
      <div className="absolute inset-0 overflow-hidden z-0">
        {icons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500/20 dark:text-blue-400/10"
            initial={{ x: icon.x, y: icon.y, scale: icon.scale, opacity: 0 }}
            animate={{
              y: [icon.y, icon.y - 400],
              opacity: [0.5, 0.7, 0.45],
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <LinkIcon size={36} />
          </motion.div>
        ))}
      </div>

      <main className="z-10 w-full max-w-lg text-center">
        <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          Kısaca.
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-10">
          Uzun linkleri sadeleştir. Kısaca, paylaş, hatırla.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between w-full bg-neutral-100 dark:bg-neutral-900 rounded-full p-2 shadow-sm border border-neutral-200 dark:border-neutral-800"
        >
          <input
            type="url"
            placeholder="Bir bağlantı yapıştır..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neutral-800 dark:text-neutral-200 px-4"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all cursor-pointer"
          >
            Kısalt
          </button>
        </form>

        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-5 py-2 flex items-center gap-3">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="text-green-500 dark:text-green-400" size={20} />
                  ) : (
                    <Copy className="text-blue-500 dark:text-blue-400" size={20} />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="absolute bottom-6 text-xs text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} Kısaca. — Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
