"use client";

import GuestOnlyRoute from "@/components/providers/GuestOnlyRoute";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
}
