import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import { verifyAdmin } from "@/lib/auth";

// POST: Create a new quiz
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
//   console.log("Decoded admin payload:", admin);
  try {
    await connectToDatabase();
    const body = await req.json();
    // const { title, description, topic, passMark } = body;
    const { title, description, topic } = body;

    if (!title || !description || !topic) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuiz = new QuizModel({
      ...body,
      createdBy: admin.sub,
    });

    await newQuiz.save();
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Fetch all available quizzes (latest first)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const quizzes = await QuizModel.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, descending
      .populate("createdBy", "fullname email"); // Populate creator info

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
