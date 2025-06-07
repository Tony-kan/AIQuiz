import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a response object
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    // Set the cookie with an expiration date in the past to delete it
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Set expiration to a past date
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
