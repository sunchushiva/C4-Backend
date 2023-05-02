const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users.model");

const userRoute = express.Router();

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const User = await UserModel.findOne({ email });
    if (User.email !== "") {
      bcrypt.compare(password, User.password, function (err, result) {
        if (err) {
          res.status(400).send({ message: err.message });
        } else {
          res.status(200).send({
            message: "Login successful",
            token: jwt.sign(
              {
                user: User._id,
              },
              "NEMB25",
              { expiresIn: "1h" }
            ),
          });
        }
      });
    } else {
      res.send({ message: `${email} not registered` });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRoute.post("/register", async (req, res) => {
  const payload = req.body;
  try {
    const User = await UserModel.findOne({ email: payload.password });
    if (User) {
      res.status(200).send({ message: `${payload.email} already exists` });
    } else {
      bcrypt.hash(payload.password, 2, async function (err, hash) {
        if (err) {
          res.status(400).send({ message: err.message });
        } else {
          const newUser = new UserModel({ ...payload, password: hash });
          await newUser.save();
          res
            .status(200)
            .send({ message: `${payload.email} registered successfully` });
        }
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRoute;
