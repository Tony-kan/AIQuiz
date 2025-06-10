"use client";

import React, { useState, useEffect } from "react";

import {
  // BookCheck,
  BookCopy,
  CheckCircle,
  Percent,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/students/StatCard";
import { QuizCard } from "@/components/students/QuizCard";

// Define types for the data we expect from the API
interface IStat {
  totalQuizzes: number;
  quizzesTaken: number;
  passed: number;
  averageScore: number;
}

interface IQuiz {
  _id: string;
  title: string;
  topic: string;
  questionCount: number;
  passMark: number;
  status: "Passed" | "Failed" | "Not Started";
}

const StudentDashboardPage = () => {
  const [stats, setStats] = useState<IStat | null>(null);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/student/dashboard");
        const data = await response.json();
        setStats(data.stats);
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      {/* Overview Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Progress Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Available Quizzes"
            value={stats?.totalQuizzes || 0}
            caption="Total quizzes you can take"
            Icon={BookCopy}
          />
          <StatCard
            title="Quizzes Passed"
            value={stats?.passed || 0}
            caption={`${stats?.quizzesTaken || 0} taken in total`}
            Icon={CheckCircle}
          />
          <StatCard
            title="Quizzes Failed"
            value={(stats?.quizzesTaken || 0) - (stats?.passed || 0)}
            caption="Keep trying, you'll get it!"
            Icon={XCircle}
          />
          <StatCard
            title="Average Score"
            value={`${stats?.averageScore || 0}%`}
            caption="Your average across all attempts"
            Icon={Percent}
          />
        </div>
      </section>

      {/* Quizzes List Section */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
        {quizzes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <p>No quizzes available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default StudentDashboardPage;
