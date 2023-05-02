const express = require("express");
const userRoute = require("./routes/users.route");
const postRoute = require("./routes/posts.route");
const connection = require("./config/mongo");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/users", userRoute);
app.use("/posts", postRoute);

app.listen(process.env.PORT, async () => {
  console.log(`Server started at ${process.env.PORT} port`);
  try {
    await connection;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log({ message: err.message });
  }
});
