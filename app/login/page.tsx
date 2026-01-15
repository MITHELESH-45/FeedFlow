"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Eye, EyeOff, Leaf, Utensils, Heart, Truck, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- TYPES ---------------- */

type Role = {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

/* ---------------- DATA ---------------- */

const roles: Role[] = [
  {
    value: "donor",
    label: "Donor",
    description: "Upload surplus food",
    icon: Utensils,
  },
  {
    value: "ngo",
    label: "NGO",
    description: "Request food donations",
    icon: Heart,
  },
  {
    value: "volunteer",
    label: "Volunteer",
    description: "Deliver food",
    icon: Truck,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage platform",
    icon: Shield,
  },
];

/* ---------------- PAGE ---------------- */

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      setUser({
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      const userRole = data.user.role as string;
      switch (userRole) {
        case "donor":
          router.push("/donor");
          break;
        case "ngo":
          router.push("/ngo");
          break;
        case "volunteer":
          router.push("/volunteer");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-background">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-gradient">FeedFlow</span>
        </Link>

        <div className="max-w-md w-full">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in to continue making a difference
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* ROLE */}
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full h-12 bg-card border-border">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>

                <SelectContent className="bg-card border-border">
                  {roles.map((r) => (
                    <SelectItem
                      key={r.value}
                      value={r.value}
                      className="focus:bg-primary/10"
                    >
                      <span className="flex items-center gap-3">
                        <r.icon className="w-4 h-4 text-primary" />
                        <span>
                          <span className="font-medium">{r.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            – {r.description}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/40 rounded-md p-3">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-accent text-primary-foreground text-lg shadow-glow"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* REGISTER */}
          <p className="text-center text-muted-foreground mt-8">
            New to FeedFlow?{" "}
            <Link href="/register" className="text-primary font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>

       {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex w-1/2 gradient-hero relative overflow-hidden">

        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex items-start justify-center w-full pt-24">
          <div className="flex flex-col space-y-6 max-w-lg w-full">

            {/* Stats */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">50,000+</h3>
                  <p className="text-sm text-muted-foreground">Meals Donated</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-semibold mb-4">How It Works</h3>
              {[
                "Donors upload surplus food",
                "NGOs request donations",
                "Volunteers deliver safely",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <span className="text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>

            {/* Transparency */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">100% Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Track every donation in real-time
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="text-center mt-16 opacity-80">
              <p className="italic text-muted-foreground">
                "Together, we can ensure no food goes to waste while no one goes hungry."
              </p>
              <p className="text-sm text-primary mt-2">
                – FeedFlow Mission
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
