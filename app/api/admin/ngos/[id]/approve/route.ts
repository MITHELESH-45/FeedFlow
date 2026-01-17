import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/admin/ngos/:id/approve
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(["admin"])(request);
    if ("error" in authResult) {
      return authResult.error;
    }

    await dbConnect();

    const ngo = await User.findById(params.id);
    if (!ngo || ngo.role !== "ngo") {
      return NextResponse.json(
        { error: "NGO not found" },
        { status: 404 }
      );
    }

    ngo.status = "approved";
    await ngo.save();

    // Create notification
    await createNotification(
      ngo._id.toString(),
      "NGO Account Approved",
      "Your NGO account has been approved! You can now request food donations.",
      "success"
    );

    const ngoObj = ngo.toObject();
    delete ngoObj.password;

    return NextResponse.json(ngoObj);
  } catch (error: any) {
    console.error("Approve NGO error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}






