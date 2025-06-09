import { NextResponse } from "next/server";
import QuestionModel from "@/models/question";
import QuizModel from "@/models/quiz";
import { connectToDatabase } from "@/lib/database";

export async function GET(
  request: Request,
  params: { params: { quizId: string } }
) {
  try {
    await connectToDatabase();
    // const { quizId } = params;
    const quizId = params.params.quizId;
    console.log("FRONTEND: The quizId from the URL is:", params);

    const quiz = await QuizModel.findById(quizId).populate({
      path: "questions",
      select: "-correctAnswerIndex", // IMPORTANT: Exclude the answer
    });

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Fetch Quiz Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
