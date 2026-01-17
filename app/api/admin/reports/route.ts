import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import Task from "@/lib/models/Task";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/reports - Get reports data
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "overview";

    if (type === "overview") {
      const totalFood = await Food.countDocuments({});
      const totalRequests = await Request.countDocuments({});
      const totalTasks = await Task.countDocuments({});
      const totalDonors = await User.countDocuments({ role: "donor" });
      const totalNGOs = await User.countDocuments({ role: "ngo", status: "approved" });
      const totalVolunteers = await User.countDocuments({ role: "volunteer" });
      const completedTasks = await Task.countDocuments({ status: "completed" });
      const expiredFood = await Food.countDocuments({
        status: "expired",
        expiryTime: { $lt: new Date() },
      });

      return NextResponse.json({
        totalFood,
        totalRequests,
        totalTasks,
        totalDonors,
        totalNGOs,
        totalVolunteers,
        completedTasks,
        expiredFood,
      });
    }

    // Add more report types as needed
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  } catch (error: any) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}






