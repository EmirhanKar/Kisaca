import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kısaca.",
  description: "Minimal URL shortener",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body
        className={`${poppins.variable} h-full antialiased bg-white dark:bg-neutral-950 overflow-hidden`}
      >
        <AuthProvider>
          <ToastProvider>
          <Navbar />
          <main className="w-full h-screen flex items-center justify-center relative z-10 overflow-hidden">
            {children}
          </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
