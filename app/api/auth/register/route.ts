import { connectToDatabase } from "@/lib/database";
import UserModel from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  try {
    const { username, email, password, fullname, role } = body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 } // 409 Conflict
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      username,
      fullname,
      role,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
