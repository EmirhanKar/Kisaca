"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-600 dark:text-neutral-300">
        <span className="animate-pulse">Kontrol ediliyor...</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
