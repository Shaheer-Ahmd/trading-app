// app.ts
import express from "express";
import { Express, json, urlencoded } from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";

export const app: Express = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/", authRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});
