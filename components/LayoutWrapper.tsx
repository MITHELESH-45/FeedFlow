"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth") || 
                     pathname === "/login" || 
                     pathname === "/register";

  if (isAuthPage || pathname === "/") {
    return <>{children}</>;
  }

  // Determine which mobile nav to show based on route
  let mobileNavType: "donor" | "ngo" | "volunteer" | "admin" = "donor";
  if (pathname?.startsWith("/ngo")) {
    mobileNavType = "ngo";
  } else if (pathname?.startsWith("/volunteer")) {
    mobileNavType = "volunteer";
  } else if (pathname?.startsWith("/admin")) {
    mobileNavType = "admin";
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-16 md:ml-64 md:pb-0">{children}</main>
      </div>
      <MobileBottomNav type={mobileNavType} />
    </>
  );
}

