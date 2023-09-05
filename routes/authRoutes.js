import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.URI_MONGO);

const router = express.Router();

const authSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  permission: String,
});

const Auth = mongoose.model("Auth", authSchema);

router.post("/auth", async (req, res) => {
  try {
    const auth = await Auth.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (auth) {
      res.status(200).json({ message: "Usuário encontrado!", auth });
    } else {
      res.status(404).json({ message: "Usuário não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Usuário não encontrado!" });
  }
});

export default router;
