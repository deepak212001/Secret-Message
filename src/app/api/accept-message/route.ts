import dbConnect from "@/lib/dbconnect";
dbConnect();

import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

// getServerSession used for find currently login user
// post for currently user can toggle accepting message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  //   session are in authOption
  //   now we get the session and the session take the user detail
  const user = session?.user;
  console.log("user ac ", user);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "User ID not found",
      },
      { status: 400 }
    );
  }
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true } // es se updated document return hoga
    );
    console.log("updatedUser ", updatedUser);
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User status updated failed",
        },
        { status: 505 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user status to accept message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
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
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve user", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve user",
      },
      { status: 500 }
    );
  }
}
