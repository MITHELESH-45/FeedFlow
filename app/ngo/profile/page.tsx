"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Edit2,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

// Mock NGO data
const ngoData = {
  id: "n1",
  name: "Food Bank NYC",
  email: "contact@foodbanknyc.org",
  phone: "+1 (555) 987-6543",
  address: "123 Charity Street, New York, NY 10001",
  registrationNumber: "NGO-2024-001",
  description: "Dedicated to fighting hunger by distributing nutritious food to those in need across New York City.",
  website: "www.foodbanknyc.org",
  status: "pending", // pending | approved | rejected
  deliveryLocation: {
    lat: 40.7128,
    lng: -74.006,
    address: "123 Charity St, New York, NY",
  },
  stats: {
    totalRequests: 0,
    completedDeliveries: 0,
    totalFoodReceived: 0,
  },
};

export default function NGOProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(ngoData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    // In real app, make API call here
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(ngoData);
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    const configs = {
      pending: { color: "bg-yellow-500", label: "Pending Approval" },
      approved: { color: "bg-green-500", label: "Approved" },
      rejected: { color: "bg-red-500", label: "Rejected" },
    };

    const config = configs[formData.status as keyof typeof configs];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">NGO Profile</h1>
              <p className="text-gray-400">Manage your organization details</p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-800 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>

          {/* Profile Information */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-500" />
              Organization Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  <User className="w-4 h-4 inline mr-2 text-teal-500" />
                  Organization Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-gray-300">
                  <FileText className="w-4 h-4 inline mr-2 text-teal-500" />
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  disabled
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2 text-teal-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2 text-teal-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-2 text-teal-500" />
                  Office Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website" className="text-gray-300">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white disabled:opacity-70"
                />
              </div>
            </div>
          </Card>

          {/* Delivery Location */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              Delivery Location
            </h2>

            <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
              <p className="text-gray-400 text-sm mb-2">All food will be delivered to:</p>
              <p className="text-white font-medium">{formData.deliveryLocation.address}</p>
              <p className="text-gray-500 text-sm mt-2">
                Coordinates: {formData.deliveryLocation.lat.toFixed(6)}, {formData.deliveryLocation.lng.toFixed(6)}
              </p>
            </div>

            {isEditing && (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Update Location on Map
              </Button>
            )}
          </Card>

          {/* Statistics */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Requests</p>
                <p className="text-white font-bold text-3xl">{formData.stats.totalRequests}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Completed Deliveries</p>
                <p className="text-white font-bold text-3xl">{formData.stats.completedDeliveries}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Food Received (kg)</p>
                <p className="text-white font-bold text-3xl">{formData.stats.totalFoodReceived}</p>
              </div>
            </div>
          </Card>

          {/* Account Settings */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account Settings</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400"
                >
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Change Password</p>
                  <p className="text-gray-400 text-sm">Update your account password</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-700 text-gray-400"
                >
                  Update
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
