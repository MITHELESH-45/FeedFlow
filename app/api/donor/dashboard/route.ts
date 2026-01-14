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

    const totalUploaded = await Food.countDocuments({ donorId: user._id });
    const activeDonations = await Food.countDocuments({
      donorId: user._id,
      status: { $in: ["available", "requested", "approved", "picked_up"] },
    });
    const completedDonations = await Food.countDocuments({
      donorId: user._id,
      status: "completed",
    });
    const expiredCancelled = await Food.countDocuments({
      donorId: user._id,
      status: { $in: ["expired", "cancelled"] },
    });

    return NextResponse.json({
      totalUploaded,
      activeDonations,
      completedDonations,
      expiredCancelled,
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


