"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// import { Label } from "./ui/label";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    // Add minimum length for password
    message: "Password must be at least 8 characters.",
  }),
  // 2. Add a distinct field for confirm password
});

const SignInForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Form values:", values);
    console.log("Form submitted successfully!");
    try {
      const response = await axios.post("/api/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(response);
      // toast("Login successful!", {
      //   description: `Welcome back, ${response.data}!`,
      // });
      toast.success("Login successful!", {
        description: "Welcome back! Redirecting you now...",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        // We can get the custom message from our API.
        const errorMessage =
          error.response.data.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      } else {
        // Something happened in setting up the request that triggered an Error
        // or a non-Axios error was thrown.
        toast.error("Registration failed. Please try again.");
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-[360px] mx-auto p-6 bg-white dark:bg-[#212121] rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-4 bg-teal-500 hover:bg-teal-600 text-white w-full font-extrabold"
        >
          Submit
        </Button>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Dont have an account?{" "}
          <Link
            href="/sign-up"
            className="text-teal-500 font-bold hover:underline dark:text-teal-500"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
