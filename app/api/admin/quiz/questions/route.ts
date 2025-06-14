import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import QuestionModel from "@/models/question";
import { verifyAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// We have removed the second 'context' argument.
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // --- THE FIX: Get quizId from the request BODY ---
    const body = await req.json();
    const { quizId, ...questionData } = body; // Separate quizId from the rest of the question data

    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is missing from the request body." },
        { status: 400 }
      );
    }

    // Create the new question with the remaining data and the extracted quizId
    const newQuestion = new QuestionModel({
      ...questionData,
      quizId: quizId,
    });
    await newQuestion.save();

    // Add the new question's ID to the quiz's questions array
    await QuizModel.findByIdAndUpdate(quizId, {
      $push: { questions: newQuestion._id },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { questionId } = params;
    const updateData = await req.json(); // The body contains the fields to update

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { message: "Invalid Question ID" },
        { status: 400 }
      );
    }

    // Find the question by its ID and update it with the new data
    // { new: true } ensures the updated document is returned
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true, runValidators: true } // runValidators ensures the update follows schema rules
    );

    if (!updatedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_QUESTION]", error);
    // if (error.name === "ValidationError") {
    //   return NextResponse.json(
    //     { message: "Validation Error", details: error.errors },
    //     { status: 400 }
    //   );
    // }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific question by its ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { questionId } = params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { message: "Invalid Question ID" },
        { status: 400 }
      );
    }

    // Find and delete the question. We need the deleted document
    // to get its quizId for the next step.
    const deletedQuestion = await QuestionModel.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // IMPORTANT: Also remove the question's ID from the parent quiz's 'questions' array
    // This maintains data integrity.
    await QuizModel.findByIdAndUpdate(deletedQuestion.quizId, {
      $pull: { questions: deletedQuestion._id },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_QUESTION]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
