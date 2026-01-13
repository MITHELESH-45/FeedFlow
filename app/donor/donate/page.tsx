"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Image as ImageIcon,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import LocationPickerWrapper from "@/components/LocationPickerWrapper";

interface FormData {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  unit: string;
  preparedTime: string;
  expiryTime: string;
  image: File | null;
  imagePreview: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

const foodTypes = [
  "Produce",
  "Packaged",
  "Cooked Meals",
  "Dairy",
  "Bakery",
  "Canned Goods",
  "Frozen",
  "Other",
];

const units = ["kg", "lbs", "packets", "pieces", "servings", "liters"];

export default function DonateFoodPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    foodType: "",
    quantity: "",
    unit: "kg",
    preparedTime: "",
    expiryTime: "",
    image: null,
    imagePreview: "",
    latitude: null,
    longitude: null,
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Image validation
    if (!formData.imagePreview) {
      newErrors.image = "Food image is required";
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Food title is required";
    }

    // Food type validation
    if (!formData.foodType) {
      newErrors.foodType = "Food type is required";
    }

    // Quantity validation
    const quantity = parseFloat(formData.quantity);
    if (!formData.quantity || quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    // Prepared time validation
    if (!formData.preparedTime) {
      newErrors.preparedTime = "Prepared time is required";
    }

    // Expiry time validation
    if (!formData.expiryTime) {
      newErrors.expiryTime = "Expiry time is required";
    } else if (formData.preparedTime && formData.expiryTime) {
      const preparedDate = new Date(formData.preparedTime);
      const expiryDate = new Date(formData.expiryTime);
      if (expiryDate <= preparedDate) {
        newErrors.expiryTime = "Expiry time must be after prepared time";
      }
    }

    // Location validation
    if (formData.latitude === null || formData.longitude === null) {
      newErrors.location = "Pickup location is required. Click on the map to select.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Create food object
      const newFood = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        foodType: formData.foodType,
        quantity: `${formData.quantity} ${formData.unit}`,
        preparedTime: new Date(formData.preparedTime).toLocaleString(),
        expiryTime: new Date(formData.expiryTime).toLocaleString(),
        imageUrl: formData.imagePreview,
        pickupLocation: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address,
        },
        status: "available",
        createdAt: new Date().toISOString(),
      };

      // Create notification
      const notification = {
        id: Date.now().toString(),
        type: "success",
        title: "Food Donation Created",
        message: `Your donation "${formData.title}" has been successfully uploaded and is now available for pickup.`,
        time: "Just now",
        read: false,
        category: "donation",
      };

      console.log("New Food:", newFood);
      console.log("Notification:", notification);

      setIsSubmitting(false);
      setShowSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/donor");
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-foreground overflow-hidden">
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-gray-900/50 border-gray-800 p-12 max-w-md text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Donation Created Successfully!
            </h2>
            <p className="text-gray-400 mb-6">
              Your food donation is now available for pickup. Redirecting to dashboard...
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full pb-24 md:pb-20">
          {/* Header */}
          <div className="mb-8">
            <Link href="/donor">
              <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Upload className="w-8 h-8 text-teal-500" />
              Donate Food
            </h1>
            <p className="text-gray-400 mt-1">
              Share surplus food and make a difference
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <Label className="text-white font-semibold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-teal-500" />
                Food Image *
              </Label>
              <div className="mt-2">
                {formData.imagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-700"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: null, imagePreview: "" }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-teal-500 transition-colors bg-gray-900/30">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                {errors.image && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="bg-gray-900/50 border-gray-800 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>

              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Food Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Fresh Vegetables, Cooked Rice"
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about the food..."
                  rows={3}
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foodType" className="text-gray-300">
                    Food Type *
                  </Label>
                  <Select
                    value={formData.foodType}
                    onValueChange={(value: string) => handleSelectChange("foodType", value)}
                  >
                    <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {foodTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.foodType && (
                    <p className="text-red-400 text-sm mt-1">{errors.foodType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-gray-300">
                    Quantity *
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    <Select
                      value={formData.unit}
                      onValueChange={(value: string) => handleSelectChange("unit", value)}
                    >
                      <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit} className="text-white">
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.quantity && (
                    <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Time Information */}
            <Card className="bg-gray-900/50 border-gray-800 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Time Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preparedTime" className="text-gray-300">
                    Prepared Time *
                  </Label>
                  <Input
                    id="preparedTime"
                    name="preparedTime"
                    type="datetime-local"
                    value={formData.preparedTime}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                  />
                  {errors.preparedTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.preparedTime}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiryTime" className="text-gray-300">
                    Expiry Time *
                  </Label>
                  <Input
                    id="expiryTime"
                    name="expiryTime"
                    type="datetime-local"
                    value={formData.expiryTime}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-900 border-gray-700 text-white"
                  />
                  {errors.expiryTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.expiryTime}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Pickup Location */}
            <Card className="bg-gray-900/50 border-gray-800 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-white">Pickup Location *</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Click on the map to select your pickup location
              </p>

              <LocationPickerWrapper onLocationSelect={handleLocationSelect} />

              {formData.latitude !== null && formData.longitude !== null && (
                <Alert className="bg-teal-500/10 border-teal-500/50">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                  <AlertDescription className="text-teal-400">
                    Location selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="address" className="text-gray-300">
                  Address (Optional)
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address for better navigation"
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                />
              </div>

              {errors.location && (
                <Alert className="bg-red-500/10 border-red-500/50">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <AlertDescription className="text-red-400">
                    {errors.location}
                  </AlertDescription>
                </Alert>
              )}
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold h-12"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating Donation...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Food Donation
                  </>
                )}
              </Button>
              <Link href="/donor">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800 h-12 px-8"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
