"use client";

import GuestOnlyRoute from "@/components/providers/GuestOnlyRoute";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
}
