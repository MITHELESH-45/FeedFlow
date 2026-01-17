"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>

        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
              }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-muted-foreground text-sm font-medium mb-1">
          {title}
        </h4>
        <div className="text-3xl font-bold font-display text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
