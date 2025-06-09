// import { NextResponse } from "next/server";
// import QuestionModel from "@/models/question";
// import QuizModel from "@/models/quiz";
// import { connectToDatabase } from "@/lib/database";

// export async function GET(
//   request: Request,
//   params: { params: { quizId: string } }
// ) {
//   try {
//     await connectToDatabase();
//     // const { quizId } = params;
//     const quizId = params.params.quizId;
//     // console.log("FRONTEND: The quizId from the URL is:", params);

//     const quiz = await QuizModel.findById(quizId).populate({
//       path: "questions",
//       select: "-correctAnswerIndex", // IMPORTANT: Exclude the answer
//     });

//     if (!quiz) {
//       return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
//     }

//     return NextResponse.json(quiz);
//   } catch (error) {
//     console.error("Fetch Quiz Error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch quiz" },
//       { status: 500 }
//     );
//   }
// }

// File: app/api/student/quizzes/[quizId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import QuestionModel from "@/models/question"; // FIX 1: Import the Question model for population
import mongoose from "mongoose"; // FIX 2: Import mongoose for ID validation

export async function GET(
  request: NextRequest,
  // FIX 3: Use the standard 'context' object for the signature
  context: { params: { quizId: string } }
) {
  // Note: For a real application, you would also verify the student is logged in here.
  // const student = await verifyStudent(request);
  // if (!student) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  try {
    await connectToDatabase();
    // FIX 4: Destructure quizId cleanly from context.params
    const { quizId } = context.params;
    // console.log("FRONTEND: The quizId from the URL is:-------------", quizId);
    // FIX 5: Add ID validation to prevent crashes (from your reference code)
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ message: "Invalid Quiz ID" }, { status: 400 });
    }

    // This query now works because QuestionModel is imported
    const quiz = await QuizModel.findById(quizId).populate({
      path: "questions",
      select: "-correctAnswerIndex", // IMPORTANT: Exclude the answer
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    // Add a specific error log for easier debugging
    console.error("[GET_QUIZ_FOR_STUDENT]", error);
    return NextResponse.json(
      { message: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
