import { NextRequest, NextResponse } from "next/server";
import QuizModel from "@/models/quiz";
// import QuestionModel from "@/models/question";
import QuizAttemptModel from "@/models/quizAttempt";
import { connectToDatabase } from "@/lib/database";
// import { IQuestion } from "@/models/question";
import { verifyAdmin } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const tokenData = await verifyAdmin(request);
    if (!tokenData || !tokenData.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { quizId } = params;
    const body = await request.json();
    const { userAnswers, userId } = body;

    // Expects: { questionId: string, selectedAnswerIndex: number }[]
    console.log("userAnswers:", userAnswers);
    console.log("userId:;;;;;;;--------------", userId);
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
      userId: tokenData.userId,
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
