import { Schema, model, models, Document, Types } from "mongoose";

export interface IQuestion extends Document {
  questionText: string;
  options: string[];
  // correctAnswer: string;
  correctAnswerIndex: number;
  quizId: Types.ObjectId; // Reference to the parent quiz
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length > 1 && val.length <= 4,
        "A question must have between 2 and 4 options.",
      ],
    },
    // correctAnswer: { type: String, required: true, trim: true },
    correctAnswerIndex: {
      type: Number,
      required: true,
      // Add a validator to ensure the index is valid for the options array
      validate: {
        validator: function (this: IQuestion, value: number) {
          // 'this' refers to the document being validated
          return value >= 0 && value < this.options.length;
        },
        message:
          "correctAnswerIndex must be a valid index for the options array.",
      },
    },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  },
  { timestamps: true }
);

const QuestionModel =
  models.Question || model<IQuestion>("Question", questionSchema);

export default QuestionModel;
