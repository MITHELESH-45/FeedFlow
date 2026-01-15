import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const readyState = mongoose.connection.readyState; // 1 = connected
    const connected = readyState === 1;
    return NextResponse.json({
      ok: connected,
      state: readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || "DB connection failed" },
      { status: 500 }
    );
  }
}






