import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["donor"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = { donorId: user._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone")
      .lean();

    // Get request counts for each food
    const foodsWithRequests = await Promise.all(
      foods.map(async (food) => {
        const requestCount = await Request.countDocuments({ foodId: food._id });
        return {
          ...food,
          requestCount,
        };
      })
    );

    return NextResponse.json(foodsWithRequests);
  } catch (error: any) {
    console.error("Get donations error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


