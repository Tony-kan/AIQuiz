// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// // import { useParams } from "next/navigation";
// import { toast } from "sonner";
// import { IQuiz, IQuestion } from "@/type/type"; // Assuming you have these types

// import { ArrowLeft, Bot, PlusCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
// import { QuestionList } from "@/components/admin/questionList";
// import { QuestionModal } from "@/components/admin/questionModal";
// import { AiGenerationDialog } from "@/components/admin/aiGenerationDialog";

// // import { QuizDetailsForm } from "@/components/admin/QuizDetailsForm";
// // import { QuestionList } from "@/components/admin/QuestionList";
// // import { QuestionModal } from "@/components/admin/QuestionModal";
// // import { AiGenerationDialog } from "@/components/admin/AiGenerationDialog";

// const QuizAdminPage = ({ params }: { params: { id: string } }) => {
//   // const { quizId } = useParams();
//   const { id: quizId } = params;

//   console.log("FRONTEND: The quizId from the URL is:", quizId);

//   const [quiz, setQuiz] = useState<IQuiz | null>(null);
//   const [questions, setQuestions] = useState<IQuestion[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // State for the question modal (add/edit)
//   const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
//     null
//   );

//   // State for the AI generation dialog
//   const [isAiModalOpen, setIsAiModalOpen] = useState(false);

//   // Fetch initial quiz and question data
//   const fetchData = useCallback(async () => {
//     setIsLoading(false);
//     try {
//       // Fetch quiz details
//       const quizRes = await fetch(`/api/admin/quiz/${quizId}`);
//       if (!quizRes.ok) throw new Error("Failed to fetch quiz details.");
//       const quizData = await quizRes.json();
//       setQuiz(quizData);

//       // Fetch associated questions
//       const questionsRes = await fetch(`/api/admin/quiz/${quizId}/questions`);
//       if (!questionsRes.ok) throw new Error("Failed to fetch questions.");
//       const questionsData = await questionsRes.json();
//       setQuestions(questionsData);
//     } catch (error) {
//       // toast.error(error.message || "Could not load quiz data.");
//       toast.error("Could not load quiz data.");
//       console.error("Error : ", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [quizId]);

//   useEffect(() => {
//     if (quizId) {
//       fetchData();
//     }
//   }, [quizId, fetchData]);

//   // --- Handlers ---

//   const handleOpenEditModal = (question: IQuestion) => {
//     setEditingQuestion(question);
//     setIsQuestionModalOpen(true);
//   };

//   const handleOpenCreateModal = () => {
//     setEditingQuestion(null);
//     setIsQuestionModalOpen(true);
//   };

//   const handleDeleteQuestion = async (questionId: string) => {
//     if (!window.confirm("Are you sure you want to delete this question?"))
//       return;

//     const deleteToast = toast.loading("Deleting question...");
//     try {
//       const response = await fetch(`/api/admin/question/${questionId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete question.");

//       toast.success("Question deleted successfully.", { id: deleteToast });
//       fetchData(); // Refresh the list
//     } catch (error) {
//       // toast.error(error.message || "Failed to delete question.", {
//       //   id: deleteToast,
//       // });
//       toast.error("Failed to delete question.");
//       console.error("Error : ", error);
//     }
//   };

//   if (isLoading) {
//     return <div className="p-10 text-center">Loading quiz details ...</div>;
//   }

//   if (!quiz) {
//     return <div className="p-10 text-center">Quiz not found.</div>;
//   }

//   return (
//     <>
//       <div className="flex flex-col gap-8 p-4 md:p-10">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <Button variant="outline" size="icon" asChild>
//             <Link href="/admin/dashboard">
//               <ArrowLeft className="h-4 w-4" />
//             </Link>
//           </Button>
//           <div>
//             <h1 className="font-bold text-2xl md:text-3xl">Edit Quiz</h1>
//             <p className="text-muted-foreground">
//               Manage quiz details and questions.
//             </p>
//           </div>
//         </div>

//         {/* Section 1: Quiz Details Form */}
//         {/* <QuizDetailsForm initialData={quiz} onUpdate={fetchData} /> */}

//         <Separator />

//         {/* Section 2 & 3: Questions Header & Actions */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="font-bold text-xl md:text-2xl">Questions</h2>
//             <p className="text-muted-foreground">
//               Add, edit, or generate questions for this quiz.
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => setIsAiModalOpen(true)}>
//               <Bot className="mr-2 h-4 w-4" /> Generate with AI
//             </Button>
//             <Button onClick={handleOpenCreateModal}>
//               <PlusCircle className="mr-2 h-4 w-4" /> Add Question
//             </Button>
//           </div>
//         </div>

//         {/* Section 4: Questions List */}
//         <QuestionList
//           questions={questions}
//           onEdit={handleOpenEditModal}
//           onDelete={handleDeleteQuestion}
//         />
//       </div>

