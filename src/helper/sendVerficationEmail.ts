// resend lib use with professional account (domain account)

// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";
// import * as React from "react";

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//   await resend.emails.send({
//     from: "Website <website@resend.dev>",
//     to: email,
//     subject: "True Feedback Verification Code",
//     html: `<p>hello ${username}, Your verification code is: ${verifyCode}</p>`,
//     // react: VerificationEmail({ username, otp :verifyCode }),
//   });

//   return {
//     success: true,
//     isAcceptingMessages: true,
//     message: "Verification email send successfully",
//   };
//   } catch (error) {
//     console.log("Error sending verification email:", error);
//     // yaha par bhi return bcz promise kiya hai
//     return {
//       success: false,
//       isAcceptingMessages: false,
//       message: "Failed to send verification email.",
//     };
//   }
// }

import React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const emailHtml: string = await render(
      React.createElement(VerificationEmail, { username, otp: verifyCode })
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "True Feedback Verification Code",
      // html: `dfdfg ${username}, ${verifyCode}`,
      html: emailHtml,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    console.log("mail response in send ", mailResponse);
    return {
      success: true,
      isAcceptingMessages: true,
      message: "Verification email send successfully",
    };
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return {
      success: false,
      isAcceptingMessages: false,
      message: "Failed to send verification email.",
    };
  }
}
