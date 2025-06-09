// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/database";
// import QuizModel from "@/models/quiz";
// import QuestionModel from "@/models/question";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { verifyAdmin } from "@/lib/auth";

// // Initialize the AI SDK
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // type RouteContext = {
// //   params: {
// //     id: string;
// //   };
// // };
// export async function POST(req: NextRequest) {
//   const admin = await verifyAdmin(req);
//   if (!admin) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     await connectToDatabase();
//     const { id: quizId } = context.params;
//     // const { quizId } = params; // This now works correctly
//     const body = await req.json();
//     const numberOfQuestions = body.numberOfQuestions || 10; // Default to 10

//     const quiz = await QuizModel.findById(quizId);
//     if (!quiz) {
//       return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
//     }

//     // --- AI Prompt Engineering ---
//     const prompt = `
//       You are an expert quiz creator. Based on the following quiz details, generate ${numberOfQuestions} multiple-choice questions.

//       Quiz Title: "${quiz.title}"
//       Quiz Topic: "${quiz.topic}"
//       Quiz Description: "${quiz.description}"

//       Each question must have exactly 4 options. One of the options must be the correct answer.

//       IMPORTANT: Your response MUST be a valid JSON array of objects, with no other text, explanations, or markdown.
//       Each object in the array must have the following structure:
//       {
//         "text": "The question text",
//         "options": ["Option A", "Option B", "Option C", "Option D"],
//         "correctAnswer": "The correct option text"
//       }

//       Here is an example for a "History" quiz:
//       [
//         {
//           "text": "In what year did the Titanic sink?",
//           "options": ["1905", "1912", "1918", "1923"],
//           "correctAnswer": "1912"
//         }
//       ]

//       Now, generate the questions for the given quiz.
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // Clean up the response to ensure it's valid JSON
//     const cleanedJsonString = responseText
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let generatedQuestions;
//     try {
//       generatedQuestions = JSON.parse(cleanedJsonString);
//     } catch (e) {
//       console.error("Failed to parse AI response:", cleanedJsonString);
//       console.error("Error:", e);
//       return NextResponse.json(
//         { message: "AI failed to generate valid questions. Please try again." },
//         { status: 500 }
//       );
//     }

//     if (!Array.isArray(generatedQuestions)) {
//       return NextResponse.json(
//         { message: "AI returned an invalid data format." },
//         { status: 500 }
//       );
//     }

//     // Prepare questions for database insertion
//     const questionsToInsert = generatedQuestions.map((q) => ({
//       ...q,
//       quizId: quiz._id,
//     }));

//     const newQuestions = await QuestionModel.insertMany(questionsToInsert);
//     const newQuestionIds = newQuestions.map((q) => q._id);

//     // Add the new question IDs to the quiz
//     await QuizModel.findByIdAndUpdate(quizId, {
//       $push: { questions: { $each: newQuestionIds } },
//     });

//     return NextResponse.json(
//       {
//         message: `${newQuestions.length} questions generated and added successfully.`,
//         data: newQuestions,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("AI Generation Error:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error during AI generation" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import QuizModel from "@/models/quiz";
import QuestionModel from "@/models/question";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyAdmin } from "@/lib/auth";

// Initialize the AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// We have removed the second 'context' argument entirely.
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // --- THE FIX: Get quizId from the request BODY ---
    const body = await req.json();
    const { quizId, numberOfQuestions = 10 } = body; // Default to 10 if not provided

    // Add a check to ensure quizId was sent
    if (!quizId) {
      return NextResponse.json(
        { message: "quizId is missing from the request body." },
        { status: 400 }
      );
    }

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // --- AI Prompt Engineering (No changes needed here) ---
    const prompt = `
      You are an expert quiz creator. Based on the following quiz details, generate ${numberOfQuestions} multiple-choice questions.
      
      Quiz Title: "${quiz.title}"
      Quiz Topic: "${quiz.topic}"
      Quiz Description: "${quiz.description}"

      Each question must have exactly 4 options. One of the options must be the correct answer.
      
      IMPORTANT: Your response MUST be a valid JSON array of objects, with no other text, explanations, or markdown.
      Each object in the array must have the following structure:
      {
        "text": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text"
        "correctAnswerIndex": "The index of the correct option"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedJsonString = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let generatedQuestions;
    try {
      generatedQuestions = JSON.parse(cleanedJsonString);
    } catch (e) {
      console.error("Failed to parse AI response:", cleanedJsonString);
      console.error("Error:", e);
      return NextResponse.json(
        { message: "AI failed to generate valid questions. Please try again." },
        { status: 500 }
      );
    }

    if (!Array.isArray(generatedQuestions)) {
      return NextResponse.json(
        { message: "AI returned an invalid data format." },
        { status: 500 }
      );
    }

    const questionsToInsert = generatedQuestions.map((q) => ({
      ...q,
      quizId: quiz._id,
    }));

    const newQuestions = await QuestionModel.insertMany(questionsToInsert);
    const newQuestionIds = newQuestions.map((q) => q._id);

    await QuizModel.findByIdAndUpdate(quizId, {
      $push: { questions: { $each: newQuestionIds } },
    });

    return NextResponse.json(
      {
        message: `${newQuestions.length} questions generated and added successfully.`,
        data: newQuestions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error during AI generation" },
      { status: 500 }
    );
  }
}
