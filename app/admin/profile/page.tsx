"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogOut, Shield } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AdminProfilePage() {
    const user = useAppStore((state) => state.user);
    const [loading, setLoading] = useState(true);

    // Simulate loading to match other pages
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
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
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-teal-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
                            <p className="text-gray-400">System Administrator</p>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <Card className="bg-gray-900/50 border-gray-800 p-6 mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium text-lg">{user?.name || "Admin User"}</p>
                                <p className="text-gray-400">{user?.email || "admin@feedflow.com"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Account Settings */}
                    <Card className="bg-gray-900/50 border-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Account Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div>
                                    <p className="text-white font-medium">Security Settings</p>
                                    <p className="text-gray-400 text-sm">Manage password and access</p>
                                </div>
                                <Button variant="outline" size="sm" className="border-gray-700 hover:bg-white/10">
                                    Manage
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/50">
                                <div>
                                    <p className="text-red-400 font-medium">Log Out</p>
                                    <p className="text-red-400/70 text-sm">Sign out of admin console</p>
                                </div>
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                                        onClick={() => localStorage.removeItem("token")}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log Out
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
