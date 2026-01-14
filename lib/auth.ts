import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import User, { IUser } from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: any) {
    return null;
  }
}

export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    await import("./db").then((m) => m.default());
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("getAuthUser error:", error);
    return null;
  }
}

export function requireAuth(roles?: string[]) {
  return async (request: NextRequest): Promise<{ user: IUser } | { error: Response }> => {
    const user = await getAuthUser(request);

    if (!user) {
      return {
        error: new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      return {
        error: new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }),
      };
    }

    return { user };
  };
}

