import React from "react";
import { IQuestion } from "@/type/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface QuestionListProps {
  questions: IQuestion[];
  onEdit: (question: IQuestion) => void;
  onDelete: (questionId: string) => void;
}

export const QuestionList = ({
  questions,
  onEdit,
  onDelete,
}: QuestionListProps) => {
  if (questions.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
        No questions have been added to this quiz yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {questions.map((q, index) => (
        <Card key={q._id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                {index + 1}. {q.questionText}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(q)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(q._id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center">
                  <Badge
                    variant={i === q.correctAnswerIndex ? "default" : "outline"}
                    className="p-2 w-full text-left justify-start"
                  >
                    {opt}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
