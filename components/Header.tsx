"use client";

import { usePathname } from "next/navigation";
// import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-full h-[18vh] border-b-2 items-center justify-between p-6">
      <div className="text-3xl font-bold tracking-tight">
        <span
          className="
      bg-gradient-to-r from-teal-500 to-cyan-500 
      bg-clip-text text-transparent
    "
        >
          <Link href="/" className="hover:underline">
            AIQuiz
          </Link>
        </span>
      </div>
      <div className="flex gap-4 font-bold text-gray-900 dark:text-gray-100 mr-4">
        {pathname !== "/sign-in" && (
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="font-bold text-teal-500 border-teal-500 hover:bg-teal-500/10 hover:text-teal-500"
            >
              Sign In
            </Button>
          </Link>
        )}

        {pathname !== "/sign-up" && (
          <Link href="/sign-up">
            <Button className="font-bold bg-teal-500 hover:bg-teal-600">
              Sign Up
            </Button>
          </Link>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
