import { connectToDatabase } from "@/lib/database";
import UserModel from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
// import { setCookie } from "cookies-next";
// import jwt from "jsonwebtoken";
import { SignJWT } from "jose";

// 2. The JWT_SECRET must be converted to a Uint8Array for 'jose'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { email, password } = body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      //   return new Response("User already exists", { status: 409 });
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      //   return new Response("Invalid credentials", { status: 401 });
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      userId: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
      fullname: existingUser.fullname,
      sub: existingUser._id.toString(),
    })
      .setProtectedHeader({ alg: "HS256" }) // Set the algorithm
      .setIssuedAt() // Set the issued at time to now
      .setExpirationTime("72h") // Set the expiration time
      .sign(JWT_SECRET); // Sign the token with the secret

    // return new Response("User registered successfully", { status: 201 });
    const response = NextResponse.json(
      { message: "User Logged in successfully" },
      { status: 201 } // 201 Created
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Log in error:", error);
    // Return a server error response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
