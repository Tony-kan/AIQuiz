// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";

// // Define types for quiz data
// interface IQuestion {
//   _id: string;
//   questionText: string;
//   options: string[];
// }
// interface IQuiz {
//   _id: string;
//   title: string;
//   questions: IQuestion[];
// }

// const QuizPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const quizId = params.quizId as string;
//   console.log("FRONTEND: The quizId from the URL is:", quizId);

//   const [quiz, setQuiz] = useState<IQuiz | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
//   const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       const response = await fetch(`/api/student/quizzes/${quizId}`);
//       const data = await response.json();
//       setQuiz(data);
//       // Set timer based on number of questions (e.g., 1 minute per question)
//       setTimeLeft(data.questions.length * 60);
//     };
//     if (quizId) fetchQuiz();
//   }, [quizId]);

//   // Timer effect
//   useEffect(() => {
//     if (!quiz || timeLeft <= 0) return;
//     const timerId = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timerId);
//   }, [quiz, timeLeft]);

//   // Auto-submit when timer runs out
//   useEffect(() => {
//     if (timeLeft === 0) {
//       handleSubmit();
//     }
//   }, [timeLeft]);

//   const handleAnswerSelect = (questionId: string, optionIndex: number) => {
//     setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
//   };

//   const handleSubmit = async () => {
//     if (isSubmitting) return;
//     setIsSubmitting(true);

//     const formattedAnswers = Object.entries(userAnswers).map(
//       ([questionId, selectedAnswerIndex]) => ({
//         questionId,
//         selectedAnswerIndex,
//       })
//     );

//     try {
//       const response = await fetch(`/api/student/quizzes/${quizId}/submit`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userAnswers: formattedAnswers }),
//       });
//       const result = await response.json();
//       // Redirect to a results page (you can create this page)
//       alert(
//         `Quiz Submitted! Your score: ${result.score}%. You ${
//           result.passed ? "Passed" : "Failed"
//         }.`
//       );
//       router.push("/student/dashboard");
//     } catch (error) {
//       console.error("Failed to submit quiz", error);
//       alert("There was an error submitting your quiz.");
//       setIsSubmitting(false);
//     }
//   };

//   const currentQuestion = quiz?.questions[currentQuestionIndex];
//   const progress = useMemo(() => {
//     if (!quiz) return 0;
//     return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
//   }, [currentQuestionIndex, quiz]);

//   if (!quiz) return <div>Loading Quiz...</div>;

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
//       <Card className="w-full max-w-2xl">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>{quiz.title}</CardTitle>
//             <div className="text-lg font-mono bg-secondary text-secondary-foreground px-3 py-1 rounded">
//               {Math.floor(timeLeft / 60)}:
//               {String(timeLeft % 60).padStart(2, "0")}
//             </div>
//           </div>
//           <div className="mt-4">
//             <Progress value={progress} className="w-full" />
//             <p className="text-sm text-muted-foreground mt-1 text-center">
//               Question {currentQuestionIndex + 1} of {quiz.questions.length}
//             </p>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {currentQuestion && (
//             <div>
//               <h2 className="text-lg font-semibold mb-4">
//                 {currentQuestion.questionText}
//               </h2>
//               <RadioGroup
//                 value={String(userAnswers[currentQuestion._id])}
//                 onValueChange={(value) =>
//                   handleAnswerSelect(currentQuestion._id, Number(value))
//                 }
//               >
//                 {currentQuestion.options.map((option, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center space-x-2 mb-2 p-3 border rounded-md has-[:checked]:bg-accent"
//                   >
//                     <RadioGroupItem
//                       value={String(index)}
//                       id={`option-${index}`}
//                     />
//                     <Label
//                       htmlFor={`option-${index}`}
//                       className="flex-1 cursor-pointer"
//                     >
//                       {option}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>
//           )}
//         </CardContent>
//         <div className="p-6 pt-0 flex justify-between">
//           <Button
//             variant="outline"
//             onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
//             disabled={currentQuestionIndex === 0}
//           >
//             Previous
//           </Button>
//           {currentQuestionIndex < quiz.questions.length - 1 ? (
//             <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
//               Next
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit} disabled={isSubmitting}>
//               {isSubmitting ? "Submitting..." : "Finish & Submit"}
//             </Button>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default QuizPage;

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Define types for quiz data
interface IQuestion {
  _id: string;
  questionText: string;
  options: string[];
}
interface IQuiz {
  _id: string;
  title: string;
  questions: IQuestion[];
}

const QuizPage = () => {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/student/quizzes/${quizId}`);

        // FIX 1: Check if the API call was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load the quiz.");
        }

        const data = await response.json();
        setQuiz(data);
        // Set timer only after successfully fetching data
        if (data.questions && data.questions.length > 0) {
          setTimeLeft(data.questions.length * 60);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("Frontend Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!quiz || timeLeft <= 0 || loading) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [quiz, timeLeft, loading]);

  // Auto-submit when timer runs out
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formattedAnswers = Object.entries(userAnswers).map(
      ([questionId, selectedAnswerIndex]) => ({
        questionId,
        selectedAnswerIndex,
      })
    );

    try {
      // FIX 2: Corrected the API path
      const response = await fetch(`/api/student/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswers: formattedAnswers }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit quiz.");
      }
      alert(
        `Quiz Submitted! Your score: ${result.score}%. You ${
          result.passed ? "Passed" : "Failed"
        }.`
      );
      router.push("/student/dashboard");
    } catch (error: any) {
      console.error("Failed to submit quiz", error);
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const progress = useMemo(() => {
    if (!quiz?.questions) return 0;
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  }, [currentQuestionIndex, quiz]);

  if (loading) return <div className="text-center p-8">Loading Quiz...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!quiz || !currentQuestion)
    return <div className="text-center p-8">Quiz data is not available.</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="text-lg font-mono bg-secondary text-secondary-foreground px-3 py-1 rounded">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {currentQuestion.questionText}
            </h2>
            <RadioGroup
              value={String(userAnswers[currentQuestion._id])}
              onValueChange={(value) =>
                handleAnswerSelect(currentQuestion._id, Number(value))
              }
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 mb-2 p-3 border rounded-md has-[:checked]:bg-accent"
                >
                  <RadioGroupItem
                    value={String(index)}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <div className="p-6 pt-0 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Finish & Submit"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;
