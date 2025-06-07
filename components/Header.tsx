import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="flex w-full h-[18vh] border-b-2 items-center justify-between p-6">
      <div className="text-3xl font-bold tracking-tight">
        <span
          className="
      bg-gradient-to-r from-teal-400 to-cyan-400 
      bg-clip-text text-transparent
    "
        >
          AIQuiz
        </span>
      </div>
      <div className="flex gap-4 font-bold text-gray-900 dark:text-gray-100 mr-4">
        <Button className=" bg-transparent border border-teal-400 font-bold text-teal-400 hover:bg-teal-400/30  hover:border-teal-400">
          Sign In
        </Button>
        <Button className="bg-teal-400 font-bold text-white border border-transparent hover:bg-transparent hover:text-teal-400 hover:border-teal-400">
          Sign Up
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
