"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogIn, Mail, Lock, User } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "donor",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Save token and user
      localStorage.setItem("token", data.token);
      setUser({
        id: data.user._id || data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status, // Include status for NGO
      });

      // Route based on role
      switch (data.user.role) {
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
          router.push("/donor");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800 p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-teal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your FeedFlow account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role" className="text-gray-300">
              Login As
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="pl-10 bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="donor" className="text-white">
                    Donor
                  </SelectItem>
                  <SelectItem value="ngo" className="text-white">
                    NGO
                  </SelectItem>
                  <SelectItem value="volunteer" className="text-white">
                    Volunteer
                  </SelectItem>
                  <SelectItem value="admin" className="text-white">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold h-11 mt-6"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-teal-500 hover:text-teal-400 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}




