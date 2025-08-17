// yaha ye hai ki jab bhi response send kare to es hi type ki guideline ko follow kare

import { Message } from "@/model/user.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>
};
