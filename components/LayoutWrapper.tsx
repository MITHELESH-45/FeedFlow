"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/register";

  if (isAuthPage || pathname === "/") {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 md:ml-64 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </>
  );
}

