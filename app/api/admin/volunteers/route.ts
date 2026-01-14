import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/volunteers - Get all volunteers
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const volunteers = await User.find({ role: "volunteer" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Get stats for each volunteer
    const volunteersWithStats = await Promise.all(
      volunteers.map(async (volunteer) => {
        const totalTasks = await Task.countDocuments({ volunteerId: volunteer._id });
        const completedTasks = await Task.countDocuments({
          volunteerId: volunteer._id,
          status: "completed",
        });
        const activeTasks = await Task.countDocuments({
          volunteerId: volunteer._id,
          status: { $in: ["assigned", "accepted", "picked_up", "reached_ngo"] },
        });

        return {
          ...volunteer,
          stats: {
            totalTasks,
            completedTasks,
            activeTasks,
          },
        };
      })
    );

    return NextResponse.json(volunteersWithStats);
  } catch (error: any) {
    console.error("Get volunteers error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


