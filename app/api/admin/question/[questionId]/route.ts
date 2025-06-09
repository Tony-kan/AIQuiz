// File: app/api/admin/question/[questionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuestionModel from "@/models/question";
import QuizModel from "@/models/quiz";
import { verifyAdmin } from "@/lib/auth";
import mongoose from "mongoose";

// // PUT: Update a specific question by its ID
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { questionId: string } }
// ) {
//   const admin = await verifyAdmin(req);
//   if (!admin) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await connectToDatabase();
//     // FIX: Only 'questionId' is available in params for this route.

//     const updateData = await req.json();

//     const { questionId } = params;

//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return NextResponse.json(
//         { message: "Invalid Question ID" },
//         { status: 400 }
//       );
//     }

//     const updatedQuestion = await QuestionModel.findByIdAndUpdate(
//       questionId,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedQuestion) {
//       return NextResponse.json(
//         { message: "Question not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedQuestion, { status: 200 });
//   } catch (error) {
//     console.error("[UPDATE_QUESTION]", error);

//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// DELETE: Delete a specific question by its ID
export async function DELETE(
  req: NextRequest,
  context: { params: { questionId: string } }
) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    // const { questionId } = params;
    const { questionId } = context.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { message: "Invalid Question ID" },
        { status: 400 }
      );
    }

    const deletedQuestion = await QuestionModel.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // This cleanup step is correct and very important.
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
