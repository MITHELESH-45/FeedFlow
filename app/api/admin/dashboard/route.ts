import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import Task from "@/lib/models/Task";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const totalFood = await Food.countDocuments({});
    const activeDeliveries = await Task.countDocuments({
      status: { $in: ["assigned", "accepted", "picked_up", "reached_ngo"] },
    });
    const completedDeliveries = await Task.countDocuments({
      status: "completed",
    });
    const expiredFood = await Food.countDocuments({
      status: "expired",
      expiryTime: { $lt: new Date() },
    });
    const pendingNGOs = await User.countDocuments({
      role: "ngo",
      status: "pending",
    });
    const pendingRequests = await Request.countDocuments({
      status: "pending",
    });

    return NextResponse.json({
      totalFood,
      activeDeliveries,
      completedDeliveries,
      expiredFood,
      pendingNGOs,
      pendingRequests,
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}






