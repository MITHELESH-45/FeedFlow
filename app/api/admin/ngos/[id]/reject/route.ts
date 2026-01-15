import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth } from "@/lib/auth";
import { createNotification } from "@/lib/utils/notifications";

// POST /api/admin/ngos/:id/reject
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

    const body = await request.json();
    const { reason } = body;

    const ngo = await User.findById(params.id);
    if (!ngo || ngo.role !== "ngo") {
      return NextResponse.json(
        { error: "NGO not found" },
        { status: 404 }
      );
    }

    ngo.status = "rejected";
    await ngo.save();

    // Create notification
    await createNotification(
      ngo._id.toString(),
      "NGO Account Rejected",
      reason || "Your NGO account has been rejected. Please contact support for more information.",
      "error"
    );

    const ngoObj = ngo.toObject();
    delete ngoObj.password;

    return NextResponse.json(ngoObj);
  } catch (error: any) {
    console.error("Reject NGO error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}





