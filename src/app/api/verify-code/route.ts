import dbConnect from "@/lib/dbconnect";
dbConnect();

// import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user.model";

export async function POST(req: Request) {
  try {
    const { username, code } = await req.json();
    console.log("details ", { username, code });
    const decodedUsername = decodeURIComponent(username);
    // ye url ko decode kar deta hai means  sappce hota hai to uri %20 kar deta hai to vo hata deta hai
    // vaise yaha eski jruri nhi hai par bahut jagah hoti hai

    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiry = new Date(user.verifyCodeExpires) > new Date();
    if (isCodeValid && isCodeNotExpiry) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );
    }

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "OTP is invalid",
        },
        { status: 400 }
      );
    }
    if (!isCodeNotExpiry) {
      return Response.json(
        {
          success: false,
          message: "Verification Code is expired",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error while verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to Verify user",
      },
      { status: 500 }
    );
  }
}
