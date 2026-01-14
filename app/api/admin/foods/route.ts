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

    return NextResponse.json(foods);
  } catch (error: any) {
    console.error("Get foods error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


