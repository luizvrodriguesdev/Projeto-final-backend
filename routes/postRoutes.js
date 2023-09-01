import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.URI_MONGO);

const router = express.Router();

const postSchema = new mongoose.Schema({
  title: String,
  categories: mongoose.Schema.Types.ObjectId,
  //   description: String,
  description: String,
});

const Post = mongoose.model("Post", postSchema);

async function savePost(req, res) {
  const newPost = new Post({
    title: req.body.title,
    categories: req.body.categories,
    description: req.body.description,
  });
  try {
    await newPost.save();
    console.log("Post criado com sucesso!");
    res.status(201).json({ message: "Post criado com sucesso!" });
  } catch (err) {
    console.log("Ocorreu um erro:", err);
  }
}
async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getPostById(req, res) {
  console.log("ENTREI AQUI!");
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send("Nenhum post encontrado no banco!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deletePost(req, res) {
  const postId = req.params.id;
  console.log(postId);
  try {
    const deletedPost = await Post.deleteOne({
      _id: postId,
    });
    if (deletedPost.deletedCount === 0) {
      res.status(404).send("Nenhum post encontrado no banco!");
    } else {
      res.status(204).json({ message: "Post deletado com sucesso!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function updatePost(req, res) {
  console.log("ENTREI AQUI!");
  const postId = req.params.id;

  const updateData = req.body;
  try {
    const updatedPost = await Post.updateOne({ _id: postId }, updateData);
    if (updatedPost.nModified === 0) {
      res.status(404).send("Nenhum post encontrado no banco!");
    } else {
      res.status(200).json({ message: "Post Atualizado!" });
    }
  } catch (error) {
    console.log("Ocorreu um erro", error);
    res.status(500).send(error);
  }
}

router.post("/posts", savePost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);
router.delete("/posts/:id", deletePost);
router.patch("/posts/:id", updatePost);

export default router;
