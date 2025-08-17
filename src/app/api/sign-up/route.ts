import dbConnect from "@/lib/dbconnect";
dbConnect();

import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerficationEmail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = body;
    console.log("user signup:", { email, password, username });
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    // means username ho aur sath me vo verified user ho
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 409 }
      );
    }
    const existingEmail = await UserModel.findOne({ email });
    // means username ho aur sath me vo verified user ho

    const verifyCode = Math.floor(Math.random() * 1000000);
    const verifyCodeExpires = new Date();
    console.log("date ", verifyCodeExpires);
    verifyCodeExpires.setHours(verifyCodeExpires.getHours() + 1);
    // valid for 1hr

    if (existingEmail) {
      if (existingEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 409 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      existingEmail.password = hashedPassword;
      existingEmail.verifyCode = verifyCode.toString();
      existingEmail.verifyCodeExpires = verifyCodeExpires;
      await existingEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
      });
      await newUser.save();
    }

    const emailRes = await sendVerificationEmail(
      email,
      username,
      verifyCode.toString()
    );
    // if failed to sent email
    console.log("Email response:", emailRes);
    if (!emailRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in sign-up route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
