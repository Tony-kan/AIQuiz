"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IQuiz } from "@/type/type";

/**
 * A component to display a list of quizzes in styled rectangular cards.
 * It handles loading, empty states, and user actions like viewing, editing, and deleting.
 *
 * @param {IQuiz[]} quizzes - The array of quiz objects to display.
 * @param {boolean} isLoading - A boolean to indicate if the quizzes are currently being loaded.
 * @param {(quiz: IQuiz) => void} handleEdit - Function to call when the edit button is clicked. It receives the quiz object.
 * @param {(id: string) => void} handleDelete - Function to call when the delete button is clicked. It receives the quiz ID.
 */
export const QuizList = ({
  quizzes,
  isLoading,
  handleEdit,
  handleDelete,
}: {
  quizzes: IQuiz[];
  isLoading: boolean;
  handleEdit: (quiz: IQuiz) => void;
  handleDelete: (id: string) => void;
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Loading quizzes...
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No quizzes found. Click &quot;Create Quiz&quot; to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card
          key={quiz._id}
          className="flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Card Header and Content */}
          <div>
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <Badge variant="outline" className="capitalize shrink-0">
                  {quiz.topic}
                </Badge>
              </div>
              <CardDescription className="pt-2 h-[65px] line-clamp-3">
                {quiz.description || "No description provided for this quiz."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Created on: {new Date(quiz.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </div>

          {/* Card Actions Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t mt-auto">
            <Button
              variant="ghost"
              size="icon"
              aria-label="View Quiz"
              title="View Quiz"
              onClick={() => router.push(`/quizz/${quiz._id}`)}
            >
              <Eye className="h-5 w-5 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit Quiz"
              title="Edit Quiz"
              onClick={() => handleEdit(quiz)}
            >
              <Pencil className="h-5 w-5 text-yellow-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete Quiz"
              title="Delete Quiz"
              onClick={() => handleDelete(quiz._id)}
            >
              <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
