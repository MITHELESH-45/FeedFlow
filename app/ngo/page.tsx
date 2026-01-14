"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationPickerWrapper from "@/components/LocationPickerWrapper";
import {
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Heart,
  TrendingUp,
  Search,
  Bell,
  MapPin,
  Save,
} from "lucide-react";

// Mock NGO data
const ngoData = {
  id: "1",
  name: "Food Bank NYC",
  email: "contact@foodbanknyc.org",
  status: "pending", // "pending" | "approved" | "rejected"
  location: null as { lat: number; lng: number; address: string } | null, // Set to null to trigger setup
  stats: {
    totalRequests: 0,
    approvedRequests: 0,
    completedDeliveries: 0,
    pendingRequests: 0,
  },
};

export default function NGOPage() {
  const [ngo, setNgo] = useState(ngoData);
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    lat: 40.7128,
    lng: -74.006,
  });
  const [isSaving, setIsSaving] = useState(false);

  const isApproved = ngo.status === "approved";

  // Check if location is set on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("ngo_location");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setNgo((prev) => ({ ...prev, location: parsedLocation }));
        setLocationData((prev) => ({
          ...prev,
          lat: parsedLocation.lat,
          lng: parsedLocation.lng,
        }));
        setShowLocationSetup(false);
      } catch (e) {
        console.error("Failed to parse saved location", e);
      }
    } else if (!ngo.location) {
      setShowLocationSetup(true);
    }
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationData((prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }));
        },
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const handleSaveLocation = async () => {
    if (!locationData.address || !locationData.city || !locationData.state || !locationData.zipCode) {
      alert("Please fill in all address fields");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fullAddress = `${locationData.address}, ${locationData.city}, ${locationData.state} ${locationData.zipCode}`;
    
    const locationObj = {
      lat: locationData.lat,
      lng: locationData.lng,
      address: fullAddress,
    };

    localStorage.setItem("ngo_location", JSON.stringify(locationObj));

    setNgo({
      ...ngo,
      location: locationObj,
    });

    setIsSaving(false);
    setShowLocationSetup(false);
    alert("Delivery location saved successfully!");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-20">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome, {ngo.name}! 👋
              </h2>
              <p className="text-gray-400 mt-1">
                Manage your food requests and deliveries
              </p>
            </div>

            <Link href="/ngo/available-food">
              <Button className="bg-teal-500 text-white hover:bg-teal-600 font-semibold shadow-lg shadow-teal-500/20">
                <Search className="w-5 h-5 mr-2" />
                Browse Available Food
              </Button>
            </Link>
          </div>

          {/* Approval Status Alert */}
          {!isApproved && (
            <Alert className="bg-yellow-500/10 border-yellow-500/50">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <AlertDescription className="text-yellow-400">
                <strong>Approval Pending:</strong> Your NGO account is under review. 
                You can browse available food, but you need admin approval to request food.
              </AlertDescription>
            </Alert>
          )}

          {isApproved && (
            <Alert className="bg-green-500/10 border-green-500/50">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <AlertDescription className="text-green-400">
                <strong>Approved:</strong> Your NGO is verified! You can now request food donations.
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Requests</p>
                  <p className="text-white font-bold text-2xl">{ngo.stats.totalRequests}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Approved</p>
                  <p className="text-white font-bold text-2xl">{ngo.stats.approvedRequests}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                  <p className="text-white font-bold text-2xl">{ngo.stats.completedDeliveries}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-white font-bold text-2xl">{ngo.stats.pendingRequests}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 p-6 hover:border-teal-500/50 transition-colors cursor-pointer">
              <Link href="/ngo/available-food">
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Browse Food</h3>
                  <p className="text-gray-400 text-sm">
                    View all available food donations
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6 hover:border-teal-500/50 transition-colors cursor-pointer">
              <Link href="/ngo/requests">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">My Requests</h3>
                  <p className="text-gray-400 text-sm">
                    Track all your food requests
                  </p>
                </div>
              </Link>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-6 hover:border-teal-500/50 transition-colors cursor-pointer">
              <Link href="/ngo/notifications">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Notifications</h3>
                  <p className="text-gray-400 text-sm">
                    View updates and alerts
                  </p>
                </div>
              </Link>
            </Card>
          </div>

          {/* Delivery Location */}
          {ngo.location && (
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-teal-500" />
                Your Delivery Location
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">All food will be delivered to:</p>
                <p className="text-white font-medium">{ngo.location.address}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Coordinates: {ngo.location.lat.toFixed(6)}, {ngo.location.lng.toFixed(6)}
                </p>
              </div>
              <Button
                onClick={() => setShowLocationSetup(true)}
                variant="outline"
                className="mt-4 border-gray-700 text-gray-400 hover:text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Update Location
              </Button>
            </Card>
          )}

          {/* Getting Started Guide */}
          {!isApproved && (
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Getting Started
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Registration Complete</p>
                    <p className="text-gray-400 text-sm">Your account has been created</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Awaiting Admin Approval</p>
                    <p className="text-gray-400 text-sm">We're reviewing your NGO details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>

      {/* Location Setup Dialog */}
      <Dialog open={showLocationSetup} onOpenChange={(open) => {
        // Prevent closing if location is not set (first time setup)
        if (!open && !ngo.location) {
          alert("Please set your delivery location to continue");
          return;
        }
        setShowLocationSetup(open);
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-500" />
              Set Delivery Location
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {ngo.location 
                ? "Update your delivery location. All food donations will be delivered to this address."
                : "Please set your delivery location. All food donations will be delivered to this address."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Address Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-gray-300">
                  Street Address *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={locationData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-gray-300">
                    City *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={locationData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-gray-300">
                    State *
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={locationData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="zipCode" className="text-gray-300">
                  ZIP Code *
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={locationData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
            </div>

            {/* Map Picker */}
            <div>
              <Label className="text-gray-300 mb-2 block">
                Click on the map to set exact coordinates
              </Label>
              <LocationPickerWrapper
                onLocationSelect={(lat, lng) =>
                  setLocationData((prev) => ({ ...prev, lat, lng }))
                }
                initialLat={locationData.lat}
                initialLng={locationData.lng}
              />

              <div className="bg-gray-800/50 p-3 rounded-lg mt-2">
                <p className="text-sm text-gray-400">
                  Selected Coordinates: {locationData.lat.toFixed(6)}, {locationData.lng.toFixed(6)}
                </p>
              </div>
            </div>

            {/* Alert */}
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <AlertDescription className="text-blue-400">
                <strong>Important:</strong> This will be your permanent delivery location. All food donations will be delivered here.
              </AlertDescription>
            </Alert>

            {/* Save Button */}
            <Button
              onClick={handleSaveLocation}
              disabled={isSaving}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-6"
            >
              {isSaving ? (
                "Saving Location..."
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Delivery Location
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
                  <div>
                    <p className="text-white font-medium">Start Requesting Food</p>
                    <p className="text-gray-400 text-sm">Available after approval</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}




