import dbConnect from "@/lib/dbconnect";
dbConnect();

import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/singup.schema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
// means ab yaha pe user form me username likhega to vaha hi pta chal jayega ki unique hai ya nhi

export async function GET(req: Request) {

  try {
    // url -? localhost:3000/api/check-username-unique?username=<username>
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validation by zod

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("Validation result:", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._error || [];
      //   means ki username ka error lo
      return Response.json(
        {
          success: false,
          Message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : ["Invalid username"],
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          Message: "Username is already taken",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: true,
        Message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking username ", error);
    return Response.json(
      {
        success: false,
        Message: "Failed to check username",
      },
      { status: 500 }
    );
  }
}
