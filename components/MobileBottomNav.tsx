"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Plus,
  Clock,
  Bell,
  User,
  Package,
  Search,
  Heart,
  Users,
} from "lucide-react";

interface MobileBottomNavProps {
  type: "donor" | "ngo" | "volunteer" | "admin";
}

const navigationConfig = {
  donor: [
    { name: "Dashboard", href: "/donor", icon: LayoutGrid },
    { name: "Upload", href: "/donor/donate", icon: Plus },
    { name: "History", href: "/donor/history", icon: Clock },
    { name: "Alerts", href: "/donor/notifications", icon: Bell },
    { name: "Profile", href: "/donor/profile", icon: User },
  ],
  ngo: [
    { name: "Dashboard", href: "/ngo", icon: LayoutGrid },
    { name: "Browse", href: "/ngo/available-food", icon: Search },
    { name: "Requests", href: "/ngo/requests", icon: Package },
    { name: "Alerts", href: "/ngo/notifications", icon: Bell },
    { name: "Profile", href: "/ngo/profile", icon: User },
  ],
  volunteer: [
    { name: "Dashboard", href: "/volunteer", icon: LayoutGrid },
    { name: "History", href: "/volunteer/history", icon: Clock },
    { name: "Alerts", href: "/volunteer/notifications", icon: Bell },
    { name: "Profile", href: "/volunteer/profile", icon: User },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutGrid },
    { name: "NGOs", href: "/admin/ngos", icon: Heart },
    { name: "Volunteers", href: "/admin/volunteers", icon: Users },
    { name: "Profile", href: "/admin/profile", icon: User },
  ],
};

export function MobileBottomNav({ type }: MobileBottomNavProps) {
  const pathname = usePathname();
  const navigation = navigationConfig[type];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d1f1a] border-t border-white/10 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all rounded-lg",
                isActive
                  ? "text-teal-500"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
