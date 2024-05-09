import 'dotenv';
import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();
let uri = process.env.CONN_STR;


export const connect = async () => {  
  console.log("Connecting to the database");
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (e: any) {
    console.log(e.message);
    throw new Error("Error connecting to the database");
  }
};
