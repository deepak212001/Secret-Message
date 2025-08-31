import dbConnect from "@/lib/dbconnect";
dbConnect();

import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  // console.log("session ", session);
  // console.log("user ", user);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  //   const userId = user._id;
  // user._id string me convert kiya tha authOptions me
  //   to ab aggregation pipeline me ye issue de skte hai
  // to ab ham se mongose se lenge
  const userId = new mongoose.Types.ObjectId(user._id);
  // SO ab se convert hoke jayega
  console.log("userId ", userId);
  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "User ID not found",
      },
      { status: 400 }
    );
  }

  try {
    // unwind arraype lagta hai ye sabhi array ko split karta hai
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.creadtedAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log("user message ", user[0].messages[0]._id);
    console.log("user message type ", typeof user[0].messages);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not founf aur No messages found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Failed to retrieve messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve messages",
      },
      { status: 500 }
    );
  }
}
