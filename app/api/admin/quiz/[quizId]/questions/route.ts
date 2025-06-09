// File: app/api/admin/quiz/[quizId]/questions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuestionModel from "@/models/question";
import QuizModel from "@/models/quiz"; // Import QuizModel to update it
import { verifyAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// GET: Fetch all questions for a specific quiz ID
export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { quizId } = params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }

    const questions = await QuestionModel.find({ quizId: quizId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("[GET_QUESTIONS_BY_QUIZ_ID]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Add a new question to a specific quiz
export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  // 1. Verify the user is an admin
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Connect to DB and get data from request
    await connectToDatabase();
    const { quizId } = params; // Get the parent quiz ID from the URL
    const body = await req.json(); // Get question data (text, options, etc.) from the body

    // 3. Validate the quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }

    // 4. Create the new question document, merging body data with the quizId from the URL
    const newQuestion = new QuestionModel({
      ...body,
      quizId: quizId, // Ensure the question is linked to the correct quiz
    });

    // 5. Save the new question to the database
    await newQuestion.save();

    // 6. (Optional but recommended) Add the new question's ID to the parent quiz's 'questions' array
    // This assumes your QuizModel has a field like: questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
    await QuizModel.findByIdAndUpdate(quizId, {
      $push: { questions: newQuestion._id },
    });

    // 7. Return the newly created question with a 201 status
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("[POST_QUESTION]", error);

    // Provide a more specific error if Mongoose validation fails
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
