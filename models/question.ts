import { Schema, model, models, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  text: string;
  options: string[];
  correctAnswer: string;
  quizId: Types.ObjectId; // Reference to the parent quiz
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 1 && val.length <= 4,
        "A question must have between 2 and 4 options.",
      ],
    },
    correctAnswer: { type: String, required: true, trim: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  },
  { timestamps: true }
);

const QuestionModel =
  models.Question || model<IQuestion>("Question", questionSchema);

export default QuestionModel;
