"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Users,
  User,
} from "lucide-react";

type Status = "all" | "available" | "requested" | "approved" | "picked_up" | "completed" | "expired";

interface Donation {
  _id: string;
  foodType: string;
  imageUrl?: string;
  quantity: number;
  unit: string;
  expiryTime: string;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  status: string;
  createdAt: string;
  requestCount?: number;
}

export default function FoodHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status>("all");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/donor/donations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setDonations(data);
        }
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const statusOptions: { value: Status; label: string }[] = [
    { value: "all", label: "All" },
    { value: "available", label: "Available" },
    { value: "requested", label: "Requested" },
    { value: "approved", label: "Approved" },
    { value: "picked_up", label: "Picked Up" },
    { value: "completed", label: "Completed" },
    { value: "expired", label: "Expired" },
  ];

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch = donation.foodType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || donation.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-500 text-white",
    picked_up: "bg-purple-500 text-white",
    approved: "bg-blue-500 text-white",
    available: "bg-teal-500 text-white",
    requested: "bg-yellow-500 text-white",
    expired: "bg-red-500 text-white",
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        {/* Header Section */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white">Food History</h1>
            <p className="text-gray-400 mt-1">Track all your uploaded food donations</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by food type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-teal-500/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      selectedStatus === option.value
                        ? "bg-teal-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] border border-white/10"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-400 text-sm">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>

          {/* Food Cards Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading donations...</div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No donations found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredDonations.map((donation) => (
                <div
                  key={donation._id}
                  className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    {donation.imageUrl ? (
                      <img
                        src={donation.imageUrl}
                        alt={donation.foodType}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-600 text-4xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        className={cn(
                          "capitalize font-medium px-3 py-1",
                          statusColors[donation.status] || "bg-gray-500 text-white"
                        )}
                      >
                        {donation.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3 bg-[#0d1f1a]">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white">
                        {donation.foodType}
                      </h3>
                      <span className="text-xs text-teal-400 flex items-center gap-1">
                        <span>🍽️</span>
                        {donation.quantity} {donation.unit}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4 text-teal-500" />
                        <span>Expires: {new Date(donation.expiryTime).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-teal-500" />
                        <span className="truncate">{donation.pickupLocation.address}</span>
                      </div>

                      {donation.requestCount !== undefined && donation.requestCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users className="w-4 h-4 text-teal-500" />
                          <span>{donation.requestCount} request{donation.requestCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
