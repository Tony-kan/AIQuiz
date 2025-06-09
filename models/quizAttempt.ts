import { Schema, model, models, Document, Types } from "mongoose";

export interface IQuizAttempt extends Document {
  userId: Types.ObjectId; // The student who took the quiz
  quizId: Types.ObjectId; // The quiz that was taken
  score: number; // The percentage score (0-100)
  answers: {
    questionId: Types.ObjectId;
    selectedAnswerIndex: number;
    isCorrect: boolean;
  }[];
  passed: boolean;
  completedAt: Date;
}

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedAnswerIndex: { type: Number },
        isCorrect: { type: Boolean },
      },
    ],
    passed: { type: Boolean, required: true },
  },
  { timestamps: { createdAt: "completedAt", updatedAt: false } }
);

const QuizAttemptModel =
  models.QuizAttempt || model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);

export default QuizAttemptModel;
