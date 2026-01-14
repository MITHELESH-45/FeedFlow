import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";
    
    // Check if it's admin login
    if (email.toLowerCase() === ADMIN_EMAIL) {
      // Find admin user in database
      let adminUser = await User.findOne({ email: ADMIN_EMAIL, role: "admin" });
      
      if (!adminUser) {
        // Create admin user if it doesn't exist
        if (password === ADMIN_PASSWORD) {
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
          adminUser = await User.create({
            name: "Admin User",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            status: "approved",
          });
        } else {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
          );
        }
      } else {
        // Verify password matches (compare hashed password)
        const isValidPassword = await bcrypt.compare(password, adminUser.password);
        if (!isValidPassword) {
          return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
          );
        }
      }
      
      const adminToken = generateToken(adminUser);
      const userObj = adminUser.toObject();
      delete userObj.password;
      
      return NextResponse.json({
        user: userObj,
        token: adminToken,
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // NGO can login even if pending, but cannot request food
    // This is handled in the NGO request endpoint

    // Generate token
    const token = generateToken(user);

    // Return user (without password)
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({
      user: userObj,
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


