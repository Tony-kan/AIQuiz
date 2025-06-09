import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import QuestionModel from "@/models/question";
import { verifyAdmin } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  // 1. Verify the user is an admin
  // console.log("BACKEND: API route /api/admin/quiz/[quizId] was HIT.");
  // const { id: quizId } = params;
  // console.log("BACKEND: Extracted quizId is:", quizId);

  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Connect to the database
    await connectToDatabase();

    // const { id: quizId } = params;
    // const { id: quizId } = context.params;
    // const { quizId } = req.body;
    const body = await req.json();
    const { quizId } = body;
    // 3. Validate that the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }

    // 4. Find the quiz by its ID
    const quiz = await QuizModel.findById(quizId);

    // 5. Handle the case where the quiz is not found
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // 6. Return the found quiz
    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("[GET_QUIZ_BY_ID]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// PUT: Update a quiz by ID
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // --- THE FIX: Get quizId from the request BODY ---
    const body = await req.json();
    const { quizId, ...updateData } = body; // Separate quizId from the update data

    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is missing from the request body." },
        { status: 400 }
      );
    }

    const updatedQuiz = await QuizModel.findByIdAndUpdate(quizId, updateData, {
      new: true,
    });

    if (!updatedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a quiz and all its associated questions
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // --- THE FIX: Get quizId from the request BODY ---
    const body = await req.json();
    const { quizId } = body;

    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is missing from the request body." },
        { status: 400 }
      );
    }

    // --- BUG FIX: The field in the Question model is 'quizId', not 'id' ---
    await QuestionModel.deleteMany({ quizId: quizId });

    // Then, delete the quiz itself
    const deletedQuiz = await QuizModel.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Quiz and all associated questions deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
