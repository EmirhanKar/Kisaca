"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, logoutUser, loading } = useAuth();

  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] md:w-[80%] backdrop-blur-md bg-white/70 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 rounded-full px-6 py-2 shadow-sm flex items-center justify-between">
      <Link href="/" className="flex items-center justify-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400 select-none">
        <div>
          Kısaca<span className="text-neutral-500 dark:text-neutral-400">.</span>
        </div>
      </Link>

      {!loading && (
        <div className="hidden sm:flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Giriş Yap
              </Link>
              <Link href="/register" className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-medium transition">
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              <Link href="/links" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                Linklerim
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-red-600 dark:hover:bg-red-800 transition text-sm cursor-pointer"
              >
                Çıkış Yap
              </button>
            </>
          )}
        </div>
      )}

      <div className="sm:hidden flex items-center">
        {!loading && <MobileMenu user={user} onLogout={handleLogout} />}
      </div>
    </nav>
  );
}

function MobileMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
        ☰
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
          >
            <div className="flex flex-col text-sm">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Giriş Yap
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Kayıt Ol
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/links" onClick={() => setOpen(false)} className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    Linklerim
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setOpen(false);
                    }}
                    className="text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Çıkış Yap
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
