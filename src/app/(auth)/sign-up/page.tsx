"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { singUpSchema } from "@/schemas/singup.schema";
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

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 3000);
  // means ye 300 millisec bad value set karega

  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof singUpSchema>>({
    resolver: zodResolver(singUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    // vo control karna hai vo dalna hai
  });

  useEffect(() => {
    const checkUsernsmeUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        // Simulate an API call
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
          console.log("response forusername check ", response);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernsmeUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof singUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/sign-up`, data);
      toast(`${response.data.message}`);
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("error in singup in fd ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "ERROR in singnup";
      toast(`${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Email" {...field} />
                  <p className=' text-gray-500 text-sm'>We will send you a verification code</p>
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
                  <Input type="password"  placeholder="Password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
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
