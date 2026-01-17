import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Request from "@/lib/models/Request";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/requests - Get all requests
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

    const requests = await Request.find(query)
      .populate({
        path: "foodId",
        populate: {
          path: "donorId",
          select: "name email phone organization",
        },
      })
      .populate("ngoId", "name email phone organization deliveryLocation")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Get requests error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


