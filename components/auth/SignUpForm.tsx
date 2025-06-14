"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const roles = ["Student", "Admin"] as const;

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    fullname: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      // Add minimum length for password
      message: "Password must be at least 8 characters.",
    }),
    // 2. Add a distinct field for confirm password
    confirmPassword: z.string().min(8, {
      // Add minimum length for confirm password
      message: "Confirm password must be at least 8 characters.",
    }),
    role: z.enum(roles, {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return { message: "Please select a role." };
        }
        return { message: ctx.defaultError };
      },
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Student",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log("Form values:", values);

    try {
      const response = await axios.post("/api/auth/register", {
        username: values.username,
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      console.log(response);
      console.log("Form submitted successfully!");
      // alert("Registration successful! You can now sign in.");
      // toast("Registration successful!", {
      //   description: "You can now sign in.",
      //   action: {
      //     label: "Undo",
      //     onClick: () => console.log("Undo"),
      //   },
      // });
      toast("Registration successful!", {
        description: "You can now sign in.",
      });
      router.push("/sign-in"); // Redirect to sign-in page after successful registration
    } catch (error) {
      console.error(error);
      // toast.error(`Registration failed : ${error.message}`);

      // --- THIS IS THE CORRECTED LOGIC ---
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
        className="min-w-[360px] mx-auto px-6 bg-white dark:bg-[#212121] rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter unique username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Fullname</FormLabel>
              <FormControl>
                <Input placeholder="Enter your fullname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  placeholder="Enter a secure password"
                  {...field}
                  type="password"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Comfirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Repeat the password"
                  {...field}
                  type="password"
                />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role" // Name matches the schema field
          render={({ field }) => (
            <FormItem className="space-y-4 ">
              {" "}
              {/* Use space-y-3 for vertical spacing within the item */}
              <FormLabel>Select Role</FormLabel>
              <FormControl className="flex items-center space-x-3">
                {/* RadioGroup handles the value and onChange */}
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value} // Use value prop to control the selected item
                  className="flex  items-center" // Style the radio group layout
                >
                  {roles.map((role) => (
                    <FormItem
                      key={role}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        {/* RadioGroupItem represents each radio button */}
                        <RadioGroupItem
                          value={role}
                          id={`role-${role.toLowerCase()}`}
                        />
                      </FormControl>
                      {/* Label for the radio button, linked by htmlFor */}
                      <Label htmlFor={`role-${role.toLowerCase()}`}>
                        {role}
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              {/* FormMessage will display validation errors for the role */}
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
        <div className="my-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-teal-500 font-bold hover:underline dark:text-teal-500"
          >
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
