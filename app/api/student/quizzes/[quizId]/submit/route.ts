import { NextResponse } from "next/server";
import QuizModel from "@/models/quiz";
// import QuestionModel from "@/models/question";
import QuizAttemptModel from "@/models/quizAttempt";
import { connectToDatabase } from "@/lib/database";
// import { IQuestion } from "@/models/question";

// const MOCK_USER_ID = "65a5a8a5a5a5a5a5a5a5a5a5"; // Replace with a real ObjectId from your User collection

export async function POST(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    await connectToDatabase();
    const { quizId } = params;
    const body = await request.json();
    const { userAnswers, userId } = body; // Expects: { questionId: string, selectedAnswerIndex: number }[]

    // 1. Fetch the quiz and its questions WITH the correct answers
    const quiz = await QuizModel.findById(quizId).populate("questions");
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // 2. Create a map for easy lookup of correct answers
    const correctAnswersMap = new Map();
    quiz.questions.forEach((q: any) => {
      correctAnswersMap.set(q._id.toString(), q.correctAnswerIndex);
    });

    // 3. Calculate score
    let correctCount = 0;
    const detailedAnswers = userAnswers.map((ua: any) => {
      const isCorrect =
        correctAnswersMap.get(ua.questionId) === ua.selectedAnswerIndex;
      if (isCorrect) {
        correctCount++;
      }
      return { ...ua, isCorrect };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passMark;

    // 4. Save the attempt
    const newAttempt = new QuizAttemptModel({
      userId: userId,
      quizId,
      score,
      passed,
      answers: detailedAnswers,
    });
    await newAttempt.save();

    return NextResponse.json({
      message: "Quiz submitted successfully!",
      score,
      passed,
      attemptId: newAttempt._id,
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    return NextResponse.json(
      { message: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
