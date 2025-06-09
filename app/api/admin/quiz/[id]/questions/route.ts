// // import { NextRequest, NextResponse } from "next/server";
// // import { connectToDatabase } from "@/lib/database";
// // import QuizModel from "@/models/quiz";
// // import QuestionModel from "@/models/question";
// // import { verifyAdmin } from "@/lib/auth";

// // interface Params {
// //   params: { quizId: string };
// // }

// // // POST: Add a new question to a specific quiz
// // export async function POST(req: NextRequest, { params }: Params) {
// //   const admin = await verifyAdmin(req);
// //   if (!admin) {
// //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// //   }

// //   try {
// //     await connectToDatabase();
// //     const body = await req.json();
// //     // const { text, options, correctAnswer } = body;

// //     const newQuestion = new QuestionModel({
// //       ...body,
// //       quizId: params.quizId,
// //     });
// //     await newQuestion.save();

// //     // Add the new question's ID to the quiz's questions array
// //     await QuizModel.findByIdAndUpdate(params.quizId, {
// //       $push: { questions: newQuestion._id },
// //     });

// //     return NextResponse.json(newQuestion, { status: 201 });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { message: "Internal Server Error" },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/database";
// import QuizModel from "@/models/quiz";
// import QuestionModel from "@/models/question";
// import { verifyAdmin } from "@/lib/auth";

// // The `interface Params` is no longer needed.
// type RouteContext = {
//   params: {
//     id: string;
//   };
// };

// // POST: Add a new question to a specific quiz
// export async function POST(
//   req: NextRequest,
//   context: RouteContext // <-- FIX APPLIED HERE
// ) {
//   // const { id } = params;
//   const { id } = context.params;
//   const admin = await verifyAdmin(req);
//   if (!admin) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     // const { text, options, correctAnswer } = body;

//     const newQuestion = new QuestionModel({
//       ...body,
//       quizId: id,
//     });
//     await newQuestion.save();

//     // Add the new question's ID to the quiz's questions array
//     await QuizModel.findByIdAndUpdate(id, {
//       $push: { questions: newQuestion._id },
//     });

//     return NextResponse.json(newQuestion, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import QuestionModel from "@/models/question";
import { verifyAdmin } from "@/lib/auth";

// We have removed the second 'context' argument.
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // --- THE FIX: Get quizId from the request BODY ---
    const body = await req.json();
    const { quizId, ...questionData } = body; // Separate quizId from the rest of the question data

    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is missing from the request body." },
        { status: 400 }
      );
    }

    // Create the new question with the remaining data and the extracted quizId
    const newQuestion = new QuestionModel({
      ...questionData,
      quizId: quizId,
    });
    await newQuestion.save();

    // Add the new question's ID to the quiz's questions array
    await QuizModel.findByIdAndUpdate(quizId, {
      $push: { questions: newQuestion._id },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
