import { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

interface AdminJWTPayload extends JWTPayload {
  userId: string;
  role: "Admin" | "Student";
}

export async function verifyAdmin(
  req: NextRequest
): Promise<AdminJWTPayload | null> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const adminPayload = payload as AdminJWTPayload;

    if (adminPayload.role !== "Admin") {
      return null; // Not an admin
    }

    return adminPayload; // Verification successful
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return null;
  }
}


