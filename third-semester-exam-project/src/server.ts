import dotenv from "dotenv";
import app from "./app";
import express from "express";
import { apiLimiter } from "./middlewares/rateLimit.middleware";



dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(apiLimiter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});