"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Eye,
  EyeOff,
  Leaf,
  Utensils,
  Heart,
  Truck,
  Shield,
  MapPin,
  Phone,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useAppStore } from "@/lib/store";

/* ---------------- TYPES ---------------- */
type Role = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

/* ---------------- DATA ---------------- */
const roles: Role[] = [
  { value: "donor", label: "Donor", icon: Utensils, description: "Upload surplus food" },
  { value: "ngo", label: "NGO", icon: Heart, description: "Request food donations" },
  { value: "volunteer", label: "Volunteer", icon: Truck, description: "Deliver food" },
];

export default function RegisterPage() {
  const setUser = useAppStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "donor",
    organization: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setUser({
        id: data.user._id || data.user.id,
        name: data.user.name,
        role: data.user.role,
      });

      switch (data.user.role) {
        case "donor":
          window.location.href = "/donor";
          break;
        case "ngo":
          window.location.href = "/ngo";
          break;
        case "volunteer":
          window.location.href = "/volunteer";
          break;
        default:
          window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setIsLoading(false);
    }
  };

  const showOrganization = formData.role === "ngo" || formData.role === "donor";

  return (
    <div className="min-h-screen flex">

      {/* ================= LEFT SIDE ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-background overflow-y-auto">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-gradient">FeedFlow</span>
        </Link>

        <div className="max-w-md w-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground mb-8">
            Join the movement to reduce food waste
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* ROLE */}
            <div className="space-y-2">
              <Label>Select Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex items-center gap-3">
                        <r.icon className="w-4 h-4 text-primary" />
                        <div>
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            – {r.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NAME */}
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            {/* PHONE */}
            <div className="space-y-2">
              <Label>Phone *</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="+91 98765 43210"
                  className="pl-12"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ORGANIZATION */}
            {showOrganization && (
              <div className="space-y-2">
                <Label>
                  {formData.role === "ngo"
                    ? "NGO Name *"
                    : "Organization / Restaurant Name"}
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                     placeholder={
    formData.role === "ngo"
      ? "Enter NGO name"
      : "Enter organization name"
  }
                    className="pl-12"
                    value={formData.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    required={formData.role === "ngo"}
                  />
                </div>
              </div>
            )}

            {/* ADDRESS */}
            <div className="space-y-2">
              <Label>Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-4 h-4 text-muted-foreground" />
                <Textarea
                 placeholder="Enter your full address"
                  className="pl-12 resize-none"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password *</Label>
              <div className="relative">
                <Input
                
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="pr-12"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label>Confirm Password *</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                   placeholder="Confirm your password"
                  className="pr-12"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-accent text-primary-foreground text-lg shadow-glow"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/40 rounded-md p-3">
                {error}
              </p>
            )}
          </form>

          {/* LOGIN */}
          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="flex items-center justify-center w-full p-12 relative z-10">
          <div className="space-y-6 w-full max-w-md">

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Join Our Community</h3>
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Active Donors" value="500+" />
                <Stat label="Partner NGOs" value="150+" />
                <Stat label="Volunteers" value="300+" />
                <Stat label="Meals Saved" value="50K+" accent />
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Why Join?</h3>
              <ul className="space-y-3">
                {[
                  "Track your impact with analytics",
                  "Connect with verified NGOs",
                  "Real-time delivery updates",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary">✓</span>
                    <span className="text-sm text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl flex gap-4 items-center">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Verified & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard security
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENT ---------- */
function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center p-4 rounded-xl bg-card/50">
      <p className={`text-2xl font-bold ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
