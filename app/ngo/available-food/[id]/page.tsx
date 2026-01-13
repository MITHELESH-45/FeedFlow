"use client";

import { useState } from "react";
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

// Mock food data
const foodData = {
  id: "1",
  donorId: "d1",
  donorName: "Restaurant ABC",
  donorPhone: "+1 (555) 123-4567",
  foodType: "Cooked Meals",
  quantity: 50,
  unit: "meals",
  preparedTime: "2024-01-15T10:00:00",
  expiryTime: "2024-01-15T18:00:00",
  pickupLocation: {
    lat: 40.758,
    lng: -73.9855,
    address: "Times Square, New York, NY",
  },
  imageUrl: "/placeholder-food.jpg",
  status: "available",
  description: "Fresh cooked meals including rice, vegetables, and curry. Prepared in our commercial kitchen following all food safety standards.",
};

// Mock NGO data
const ngoData = {
  id: "n1",
  name: "Food Bank NYC",
  status: "pending", // Change to "approved" to test
  deliveryLocation: {
    lat: 40.7128,
    lng: -74.006,
    address: "123 Charity St, New York, NY",
  },
};

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [requestedQuantity, setRequestedQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isApproved = ngoData.status === "approved";
  const food = foodData; // In real app, fetch by params.id

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

    if (parseInt(requestedQuantity) > food.quantity) {
      alert(`Maximum available quantity is ${food.quantity} ${food.unit}`);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create request object
    const request = {
      id: `req_${Date.now()}`,
      foodId: food.id,
      ngoId: ngoData.id,
      ngoName: ngoData.name,
      donorId: food.donorId,
      donorName: food.donorName,
      foodType: food.foodType,
      requestedQuantity: parseInt(requestedQuantity),
      unit: food.unit,
      pickupLocation: food.pickupLocation,
      deliveryLocation: ngoData.deliveryLocation,
      status: "requested",
      requestDate: new Date().toISOString(),
    };

    console.log("Request created:", request);

    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/ngo/requests");
    }, 2000);
  };

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
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-600" />
                </div>
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
                <p className="text-gray-400">{food.description}</p>
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

                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-teal-500" />
                  <div>
                    <p className="text-sm text-gray-400">Prepared Time</p>
                    <p className="font-semibold">{formatDateTime(food.preparedTime)}</p>
                  </div>
                </div>

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
                    <p className="font-semibold">{food.donorName}</p>
                    <p className="text-sm text-gray-500">{food.donorPhone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pickup Location Map */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              Pickup Location (Donor Address)
            </h2>

            {/* Read-only Map */}
            <div
              className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800"
              style={{
                backgroundImage: `url(https://tile.openstreetmap.org/8/${Math.floor(
                  ((food.pickupLocation.lng + 180) / 360) * Math.pow(2, 8)
                )}/${Math.floor(
                  ((1 -
                    Math.log(
                      Math.tan((food.pickupLocation.lat * Math.PI) / 180) +
                        1 / Math.cos((food.pickupLocation.lat * Math.PI) / 180)
                    ) /
                      Math.PI) /
                    2) *
                    Math.pow(2, 8)
                )}.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Map Marker */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full"
              >
                <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" />
              </div>

              {/* Read-only overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Badge className="bg-gray-900/80 text-white border-gray-700">
                  Read-Only Map View
                </Badge>
              </div>
            </div>

            <div className="mt-4 bg-gray-800/50 p-4 rounded-lg">
              <p className="text-white font-medium">{food.pickupLocation.address}</p>
              <p className="text-gray-500 text-sm mt-1">
                Coordinates: {food.pickupLocation.lat.toFixed(6)}, {food.pickupLocation.lng.toFixed(6)}
              </p>
            </div>
          </Card>

          {/* Request Form */}
          {!isApproved && (
            <Alert className="bg-yellow-500/10 border-yellow-500/50">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                <strong>Approval Required:</strong> You need admin approval to request food donations.
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
                  disabled={!isApproved}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum available: {food.quantity} {food.unit}
                </p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Delivery Location:</p>
                <p className="text-white font-medium">{ngoData.deliveryLocation.address}</p>
                <p className="text-gray-500 text-sm mt-1">
                  All food will be delivered to your registered NGO address
                </p>
              </div>

              <Button
                onClick={handleRequestFood}
                disabled={!isApproved || isSubmitting || !requestedQuantity}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6"
              >
                {isSubmitting ? (
                  "Submitting Request..."
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
