import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

// GET /api/ngo/available-food - Get all available food
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const foodType = searchParams.get("foodType");

    const query: any = {
      status: "available",
      expiryTime: { $gt: new Date() }, // Not expired
    };

    if (foodType && foodType !== "all") {
      query.foodType = foodType;
    }

    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .populate("donorId", "name email phone organization")
      .lean();

    // Check which foods have pending/approved requests from this NGO
    const foodsWithRequestStatus = await Promise.all(
      foods.map(async (food) => {
        const existingRequest = await Request.findOne({
          foodId: food._id,
          ngoId: user._id,
          status: { $in: ["pending", "approved"] },
        });

        return {
          ...food,
          hasRequest: !!existingRequest,
          requestStatus: existingRequest?.status || null,
        };
      })
    );

    return NextResponse.json(foodsWithRequestStatus);
  } catch (error: any) {
    console.error("Get available food error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}





