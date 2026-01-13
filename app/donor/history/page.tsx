"use client";

import { useState } from "react";
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

/* 🔹 MOCK FOOD DONATIONS DATA */
const mockDonations = [
  {
    id: "1",
    title: "Cooked Meals",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60",
    quantity: "50 servings",
    expiryTime: "Jan 3, 8:00 PM",
    pickupAddress: "123 Main St, New York, NY",
    status: "completed" as const,
    ngo: "Hope Foundation",
    volunteer: "Mike Driver",
  },
  {
    id: "2",
    title: "Bakery Items",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=60",
    quantity: "30 pieces",
    expiryTime: "Jan 4, 6:00 AM",
    pickupAddress: "456 Broadway, New York, NY",
    status: "picked_up" as const,
    ngo: "Hope Foundation",
    volunteer: "Mike Driver",
  },
  {
    id: "3",
    title: "Fresh Produce",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
    quantity: "20 kg",
    expiryTime: "Jan 5, 5:00 AM",
    pickupAddress: "789 Park Ave, New York, NY",
    status: "approved" as const,
    ngo: "Hope Foundation",
    volunteer: null,
  },
  {
    id: "4",
    title: "Packaged Food",
    imageUrl: "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&auto=format&fit=crop&q=60",
    quantity: "100 packets",
    expiryTime: "Jan 10, 9:00 AM",
    pickupAddress: "321 5th Ave, New York, NY",
    status: "available" as const,
    ngo: null,
    volunteer: null,
  },
];

type Status = "all" | "available" | "requested" | "approved" | "picked_up" | "completed" | "expired";

export default function FoodHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status>("all");

  const statusOptions: { value: Status; label: string }[] = [
    { value: "all", label: "All" },
    { value: "available", label: "Available" },
    { value: "requested", label: "Requested" },
    { value: "approved", label: "Approved" },
    { value: "picked_up", label: "Picked Up" },
    { value: "completed", label: "Completed" },
    { value: "expired", label: "Expired" },
  ];

  const filteredDonations = mockDonations.filter((donation) => {
    const matchesSearch = donation.title.toLowerCase().includes(searchQuery.toLowerCase());
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
            Showing {filteredDonations.length} of {mockDonations.length} donations
          </div>

          {/* Food Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={donation.imageUrl}
                    alt={donation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={cn(
                        "capitalize font-medium px-3 py-1",
                        statusColors[donation.status]
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
                      {donation.title}
                    </h3>
                    <span className="text-xs text-teal-400 flex items-center gap-1">
                      <span>🍽️</span>
                      {donation.quantity}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4 text-teal-500" />
                      <span>Expires: {donation.expiryTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span className="truncate">{donation.pickupAddress}</span>
                    </div>

                    {donation.ngo && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4 text-teal-500" />
                        <span>NGO: {donation.ngo}</span>
                      </div>
                    )}

                    {donation.volunteer && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4 text-teal-500" />
                        <span>Volunteer: {donation.volunteer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
