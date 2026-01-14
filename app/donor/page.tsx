"use client";

import Link from "next/link";
import { StatsCard } from "@/components/StatsCard";
import { FoodCard } from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

/* 🔹 TEMP DATA */
const stats = {
  totalUploaded: 4,
  activeDonations: 2,
  completedDonations: 1,
  expiredCancelled: 0,
};

const recentDonations = [
  {
    id: "1",
    title: "Fresh Produce",
    description: "Organic vegetables and fruits",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
    quantity: "20 kg",
    foodType: "Produce",
    expiryTime: "Jan 5, 5:00 AM",
    pickupAddress: "789 Park Ave, New York, NY",
    status: "approved" as const,
  },
  {
    id: "2",
    title: "Packaged Food",
    description: "Ready to eat packaged meals",
    imageUrl: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&auto=format&fit=crop&q=60",
    quantity: "100 packets",
    foodType: "Packaged",
    expiryTime: "Jan 10, 9:00 AM",
    pickupAddress: "321 5th Ave, New York, NY",
    status: "available" as const,
  },
];

export default function DonorDashboard() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, John! 👋
              </h2>
              <p className="text-gray-400 mt-1">
                Here's what's happening with your food donations today.
              </p>
            </div>

            <Link href="/donor/donate">
              <Button className="bg-teal-500 text-white hover:bg-teal-600 font-semibold shadow-lg shadow-teal-500/20">
                <Plus className="w-5 h-5 mr-2" />
                Donate Food
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Uploaded"
              value={stats.totalUploaded}
              icon={Package}
              trend="+12%"
              trendUp
            />
            <StatsCard
              title="Active Donations"
              value={stats.activeDonations}
              icon={Truck}
            />
            <StatsCard
              title="Completed"
              value={stats.completedDonations}
              icon={CheckCircle2}
              trend="+5%"
              trendUp
            />
            <StatsCard
              title="Expired/Cancelled"
              value={stats.expiredCancelled}
              icon={AlertCircle}
              trend="-2%"
              trendUp
            />
          </div>

          {/* Recent Activity Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Recent Donations
              </h3>
              <Link
                href="/donor/history"
                className="text-teal-500 hover:text-teal-400 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {recentDonations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDonations.map((food) => (
                  <FoodCard key={food.id} food={food} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  No Active Donations
                </h3>
                <p className="text-gray-400 mt-2 max-w-sm mx-auto">
                  You don't have any active food donations at the moment. Consider donating to help those in need!
                </p>
                <Link href="/donor/donate">
                  <Button
                    variant="outline"
                    className="mt-6 border-teal-500/20 text-teal-500 hover:bg-teal-500/10"
                  >
                    Donate Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
