import { NextResponse } from "next/server";
import QuizModel from "@/models/quiz";
import QuizAttemptModel from "@/models/quizAttempt";
import { connectToDatabase } from "@/lib/database";

// Mock user ID - in a real app, you'd get this from a session (e.g., NextAuth.js)
const MOCK_USER_ID = "65a5a8a5a5a5a5a5a5a5a5a5"; // Replace with a real ObjectId from your User collection

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch all quizzes and add question count
    const allQuizzes = await QuizModel.find({}).lean();
    const quizzesWithCount = allQuizzes.map((quiz) => ({
      ...quiz,
      questionCount: quiz.questions.length,
    }));

    // 2. Fetch user's attempts to determine status (taken, passed, failed)
    const userAttempts = await QuizAttemptModel.find({
      userId: MOCK_USER_ID,
    }).lean();

    // Create a map for quick lookup of the latest attempt for each quiz
    const attemptMap = new Map();
    userAttempts.forEach((attempt) => {
      const quizId = attempt.quizId.toString();
      // Store the latest attempt
      if (
        !attemptMap.has(quizId) ||
        attempt.completedAt > attemptMap.get(quizId).completedAt
      ) {
        attemptMap.set(quizId, attempt);
      }
    });

    // 3. Combine quiz data with attempt status
    const dashboardQuizzes = quizzesWithCount.map((quiz) => {
      const latestAttempt = attemptMap.get(quiz._id.toString());
      return {
        ...quiz,
        status: latestAttempt
          ? latestAttempt.passed
            ? "Passed"
            : "Failed"
          : "Not Started",
      };
    });

    // 4. Calculate stats
    const totalQuizzes = await QuizModel.countDocuments();
    const passedCount = Array.from(attemptMap.values()).filter(
      (a) => a.passed
    ).length;
    const failedCount = attemptMap.size - passedCount;

    // Another motivating metric: Overall Average Score
    const totalScore = userAttempts.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const averageScore =
      userAttempts.length > 0
        ? Math.round(totalScore / userAttempts.length)
        : 0;

    const stats = {
      totalQuizzes,
      quizzesTaken: attemptMap.size,
      passed: passedCount,
      averageScore,
    };

    return NextResponse.json({ stats, quizzes: dashboardQuizzes });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
