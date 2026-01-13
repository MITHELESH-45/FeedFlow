"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="p-0 bg-[#111] border-r border-white/10 w-64"
            >
              <Sidebar />
            </SheetContent>
          </Sheet>

          <h1 className="text-xl md:text-2xl font-bold font-display text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent w-64 transition-all"
            />
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer group">
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground group-hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
