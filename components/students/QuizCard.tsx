import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    topic: string;
    questionCount: number;
    passMark: number;
    status: "Passed" | "Failed" | "Not Started";
  };
}

const statusColors = {
  Passed: "text-green-500 bg-green-100",
  Failed: "text-red-500 bg-red-100",
  "Not Started": "text-gray-500 bg-gray-100",
};

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const actionText =
    quiz.status === "Not Started" ? "Start Quiz" : "Retake Quiz";

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{quiz.title}</CardTitle>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              statusColors[quiz.status]
            }`}
          >
            {quiz.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{quiz.topic}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Questions</span>
          <span>{quiz.questionCount}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-muted-foreground">Pass Mark</span>
          <span>{quiz.passMark}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-transparent border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
        >
          <Link href={`/studentQuizzes/${quiz._id}`}>{actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
