import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";

// PUT /api/ngo/profile/location - Set NGO delivery location
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(["ngo"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }
    const { user } = authResult;

    await dbConnect();

    const body = await request.json();
    const { lat, lng, address } = body;

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        deliveryLocation: {
          lat,
          lng,
          address: address || "",
        },
      },
      { new: true }
    );

    const userObj = updatedUser!.toObject();
    delete userObj.password;

    return NextResponse.json(userObj);
  } catch (error: any) {
    console.error("Update location error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


