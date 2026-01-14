import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Food from "@/lib/models/Food";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

// GET /api/ngo/available-food/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const food = await Food.findById(params.id)
      .populate("donorId", "name email phone organization")
      .lean();

    if (!food) {
      return NextResponse.json(
        { error: "Food not found" },
        { status: 404 }
      );
    }

    // Check if NGO has existing request
    const existingRequest = await Request.findOne({
      foodId: params.id,
      ngoId: authResult.user._id,
    });

    return NextResponse.json({
      ...food,
      existingRequest: existingRequest || null,
    });
  } catch (error: any) {
    console.error("Get food detail error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


