import mongoose, { Schema, Document } from "mongoose";
// document use  typesafety ke liye

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// type schema hai aur custom hai to <> me btaya hai
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpires: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  //   aur
  //   messages: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: "Message",
  //     },
  //   ],
});

// ye edge pe chalta ahi to ese bta nhi hota ki pehle bar chal rha hai ya pehle bhi chal gya hai
// to ye ham check karge ki ye schema hai ya nhi nhi hai to create karte hai

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
//  mongoose.Model<User> means btata hai ki vo aayega uska type model aayega vo bhi user type ka  ye hai data type

// <User> ye data type hai


export default UserModel;