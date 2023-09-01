import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.URI_MONGO);


const router = express.Router();

const workSchema = new mongoose.Schema({
  title: String,
  categories: mongoose.Schema.Types.ObjectId,
  //   description: String,
  description: String,
});

const Work = mongoose.model("Work", workSchema);

async function saveWork(req, res) {
  const newWork = new Work({
    title: req.body.title,
    categories: req.body.categories,
    description: req.body.description,
  });
  try {
    await newWork.save();
    console.log("Work criado com sucesso!");
    res.status(201).json({ message: "Work criado com sucesso!" });
  } catch (err) {
    console.log("Ocorreu um erro:", err);
  }
}
async function getAllWorks(req, res) {
  try {
    const works = await Work.find();
    res.status(200).json(works);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getWorkById(req, res) {
  console.log("ENTREI AQUI!");
  const workId = req.params.id;
  try {
    const work = await Work.findById(workId);
    if (work) {
      res.status(200).send(work);
    } else {
      res.status(404).send("Nenhum work encontrado no banco!");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

async function deleteWork(req, res) {
  const workId = req.params.id;
  console.log(workId);
  try {
    const deletedWork = await Work.deleteOne({
      _id: workId,
    });
    if (deletedWork.deletedCount === 0) {
      res.status(404).send("Nenhum work encontrado no banco!");
    } else {
      res.status(204).json({ message: "work deletado com sucesso!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function updateWork(req, res) {
    console.log("ENTREI AQUI!");
    const workId = req.params.id;
  
    const updateData = req.body;
    try {
      const updatedWork = await Work.updateOne({ _id: workId }, updateData);
      if (updatedWork.nModified === 0) {
        res.status(404).send("Nenhum work encontrado no banco!");
      } else {
        res.status(200).json({ message: "Work Atualizado!" });
      }
    } catch (error) {
      console.log("Ocorreu um erro", error);
      res.status(500).send(error);
    }
  }

router.post("/works", saveWork);
router.get("/works", getAllWorks);
router.get("/works/:id", getWorkById);
router.delete("/works/:id", deleteWork);
router.patch("/works/:id", updateWork);

export default router;