//       {/* Modals and Dialogs */}
//       <QuestionModal
//         isOpen={isQuestionModalOpen}
//         onClose={() => setIsQuestionModalOpen(false)}
//         quizId={quizId}
//         questionData={editingQuestion}
//         onSave={fetchData}
//       />
//       <AiGenerationDialog
//         isOpen={isAiModalOpen}
//         onClose={() => setIsAiModalOpen(false)}
//         quizId={quizId}
//         quizTopic={quiz.topic}
//         onFinish={fetchData}
//       />
//     </>
//   );
// };

// export default QuizAdminPage;

// File: app/(admin)/quizz/[id]/page.tsx

// STEP 1: Add "use client" at the very top. This is the most important step.
"use client";

import React, { useState, useEffect, useCallback } from "react";
// STEP 2: Import and use the `useParams` hook to get the ID.
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { IQuiz, IQuestion } from "@/type/type";

import { ArrowLeft, Bot, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { QuestionList } from "@/components/admin/questionList";
import { QuestionModal } from "@/components/admin/questionModal";
import { AiGenerationDialog } from "@/components/admin/aiGenerationDialog";

// STEP 3: The component does NOT receive `params` as a prop.
const QuizAdminPage = () => {
  // Get the params object using the hook.
  // The key 'id' must match your folder name: [id]
  // const params = useParams<{ quizId: string }>();
  // const quizId = params.id;
  const params = useParams<{ quizId: string }>();
  const quizId = params.quizId;

  console.log("FRONTEND: The quizId from the URL is:", quizId);

  // The rest of your code is already correct for a Client Component.
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null
  );
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    // This check is important to prevent fetching with an undefined ID
    if (!quizId) return;

    // Set loading to true at the start of the fetch
    setIsLoading(true);
    try {
      const quizRes = await fetch(`/api/admin/quiz/${quizId}`);
      console.log("quizRes ----------- ", quizRes);
      if (!quizRes.ok) {
        const errorData = await quizRes.json();
        throw new Error(errorData.message || "Failed to fetch quiz details.");
      }
      const quizData = await quizRes.json();
      setQuiz(quizData);

      const questionsRes = await fetch(`/api/admin/quiz/${quizId}/questions`);
      console.log("questtions Res ----------- ", questionsRes);

      if (!questionsRes.ok) {
        const errorData = await questionsRes.json();
        throw new Error(errorData.message || "Failed to fetch questions.");
      }
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not load quiz data."
      );
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    // The `if (quizId)` guard ensures `fetchData` only runs when the ID is available.
    if (quizId) {
      fetchData();
    }
  }, [quizId, fetchData]);

  // --- Handlers ---
  const handleOpenEditModal = (question: IQuestion) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  // const handleDeleteQuestion = async (questionId: string) => {
  //   if (!window.confirm("Are you sure you want to delete this question?"))
  //     return;
  //   // ... your delete logic
  // };
  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    const deleteToast = toast.loading("Deleting question...");
    try {
      const response = await fetch(`/api/admin/question/${questionId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete question.");

      toast.success("Question deleted successfully.", { id: deleteToast });
      fetchData(); // Refresh the list
    } catch (error) {
      // toast.error(error.message || "Failed to delete question.", {
      //   id: deleteToast,
      // });
      toast.error("Failed to delete question.");
      console.error("Error : ", error);
    }
  };
  // --- Render Logic ---
  if (isLoading) {
    return <div className="p-10 text-center">Loading quiz details...</div>;
  }

  if (!quiz) {
    return (
      <div className="p-10 text-center">Quiz not found or failed to load.</div>
    );
  }

  return (
    <>
      {/* Your JSX is fine, no changes needed here */}
      <div className="flex flex-col gap-8 p-4 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-bold text-2xl md:text-3xl">Edit Quiz</h1>
            <p className="text-muted-foreground">
              Manage quiz details and questions.
            </p>
          </div>
        </div>
        <Separator />
        {/* Questions Header & Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl md:text-2xl">Questions</h2>
            <p className="text-muted-foreground">
              Add, edit, or generate questions for this quiz.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAiModalOpen(true)}>
              <Bot className="mr-2 h-4 w-4" /> Generate with AI
            </Button>
            <Button onClick={handleOpenCreateModal}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
        </div>
        {/* Questions List */}
        <QuestionList
          questions={questions}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteQuestion}
        />
      </div>
      {/* Modals and Dialogs */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        quizId={quizId}
        questionData={editingQuestion}
        onSave={fetchData}
      />
      <AiGenerationDialog
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        quizId={quizId}
        quizTopic={quiz.topic}
        onFinish={fetchData}
      />
    </>
  );
};

export default QuizAdminPage;
