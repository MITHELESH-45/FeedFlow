import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

// GET /api/admin/ngos - Get all NGOs
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = { role: "ngo" };
    if (status && status !== "all") {
      query.status = status;
    }

    const ngos = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(ngos);
  } catch (error: any) {
    console.error("Get NGOs error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


