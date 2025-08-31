// // import { openai } from "@ai-sdk/openai";
// // import { streamText, UIMessage, convertToModelMessages } from "ai";
// // import { NextResponse } from "next/server";

// // export const maxDuration = 30;

// // export async function POST(req: Request) {
// //   try {
// //     const { messages } = await req.json();
// //     const prompt =
// //       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

// //     const result = streamText({
// //       model: openai("gpt-4o"),
// //       prompt,
// //     });
// //     console.log("result of ai ", result);
// //     return result.toUIMessageStreamResponse();
// //   } catch (error) {
// //     if (error instanceof Error) {
// //       const { name, message } = error;
// //       console.error("Error processing request:", error.message);
// //       return NextResponse.json({ name, message }, { status: 500 });
// //     }
// //     console.error("Error processing request:", error);
// //     return new Response("Internal Server Error", { status: 500 });
// //   }
// // }

// import { openai } from "@ai-sdk/openai";
// import { streamText, UIMessage, convertToModelMessages } from "ai";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 300;

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const prompt =
//     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'Whats a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||Whats a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//   try {
//     const result = streamText({
//       model: openai("gpt-4o"),
//       prompt,
//     });
//     console.log("result openai ", result);
//     const response = result.toUIMessageStreamResponse();
//     console.log("respone ", response);
//     return response;
//   } catch (error) {
//     console.log("error ", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
