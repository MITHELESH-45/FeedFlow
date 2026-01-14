"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Clock,
  Package,
  AlertCircle,
  Filter,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function AvailableFoodPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [foods, setFoods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAppStore();
  const isApproved = user?.status === "approved";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch("/api/food");
        const data = await res.json();
        if (res.ok) {
          setFoods(data.foods.map((f: any) => ({
            id: f._id,
            donorId: f.donor?._id,
            donorName: f.donor?.name || "Unknown Donor",
            foodType: f.foodType,
            quantity: f.quantity,
            unit: f.unit,
            preparedTime: f.preparedTime,
            expiryTime: f.expiryTime,
            pickupLocation: f.pickupLocation,
            imageUrl: f.imageUrl,
            status: f.status,
          })));
        }
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesSearch =
      food.foodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || food.foodType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatTimeRemaining = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) return "Expired";
    return `${hours}h remaining`;
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Available Food</h1>
            <p className="text-gray-400">Browse and request food donations</p>
          </div>

          {/* Approval Warning */}
          {!isApproved && (
            <Alert className="bg-yellow-500/10 border-yellow-500/50">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                <strong>Admin Approval Required:</strong> You can browse food, but you need admin approval to request donations.
              </AlertDescription>
            </Alert>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by food type or donor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-800 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={
                  filterType === "all"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "border-gray-800 text-gray-400"
                }
              >
                All
              </Button>
              <Button
                variant={filterType === "Cooked Meals" ? "default" : "outline"}
                onClick={() => setFilterType("Cooked Meals")}
                className={
                  filterType === "Cooked Meals"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "border-gray-800 text-gray-400"
                }
              >
                Cooked
              </Button>
              <Button
                variant={filterType === "Packaged Food" ? "default" : "outline"}
                onClick={() => setFilterType("Packaged Food")}
                className={
                  filterType === "Packaged Food"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : "border-gray-800 text-gray-400"
                }
              >
                Packaged
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-400 text-sm">
            Found {filteredFoods.length} available food {filteredFoods.length === 1 ? "item" : "items"}
          </p>

          {/* Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="bg-gray-900/50 border-gray-800 overflow-hidden hover:border-teal-500/50 transition-all"
              >
                {/* Food Image */}
                <div className="relative h-48 bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-600" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    Available
                  </Badge>
                </div>

                {/* Food Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {food.foodType}
                    </h3>
                    <p className="text-sm text-gray-400">by {food.donorName}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>
                      {food.quantity} {food.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-orange-400">
                      {formatTimeRemaining(food.expiryTime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{food.pickupLocation.address}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 space-y-2">
                    <Link href={`/ngo/available-food/${food.id}`}>
                      <Button
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    {isApproved ? (
                      <Link href={`/ngo/available-food/${food.id}`}>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold">
                          Request Food
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        className="w-full bg-gray-800 text-gray-500 cursor-not-allowed"
                        title="Approval required to request food"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Approval Required
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredFoods.length === 0 && (
            <Card className="bg-gray-900/50 border-gray-800 p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Food Found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
