import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/foods - Get all foods
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const foods = await Food.find(query)
      .populate("donorId", "name email phone organization")
      .sort({ createdAt: -1 })
      .lean();

    // Get NGO and volunteer info from requests and tasks
    const Request = (await import("@/lib/models/Request")).default;
    const Task = (await import("@/lib/models/Task")).default;

    const foodsWithRelations = await Promise.all(
      foods.map(async (food: any) => {
        // Find approved request for this food
        const request = await Request.findOne({
          foodId: food._id,
          status: "approved",
        })
          .populate("ngoId", "name")
          .lean();

        // Find task for this food
        const task = await Task.findOne({ foodId: food._id })
          .populate("volunteerId", "name")
          .lean();

        return {
          ...food,
          ngoName: request?.ngoId?.name || null,
          volunteerName: task?.volunteerId?.name || null,
        };
      })
    );

    return NextResponse.json(foodsWithRelations);
  } catch (error: any) {
    console.error("Get foods error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


