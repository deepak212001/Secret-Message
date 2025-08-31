import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Emial", type: "text", placeholder: "Your Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials?.identifier },
              { username: credentials?.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found eith this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Incorrect Password");
          }

          return user;
        } catch (error: unknown) {
          console.error("Error in auth:", error);
          if (error instanceof Error) throw new Error(error.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    //  yaha pe ha par db se data na le to user se token me aur fir token se session me daal dena hai data
    // ab token ya session me se ek ho to user ki details le skte hai
    // aur yaha pe type bta rhe hai next-auth.d.ts me
  },

  pages: {
    signIn: "/sign-in",
    // pages  yaha /auth/singin kar ke aata to yaha pe overwrite kar diya hai
    // ab /sign-in pe jayege to hi ho jayega
  },

  session: {
    strategy: "jwt",
    // db ki sreategy hoti hai par mostly jwt ki hi
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// nextauth hi ab signin page ko desgin kar lega
