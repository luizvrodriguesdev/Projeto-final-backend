import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.URI_MONGO);


const router = express.Router();

router.get("/auth", (req, res) => {
  console.log("Cheguei no AUTH");
});

export default router;
