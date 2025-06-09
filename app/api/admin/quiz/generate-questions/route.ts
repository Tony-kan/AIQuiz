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
    const { quizId, numberOfQuestions = 10, context } = body; // Default to 10 if not provided

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

    const questionTypes = [
      {
        type: "Remembering",
        description:
          "Recall facts and basic concepts (e.g., define, list, name).",
      },
      {
        type: "Understanding",
        description:
          "Explain ideas or concepts (e.g., classify, describe, discuss).",
      },
      {
        type: "Applying",
        description:
          "Use information in new situations (e.g., execute, implement, solve).",
      },
      {
        type: "Analyzing",
        description:
          "Draw connections among ideas (e.g., differentiate, organize, compare).",
      },
    ];

    // // --- AI Prompt Engineering (No changes needed here) ---
    // if (context && context.trim() !== "") {
    //   prompt += `

    //   ADDITIONAL CONTEXT TO USE: You MUST base the questions on the following text or keywords:
    //   ---
    //   ${context}
    //   ---
    //   `;
    // }

    // const prompt = `
    //   You are an expert quiz creator. Based on the following quiz details, generate ${numberOfQuestions} multiple-choice questions.

    //   Quiz Title: "${quiz.title}"
    //   Quiz Topic: "${quiz.topic}"
    //   Quiz Description: "${quiz.description}"

    //   Each question must have exactly 4 options. One of the options must be the correct answer.

    //   IMPORTANT: Your response MUST be a valid JSON array of objects, with no other text, explanations, or markdown.
    //   Each object in the array must have the following structure:
    //   {
    //     "questionText": "The question text",
    //     "options": ["Option A", "Option B", "Option C", "Option D"],
    //     "correctAnswer": "The correct option text"
    //     "correctAnswerIndex": "The index of the correct option"
    //   }
    // `;

    let prompt = `
      You are a master educator and expert quiz creator specializing in creating engaging and effective learning assessments. Your goal is to generate a set of high-quality multiple-choice questions.

      **//-- INSTRUCTIONS --//**

      **1. Core Task:** Generate exactly ${numberOfQuestions} multiple-choice questions based on the provided quiz details.

      **2. Quiz Details:**
         - **Title:** "${quiz.title}"
         - **Topic:** "${quiz.topic}"
         - **Description:** "${quiz.description}"
    `;

    // 3. Conditionally add user-provided context
    if (context && context.trim() !== "") {
      prompt += `
         - **Mandatory Context:** You MUST base the questions primarily on the following text. This context is the source of truth.
           ---
           ${context}
           ---
      `;
    }

    // 4. Add instructions for question quality and variety
    prompt += `
      **3. Question Quality Guidelines:**
         - **Clarity:** Each question must be unambiguous, clear, and grammatically correct.
         - **Plausible Distractors:** The incorrect options (distractors) must be plausible and relevant to the topic to create a meaningful challenge. Avoid obviously wrong or silly options.
         - **Varying Difficulty:** Create a mix of question difficulties. For inspiration, consider these levels:
           - ${questionTypes
             .map((qt) => `${qt.type}: ${qt.description}`)
             .join("\n           - ")}
         - **Avoid Trivial Questions:** Do not ask questions that are common knowledge or can be answered without understanding the topic.

      **4. Chain-of-Thought Process (Internal Monologue):**
         Before generating the JSON, perform these steps internally:
         a. Identify the key concepts from the topic and context.
         b. For each question, formulate a clear question stem.
         c. Determine the single, unequivocally correct answer.
         d. Create three distinct, plausible but incorrect distractors.
         e. Verify that the question aligns with the quality guidelines.

      **5. Output Format:**
         - Your response MUST be a single, valid JSON array of objects.
         - Do NOT include any introductory text, explanations, comments, or markdown formatting like \`\`\`json. Your entire response should start with \`[\` and end with \`]\`.
         - Each object in the array must strictly adhere to this structure:
           {
             "questionText": "The full text of the question.",
             "options": ["Option A", "Option B", "Option C", "Option D"],
             "correctAnswerIndex": 0 
           }
         - The "correctAnswerIndex" MUST be the 0-based integer index of the correct answer within the "options" array.
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
