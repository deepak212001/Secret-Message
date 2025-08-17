import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import * as React from "react";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
  await resend.emails.send({
    from: "Website <website@resend.dev>",
    to: email,
    subject: "True Feedback Verification Code",
    html: `<p>hello ${username}, Your verification code is: ${verifyCode}</p>`,
    // react: VerificationEmail({ username, otp :verifyCode }),
  });

  return {
    success: true,
    isAcceptingMessages: true,
    message: "Verification email send successfully",
  };
  } catch (error) {
    console.log("Error sending verification email:", error);
    // yaha par bhi return bcz promise kiya hai
    return {
      success: false,
      isAcceptingMessages: false,
      message: "Failed to send verification email.",
    };
  }
}
