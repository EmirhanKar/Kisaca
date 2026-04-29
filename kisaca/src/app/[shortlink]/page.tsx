"use client";

import { fetchLinkByShortUrl } from "@/api/links";
import { useToast } from "@/components/providers/ToastProvider";
import { motion } from "framer-motion";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RedirectingPage({
    message = "Yönlendiriliyorsunuz...",
    subtext = "Lütfen bekleyin, işleminiz devam ediyor.",
}: {
    message?: string;
    subtext?: string;
}) {

    const { shortlink } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchLinkByShortUrl(shortlink as string);
                router.push(res.original_url);
            } catch {
                showToast("Link bilgileri alınamadı.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shortlink, showToast]);

    return (
        <div className="relative flex items-center justify-center w-full h-full px-6 overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <AnimatedBackground />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/70 dark:bg-neutral-950/70 
                   backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 
                   shadow-sm rounded-2xl p-8 text-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 
                          flex items-center justify-center">
                        <ArrowRightCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                    </div>

                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {message}
                    </h1>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {subtext}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-neutral-500 dark:text-neutral-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Yönlendirme hazırlanıyor...</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

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
