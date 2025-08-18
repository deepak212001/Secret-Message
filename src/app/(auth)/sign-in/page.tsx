"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { singInSchema } from "@/schemas/signin.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { ToastContainer, toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // means ye 300 millisec bad value set karega

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof singInSchema>>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    // vo control karna hai vo dalna hai
  });

  const onSubmit = async (data: z.infer<typeof singInSchema>) => {
    //   ye nextauth se tha to
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log("signin res ", result);
    if (result?.error) toast(`${result.error}`);

    if (result?.url) router.replace("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input
                    {...field}
                    value={field.value as string}
                    placeholder="Enter email or username"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <ToastContainer />
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
