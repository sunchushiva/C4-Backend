const express = require("express");
const authorizeMiddleware = require("../middlewares/authorize.middleware");
const PostModel = require("../models/posts.model");

const postRoute = express.Router();

postRoute.get("/", authorizeMiddleware, async (req, res) => {
  const { user } = req.body;
  const { device } = req.query;

  let payload;

  if (user && device) {
    payload = { user, device };
  } else {
    payload = { user };
  }

  try {
    const Data = await PostModel.find(payload);
    res.status(200).send(Data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

postRoute.post("/add", authorizeMiddleware, async (req, res) => {
  const payload = req.body;
  try {
    const newPost = new PostModel(payload);
    await newPost.save();
    res.status(200).send({ message: "Post added successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

postRoute.patch("/update/:_id", authorizeMiddleware, async (req, res) => {
  const payload = req.body;
  const { _id } = req.params;
  try {
    await PostModel.findByIdAndUpdate({ _id }, payload);
    res.status(200).send({ message: "Post updated successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

postRoute.delete("/delete/:_id", authorizeMiddleware, async (req, res) => {
  const { _id } = req.params;
  try {
    await PostModel.findByIdAndDelete({ _id });
    res.status(200).send({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = postRoute;
