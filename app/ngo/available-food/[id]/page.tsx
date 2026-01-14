"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import ReadOnlyMap from "@/components/ReadOnlyMap";

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const [requestedQuantity, setRequestedQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [food, setFood] = useState<any>(null);
  const [ngo, setNgo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch food details
        const foodRes = await fetch(`/api/ngo/available-food/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const foodData = await foodRes.json();
        if (foodRes.ok) {
          setFood(foodData);
        }

        // Fetch NGO profile - always fetch fresh to get latest status
        const ngoRes = await fetch("/api/ngo/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store", // Force fresh data
        });
        const ngoData = await ngoRes.json();
        if (ngoRes.ok) {
          console.log("NGO Status from API:", ngoData.status);
          setNgo(ngoData);
          // Update Zustand store with fresh status
          const { useAppStore } = await import("@/lib/store");
          const currentUser = useAppStore.getState().user;
          if (currentUser) {
            useAppStore.getState().setUser({
              ...currentUser,
              status: ngoData.status,
            });
          }
        } else {
          console.error("Failed to fetch NGO profile:", ngoData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  // Check approval status - use ngo state first, fallback to user from store
  // Only check if data has loaded (not loading)
  const ngoStatus = ngo?.status;
  const userStatus = user?.status;
  const isApproved = !loading && (ngoStatus === "approved" || userStatus === "approved");
  
  // Debug: Log status check
  useEffect(() => {
    if (!loading) {
      console.log("NGO Approval Check:", {
        loading,
        hasNgo: !!ngo,
        ngoStatus: ngoStatus,
        hasUser: !!user,
        userStatus: userStatus,
        isApproved: ngoStatus === "approved" || userStatus === "approved",
      });
    }
  }, [ngo, user, loading, ngoStatus, userStatus]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRequestFood = async () => {
    if (!requestedQuantity || parseInt(requestedQuantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!food) {
      alert("Food data not loaded");
      return;
    }

    if (parseInt(requestedQuantity) > food.quantity) {
      alert(`Maximum available quantity is ${food.quantity} ${food.unit}`);
      return;
    }

    // Double-check approval status before submitting
    if (!isApproved) {
      alert("Your NGO account must be approved by admin before requesting food");
      return;
    }

    if (!ngo?.deliveryLocation) {
      alert("Please set your delivery location first");
      router.push("/ngo");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ngo/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: food._id || food.id,
          quantity: parseInt(requestedQuantity),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Request submitted successfully:", data);
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/ngo/requests");
        }, 2000);
      } else {
        console.error("Request submission failed:", data);
        alert(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !food) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
        <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
          <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
            <div className="text-center py-12 text-gray-400">Loading food details...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
          {/* Back Button */}
          <Link href="/ngo/available-food">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Available Food
            </Button>
          </Link>

          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <AlertDescription className="text-green-400">
                <strong>Request Submitted!</strong> Redirecting to My Requests...
              </AlertDescription>
            </Alert>
          )}

          {/* Food Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Section */}
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <div className="relative h-64 md:h-full bg-gray-800">
                {food.imageUrl ? (
                  <img src={food.imageUrl} alt={food.foodType} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-600" />
                  </div>
                )}
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  {food.status}
                </Badge>
              </div>
            </Card>

            {/* Info Section */}
            <Card className="bg-gray-900/50 border-gray-800 p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {food.foodType}
                </h1>
                <p className="text-gray-400">{food.description || "No description available"}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-gray-300">
                  <Package className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Available Quantity</p>
                    <p className="font-semibold">
                      {food.quantity} {food.unit}
                    </p>
                  </div>
                </div>

                {food.preparedTime && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-gray-400">Prepared Time</p>
                      <p className="font-semibold">{formatDateTime(food.preparedTime)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-400">Expiry Time</p>
                    <p className="font-semibold text-orange-400">
                      {formatDateTime(food.expiryTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <User className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Donor</p>
                    <p className="font-semibold">{food.donorId?.name || "Unknown"}</p>
                    {food.donorId?.phone && (
                      <p className="text-sm text-gray-500">{food.donorId.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pickup Location Map */}
          {food.pickupLocation && (
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                Pickup Location (Donor Address)
              </h2>

              {/* Read-only Map using ReadOnlyMap component */}
              {ngo?.deliveryLocation ? (
                <ReadOnlyMap
                  pickupLocation={{ lat: food.pickupLocation.lat, lng: food.pickupLocation.lng }}
                  dropLocation={{ lat: ngo.deliveryLocation.lat, lng: ngo.deliveryLocation.lng }}
                  pickupLabel="Pickup Location"
                  dropLabel="Your Delivery Location"
                />
              ) : (
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Set your delivery location to see the route</p>
                  </div>
                </div>
              )}

              <div className="mt-4 bg-gray-800/50 p-4 rounded-lg">
                <p className="text-white font-medium">{food.pickupLocation.address}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Coordinates: {food.pickupLocation.lat.toFixed(6)}, {food.pickupLocation.lng.toFixed(6)}
                </p>
              </div>
            </Card>
          )}

          {/* Request Form */}
          {!loading && !isApproved && (
            <Alert className="bg-yellow-500/10 border-yellow-500/50">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                <strong>Approval Required:</strong> You need admin approval to request food donations. 
                Current status: {ngoStatus || userStatus || "unknown"}
              </AlertDescription>
            </Alert>
          )}
          
          {!loading && isApproved && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <AlertDescription className="text-green-400">
                <strong>Approved:</strong> You can request food donations.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Request This Food</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-gray-300">
                  Quantity Needed ({food.unit})
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={food.quantity}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value)}
                  placeholder={`Max: ${food.quantity} ${food.unit}`}
                  disabled={loading || !isApproved}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum available: {food.quantity} {food.unit}
                </p>
              </div>

              {ngo?.deliveryLocation ? (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Delivery Location:</p>
                  <p className="text-white font-medium">{ngo.deliveryLocation.address}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    All food will be delivered to your registered NGO address
                  </p>
                </div>
              ) : (
                <Alert className="bg-yellow-500/10 border-yellow-500/50">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <AlertDescription className="text-yellow-400">
                    <strong>Location Required:</strong> Please set your delivery location first.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleRequestFood}
                disabled={loading || !isApproved || isSubmitting || !requestedQuantity}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Submitting Request..."
                ) : loading ? (
                  "Loading..."
                ) : !isApproved ? (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Approval Required
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
