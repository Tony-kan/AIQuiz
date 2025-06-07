"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// import Cookies from "js-cookie";
import axios from "axios";

import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

// A small helper function to get initials from a name
const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading } = useSession(); // Use our session hook

  const handleLogout = async () => {
    try {
      // Call the new logout API endpoint
      await axios.post("/api/auth/logout");

      // Redirect to the sign-in page
      router.push("/sign-in");

      // Force a hard refresh to clear all client-side state and re-run middleware
      router.refresh();
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-[18vh] border-b-2 items-center justify-between p-6">
      <div className="text-3xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
          <Link href="/" className="hover:underline">
            AIQuiz
          </Link>
        </span>
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ) : session && session.isAuthenticated ? (
          // --- USER IS LOGGED IN ---
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-10">
                  <AvatarFallback className="bg-teal-500 text-white font-bold">
                    {getInitials(session.fullname)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <p className="text-sm font-medium">{session.fullname}</p>
                  <p className="text-xs text-gray-500">{session.email}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {session.role}
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-500 font-medium"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          // --- USER IS LOGGED OUT ---
          <>
            {pathname !== "/sign-in" && (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="font-bold text-teal-500 border-teal-500 hover:bg-teal-500/10 hover:text-teal-500 dark:border-teal-500 dark:hover:bg-teal-500/10"
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
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
