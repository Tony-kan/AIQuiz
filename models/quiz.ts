import { Schema, model, models, Document, Types } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  description: string;
  topic: string;
  passMark: number;
  questions: Types.ObjectId[]; // Array of references to Question documents
  createdBy: Types.ObjectId; // Reference to the Admin user who created it
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    passMark: { type: Number, required: true, min: 0, max: 100, default: 50 },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const QuizModel = models.Quiz || model<IQuiz>("Quiz", quizSchema);

export default QuizModel;
