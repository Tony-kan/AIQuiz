import SignUpForm from "@/components/auth/SignUpForm";
import React from "react";

const page = () => {
  return (
    <div className="flex bg-white flex-col items-center justify-center h-[calc(100vh-18vh)] w-screen dark:bg-black">
      <div className="mb-4 text-3xl text-teal-500 font-semibold">
        Create Account
      </div>
      <SignUpForm />
    </div>
  );
};

export default page;
