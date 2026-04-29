"use client";

import { deleteLink, fetchLinks } from "@/api/links";
import { useToast } from "@/components/providers/ToastProvider";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Copy,
    Edit3,
    LinkIcon,
    Search,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ShortLink = {
    id: number;
    short_url: string;
    original_url: string;
    click_count: number;
    created_at: string;
};

export default function LinksPage() {
    const [links, setLinks] = useState<ShortLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState("");
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const { showToast } = useToast();
    const router = useRouter();

    const getLinks = useCallback(async (pageNum: number) => {
        try {
            const res = await fetchLinks(pageNum, 5);
            const newItems = Array.isArray(res) ? res : res.items || [];
            if (newItems.length === 0) {
                setHasMore(false);
                return;
            }
            setLinks((prev) => {
                const merged = [...prev, ...newItems];
                const unique = merged.filter(
                    (link, index, self) => index === self.findIndex((l) => l.id === link.id)
                );
                if (unique.length === prev.length) {
                    setHasMore(false);
                }
                return unique;
            });
        } catch {
            showToast("Bağlantılar alınamadı, lütfen tekrar dene.", "error");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [showToast]);

    const firstLoad = useRef(false);

    useEffect(() => {
        if (!firstLoad.current) {
            firstLoad.current = true;
            getLinks(1);
        }
    }, [getLinks]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading && !loadingMore) {
                    setLoadingMore(true);
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );
        const current = loaderRef.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
            observer.disconnect();
        };
    }, [hasMore, loading, loadingMore]);

    useEffect(() => {
        if (page > 1) getLinks(page);
    }, [page, getLinks]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return links;
        return links.filter(
            (l) =>
                l.short_url.toLowerCase().includes(q) ||
                l.original_url.toLowerCase().includes(q)
        );
    }, [links, query]);

    const handleCopy = async (value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedUrl(value);
        showToast("Bağlantı panoya kopyalandı", "success");
        setTimeout(() => setCopiedUrl(null), 1500);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteLink(id);
            setLinks((prev) => prev.filter((x) => x.id !== id));
            showToast("Bağlantı silindi", "success");
        } catch {
            showToast("Bağlantı silinemedi, tekrar dene.", "error");
        }
    };

    const handleEdit = (id: number) => router.push(`/links/${id}/edit`);

    return (
        <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
            <div className="w-full max-w-3xl bg-white/70 dark:bg-neutral-950/70 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Linklerim
                    </h1>
                    <Link
                        href="/"
                        className="hidden sm:inline-flex px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm transition"
                    >
                        Yeni Link Oluştur
                    </Link>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-2">
                        <Search className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Bağlantılarda ara…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent outline-none text-sm sm:text-base text-neutral-800 dark:text-neutral-200"
                        />
                    </div>
                </div>

                {/* İçerik */}
                <div className="relative max-h-[54vh] overflow-auto pr-1">
                    {loading && <ListSkeleton />}
                    {!loading && filtered.length === 0 && <EmptyState />}

                    <ul className="space-y-3">
                        {filtered.map((item, index) => (
                            <motion.li
                                key={`${item.id}-${index}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className="group border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 rounded-xl p-3 sm:p-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <a
                                                href={item.short_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block truncate font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                title={item.short_url}
                                            >
                                                {item.short_url}
                                            </a>
                                            <p
                                                className="truncate text-xs sm:text-sm text-neutral-600 dark:text-neutral-300"
                                                title={item.original_url}
                                            >
                                                {item.original_url}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                                            <button
                                                onClick={() => handleCopy(item.short_url)}
                                                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-800 transition"
                                                title="Kopyala"
                                            >
                                                {copiedUrl === item.short_url ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleEdit(item.id)}
                                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                                title="Düzenle"
                                            >
                                                <Edit3 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                                                title="Sil"
                                            >
                                                <Trash2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" />
                                            <span>{item.click_count} tıklama</span>
                                        </div>
                                        <time dateTime={item.created_at}>
                                            {new Date(item.created_at).toLocaleDateString("tr-TR")}
                                        </time>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Infinite scroll loader */}
                    {hasMore && !loading && (
                        <div ref={loaderRef} className="py-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
                            {loadingMore ? "Yükleniyor..." : "Daha fazla yüklemek için kaydır"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


function ListSkeleton() {
    return (
        <ul className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <li
                    key={i}
                    className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 rounded-xl p-4 animate-pulse"
                >
                    <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-3" />
                    <div className="flex items-center justify-between">
                        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-8 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                Henüz link bulunmuyor
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">
                İlk kısa bağlantını oluşturmak için hemen dene.
            </p>
            <Link
                href="/"
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm transition"
            >
                Yeni Link Oluştur
            </Link>
        </div>
    );
}
