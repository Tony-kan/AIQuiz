"use client";
import { useEffect } from "react";
import { Zap, GraduationCap, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import HomeCard from "@/components/HomeCard";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

const homepageFeatures = [
  {
    icon: <Zap size={40} className="text-teal-500" />,
    label: "Fast Setup",
    title: "Instant Quiz Generation",
    description: "Generate quizzes in seconds with AI or build your own.",
  },
  {
    icon: <GraduationCap size={40} className="text-teal-500" />,
    label: "For Everyone",
    title: "Admin & Student Roles",
    description: "Teachers manage quizzes,students take and review quizzes.",
  },
  {
    icon: <BarChart3 size={40} className="text-teal-500" />,

    label: "Smart Feedback",
    title: "Detailed results",
    description: "Get instant, actionable feedback after every quiz.",
  },
];

export default function Home() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (session) {
        const redirectPath =
          session?.role === "Student" ? "/studentsDashboard" : "/dashboard";

        router.push(redirectPath);
      }
    }
  }, [session, loading, router]);

  if (loading || session) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Header />
      <main className="flex flex-grow flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1
              className="
                text-4xl md:text-5xl lg:text-6xl 
                font-extrabold tracking-tight 
                text-slate-900 dark:text-slate-50
              "
            >
              AI-Powered Quiz Platform
            </h1>
            <p
              className="
                mt-4 max-w-2xl mx-auto 
                text-lg md:text-xl 
                text-slate-600 dark:text-slate-400
              "
            >
              Create, take, and review quizzes effortlessly with AI assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageFeatures.map((feature, index) => (
              <HomeCard
                key={index}
                icon={feature.icon}
                label={feature.label}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
