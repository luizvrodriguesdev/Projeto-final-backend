import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.URI_MONGO);


const router = express.Router();

const categorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model("Category", categorySchema);

async function saveCategory(req, res) {
  const newCategory = new Category({
    name: req.body.name,
  });
  try {
    await newCategory.save();
    console.log("Category criada com sucesso!");
    res.status(201).json({ message: "Category criada com sucesso!" });
  } catch (err) {
    console.log("Ocorreu um erro:", err);
  }
}
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getCategoryById(req, res) {
  console.log("ENTREI AQUI!");
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    if (category) {
      res.status(200).send(category);
    } else {
      res.status(404).send("Nenhuma category encontrada no banco!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteCategory(req, res) {
  const categoryId = req.params.id;
  console.log(categoryId);
  try {
    const deletedCategory = await Category.deleteOne({
      _id: categoryId,
    });
    if (deletedCategory.deletedCount === 0) {
      res.status(404).send("Nenhuma category encontrada no banco!");
    } else {
      res.status(204).json({ message: "category deletada com sucesso!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function updateCategory(req, res) {
    console.log("ENTREI AQUI!");
    const categoryId = req.params.id;

    const updateData = req.body;
    try {
      const updatedCategory = await Category.updateOne({ _id: categoryId }, updateData);
      if (updatedCategory.nModified === 0) {
        res.status(404).send("Nenhuma category encontrada no banco!");
      } else {
        res.status(200).json({ message: "Category Atualizada!" });
      }
    } catch (error) {
      console.log("Ocorreu um erro", error);
      res.status(500).send(error);
    }
  }

router.post("/categories", saveCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.delete("/categories/:id", deleteCategory);
router.patch("/categories/:id", updateCategory);

export default router;
