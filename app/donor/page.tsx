"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/StatsCard";
import { FoodCard } from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

export default function DonorDashboard() {
  const user = useAppStore((state) => state.user);
  const [stats, setStats] = useState({
    totalUploaded: 0,
    activeDonations: 0,
    completedDonations: 0,
    expiredCancelled: 0,
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch dashboard stats
        const statsResponse = await fetch("/api/donor/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statsData = await statsResponse.json();
        if (statsResponse.ok) {
          setStats(statsData);
        }

        // Fetch recent donations
        const donationsResponse = await fetch("/api/donor/donations?status=all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const donationsData = await donationsResponse.json();
        if (donationsResponse.ok) {
          // Transform data for FoodCard component
          const transformed = donationsData.slice(0, 6).map((food: any) => ({
            id: food._id || food.id,
            title: food.name || food.foodType,
            description: food.description,
            imageUrl: food.imageUrl || "/placeholder-food.jpg",
            quantity: `${food.quantity} ${food.unit}`,
            foodType: food.foodType,
            expiryTime: new Date(food.expiryTime).toLocaleString(),
            pickupAddress: food.pickupLocation?.address || "Address not provided",
            status: food.status,
            approvedRequest: food.approvedRequest || null,
            assignedVolunteer: food.assignedVolunteer || null,
          }));
          setRecentDonations(transformed);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {user?.name || "User"}! 👋
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



