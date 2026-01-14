"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  Save,
  X,
  Camera,
  Award,
  Package,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function DonorProfilePage() {
  const user = useAppStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    foodDonated: "0 kg",
    impactScore: 0,
    activeSince: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch profile
        const profileRes = await fetch("/api/donor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setFormData({
            name: profileData.name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            organization: profileData.organization || "",
            address: "",
            bio: "",
            avatar: "",
          });
          setStats({
            activeSince: new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          });
        }

        // Fetch dashboard stats
        const dashboardRes = await fetch("/api/donor/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const dashboardData = await dashboardRes.json();
        if (dashboardRes.ok) {
          setStats(prev => ({
            ...prev,
            totalDonations: dashboardData.totalUploaded || 0,
            foodDonated: `${dashboardData.totalUploaded || 0} items`,
            impactScore: dashboardData.totalUploaded > 0 ? Math.min(100, Math.floor((dashboardData.completedDonations / dashboardData.totalUploaded) * 100)) : 0,
          }));
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/donor/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          organization: formData.organization,
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
        const res = await fetch("/api/donor/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            organization: data.organization || "",
            address: "",
            bio: "",
            avatar: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
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
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <User className="w-8 h-8 text-teal-500" />
                My Profile
              </h1>
              <p className="text-gray-400 mt-1">Manage your account information</p>
            </div>

            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="bg-teal-500/30 text-teal-400 text-3xl font-bold">
                      {formData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
                <Badge className="mt-4 bg-teal-500/20 text-teal-400 border-teal-500/50">
                  Verified Donor
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organization
                    </Label>
                    {isEditing ? (
                      <Input
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{formData.organization}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{formData.address}</p>
                  )}
                </div>

                <div>
                  <Label className="text-gray-400 text-sm mb-1">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-gray-300 text-sm">{formData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-teal-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Total Donations</p>
                  <p className="text-white font-bold text-xl">{stats.totalDonations}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Food Donated</p>
                  <p className="text-white font-bold text-xl">{stats.foodDonated}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Impact Score</p>
                  <p className="text-white font-bold text-xl">{stats.impactScore}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Active Since</p>
                  <p className="text-white font-bold text-lg">{stats.activeSince}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Settings */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive updates about your donations</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <p className="text-white font-medium">Change Password</p>
                  <p className="text-gray-400 text-sm">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700">
                  Update
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/50">
                <div>
                  <p className="text-red-400 font-medium">Delete Account</p>
                  <p className="text-red-400/70 text-sm">Permanently delete your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/10">
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
