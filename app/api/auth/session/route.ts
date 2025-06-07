import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface UserJwtPayload {
  userId: string;
  email: string;
  fullname: string;
  role: "Student" | "Admin";
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // If no token is found, the user is not authenticated
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    // Verify the token and extract the payload
    const { payload } = await jwtVerify<UserJwtPayload>(token, JWT_SECRET);

    // If verification is successful, return the user data
    return NextResponse.json({
      isAuthenticated: true,
      userId: payload.userId,
      email: payload.email,
      fullname: payload.fullname,
      role: payload.role,
    });
  } catch (error) {
    console.error("Session API Error:", error);
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
