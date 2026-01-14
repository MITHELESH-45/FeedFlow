"use client";

import { useState, useEffect } from "react";
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

export default function NGOProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedDeliveries: 0,
    totalFoodReceived: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/ngo/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            address: data.deliveryLocation?.address || "",
            registrationNumber: data.organization || "",
            description: "",
            website: "",
            status: data.status,
            deliveryLocation: data.deliveryLocation,
          });
        }

        // Fetch stats
        const statsRes = await fetch("/api/ngo/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statsData = await statsRes.json();
        if (statsRes.ok) {
          setStats({
            totalRequests: statsData.totalRequests || 0,
            completedDeliveries: statsData.completedRequests || 0,
            totalFoodReceived: 0, // This would need a separate calculation
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ngo/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          organization: formData.registrationNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/ngo/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            address: data.deliveryLocation?.address || "",
            registrationNumber: data.organization || "",
            description: "",
            website: "",
            status: data.status,
            deliveryLocation: data.deliveryLocation,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
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

  if (loading || !formData) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
        <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
          <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full pb-24 md:pb-20">
            <div className="text-center py-12 text-gray-400">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

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
                  disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
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

            {formData.deliveryLocation ? (
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <p className="text-gray-400 text-sm mb-2">All food will be delivered to:</p>
                <p className="text-white font-medium">{formData.deliveryLocation.address}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Coordinates: {formData.deliveryLocation.lat.toFixed(6)}, {formData.deliveryLocation.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <p className="text-gray-400 text-sm">No delivery location set. Please set it from the dashboard.</p>
              </div>
            )}

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
                <p className="text-white font-bold text-3xl">{stats.totalRequests}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Completed Deliveries</p>
                <p className="text-white font-bold text-3xl">{stats.completedDeliveries}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Food Received (kg)</p>
                <p className="text-white font-bold text-3xl">{stats.totalFoodReceived}</p>
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
