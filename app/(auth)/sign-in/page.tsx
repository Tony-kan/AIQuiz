import SignInForm from "@/components/auth/SignInForm";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-18vh)] w-screen bg-white dark:bg-black">
      <div className="mb-6 text-2xl font-semibold">Sign In </div>
      <SignInForm />
    </div>
  );
};

export default page;
