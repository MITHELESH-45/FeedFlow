"use client";

import { useState } from "react";
import { Clock, MapPin, Package, ArrowRight, X, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Frontend-only food type
 * (backend can replace this later)
 */
type FoodResponse = {
  id: number | string;
  title: string;
  description?: string;
  imageUrl?: string;
  quantity: string;
  foodType: string;
  expiryTime: string | number | Date;
  pickupAddress: string;
  status:
    | "available"
    | "requested"
    | "approved"
    | "picked_up"
    | "completed"
    | "expired"
    | "cancelled";
};

export function FoodCard({ food }: { food: FoodResponse }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusColors: Record<FoodResponse["status"], string> = {
    available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    requested: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    approved: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    picked_up: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    completed: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    expired: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <>
      <div className="group bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
        <img
          src={
            food.imageUrl ||
            "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=60"
          }
          alt={food.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "capitalize border backdrop-blur-md",
              statusColors[food.status]
            )}
          >
            {food.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold font-display text-white group-hover:text-primary transition-colors">
            {food.title}
          </h3>

          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
            #{food.id}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {food.description || "No description provided."}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Package className="w-4 h-4 text-primary" />
            <span>
              {food.quantity} ({food.foodType})
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4 text-primary" />
            <span suppressHydrationWarning>
              Expires:{" "}
              {new Date(food.expiryTime).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{food.pickupAddress}</span>
          </div>
        </div>

        <button 
          onClick={() => setShowDetails(true)}
          className="w-full mt-auto py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:border-primary/30"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

    {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-teal-500" />
            Donation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={
                food.imageUrl ||
                "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=60"
              }
              alt={food.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge
                className={cn(
                  "capitalize border backdrop-blur-md text-base px-4 py-1",
                  statusColors[food.status]
                )}
              >
                {food.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Package className="w-4 h-4 text-teal-500" />
                <span className="text-sm">Food Details</span>
              </div>
              <h3 className="text-lg font-bold text-white">{food.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {food.description || "No description provided."}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Package className="w-4 h-4 text-teal-500" />
                <span className="text-sm">Quantity & Type</span>
              </div>
              <p className="text-lg font-bold text-white">{food.quantity}</p>
              <p className="text-sm text-gray-400 mt-1">Type: {food.foodType}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span className="text-sm">Expiry Date</span>
              </div>
              <p className="text-lg font-bold text-white" suppressHydrationWarning>
                {new Date(food.expiryTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 mt-1" suppressHydrationWarning>
                {new Date(food.expiryTime).toLocaleTimeString()}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span className="text-sm">Pickup Location</span>
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">
                {food.pickupAddress}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <User className="w-4 h-4 text-teal-500" />
              <span className="text-sm">Donation ID</span>
            </div>
            <p className="text-white font-mono">#{food.id}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Button
              onClick={() => setShowDetails(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
            >
              Close
            </Button>
            {food.status === "available" && (
              <Button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
                Edit Donation
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
