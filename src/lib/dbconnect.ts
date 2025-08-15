import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
// isConnected? means isConnected return hoga par jruri nhi hai ki har bar return ho

const connection: ConnectionObject = {};
//  connection ko empty esliye rkh par rha he kyuki isConnected? hai means pehle hi bola hai ki jaruri nhi hai ki aayega hi

// promise yaha means ki kuchh na kuchh to return karega hi aur type void means mujhe parwa nhi hai ki ki trh ka data aaye
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL! || "");
    console.log("Connected to the database ", db);
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connection state:", connection.isConnected);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

export default dbConnect;
