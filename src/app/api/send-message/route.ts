import dbConnect from "@/lib/dbconnect";
dbConnect();

import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(req: Request) {
  const { username, content } = await req.json();

  if (!username || !content) {
    return Response.json(
      {
        success: false,
        message: "username and content are required",
      },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // check user accept messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User not accpet messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    // type bta rha hai ki message ka structure kya hoga
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
        messages: user.messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 500 }
    );
  }
}


