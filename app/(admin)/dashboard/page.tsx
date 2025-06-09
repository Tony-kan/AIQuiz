"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Library, Users, CheckCircle, Percent, PlusCircle } from "lucide-react";
import { toast } from "sonner";
// import { Toaster } from "@/components/ui/sonner";

// --- STATIC UI & MOCK DATA (No changes here) ---
const cardUIData = [
  {
    stat_label: "totalQuizzes",
    icon: <Library className="h-6 w-6 text-teal-500" />,
    defaultTitle: "Total Quizzes",
  },
  {
    stat_label: "activeStudents",
    icon: <Users className="h-6 w-6 text-teal-500" />,
    defaultTitle: "Active Students",
  },
  {
    stat_label: "totalSubmissions",
    icon: <CheckCircle className="h-6 w-6 text-teal-500" />,
    defaultTitle: "Total Submissions",
  },
  {
    stat_label: "averageScore",
    icon: <Percent className="h-6 w-6 text-teal-500" />,
    defaultTitle: "Average Score",
  },
];

const mockApiData = [
  {
    stat_label: "totalQuizzes",
    value: "25",
    description: "Total number of quizzes created",
  },
  {
    stat_label: "activeStudents",
    value: "1,254",
    description: "+180 since last month",
  },
  {
    stat_label: "totalSubmissions",
    value: "8,430",
    description: "Results awaiting review: 15",
  },
  {
    stat_label: "averageScore",
    value: "82%",
    description: "Average passing rate across all quizzes",
  },
];

type StatData = {
  stat_label: string;
  value: string;
  description: string;
};

interface IQuestion {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface IQuiz {
  _id: string;
  title: string;
  description: string;
  topic: string;
  questions: IQuestion[];
  createdAt: string;
}

const tabTriggerStyles = `
  relative rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground 
  transition-none focus-visible:ring-0
  data-[state=active]:border-b-teal-500 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:font-semibold
`;

const initialQuizState = {
  title: "",
  description: "",
  topic: "",
  passMark: 50,
};

const Page = () => {
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizDetails, setQuizDetails] = useState(initialQuizState);
  const [isSaving, setIsSaving] = useState(false);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  console.log("quizzes:", quizzes);
  console.log("isLoadingQuizzes:", isLoadingQuizzes);
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsData(mockApiData);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuizDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (value: string) => {
    setQuizDetails((prev) => ({ ...prev, topic: value }));
  };

  // const handleSaveQuiz = () => {
  //   // TODO: Add form validation here (e.g., using Zod)
  //   console.log("Saving new quiz:", quizDetails);
  //   // TODO: Send data to your backend API

  //   // Close the modal and reset the form
  //   setIsModalOpen(false);
  //   setQuizDetails(initialQuizState);
  // };

  const fetchQuizzes = useCallback(async () => {
    setIsLoadingQuizzes(true);
    try {
      const response = await fetch("/api/admin/quiz");
      if (!response.ok) throw new Error("Failed to fetch quizzes.");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      toast.error("Could not load quizzes.");
      console.error(error);
    } finally {
      setIsLoadingQuizzes(false);
    }
  }, []);

