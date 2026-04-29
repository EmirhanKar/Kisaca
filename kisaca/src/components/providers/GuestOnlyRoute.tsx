"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./ToastProvider";

export default function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        showToast("Zaten giriş yapmışsın, yönlendiriliyorsun.", "info");
        router.replace("/links");
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, router, showToast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-600 dark:text-neutral-300">
        <span className="animate-pulse">Yönlendiriliyor...</span>
      </div>
    );
  }
  if (isAuthenticated) return null;
  return <>{children}</>;
}
