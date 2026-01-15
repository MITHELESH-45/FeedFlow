import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import Food from "@/lib/models/Food";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const totalRequests = await Request.countDocuments({ ngoId: user._id });
    const pendingRequests = await Request.countDocuments({
      ngoId: user._id,
      status: "pending",
    });
    const approvedRequests = await Request.countDocuments({
      ngoId: user._id,
      status: "approved",
    });
    const completedRequests = await Request.countDocuments({
      ngoId: user._id,
      status: "completed",
    });

    return NextResponse.json({
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
    });
  } catch (error: any) {
    console.error("NGO dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}