  const handleCreateQuiz = async () => {
    if (!quizDetails.title || !quizDetails.topic) {
      return toast.error("Title and Topic are required.");
    }
    setIsSaving(true);
    const creationToast = toast.loading("Creating new quiz...");
    try {
      const response = await fetch("/api/admin/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizDetails),
      });
      if (!response.ok) throw new Error("Failed to create quiz.");

      toast.success("Quiz created successfully!", { id: creationToast });
      setIsModalOpen(false);
      setQuizDetails(initialQuizState);
      fetchQuizzes(); // Refresh the list
    } catch (error) {
      // toast.error(error.message, { id: creationToast });
      toast.error("Failed to create quiz.");
      console.error("Error : ", error);
    } finally {
      setIsSaving(false);
    }
  };
  // const handleGenerateQuestions = async (quizId: string) => {
  //   const generationToast = toast.loading("Generating AI questions...");
  //   try {
  //     const response = await fetch(
  //       `/api/admin/quiz/${quizId}/generate-questions`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ quizId, numberOfQuestions: 10 }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to generate questions.");
  //     }

  //     const result = await response.json();
  //     toast.success(result.message, { id: generationToast });
  //     fetchQuizzes(); // Refresh the list to show the new question count
  //   } catch (error) {
  //     // toast.error(error.message, { id: generationToast });
  //     toast.error("Failed to generate questions.");
  //     console.error("Error : ", error);
  //   }
  // };

  // const handleDeleteQuiz = async (quizId: string) => {
  //   if (
  //     !window.confirm(
  //       "Are you sure? This will delete the quiz and all its questions permanently."
  //     )
  //   ) {
  //     return;
  //   }
  //   const deleteToast = toast.loading("Deleting quiz...");
  //   try {
  //     const response = await fetch(`/api/admin/quiz/${quizId}`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ quizId }),
  //     });
  //     if (!response.ok) throw new Error("Failed to delete quiz.");

  //     toast.success("Quiz deleted successfully!", { id: deleteToast });
  //     fetchQuizzes(); // Refresh the list
  //   } catch (error) {
  //     // toast.error(error.message, { id: deleteToast });
  //     toast.error("Failed to delete quiz.");
  //     console.error("Error : ", error);
  //   }
  // };

  if (statsData.length === 0) {
    return <div className="p-10">Loading dashboard data...</div>;
  }

  // const handleGenerateQuestions = async (quizId: string) => {
  //   const generationToast = toast.loading("Generating AI questions...");
  //   try {
  //     // The URL path still helps organize routes, but the ID is sent in the body.
  //     const response = await fetch(
  //       `/api/admin/quiz/${quizId}/generate-questions`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         // --- THE FIX: Include quizId in the JSON body ---
  //         body: JSON.stringify({
  //           quizId: quizId,
  //           numberOfQuestions: 10,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to generate questions.");
  //     }

  //     const result = await response.json();
  //     toast.success(result.message, { id: generationToast });
  //     fetchQuizzes(); // Refresh the list to show the new question count
  //   } catch (error: any) {
  //     toast.error(error.message, { id: generationToast });
  //   }
  // };

  return (
    <>
      {/* <Toaster richColors position="top-center" /> */}
      <div className="flex flex-col gap-8 p-4 md:p-10">
        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            A quick overview of the quiz platform&#39;s performance.
          </p>
        </div>

        {/* Overview Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((dataItem) => {
            const uiItem = cardUIData.find(
              (ui) => ui.stat_label === dataItem.stat_label
            );
            if (!uiItem) return null;
            return (
              <Card key={dataItem.stat_label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {uiItem.defaultTitle}
                  </CardTitle>
                  {/* <Library className="h-4 w-4 text-muted-foreground" /> */}
                  {uiItem.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataItem.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {dataItem.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Section with Tabs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Platform</CardTitle>
              <CardDescription>
                Handle quizzes, students, and review submissions.
              </CardDescription>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center font-bold bg-white dark:bg-transparent dark:hover:bg-teal-500 text-teal-500 border-2 border-teal-500 hover:bg-teal-600 hover:text-white">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Create a New Quiz</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new quiz. Click save
                    when youre done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={quizDetails.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={quizDetails.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="topic" className="text-right">
                      Topic
                    </Label>
                    <Select
                      onValueChange={handleTopicChange}
                      value={quizDetails.topic}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="passMark" className="text-right">
                      Pass Mark (%)
                    </Label>
                    <Input
                      id="passMark"
                      name="passMark"
                      type="number"
                      value={quizDetails.passMark}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 font-bold hover:text-teal-500  hover:border-teal-500 dark:hover:border-teal-500 dark:hover:text-teal-500"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-white dark:bg-transparent dark:hover:bg-teal-500 font-bold text-teal-500 border-2 border-teal-500 hover:bg-teal-600 hover:text-white"
                    type="submit"
                    onClick={handleCreateQuiz}
                  >
                    {isSaving ? "Saving..." : "Save Quiz"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quizzes" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="quizzes" className={tabTriggerStyles}>
                  Quizzes
                </TabsTrigger>
                <TabsTrigger value="students" className={tabTriggerStyles}>
                  Students
                </TabsTrigger>
                <TabsTrigger value="results" className={tabTriggerStyles}>
                  Results
                </TabsTrigger>
              </TabsList>
              <TabsContent value="quizzes" className="mt-4">
                <p className="text-center text-muted-foreground p-8">
                  A table of all quizzes will be displayed here.
                </p>
              </TabsContent>
              <TabsContent value="students" className="mt-4">
                <p className="text-center text-muted-foreground p-8">
                  Manage student information and enrollment here.
                </p>
              </TabsContent>
              <TabsContent value="results" className="mt-4">
                <p className="text-center text-muted-foreground p-8">
                  View and review all quiz submissions here.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
