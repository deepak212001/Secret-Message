"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptmessage.schema";
import { toast, ToastContainer } from "react-toastify";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  //  ye toggle switch form me hi hoga
  const { register, watch, setValue } = form;
  // ye watch hi toggle ko karega
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data?.isAcceptingMessages!);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        `${axiosError.response?.data.message ?? "Failed to fetch message settings"}`
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // (refersh:boolean =false) means refersh aayega uska type boolean hai aur nhi aya to false set karna
  const fetchMessages = useCallback(
    async (refersh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log("setMessages ", response.data.message);
        setMessages(response.data.messages || []);
        toast(`${response?.data.message ?? "successfully to fetch message 1"}`);
        if (refersh) {
          toast("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.log("axios error ", axiosError);
        setMessages(axiosError.response?.data.messages || []);
        toast(
          `${axiosError.response?.data.message ?? "Successfully to fetch message"}`
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast(`${response.data.message}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("axiors aerrror ", axiosError);
      toast(`${axiosError.response?.data.message ?? "Failed to toggle"}`);
    }
  };

  if (!session || !session.user) return <div>Please Login</div>;

  const { username } = session.user as User;

  //  window.location.protocol ->https dega
  // window.location.host -> domain
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Profile URL has been copied to clipboard.");
  };

  return (
    <div className="bg-gray-800">
      <BackgroundBeamsWithCollision>
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full max-w-6xl relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-center ">
            User Dashboard
          </h1>

          <div className="mb-4 ">
            <h2 className="text-lg font-semibold mb-2">
              Copy Your Unique Link
            </h2>{" "}
            <div className="flex items-center border-black-400 border-2 rounded-lg">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard} className="mr-1">
                Copy
              </Button>
            </div>
          </div>

          <div className="mb-4 ">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? "On" : "Off"}
            </span>
          </div>
          <Separator />

          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
          <ToastContainer />
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default Page;
